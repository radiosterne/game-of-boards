using EventFlow.Commands;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Commands
{
	public class UpdateState: Command<Game, GameId, ExecutionResult<GameId>>
	{
		public UpdateState(
			GameId id,
			GameState state
		) : base(id)
		{
			Id = id;
			State = state;
		}
	
		public GameId Id { get; }
		public GameState State { get; }
	}
}