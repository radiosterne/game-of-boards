using Functional.Maybe;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game
{
	public class GameUpdated: BusinessAggregateEvent<Game, GameId>
	{
		public GameUpdated(string name, BusinessCallContext context)
			: base(context)
		{
			Name = name;
		}
		
		public string Name { get; }
	}

	public class StateUpdated: BusinessAggregateEvent<Game, GameId>
	{
		public StateUpdated(GameState state, BusinessCallContext context)
			: base(context)
		{
			State = state;
		}
		
		public GameState State { get; }
	}

	public class QuestionUpdated: BusinessAggregateEvent<Game, GameId>
	{
		public QuestionUpdated(QuestionId questionId, string shortName, string rightAnswers, BusinessCallContext context)
			: base(context)
		{
			QuestionId = questionId;
			ShortName = shortName;
			RightAnswers = rightAnswers;
		}
		
		public QuestionId QuestionId { get; }
		public string ShortName { get; }
		public string RightAnswers { get; }
	}

	public class TeamRegistered: BusinessAggregateEvent<Game, GameId>
	{
		public TeamRegistered(UserId teamId, bool registered, BusinessCallContext context)
			: base(context)
		{
			TeamId = teamId;
			Registered = registered;
		}
		
		public UserId TeamId { get; }
		public bool Registered { get; }
	}

	public class ActiveQuestionUpdated: BusinessAggregateEvent<Game, GameId>
	{
		public ActiveQuestionUpdated(QuestionId questionId, bool isActive, BusinessCallContext context)
			: base(context)
		{
			QuestionId = questionId;
			IsActive = isActive;
		}
		
		public QuestionId QuestionId { get; }
		public bool IsActive { get; }
	}

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

	public class TeamAnswerStatusUpdated: BusinessAggregateEvent<Game, GameId>
	{
		public TeamAnswerStatusUpdated(UserId teamId, QuestionId questionId, bool isCorrect, BusinessCallContext context)
			: base(context)
		{
			TeamId = teamId;
			QuestionId = questionId;
			IsCorrect = isCorrect;
		}
		
		public UserId TeamId { get; }
		public QuestionId QuestionId { get; }
		public bool IsCorrect { get; }
	}







	// __NEW_EVENT_GENERATE_HERE__
}