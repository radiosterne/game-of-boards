namespace GameOfBoards.Domain.BC.Game.Game
{
	public class Question
	{
		public QuestionId QuestionId { get; }
		public string ShortName { get; }
		public string RightAnswers { get; }

		public Question(QuestionId questionId, string shortName, string rightAnswers)
		{
			QuestionId = questionId;
			ShortName = shortName;
			RightAnswers = rightAnswers;
		}
	}
}