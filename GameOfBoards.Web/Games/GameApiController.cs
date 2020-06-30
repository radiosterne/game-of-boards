using System.Threading;
using System.Threading.Tasks;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using GameOfBoards.Domain.BC.Authentication.User;
using Microsoft.AspNetCore.Mvc;
using GameOfBoards.Domain.BC.Game.Game;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Domain.Extensions;
using GameOfBoards.Domain.SharedKernel;
using GameOfBoards.Web.Infrastructure;

namespace GameOfBoards.Web.Games
{
	public class GetCommand
	{
		public GetCommand(GameId id)
		{
			Id = id;
		}

		public GameId Id { get; }
	}
	
	public class GameApiController: BaseApiController
	{
		public async Task<ActionResult<ExecutionResult<GameView>>> Get(GetCommand cmd)
		{
			var mg  = await QueryProcessor.ProcessAsync(new GameByIdQuery(cmd.Id), CancellationToken.None);
			return mg.Value.AsSuccess();
		}
		
		public async Task<ActionResult<ExecutionResult<GameThinView>>> GetThin(GetCommand cmd)
		{
			var mg  = await QueryProcessor.ProcessAsync(new GameByIdQuery(cmd.Id), CancellationToken.None);
			var userView = await ControllerContext.HttpContext.FindUserId()
				.SelectAsync(userId => QueryProcessor.GetByIdAsync<UserView, UserId>(userId));
			var teamId = userView.Where(u => u.IsTeam).Select(u => UserId.With(u.Id));
			return GameThinView.FromView(mg.Value, teamId, userView.Where(u => u.IsTeam).Select(u => u.Name.FullForm)).AsSuccess();
		}

		public Task<ActionResult<ExecutionResult<GameView>>> UpdateTeamAnswerStatus(UpdateTeamAnswerStatus cmd) =>
			CommandBus
				.PublishAsync(cmd, CancellationToken.None)
				.Then(async id => (await QueryProcessor.ProcessAsync(new GameByIdQuery(id),
					CancellationToken.None)).Value)
				.AsActionResult();


		public Task<ActionResult<ExecutionResult<GameThinView>>> UpdateTeamAnswer(UpdateTeamAnswer cmd) =>
			CommandBus
				.PublishAsync(cmd, CancellationToken.None)
				.Then(async id =>
				{
					var game = (await QueryProcessor.ProcessAsync(new GameByIdQuery(id),
						CancellationToken.None)).Value;
					var userView = await ControllerContext.HttpContext.FindUserId()
						.SelectAsync(userId => QueryProcessor.GetByIdAsync<UserView, UserId>(userId));
					var teamId = userView.Where(u => u.IsTeam).Select(u => UserId.With(u.Id));
					return GameThinView.FromView(game, teamId, userView.Where(u => u.IsTeam).Select(u => u.Name.FullForm));
				})
				.AsActionResult();


		public Task<ActionResult<ExecutionResult<GameView>>> UpdateActiveQuestion(UpdateActiveQuestion cmd) =>
			CommandBus
				.PublishAsync(cmd, CancellationToken.None)
				.Then(async id => (await QueryProcessor.ProcessAsync(new GameByIdQuery(id),
					CancellationToken.None)).Value)
				.AsActionResult();


		public Task<ActionResult<ExecutionResult<GameView>>> RegisterTeam(RegisterTeam cmd) =>
			CommandBus
				.PublishAsync(cmd, CancellationToken.None)
				.Then(async id => (await QueryProcessor.ProcessAsync(new GameByIdQuery(id),
					CancellationToken.None)).Value)
				.AsActionResult();


		public Task<ActionResult<ExecutionResult<GameView>>> UpdateQuestion(UpdateQuestion cmd) =>
			CommandBus
				.PublishAsync(cmd, CancellationToken.None)
				.Then(async id => (await QueryProcessor.ProcessAsync(new GameByIdQuery(id),
					CancellationToken.None)).Value)
				.AsActionResult();


		public Task<ActionResult<ExecutionResult<GameView>>> UpdateState(UpdateState cmd) =>
			CommandBus
				.PublishAsync(cmd, CancellationToken.None)
				.Then(async id => (await QueryProcessor.ProcessAsync(new GameByIdQuery(id),
					CancellationToken.None)).Value)
				.AsActionResult();

		public Task<ActionResult<ExecutionResult<GameThinView>>> Update(UpdateGameCommand cmd) =>
			CommandBus
				.PublishAsync(cmd, CancellationToken.None)
				.Then(async id =>
				{
					var game = (await QueryProcessor.ProcessAsync(new GameByIdQuery(id),
						CancellationToken.None)).Value;
					var userView = await ControllerContext.HttpContext.FindUserId()
						.SelectAsync(userId => QueryProcessor.GetByIdAsync<UserView, UserId>(userId));
					var teamId = userView.Where(u => u.IsTeam).Select(u => UserId.With(u.Id));
					return GameThinView.FromView(game, teamId, userView.Where(u => u.IsTeam).Select(u => u.Name.FullForm));
				})
				.AsActionResult();
		
		public GameApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
		}
	}
}