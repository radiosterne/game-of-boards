namespace GameOfBoards.Domain.BC.Game.Game
{
	public class Question
	{
		public QuestionId QuestionId { get; }
		public string ShortName { get; }
		public string RightAnswers { get; }
		public string QuestionText { get; }
		public double Points { get; }

		public Question(QuestionId questionId, string shortName, string rightAnswers, string questionText, double points)
		{
			QuestionId = questionId;
			ShortName = shortName;
			RightAnswers = rightAnswers;
			QuestionText = questionText;
			Points = points;
		}
	}
}