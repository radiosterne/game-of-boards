using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Events
{
	public class TeamRegistered: BusinessAggregateEvent<Game, GameId>
	{
		public TeamRegistered(UserId teamId, bool registered, BusinessCallContext context)
			: base(context)
		{
			TeamId = teamId;
			Registered = registered;
		}
		
		public UserId TeamId { get; }
		public bool Registered { get; }
	}
}