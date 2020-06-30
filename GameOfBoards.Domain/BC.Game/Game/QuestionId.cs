using EventFlow.Core;

namespace GameOfBoards.Domain.BC.Game.Game
{
	public class QuestionId: Identity<QuestionId>
	{
		public QuestionId(string value): base(value)
		{
		}
	}
}