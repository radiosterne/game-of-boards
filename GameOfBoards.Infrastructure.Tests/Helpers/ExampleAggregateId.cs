using EventFlow.Core;

namespace GameOfBoards.Infrastructure.Tests.Helpers
{
	internal class ExampleAggregateId: Identity<ExampleAggregateId>
	{
		public ExampleAggregateId(string value): base(value)
		{
		}
	}
}