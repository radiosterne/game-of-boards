using System.Collections.Generic;
using GameOfBoards.Domain.BC.Game.Game;

namespace GameOfBoards.Web.Games
{
	public class GamesListAppSettings
	{
		public GamesListAppSettings(IReadOnlyCollection<GameThinView> myGames)
		{
			MyGames = myGames;
		}

		public IReadOnlyCollection<GameThinView> MyGames { get; }
	}
}