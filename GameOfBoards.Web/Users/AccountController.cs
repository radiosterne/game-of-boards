using System.Threading;
using System.Threading.Tasks;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using GameOfBoards.Domain.BC.Authentication.User;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Web.Infrastructure;
using GameOfBoards.Web.Infrastructure.React;

namespace GameOfBoards.Web.Users
{
	public class AccountController: ReactController
	{
		public AccountController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
		}

		[AllowAnonymous]
		public Task<TypedResult<AccountLoginAppSettings>> Login() => React(new AccountLoginAppSettings());

		[PreventTypingsCreation]
		public async Task<IActionResult> Logout()
		{
			await HttpContext.SignOutAsync();
			return RedirectToAction(nameof(Login));
		}
		
		[PreventTypingsCreation]
		public async Task<IActionResult> ShortLogin(string id, string salt)
		{
			var userId = UserId.With(id);
			var user = await QueryProcessor.ProcessAsync(new UserViewByIdQuery(userId), CancellationToken.None);
			if (user.IsNothing())
			{
				return RedirectToAction(nameof(Login));
			}

			var s = new Salt(salt);

			if (user.Value.Salt.Select(st => st != s).OrElse(false))
			{
				return RedirectToAction(nameof(Login));
			}
			await HttpContext.SignIn(userId);
			return RedirectToAction("List", "Games");
		}
	}

	public class AccountLoginAppSettings
	{
		
	}
}