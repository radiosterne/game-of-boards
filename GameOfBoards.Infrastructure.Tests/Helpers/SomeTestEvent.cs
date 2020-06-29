using GameOfBoards.Domain;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Infrastructure.Tests.Helpers
{
	internal class SomeTestEvent: BusinessAggregateEvent<ExampleAggregate, ExampleAggregateId>
	{
		public SomeTestEvent(BusinessCallContext context): base(context)
		{
		}
	}
}