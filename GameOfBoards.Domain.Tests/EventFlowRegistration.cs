using EventFlow;
using EventFlow.Configuration;
using EventFlow.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.ReadStores;
using GameOfBoards.Domain.SharedKernel;
using GameOfBoards.Infrastructure;

namespace GameOfBoards.Domain.Tests
{
	public static class EventFlowRegistration
	{
		public static IRootResolver CreateResolver() =>
			EventFlowOptions.New
				.SetupBlumenkraftDomain(ReadModelRegistrationDescriptor.Create(
					typeof(EventFlowRegistration),
					nameof(UseMongoDbReadModel)))
				.RegisterServices(r =>
				{
					r.Register<IBusinessCallContextProvider, SystemContextProvider>();
				})
				.CreateResolver(false);

		private static IEventFlowOptions UseMongoDbReadModel<TReadModel, TLocator>(
			this IEventFlowOptions eventFlowOptions)
			where TReadModel: class, IMongoDbReadModel, new()
			where TLocator: IReadModelLocator
		{
			return eventFlowOptions
				.RegisterServices(f =>
				{
					f.Register<IMongoDbReadModelStore<TReadModel>, InMemoryMongoDbReadModelStore<TReadModel>>(Lifetime.Singleton);
					f.Register<IReadModelStore<TReadModel>>(r =>
						r.Resolver.Resolve<IMongoDbReadModelStore<TReadModel>>());
				})
				.UseReadStoreFor<IMongoDbReadModelStore<TReadModel>, TReadModel, TLocator>();
		}

		private static IEventFlowOptions UseMongoDbReadModel<TReadModel>(
			this IEventFlowOptions eventFlowOptions)
			where TReadModel: class, IMongoDbReadModel, new()
		{
			return eventFlowOptions
				.RegisterServices(f =>
				{
					f.Register<IMongoDbReadModelStore<TReadModel>, InMemoryMongoDbReadModelStore<TReadModel>>(Lifetime.Singleton);
					f.Register<IReadModelStore<TReadModel>>(r =>
						r.Resolver.Resolve<IMongoDbReadModelStore<TReadModel>>());
				})
				.UseReadStoreFor<IMongoDbReadModelStore<TReadModel>, TReadModel>();
		}
	}
}