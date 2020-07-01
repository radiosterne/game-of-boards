using System.Threading;
using System.Threading.Tasks;
using EventFlow.Commands;
using GameOfBoards.Domain.BC.Game.Game.Commands;
using GameOfBoards.Domain.SharedKernel;
using JetBrains.Annotations;

namespace GameOfBoards.Domain.BC.Game.Game
{
	[UsedImplicitly]
	public class GameCommandHandler:
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, UpdateTeamAnswerStatus>,
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, UpdateTeamAnswer>,
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, UpdateActiveQuestion>,
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, RegisterTeam>,
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, UpdateQuestion>,
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, UpdateState>,
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, UpdateGame>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public GameCommandHandler(IBusinessCallContextProvider contextProvider)
		{
			_contextProvider = contextProvider;
		}

		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			UpdateTeamAnswerStatus command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.UpdateTeamAnswerStatus(command, _contextProvider.GetCurrent()));


		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			UpdateTeamAnswer command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.UpdateTeamAnswer(command, _contextProvider.GetCurrent()));


		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			UpdateActiveQuestion command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.UpdateActiveQuestion(command, _contextProvider.GetCurrent()));


		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			RegisterTeam command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.RegisterTeam(command, _contextProvider.GetCurrent()));


		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			UpdateQuestion command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.UpdateQuestion(command, _contextProvider.GetCurrent()));


		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			UpdateState command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.UpdateState(command, _contextProvider.GetCurrent()));


		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			UpdateGame command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.Update(command, _contextProvider.GetCurrent()));
	}
}