using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EventFlow;
using EventFlow.Queries;
using GameOfBoards.Domain.BC.Game;
using GameOfBoards.Domain.BC.Game.Game;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Web.Infrastructure.React;
// ReSharper disable MemberCanBePrivate.Global
// ReSharper disable UnusedAutoPropertyAccessor.Global

namespace GameOfBoards.Web.Games
{
	public class GamesController: ReactController
	{
		public GamesController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
		}

		public Task<TypedResult<GamesListAppSettings>> List() => Authenticated(async () =>
		{
			var Games = await QueryProcessor.ProcessAsync(new ListGameQuery(), CancellationToken.None);

			return await React(new GamesListAppSettings(Games));
		});
	}

	public class GamesListAppSettings
	{
		public GamesListAppSettings(IReadOnlyCollection<GameView> myGames)
		{
			MyGames = myGames;
		}

		public IReadOnlyCollection<GameView> MyGames { get; }
	}
}