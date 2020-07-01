using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Events
{
	public class StateUpdated: BusinessAggregateEvent<Game, GameId>
	{
		public StateUpdated(GameState state, BusinessCallContext context)
			: base(context)
		{
			State = state;
		}
		
		public GameState State { get; }
	}
}