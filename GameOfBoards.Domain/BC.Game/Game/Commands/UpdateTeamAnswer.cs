using EventFlow.Commands;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Commands
{
	public class UpdateTeamAnswer: Command<Game, GameId, ExecutionResult<GameId>>
	{
		public UpdateTeamAnswer(
			GameId id,
			string answer, UserId teamId, QuestionId questionId
		) : base(id)
		{
			Id = id;
			Answer = answer;
			TeamId = teamId;
			QuestionId = questionId;
		}
	
		public GameId Id { get; }
		public string Answer { get; }
		public UserId TeamId { get; }
		public QuestionId QuestionId { get; }
	}
}