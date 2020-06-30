using System;
using GameOfBoards.Domain.BC.Authentication.User;

namespace GameOfBoards.Domain.BC.Game.Game
{
	public class Answer
	{
		public QuestionId QuestionId { get; }
		public UserId TeamId { get; }
		public string AnswerText { get; }
		
		public DateTime Moment { get; }

		public Answer(QuestionId questionId, UserId teamId, string answerText, DateTime moment)
		{
			QuestionId = questionId;
			TeamId = teamId;
			AnswerText = answerText;
			Moment = moment;
		}
	}
}