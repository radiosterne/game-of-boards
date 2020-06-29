using System;
using System.Threading.Tasks;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Domain.Extensions;

namespace GameOfBoards.Web.Infrastructure.React
{
	public abstract class ReactController : Controller
	{
		protected UniverseState UniverseState { get; }
		
		protected ICommandBus CommandBus { get; }
		
		protected IQueryProcessor QueryProcessor { get; }

		protected ReactController(
			ICommandBus commandBus,
			IQueryProcessor queryProcessor,
			UniverseState universeState)
		{
			CommandBus = commandBus;
			QueryProcessor = queryProcessor;
			UniverseState = universeState;
		}

		protected TypedResult<T> Authenticated<T>(Func<TypedResult<T>> wrapped)
		{
			var maybeUserId = ControllerContext.HttpContext.FindUserId();

			return maybeUserId
				.Select(_ => wrapped())
				.OrElse(() => RedirectToAction<T> ("Login", "Account"));
		}
		
		protected Task<TypedResult<T>> Authenticated<T>(Func<Task<TypedResult<T>>> wrapped)
		{
			var maybeUserId = ControllerContext.HttpContext.FindUserId();

			return maybeUserId
				.Select(_ => wrapped())
				.OrElse(() => Task.FromResult(RedirectToAction<T> ("Login", "Account")));
		}

		protected async Task<TypedResult<T>> React<T>(T model, bool clientOnly = false, string[] additionalScripts = null)
		{
			var scripts = additionalScripts ?? new string[0];
			var userView = await ControllerContext.HttpContext.FindUserId()
				.SelectAsync(userId => QueryProcessor.GetByIdAsync<UserView, UserId>(userId));
			return ShouldReturnJson()
				? (TypedResult<T>)new ModelJsonViewResult<T>(model, scripts)
				: new ReactViewResult<T>(
					model,
					clientOnly,
					scripts,
					UniverseState,
					Request
						.Headers["User-Agent"]
						.FirstMaybe()
						.OrElse(string.Empty),
					userView);
		}

		protected TypedResult<T> Redirect<T>(string url)
		{
			return ShouldReturnJson()
				? (TypedResult<T>)new RedirectJsonViewResult<T>(url)
				: new TypedActionResultWrapper<T>(Redirect(url), string.Empty);
		}

		protected TypedResult<T> RedirectToAction<T>(string actionName, string controllerName, object parameters = null)
		{
			return ShouldReturnJson()
				? (TypedResult<T>)new RedirectJsonViewResult<T>(Url.Action(actionName, controllerName, parameters))
				: new TypedActionResultWrapper<T>(RedirectToAction(actionName, controllerName, parameters), string.Empty);
		}

		private bool ShouldReturnJson()
		{
			var query = HttpContext.Request.Query;
			return query.ContainsKey(ReturnJsonQueryStringKey)
				   && query[ReturnJsonQueryStringKey] == "true";
		}

		private const string ReturnJsonQueryStringKey = "returnJson";
	}
}