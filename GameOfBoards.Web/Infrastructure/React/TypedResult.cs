using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using GameOfBoards.Infrastructure.Serialization.Json;

namespace GameOfBoards.Web.Infrastructure.React
{
	// ReSharper disable once UnusedTypeParameter
	// Type parameter needed to determine action return type
	public abstract class TypedResult<T> : ActionResult
	{
		protected TypedResult(string type)
		{
			Type = type;
		}

		// ReSharper disable once UnusedAutoPropertyAccessor.Global
		// ReSharper disable once MemberCanBePrivate.Global
		// Used implicitly via front-end code
		public string Type { get; }

		protected static void ExecuteJsonResult(ActionContext context, object value)
		{
			context.HttpContext.PreventResponseCaching();

			var serializer = ActionResultJsonSettings.Serializer;
			using var textWriter = context.HttpContext.GetResponseWriter();
			using var jsonWriter = new JsonTextWriter(textWriter) {Formatting = serializer.Formatting};
			serializer.Serialize(jsonWriter, value);
		}

		public abstract override Task ExecuteResultAsync(ActionContext context);
	}

	internal static class ActionResultJsonSettings
	{
		static ActionResultJsonSettings()
		{
			Serializer = JsonSerializer.CreateDefault(new JsonSerializerSettings().SetupJsonFormatterSettings());
		}

		public static readonly JsonSerializer Serializer;
	}
}