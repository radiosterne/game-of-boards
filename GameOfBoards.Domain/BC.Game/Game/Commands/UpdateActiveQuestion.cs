using EventFlow.Commands;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Commands
{
	public class UpdateActiveQuestion: Command<Game, GameId, ExecutionResult<GameId>>
	{
		public UpdateActiveQuestion(
			GameId id,
			QuestionId questionId, bool isActive
		) : base(id)
		{
			Id = id;
			QuestionId = questionId;
			IsActive = isActive;
		}
	
		public GameId Id { get; }
		public QuestionId QuestionId { get; }
		public bool IsActive { get; }
	}
}