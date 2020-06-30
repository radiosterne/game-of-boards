using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using Functional.Maybe;
using GameOfBoards.Domain.Extensions;
using JetBrains.Annotations;

namespace GameOfBoards.Domain.BC.Game.Game
{
	public class ListGameQuery: ReadModelQuery<IReadOnlyCollection<GameView>, GameView>
	{
		public override Task<IReadOnlyCollection<GameView>> Run(IMongoDbReadModelStore<GameView> viewStore,
			CancellationToken ct) => viewStore.ListAsync(_ => true, ct);
	}
	
	public class GameByIdQuery: ReadModelQuery<Maybe<GameView>, GameView>
	{
		public GameByIdQuery(GameId id)
		{
			Id = id;
		}

		public GameId Id { get; }
	
		public override async Task<Maybe<GameView>> Run(IMongoDbReadModelStore<GameView> viewStore,
			CancellationToken ct)
		{
			var result = await viewStore.GetAsync(Id.Value, ct);
			return result.ReadModel.ToMaybe();
		}
	}
	
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