using Newtonsoft.Json;
using NUnit.Framework;
using GameOfBoards.Domain.SharedKernel;
using GameOfBoards.Infrastructure.Serialization.Json;
using GameOfBoards.Infrastructure.Tests.Helpers;

namespace GameOfBoards.Infrastructure.Tests
{
	[TestFixture]
	public class DomainEventSerializationTests
	{
		[Test]
		public void IncludesTypeNamesWhenDealingWithEvents()
		{
			var evt = new SomeTestEvent(BusinessCallContext.System());
			var settings = new JsonSerializerSettings().SetupJsonFormatterSettings();
			var json = JsonConvert.SerializeObject(evt, settings);
			Assert.IsTrue(json.Contains("domainEventType"));
		}
	}
}