using GameOfBoards.Domain.BC.Authentication.User;

namespace GameOfBoards.Domain.BC.Game.Game
{
	public class AnswerCorrection
	{
		public QuestionId QuestionId { get; }
		public UserId TeamId { get; }
		public bool IsCorrect { get; }

		public AnswerCorrection(QuestionId questionId, UserId teamId, bool isCorrect)
		{
			QuestionId = questionId;
			TeamId = teamId;
			IsCorrect = isCorrect;
		}
	}
}