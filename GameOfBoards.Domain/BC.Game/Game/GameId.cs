using EventFlow.Core;

namespace GameOfBoards.Domain.BC.Game.Game
{
	public class GameId : Identity<GameId>
	{
		public GameId(string value)
			: base(value)
		{
		}
	}
}