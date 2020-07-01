using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EventFlow.MongoDB.ReadStores;
using GameOfBoards.Domain.Extensions;

namespace GameOfBoards.Domain.BC.Game.Game.Queries
{
	public class ListGameQuery: ReadModelQuery<IReadOnlyCollection<GameView>, GameView>
	{
		public override Task<IReadOnlyCollection<GameView>> Run(IMongoDbReadModelStore<GameView> viewStore,
			CancellationToken ct) => viewStore.ListAsync(_ => true, ct);
	}
}