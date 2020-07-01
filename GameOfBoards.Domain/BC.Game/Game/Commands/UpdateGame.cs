using EventFlow.Commands;
using Functional.Maybe;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Commands
{
	public class UpdateGame: Command<Game, GameId, ExecutionResult<GameId>>
	{
		public UpdateGame(
			Maybe<GameId> id,
			string name)
			: base(id.OrElse(GameId.New))
		{
			Id = id;
			Name = name;
		}
	
		public Maybe<GameId> Id { get; }
		public string Name { get; }
	}
}