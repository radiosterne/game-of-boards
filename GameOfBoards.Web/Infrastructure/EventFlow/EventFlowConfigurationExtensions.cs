using EventFlow.AspNetCore.Extensions;
using EventFlow.Configuration;
using EventFlow.DependencyInjection.Extensions;
using EventFlow.Hangfire.Extensions;
using EventFlow.MongoDB.Extensions;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Infrastructure;
using GameOfBoards.Infrastructure.Serialization.Bson;
using GameOfBoards.Web.Infrastructure.Configuration;
using EventFlowOptionsExtensions = GameOfBoards.Infrastructure.EventFlowOptionsExtensions;

namespace GameOfBoards.Web.Infrastructure.EventFlow
{
	public static class EventFlowConfigurationExtensions
	{
		public static IServiceCollection AddEventFlowServices(this IServiceCollection services,
			MongoDbConfiguration mongoDbConfiguration)
		{
			BsonSerializerSetup.SetupCustomSerialization();
			EventFlowOptionsExtensions.SetupMongoSerialization();
			var mongoUrlBuilder = new MongoUrlBuilder(mongoDbConfiguration.ConnectionString);
			services.AddEventFlow(ef => ef
				.SetupBlumenkraftDomain(ReadModelRegistrationDescriptor.Create(
					typeof(MongoDbOptionsExtensions),
					nameof(MongoDbOptionsExtensions.UseMongoDbReadModel)))
				.RegisterServices(r =>
				{
					r.Register<ReadModelPopulator, ReadModelPopulator>();
					r.Register<IBootstrap, SuperuserEnsuringService>();
				})
				.AddAspNetCore(o => o.UseDefaults().AddUserClaimsMetadata())
				.ConfigureMongoDb(mongoUrlBuilder.ToMongoUrl().ToString(), mongoUrlBuilder.DatabaseName)
				.UseMongoDbEventStore()
				.UseHangfireJobScheduler());

			return services;
		}
	}
}