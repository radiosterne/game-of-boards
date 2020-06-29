using GameOfBoards.Domain;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Infrastructure.Tests.Helpers
{
	internal class AnotherTestEvent: BusinessAggregateEvent<ExampleAggregate, ExampleAggregateId>
	{
		public AnotherTestEvent(BusinessCallContext context): base(context)
		{
		}
	}
}