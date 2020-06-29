using System.Threading;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Http;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Web.Infrastructure
{
	public class BusinessCallContextHttpContextProvider: IBusinessCallContextProvider
	{
		private readonly IHttpContextAccessor _httpContextAccessor;
		private readonly IQueryProcessor _queryProcessor;

		public BusinessCallContextHttpContextProvider(
			IHttpContextAccessor httpContextAccessor,
			IQueryProcessor queryProcessor)
		{
			_httpContextAccessor = httpContextAccessor;
			_queryProcessor = queryProcessor;
		}

		public BusinessCallContext GetCurrent()
		=> _httpContextAccessor.HttpContext
				.FindUserId()
				.SelectMaybe(userId => _queryProcessor.Process(new UserViewByIdQuery(userId), CancellationToken.None))
				.Select(user => BusinessCallContext.ForActor(new ActorDescriptor(user.Id, user.Name.FullForm)))
				.OrElse(BusinessCallContext.System);
	}
}