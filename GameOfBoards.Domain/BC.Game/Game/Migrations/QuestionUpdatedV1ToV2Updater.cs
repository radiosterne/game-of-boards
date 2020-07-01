using System.Collections.Generic;
using EventFlow.Aggregates;
using EventFlow.EventStores;
using GameOfBoards.Domain.BC.Game.Game.Events;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Game.Game.Migrations
{
	public class QuestionUpdatedV1: BusinessAggregateEvent<Game, GameId>
	{
		public QuestionUpdatedV1(QuestionId questionId, string shortName, string rightAnswers, BusinessCallContext context)
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
	
	public class QuestionUpdatedV1ToV2Updater: IEventUpgrader<Game, GameId>
	{
		
		private readonly IDomainEventFactory _domainEventFactory;

		public QuestionUpdatedV1ToV2Updater(IDomainEventFactory domainEventFactory)
		{
			_domainEventFactory = domainEventFactory;
		}

		public IEnumerable<IDomainEvent<Game, GameId>> Upgrade(IDomainEvent<Game, GameId> domainEvent)
		{
			if (domainEvent is IDomainEvent<Game, GameId, QuestionUpdatedV1> v1)
			{
				var evt = v1.AggregateEvent;
				yield return _domainEventFactory.Upgrade<Game, GameId>(
					domainEvent, new QuestionUpdated(
					evt.QuestionId,
					evt.ShortName,
					evt.RightAnswers,
					string.Empty,
					1,
					evt.Context));
			}
			else
			{
				yield return domainEvent;
			}
		}
	}
}