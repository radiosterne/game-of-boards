using System.Threading.Tasks;
using EventFlow;
using EventFlow.Queries;
using Microsoft.AspNetCore.Mvc;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Domain.Extensions;
using GameOfBoards.Domain.SharedKernel;
using GameOfBoards.Web.Infrastructure;

namespace GameOfBoards.Web.Howto
{
	public class HowtoApiController: BaseApiController
	{
		public HowtoApiController(
			ICommandBus commandBus,
			IQueryProcessor queryProcessor,
			UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
		}

		public Task<ActionResult<ExecutionResult<bool>>> Test(TestCommand cmd)
			=> true
				.AsSuccess()
				.AsTaskResult()
				.AsActionResult();
	}
}