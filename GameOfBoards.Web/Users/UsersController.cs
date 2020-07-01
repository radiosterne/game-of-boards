using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EventFlow;
using EventFlow.Queries;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Web.Infrastructure;
using GameOfBoards.Web.Infrastructure.React;
using Microsoft.AspNetCore.Mvc;

namespace GameOfBoards.Web.Users
{
	public class UsersController: ReactController
	{
		private readonly ReadModelPopulator _readModelPopulator;

		public UsersController(
			ICommandBus commandBus,
			IQueryProcessor queryProcessor,
			ReadModelPopulator readModelPopulator,
			UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
			_readModelPopulator = readModelPopulator;
		}

		public Task<TypedResult<UsersListAppSettings>> List() => Authenticated(async () =>
		{
			var users = await QueryProcessor.ProcessAsync(new ListUserViewsQuery(), CancellationToken.None);

			return await React(new UsersListAppSettings(users.ToArray()));
		});
		
		[PreventTypingsCreation]
		public async Task<ActionResult<string>> RecreateReadModels() 
		{
			var sw = new Stopwatch();
			sw.Start();
			await _readModelPopulator.BootAsync(CancellationToken.None);
			sw.Stop();
			return $"Read model rebuilt, took {sw.Elapsed.TotalMilliseconds} ms.";
		}

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