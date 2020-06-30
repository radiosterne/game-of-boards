using System.Threading;
using System.Threading.Tasks;
using EventFlow;
using EventFlow.Queries;
using Microsoft.AspNetCore.Mvc;
using GameOfBoards.Domain.BC.Game;
using GameOfBoards.Domain.BC.Game.Game;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Domain.SharedKernel;
using GameOfBoards.Web.Infrastructure;

namespace GameOfBoards.Web.Games
{
	public class GameApiController: BaseApiController
	{

		public Task<ActionResult<ExecutionResult<GameView>>> UpdateTeamAnswerStatus(UpdateTeamAnswerStatus cmd) =>
			CommandBus
				.PublishAsync(cmd, CancellationToken.None)
				.Then(async id => (await QueryProcessor.ProcessAsync(new GameByIdQuery(id),
					CancellationToken.None)).Value)
				.AsActionResult();


		public Task<ActionResult<ExecutionResult<GameView>>> UpdateTeamAnswer(UpdateTeamAnswer cmd) =>
			CommandBus
				.PublishAsync(cmd, CancellationToken.None)
				.Then(async id => (await QueryProcessor.ProcessAsync(new GameByIdQuery(id),
					CancellationToken.None)).Value)
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

		public Task<ActionResult<ExecutionResult<GameView>>> Update(UpdateGameCommand cmd) =>
			CommandBus
				.PublishAsync(cmd, CancellationToken.None)
				.Then(async id => (await QueryProcessor.ProcessAsync(new GameByIdQuery(id),
					CancellationToken.None)).Value)
				.AsActionResult();
		
		public GameApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
		}
	}
}