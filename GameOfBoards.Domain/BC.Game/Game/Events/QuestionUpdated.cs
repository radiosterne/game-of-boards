using EventFlow.EventStores;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Events
{
	[EventVersion("QuestionUpdated", 2)]
	public class QuestionUpdated: BusinessAggregateEvent<Game, GameId>
	{
		public QuestionUpdated(
			QuestionId questionId,
			string shortName,
			string rightAnswers,
			string questionText,
			double points,
			BusinessCallContext context)
			: base(context)
		{
			QuestionId = questionId;
			ShortName = shortName;
			RightAnswers = rightAnswers;
			QuestionText = questionText;
			Points = points;
		}
		
		public QuestionId QuestionId { get; }
		public string ShortName { get; }
		public string RightAnswers { get; }
		public string QuestionText { get; }
		public double Points { get; }
	}
}