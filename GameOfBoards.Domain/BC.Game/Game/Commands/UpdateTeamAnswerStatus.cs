using EventFlow.Commands;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Commands
{
	public class UpdateTeamAnswerStatus: Command<Game, GameId, ExecutionResult<GameId>>
	{
		public UpdateTeamAnswerStatus(
			GameId id,
			UserId teamId, QuestionId questionId, bool isCorrect
		) : base(id)
		{
			Id = id;
			TeamId = teamId;
			QuestionId = questionId;
			IsCorrect = isCorrect;
		}
	
		public GameId Id { get; }
		public UserId TeamId { get; }
		public QuestionId QuestionId { get; }
		public bool IsCorrect { get; }
	}
}