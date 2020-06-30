using System;
using System.Collections.Generic;
using Functional.Maybe;
using System.Linq;
using GameOfBoards.Domain.BC.Authentication.User;

namespace GameOfBoards.Domain.BC.Game.Game
{
	public class GameThinView
	{
		public GameId Id { get; }
		public GameState State { get; }
		public Maybe<QuestionId> ActiveQuestion { get; }
		
		public IReadOnlyCollection<QuestionId> AnsweredQuestions { get; }
		public string Name { get; }
		
		public IReadOnlyCollection<UserId> RegisteredTeams { get; }
		
		public IReadOnlyCollection<QuestionThinView> Questions { get; }

		public GameThinView(
			GameId id,
			GameState state,
			Maybe<QuestionId> activeQuestion,
			string name,
			IReadOnlyCollection<QuestionId> answeredQuestions,
			IReadOnlyCollection<UserId> registeredTeams,
			IReadOnlyCollection<QuestionThinView> questions)
		{
			Id = id;
			State = state;
			ActiveQuestion = activeQuestion;
			Name = name;
			AnsweredQuestions = answeredQuestions;
			RegisteredTeams = registeredTeams;
			Questions = questions;
		}
		
		public static GameThinView FromView(GameView view, Maybe<UserId> forTeam) =>
			new GameThinView(
				GameId.With(view.Id),
				view.State,
				view.ActiveQuestionId,
				view.Name,
				forTeam
					.Select(id => view.Answers.Where(a => a.TeamId == id).Select(a => a.QuestionId).ToArray())
					.OrElse(Array.Empty<QuestionId>()),
				view.RegisteredTeams,
				view.Questions.Select(q => new QuestionThinView(q.QuestionId, q.ShortName)).ToArray());
	}

	public class QuestionThinView
	{
		public QuestionThinView(QuestionId id, string name)
		{
			Id = id;
			Name = name;
		}

		public string Name { get; }
		
		public QuestionId Id { get; }
	}
}