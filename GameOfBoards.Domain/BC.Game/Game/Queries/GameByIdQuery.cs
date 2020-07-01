using System.Threading;
using System.Threading.Tasks;
using EventFlow.MongoDB.ReadStores;
using Functional.Maybe;
using GameOfBoards.Domain.Extensions;

namespace GameOfBoards.Domain.BC.Game.Game.Queries
{
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
}