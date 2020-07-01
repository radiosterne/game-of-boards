using System.Collections.Generic;
using EventFlow.Aggregates;
using EventFlow.ReadStores;
using Functional.Maybe;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.BC.Game.Game.Events;

// ReSharper disable MemberCanBePrivate.Global
// ReSharper disable UnusedAutoPropertyAccessor.Global

namespace GameOfBoards.Domain.BC.Game.Game
{
	public class GameView:
		MongoDbReadModel,
		IAmReadModelFor<Game, GameId, TeamAnswerStatusUpdated>,
		IAmReadModelFor<Game, GameId, TeamAnswerUpdated>,
		IAmReadModelFor<Game, GameId, ActiveQuestionUpdated>,
		IAmReadModelFor<Game, GameId, TeamRegistered>,
		IAmReadModelFor<Game, GameId, QuestionUpdated>,
		IAmReadModelFor<Game, GameId, StateUpdated>,
		IAmReadModelFor<Game, GameId, GameUpdated>
	{
		public string Name { get; private set; }
		
		public void Apply(IReadModelContext context, IDomainEvent<Game, GameId, GameUpdated> domainEvent)
		{
			SetId(domainEvent);
			Name = domainEvent.AggregateEvent.Name;
		}

		public GameState State { get; private set; }
		public void Apply(IReadModelContext context, IDomainEvent<Game, GameId, StateUpdated> domainEvent)
		{
			SetId(domainEvent);
			var e = domainEvent.AggregateEvent;
			State = e.State;
		}

		public List<Question> Questions { get; private set; } = new List<Question>();
		public void Apply(IReadModelContext context, IDomainEvent<Game, GameId, QuestionUpdated> domainEvent)
		{
			SetId(domainEvent);
			var e = domainEvent.AggregateEvent;
			Questions.RemoveAll(a => a.QuestionId == e.QuestionId);
			Questions.Add(new Question(e.QuestionId, e.ShortName, e.RightAnswers, e.QuestionText, e.Points));
		}

		public List<UserId> RegisteredTeams { get; private set; } = new List<UserId>();

		public void Apply(IReadModelContext context, IDomainEvent<Game, GameId, TeamRegistered> domainEvent)
		{
			SetId(domainEvent);
			var e = domainEvent.AggregateEvent;
			RegisteredTeams.RemoveAll(a => a == e.TeamId);
			if (e.Registered)
			{
				RegisteredTeams.Add(e.TeamId);
			}
		}

		public Maybe<QuestionId> ActiveQuestionId { get; private set; }
		public void Apply(IReadModelContext context, IDomainEvent<Game, GameId, ActiveQuestionUpdated> domainEvent)
		{
			SetId(domainEvent);
			var e = domainEvent.AggregateEvent;
			ActiveQuestionId = e.IsActive ? e.QuestionId.ToMaybe() : default;
		}

		public List<Answer> Answers { get; private set; } = new List<Answer>();
		public void Apply(IReadModelContext context, IDomainEvent<Game, GameId, TeamAnswerUpdated> domainEvent)
		{
			SetId(domainEvent);
			var e = domainEvent.AggregateEvent;
			Answers.RemoveAll(a => a.TeamId == e.TeamId && a.QuestionId == e.QuestionId);
			Answers.Add(new Answer(e.QuestionId, e.TeamId, e.Answer, domainEvent.AggregateEvent.Context.When));
		}

		public List<AnswerCorrection> Corrections { get; private set; } = new List<AnswerCorrection>();
		public void Apply(IReadModelContext context, IDomainEvent<Game, GameId, TeamAnswerStatusUpdated> domainEvent)
		{
			SetId(domainEvent);
			var e = domainEvent.AggregateEvent;
			Corrections.RemoveAll(a => a.TeamId == e.TeamId && a.QuestionId == e.QuestionId);
			Corrections.Add(new AnswerCorrection(e.QuestionId, e.TeamId, e.IsCorrect));
		}

		// __NEW_HANDLERS_GENERATE_HERE__
	}
}