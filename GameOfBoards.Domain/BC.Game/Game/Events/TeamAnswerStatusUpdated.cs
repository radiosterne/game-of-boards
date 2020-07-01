using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Events
{
	public class TeamAnswerStatusUpdated: BusinessAggregateEvent<Game, GameId>
	{
		public TeamAnswerStatusUpdated(UserId teamId, QuestionId questionId, bool isCorrect, BusinessCallContext context)
			: base(context)
		{
			TeamId = teamId;
			QuestionId = questionId;
			IsCorrect = isCorrect;
		}
		
		public UserId TeamId { get; }
		public QuestionId QuestionId { get; }
		public bool IsCorrect { get; }
	}
}