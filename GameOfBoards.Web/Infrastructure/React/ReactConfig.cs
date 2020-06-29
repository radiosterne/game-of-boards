using Microsoft.AspNetCore.Builder;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Infrastructure.Serialization.Json;
using React;
using React.AspNet;
using AssemblyRegistration = React.AssemblyRegistration;

namespace GameOfBoards.Web.Infrastructure.React
{
	public static class ReactConfig
	{
		public static void ConfigureReact(this IApplicationBuilder app, UniverseState universeState)
		{
			// to ensure client and server rendering works identical, borrow JSON settings from Web API
			ReactSiteConfiguration.Configuration.JsonSerializerSettings.SetupJsonFormatterSettings();

			var reactScriptPath = universeState.IsProduction
				? "~/bundles/lib/react.min.js"
				: "~/node_modules/react/umd/react.development.js";

			var reactDomScriptPath = universeState.IsProduction
				? "~/bundles/lib/react-dom.min.js"
				: "~/node_modules/react-dom/umd/react-dom.development.js";

			app.UseReact(conf => conf
				.SetLoadBabel(false)
				.SetLoadReact(false)
				.SetReuseJavaScriptEngines(true)
				.SetStartEngines(5)
				.SetMaxEngines(25)
				.AddScriptWithoutTransform("~/bundles/serverShims.js")
				.AddScriptWithoutTransform(reactScriptPath)
				.AddScriptWithoutTransform(reactDomScriptPath)
				.AddScriptWithoutTransform("~/bundles/bundle.js"));

			var container = AssemblyRegistration.Container;
			container.Unregister<IReactEnvironment>();
			container.Register<IReactEnvironment, AppReactEnvironment>()
				.AsPerRequestSingleton();
		}
	}
}