using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using Functional.Maybe;
using GameOfBoards.Domain.BC.Game.Game.Queries;
using JetBrains.Annotations;

namespace GameOfBoards.Domain.BC.Game.Game
{
	[UsedImplicitly]
	public class GameQueryHandler:
		IQueryHandler<GameByIdQuery, Maybe<GameView>>,
		IQueryHandler<ListGameQuery, IReadOnlyCollection<GameView>>
	{
		private readonly IMongoDbReadModelStore<GameView> _viewStore;
		public GameQueryHandler(IMongoDbReadModelStore<GameView> viewStore) => _viewStore = viewStore;

		public Task<Maybe<GameView>> ExecuteQueryAsync(GameByIdQuery query, CancellationToken cancellationToken)=> 
			query.Run(_viewStore, cancellationToken);

		public Task<IReadOnlyCollection<GameView>> ExecuteQueryAsync(ListGameQuery query,
			CancellationToken cancellationToken) => 
			query.Run(_viewStore, cancellationToken);
	}
}