using EventFlow.Commands;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Commands
{
	public class RegisterTeam: Command<Game, GameId, ExecutionResult<GameId>>
	{
		public RegisterTeam(
			GameId id,
			UserId teamId, bool registered
		) : base(id)
		{
			Id = id;
			TeamId = teamId;
			Registered = registered;
		}
	
		public GameId Id { get; }
		public UserId TeamId { get; }
		public bool Registered { get; }
	}
}