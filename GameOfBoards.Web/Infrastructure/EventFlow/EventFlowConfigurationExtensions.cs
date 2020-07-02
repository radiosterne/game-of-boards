using System;
using EventFlow.AspNetCore.Extensions;
using EventFlow.Configuration;
using EventFlow.DependencyInjection.Extensions;
using EventFlow.Extensions;
using EventFlow.Hangfire.Extensions;
using EventFlow.Logs;
using EventFlow.MongoDB.Extensions;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.BC.Game.Game;
using GameOfBoards.Domain.BC.Game.Game.Migrations;
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
					r.Register<ILog, NoOpLog>();
				})
				.AddAspNetCore(o => o.UseDefaults().AddUserClaimsMetadata())
				.ConfigureMongoDb(mongoUrlBuilder.ToMongoUrl().ToString(), mongoUrlBuilder.DatabaseName)
				.UseMongoDbEventStore()
				.UseHangfireJobScheduler()
				.AddEventUpgrader<Game, GameId, QuestionUpdatedV1ToV2Updater>());

			return services;
		}
	}
	
	// ReSharper disable once ClassNeverInstantiated.Global
	public class NoOpLog: Log
	{
		public override void Write(LogLevel logLevel, string format, params object[] args)
		{
		}

		public override void Write(LogLevel logLevel, Exception exception, string format, params object[] args)
		{
		}

		protected override bool IsVerboseEnabled => false;
		protected override bool IsInformationEnabled => false;
		protected override bool IsDebugEnabled => false;
	}
}