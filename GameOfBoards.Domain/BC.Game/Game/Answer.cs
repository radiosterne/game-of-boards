using GameOfBoards.Domain.BC.Authentication.User;

namespace GameOfBoards.Domain.BC.Game.Game
{
	public class Answer
	{
		public QuestionId QuestionId { get; }
		public UserId TeamId { get; }
		public string AnswerText { get; }

		public Answer(QuestionId questionId, UserId teamId, string answer)
		{
			QuestionId = questionId;
			TeamId = teamId;
			AnswerText = answer;
		}
	}
}