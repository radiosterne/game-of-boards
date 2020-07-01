using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Events
{
	public class TeamAnswerUpdated: BusinessAggregateEvent<Game, GameId>
	{
		public TeamAnswerUpdated(string answer, UserId teamId, QuestionId questionId, BusinessCallContext context)
			: base(context)
		{
			Answer = answer;
			TeamId = teamId;
			QuestionId = questionId;
		}
		
		public string Answer { get; }
		public UserId TeamId { get; }
		public QuestionId QuestionId { get; }
	}
}