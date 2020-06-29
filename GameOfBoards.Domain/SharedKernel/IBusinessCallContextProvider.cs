
namespace GameOfBoards.Domain.SharedKernel
{
	public interface IBusinessCallContextProvider
	{
		BusinessCallContext GetCurrent();
	}
}