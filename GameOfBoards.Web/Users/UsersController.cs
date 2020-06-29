using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EventFlow;
using EventFlow.Queries;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Web.Infrastructure.React;

namespace GameOfBoards.Web.Users
{
	public class UsersController: ReactController
	{
		public UsersController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
		}

		public Task<TypedResult<UsersListAppSettings>> List() => Authenticated(async () =>
		{
			var users = await QueryProcessor.ProcessAsync(new ListUserViewsQuery(), CancellationToken.None);

			return await React(new UsersListAppSettings(users.ToArray()));
		});
	}

	public class UsersListAppSettings
	{
		public UsersListAppSettings(UserView[] users)
		{
			Users = users;
		}

		public UserView[] Users { get; }
	}
}