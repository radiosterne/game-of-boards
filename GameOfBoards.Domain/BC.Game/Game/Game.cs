using EventFlow.Aggregates;
using Functional.Maybe;
using GameOfBoards.Domain.BC.Game.Game.Commands;
using GameOfBoards.Domain.BC.Game.Game.Events;
using GameOfBoards.Domain.SharedKernel;
using JetBrains.Annotations;

namespace GameOfBoards.Domain.BC.Game.Game
{
	[UsedImplicitly]
	public class Game: AggregateRoot<Game, GameId>,
		IEmit<StateUpdated>,
		IEmit<QuestionUpdated>,
		IEmit<TeamRegistered>,
		IEmit<ActiveQuestionUpdated>,
		IEmit<TeamAnswerUpdated>,
		IEmit<TeamAnswerStatusUpdated>,
		IEmit<GameUpdated>
	{
		public Game(GameId id)
			: base(id)
		{
		}

		public ExecutionResult<GameId> Update(UpdateGame cmd, BusinessCallContext ctx)
		{
			if (_name != cmd.Name)
			{
				Emit(new GameUpdated(cmd.Name, ctx));
			}

			return ExecutionResult<GameId>.Success(Id);
		}

		private string _name;

		void IEmit<GameUpdated>.Apply(GameUpdated aggregateEvent)
		{
			_name = aggregateEvent.Name;
		}

		public ExecutionResult<GameId> UpdateState(UpdateState cmd, BusinessCallContext context)
		{
			if (_state != cmd.State)
			{
				Emit(new StateUpdated(cmd.State, context));
			}

			return ExecutionResult<GameId>.Success(Id);
		}

		private GameState _state;

		void IEmit<StateUpdated>.Apply(StateUpdated e)
		{
			_state = e.State;
		}

		public ExecutionResult<GameId> UpdateQuestion(UpdateQuestion cmd, BusinessCallContext context)
		{
			Emit(new QuestionUpdated(
				cmd.QuestionId.OrElse(QuestionId.New),
				cmd.ShortName,
				cmd.RightAnswers,
				cmd.QuestionText,
				cmd.Points,
				context));

			return ExecutionResult<GameId>.Success(Id);
		}


		void IEmit<QuestionUpdated>.Apply(QuestionUpdated e)
		{
		}

		public ExecutionResult<GameId> RegisterTeam(RegisterTeam cmd, BusinessCallContext context)
		{
			Emit(new TeamRegistered(cmd.TeamId, cmd.Registered, context));

			return ExecutionResult<GameId>.Success(Id);
		}

		void IEmit<TeamRegistered>.Apply(TeamRegistered e)
		{
		}

		public ExecutionResult<GameId> UpdateActiveQuestion(UpdateActiveQuestion cmd, BusinessCallContext context)
		{
			Emit(new ActiveQuestionUpdated(cmd.QuestionId, cmd.IsActive, context));


			return ExecutionResult<GameId>.Success(Id);
		}

		void IEmit<ActiveQuestionUpdated>.Apply(ActiveQuestionUpdated e)
		{
		}

		public ExecutionResult<GameId> UpdateTeamAnswer(UpdateTeamAnswer cmd, BusinessCallContext context)
		{
			Emit(new TeamAnswerUpdated(cmd.Answer, cmd.TeamId, cmd.QuestionId, context));

			return ExecutionResult<GameId>.Success(Id);
		}

		void IEmit<TeamAnswerUpdated>.Apply(TeamAnswerUpdated e)
		{
		}

		public ExecutionResult<GameId> UpdateTeamAnswerStatus(UpdateTeamAnswerStatus cmd, BusinessCallContext context)
		{
			Emit(new TeamAnswerStatusUpdated(cmd.TeamId, cmd.QuestionId, cmd.IsCorrect, context));

			return ExecutionResult<GameId>.Success(Id);
		}

		void IEmit<TeamAnswerStatusUpdated>.Apply(TeamAnswerStatusUpdated e)
		{
		}

		// __NEW_COMMANDS_GENERATE_HERE__
	}
}