using EventFlow.ReadStores;

namespace GameOfBoards.Domain
{
	// ReSharper disable once UnusedTypeParameter
	public interface IWithLocator<T>
		where T: IReadModelLocator
	{
		
	}
}