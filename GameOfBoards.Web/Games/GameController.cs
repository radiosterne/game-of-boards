using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.BC.Game.Game;
using GameOfBoards.Domain.BC.Game.Game.Queries;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Domain.Extensions;
using GameOfBoards.Web.Infrastructure;
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
			var userView = await ControllerContext.HttpContext.FindUserId()
				.SelectAsync(userId => QueryProcessor.GetByIdAsync<UserView, UserId>(userId));
			var teamId = userView.Where(u => u.IsTeam).Select(u => UserId.With(u.Id));
			var games = await QueryProcessor.ProcessAsync(new ListGameQuery(), CancellationToken.None);

			return await React(new GamesListAppSettings(games.Select(g => GameThinView.FromView(g, teamId, userView.Where(u => u.IsTeam).Select(u => u.Name.FullForm))).ToArray()));
		});
		
		public Task<TypedResult<GamesEditAppSettings>> Edit(string id) => Authenticated(async () =>
		{
			var userView = await ControllerContext.HttpContext.FindUserId()
				.SelectAsync(userId => QueryProcessor.GetByIdAsync<UserView, UserId>(userId));
			var isTeam = userView.Select(u => u.IsTeam).OrElse(false);

			if (isTeam)
			{
				return RedirectToAction<GamesEditAppSettings>("Login", "Account");
			}
			
			var game = await QueryProcessor.ProcessAsync(new GameByIdQuery(GameId.With(id)), CancellationToken.None);
			var users = await QueryProcessor.ProcessAsync(new ListUserViewsQuery(), CancellationToken.None);
			var teams = users.Where(u => u.IsTeam).ToArray();

			return await React(new GamesEditAppSettings(teams, game.Value));
		});
		
		public Task<TypedResult<GamesLeaderboardAppSettings>> Leaderboard(string id) => Authenticated(async () =>
		{
			var userView = await ControllerContext.HttpContext.FindUserId()
				.SelectAsync(userId => QueryProcessor.GetByIdAsync<UserView, UserId>(userId));
			var isTeam = userView.Select(u => u.IsTeam).OrElse(false);

			if (isTeam)
			{
				return RedirectToAction<GamesLeaderboardAppSettings>("Login", "Account");
			}
			
			var game = await QueryProcessor.ProcessAsync(new GameByIdQuery(GameId.With(id)), CancellationToken.None);
			var users = await QueryProcessor.ProcessAsync(new ListUserViewsQuery(), CancellationToken.None);
			var teams = users.Where(u => u.IsTeam).ToArray();

			return await React(new GamesLeaderboardAppSettings(teams, game.Value));
		});
		
		public Task<TypedResult<GamesFormAppSettings>> Form(string id) => Authenticated(async () =>
		{
			var userView = await ControllerContext.HttpContext.FindUserId()
				.SelectAsync(userId => QueryProcessor.GetByIdAsync<UserView, UserId>(userId));
			var notTeam = userView.Select(u => !u.IsTeam).OrElse(true);

			if (notTeam)
			{
				return RedirectToAction<GamesFormAppSettings>("Login", "Account");
			}
			
			var game = await QueryProcessor.ProcessAsync(new GameByIdQuery(GameId.With(id)), CancellationToken.None);

			return await React(new GamesFormAppSettings(
				GameThinView.FromView(
					game.Value,
					userView.Select(u => UserId.With(u.Id)),
					userView.Where(u => u.IsTeam).Select(u => u.Name.FullForm))));
		});
	}
}