using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Events
{
	public class GameUpdated: BusinessAggregateEvent<Game, GameId>
	{
		public GameUpdated(string name, BusinessCallContext context)
			: base(context)
		{
			Name = name;
		}
		
		public string Name { get; }
	}
}