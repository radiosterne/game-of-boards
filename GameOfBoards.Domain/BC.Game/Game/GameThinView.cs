using Functional.Maybe;

namespace GameOfBoards.Domain.BC.Game.Game
{
	public class GameThinView
	{
		public GameId Id { get; }
		public GameState State { get; }
		public Maybe<QuestionId> ActiveQuestion { get; }
		public string Name { get; }

		public GameThinView(GameId id, GameState state, Maybe<QuestionId> activeQuestion, string name)
		{
			Id = id;
			State = state;
			ActiveQuestion = activeQuestion;
			Name = name;
		}
		
		public static GameThinView FromView(GameView view) =>
			new GameThinView(GameId.With(view.Id), view.State, view.ActiveQuestionId, view.Name);
	}
}