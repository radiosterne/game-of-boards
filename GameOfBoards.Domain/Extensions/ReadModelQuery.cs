using System;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using EventFlow.ReadStores;
using Functional.Maybe;

namespace GameOfBoards.Domain.Extensions
{
	public abstract class ReadModelQuery<TResult, TReadModel>: IQuery<TResult>
		where TReadModel: class, IReadModel, new()
	{
		public abstract Task<TResult> Run(IMongoDbReadModelStore<TReadModel> viewStore, CancellationToken ct);

		protected Task<Maybe<TReadModel>> Find(IMongoDbReadModelStore<TReadModel> viewStore,
			Expression<Func<TReadModel, bool>> filter,
			CancellationToken ct) => viewStore.FindMaybeAsync(filter, ct);

		protected async Task<Maybe<TReadModel>> FindById(IMongoDbReadModelStore<TReadModel> viewStore,
			string id,
			CancellationToken ct) => (await viewStore.GetAsync(id, ct)).ReadModel.ToMaybe();
	}
}