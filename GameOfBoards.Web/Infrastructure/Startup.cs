
using GameOfBoards.Domain.BC.Game;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using EventFlow.MongoDB.EventStore;
using EventFlow;
using Hangfire;
using Hangfire.Mongo;
using JavaScriptEngineSwitcher.ChakraCore;
using JavaScriptEngineSwitcher.Extensions.MsDependencyInjection;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Domain.SharedKernel;
using GameOfBoards.Infrastructure.Serialization.Json;
using GameOfBoards.Web.Infrastructure.Configuration;
using GameOfBoards.Web.Infrastructure.EventFlow;
using GameOfBoards.Web.Infrastructure.React;
using React.AspNet;

namespace GameOfBoards.Web.Infrastructure
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			var universeConfig = configuration.GetSection("UniverseState").Get<UniverseStateConfig>();
			_universeState = new UniverseState(universeConfig);
			var mongoDbConfig = configuration.GetSection("MongoDb").Get<MongoDbConfig>();
			_mongoDbConfiguration = new MongoDbConfiguration(mongoDbConfig);
			var superuserConfig = configuration.GetSection("Superuser").Get<SuperuserConfig>();
			_superuserConfiguration = new SuperuserConfiguration(superuserConfig.PhoneNumber, superuserConfig.Password);
			var yandexApiConfig = configuration.GetSection("YandexApi").Get<YandexApiConfig>();
			_yandexApiConfiguration = new YandexApiConfiguration(yandexApiConfig);
		}

		private readonly UniverseState _universeState;
		private readonly MongoDbConfiguration _mongoDbConfiguration;
		private readonly SuperuserConfiguration _superuserConfiguration;
		private readonly YandexApiConfiguration _yandexApiConfiguration;

		public void ConfigureServices(IServiceCollection services)
		{
			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
			services.AddTransient<IBusinessCallContextProvider, BusinessCallContextHttpContextProvider>();
			services.AddSingleton<SuperuserEnsuringService>();
			services.AddSingleton(_superuserConfiguration);
			services.AddSingleton(_yandexApiConfiguration);
			// services.AddTransient<SampleJob>();

			services.AddDataProtection()
				.PersistKeysToFileSystem(new DirectoryInfo(_universeState.DataProtectionKeysPath))
				.SetApplicationName("GameOfBoards");

			services.AddSingleton(_universeState);
			services
				.AddMemoryCache()
				.AddControllers(opts => { opts.Conventions.Insert(0, new ApplicationModelConvention()); })
				.AddNewtonsoftJson(o => { o.SerializerSettings.SetupJsonFormatterSettings(); });

			services.AddEventFlowServices(_mongoDbConfiguration);

			services.DisableDefaultModelValidation();

			services.AddReact();

			var migrationOptions = new MongoMigrationOptions
			{
				Strategy = MongoMigrationStrategy.Migrate,
				BackupStrategy = MongoBackupStrategy.None
			};
			var storageOptions = new MongoStorageOptions
			{
				MigrationOptions = migrationOptions
			};

			services.AddHangfire(x => x
				.UseColouredConsoleLogProvider()
				.UseMongoStorage(_mongoDbConfiguration.ConnectionString, storageOptions)
			);

			services
				.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
				.AddCookie(opts =>
				{
					opts.Cookie.Name = ".gameofboards-auth";
					opts.LoginPath = "/Account/Login";
					opts.LogoutPath = "/Account/Logout";
				});

			services
				.AddJsEngineSwitcher()
				.AddChakraCore();

			services.AddSignalR()
				.AddNewtonsoftJsonProtocol(opts => opts.PayloadSerializerSettings.SetupJsonFormatterSettings());
		}

		public void Configure(IApplicationBuilder app)
		{
			app.UseDeveloperExceptionPage();

			app.ConfigureReact(_universeState);
			app.UseStaticFiles();
			app.UseRouting();
			app.UseAuthentication();
			app.UseEndpoints(endpoints =>
				endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/"));
			app.UseHangfireServer();
			app.UseHangfireDashboard("/hf");
			app.ApplicationServices.GetRequiredService<IMongoDbEventPersistenceInitializer>().Initialize();
			// var refreshTokenJob = app.ApplicationServices.GetService<SampleJob>();
			// RecurringJob.AddOrUpdate(
			// 	"Refresh Yandex API token",
			// 	() => refreshTokenJob.Run(),
			// 	Cron.Weekly()
			// );
		}
	}

	// public class SampleJob
	// {
	// 	private readonly ICommandBus _commandBus;

	// 	public SampleJob(ICommandBus commandBus)
	// 	{
	// 		_commandBus = commandBus;
	// 	}

	// 	public Task Run() =>
	// 		_commandBus.PublishAsync(new RefreshYandexDiskTokenCommand(), CancellationToken.None);
	// }
}
