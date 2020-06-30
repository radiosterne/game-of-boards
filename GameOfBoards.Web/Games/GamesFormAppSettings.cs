using GameOfBoards.Domain.BC.Game.Game;

namespace GameOfBoards.Web.Games
{
	public class GamesFormAppSettings
	{
		public GamesFormAppSettings(GameThinView game)
		{
			Game = game;
		}

		public GameThinView Game { get; }
	}
}