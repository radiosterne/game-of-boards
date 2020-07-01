using EventFlow.Commands;
using Functional.Maybe;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Commands
{
	public class UpdateQuestion: Command<Game, GameId, ExecutionResult<GameId>>
	{
		public UpdateQuestion(
			GameId id,
			Maybe<QuestionId> questionId,
			string shortName,
			string rightAnswers,
			string questionText,
			double points
		) : base(id)
		{
			Id = id;
			QuestionId = questionId;
			ShortName = shortName;
			RightAnswers = rightAnswers;
			QuestionText = questionText;
			Points = points;
		}
	
		public GameId Id { get; }
		public Maybe<QuestionId> QuestionId { get; }
		public string ShortName { get; }
		public string RightAnswers { get; }
		public string QuestionText { get; }
		public double Points { get; }
	}
}