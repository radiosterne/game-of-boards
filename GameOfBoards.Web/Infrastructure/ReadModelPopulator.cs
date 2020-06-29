using System.Threading;
using System.Threading.Tasks;
using EventFlow.Configuration;
using EventFlow.ReadStores;
using JetBrains.Annotations;

namespace GameOfBoards.Web.Infrastructure
{
	[UsedImplicitly]
	public class ReadModelPopulator : IBootstrap
	{
		private readonly IReadModelPopulator _populator;

		public ReadModelPopulator(IReadModelPopulator populator)
		{
			_populator = populator;
		}

		public async Task BootAsync(CancellationToken ct)
		{
		}
		
		private async Task Rebuild<T>(CancellationToken ct)
			where T: class, IReadModel
		{
			await _populator.PurgeAsync<T>(ct);
			await _populator.PopulateAsync<T>(ct);
		}
	}
}