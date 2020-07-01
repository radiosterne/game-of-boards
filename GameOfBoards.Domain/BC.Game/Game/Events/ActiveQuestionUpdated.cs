using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Events
{
	public class ActiveQuestionUpdated: BusinessAggregateEvent<Game, GameId>
	{
		public ActiveQuestionUpdated(QuestionId questionId, bool isActive, BusinessCallContext context)
			: base(context)
		{
			QuestionId = questionId;
			IsActive = isActive;
		}
		
		public QuestionId QuestionId { get; }
		public bool IsActive { get; }
	}
}