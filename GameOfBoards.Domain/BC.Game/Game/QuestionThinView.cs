namespace GameOfBoards.Domain.BC.Game.Game
{
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