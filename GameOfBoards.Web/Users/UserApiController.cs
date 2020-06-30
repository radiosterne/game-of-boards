using System.Threading;
using System.Threading.Tasks;
using EventFlow;
using EventFlow.Queries;
using Microsoft.AspNetCore.Mvc;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Domain.SharedKernel;
using GameOfBoards.Web.Infrastructure;

namespace GameOfBoards.Web.Users
{
	public class UserApiController: BaseApiController
	{
		public async Task<ActionResult<PersonName>> UpdateName(UpdateUserNameCommand cmd)
		{
			var result = await CommandBus.PublishAsync(cmd, CancellationToken.None);
			return result.Result.Value;
		}

		public async Task<ActionResult<PhoneNumber>> ChangePhone(ChangePhoneCommand cmd)
		{
			var result = await CommandBus.PublishAsync(cmd, CancellationToken.None);
			return result.Result.Value;
		}

		public async Task<ActionResult<UserView>> Create(CreateUserCommand cmd)
		{
			var result = await CommandBus.PublishAsync(cmd, CancellationToken.None);
			var view = await QueryProcessor.ProcessAsync(new UserViewByIdQuery(result.Result.Value),
				CancellationToken.None);
			return view.Value;
		}

		public async Task<ActionResult<UserView>> UpdateTeamStatus(UpdateUserTeamStatus cmd)
		{
			var result = await CommandBus.PublishAsync(cmd, CancellationToken.None);
			var view = await QueryProcessor.ProcessAsync(new UserViewByIdQuery(result.Result.Value),
				CancellationToken.None);
			return view.Value;
		}

		public UserApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
		}
	}
}