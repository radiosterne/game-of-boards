using EventFlow;
using EventFlow.Queries;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Web.Infrastructure.React;
using System.Threading.Tasks;

namespace GameOfBoards.Web.Howto
{
	public class HowtoController: ReactController
	{
		public HowtoController(
			ICommandBus commandBus,
			IQueryProcessor queryProcessor,
			UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
		}

		public Task<TypedResult<HowtoMainAppSettings>> Main()
			=> React(new HowtoMainAppSettings());
	}
}