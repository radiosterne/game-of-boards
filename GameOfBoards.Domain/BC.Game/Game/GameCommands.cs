using System.Threading;
using System.Threading.Tasks;
using EventFlow.Commands;
using Functional.Maybe;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.SharedKernel;
using JetBrains.Annotations;

namespace GameOfBoards.Domain.BC.Game.Game
{
	public class UpdateGameCommand: Command<Game, GameId, ExecutionResult<GameId>>
	{
		public UpdateGameCommand(
			Maybe<GameId> id,
			string name)
			: base(id.OrElse(GameId.New))
		{
			Id = id;
			Name = name;
		}
	
		public Maybe<GameId> Id { get; }
		public string Name { get; }
	}

	public class UpdateState: Command<Game, GameId, ExecutionResult<GameId>>
	{
		public UpdateState(
			GameId id,
			GameState state
		) : base(id)
		{
			Id = id;
			State = state;
		}
	
		public GameId Id { get; }
		public GameState State { get; }
	}

	public class UpdateQuestion: Command<Game, GameId, ExecutionResult<GameId>>
	{
		public UpdateQuestion(
			GameId id,
			Maybe<QuestionId> questionId, string shortName, string rightAnswers
		) : base(id)
		{
			Id = id;
			QuestionId = questionId;
			ShortName = shortName;
			RightAnswers = rightAnswers;
		}
	
		public GameId Id { get; }
		public Maybe<QuestionId> QuestionId { get; }
		public string ShortName { get; }
		public string RightAnswers { get; }
	}

	public class RegisterTeam: Command<Game, GameId, ExecutionResult<GameId>>
	{
		public RegisterTeam(
			GameId id,
			UserId teamId, bool registered
		) : base(id)
		{
			Id = id;
			TeamId = teamId;
			Registered = registered;
		}
	
		public GameId Id { get; }
		public UserId TeamId { get; }
		public bool Registered { get; }
	}

	public class UpdateActiveQuestion: Command<Game, GameId, ExecutionResult<GameId>>
	{
		public UpdateActiveQuestion(
			GameId id,
			QuestionId questionId, bool isActive
		) : base(id)
		{
			Id = id;
			QuestionId = questionId;
			IsActive = isActive;
		}
	
		public GameId Id { get; }
		public QuestionId QuestionId { get; }
		public bool IsActive { get; }
	}

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






	
	[UsedImplicitly]
	public class GameCommandHandler:
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, UpdateTeamAnswerStatus>,
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, UpdateTeamAnswer>,
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, UpdateActiveQuestion>,
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, RegisterTeam>,
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, UpdateQuestion>,
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, UpdateState>,
		ICommandHandler<Game, GameId, ExecutionResult<GameId>, UpdateGameCommand>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public GameCommandHandler(IBusinessCallContextProvider contextProvider)
		{
			_contextProvider = contextProvider;
		}

		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			UpdateTeamAnswerStatus command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.UpdateTeamAnswerStatus(command, _contextProvider.GetCurrent()));


		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			UpdateTeamAnswer command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.UpdateTeamAnswer(command, _contextProvider.GetCurrent()));


		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			UpdateActiveQuestion command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.UpdateActiveQuestion(command, _contextProvider.GetCurrent()));


		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			RegisterTeam command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.RegisterTeam(command, _contextProvider.GetCurrent()));


		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			UpdateQuestion command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.UpdateQuestion(command, _contextProvider.GetCurrent()));


		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			UpdateState command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.UpdateState(command, _contextProvider.GetCurrent()));


		public Task<ExecutionResult<GameId>> ExecuteCommandAsync(
			Game aggregate,
			UpdateGameCommand command,
			CancellationToken cancellationToken
		) => Task.FromResult(aggregate.Update(command, _contextProvider.GetCurrent()));
	}
}