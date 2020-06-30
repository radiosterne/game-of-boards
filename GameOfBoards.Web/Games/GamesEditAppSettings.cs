using System.Collections.Generic;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.BC.Game.Game;

namespace GameOfBoards.Web.Games
{
	public class GamesEditAppSettings
	{
		public IReadOnlyCollection<UserView> Teams { get; }
		public GameView Game { get; }

		public GamesEditAppSettings(IReadOnlyCollection<UserView> teams, GameView game)
		{
			Teams = teams;
			Game = game;
		}
	}
	
	public class GamesLeaderboardAppSettings
	{
		public IReadOnlyCollection<UserView> Teams { get; }
		public GameView Game { get; }

		public GamesLeaderboardAppSettings(IReadOnlyCollection<UserView> teams, GameView game)
		{
			Teams = teams;
			Game = game;
		}
	}
}