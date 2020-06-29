using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.Tests
{
	internal class SystemContextProvider: IBusinessCallContextProvider
	{
		public BusinessCallContext GetCurrent() => BusinessCallContext.System();
	}
}