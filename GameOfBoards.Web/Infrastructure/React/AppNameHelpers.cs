using System;
using System.Collections.Concurrent;
using System.Text.RegularExpressions;

namespace GameOfBoards.Web.Infrastructure.React
{
	public static class AppNameHelpers
	{
		public static string GetAppNameForType(Type type)
		{
			return AppNames.GetOrAdd(type, GetAppNameForTypeImplementation);
		}

		private static string GetAppNameForTypeImplementation(Type type)
		{
			return AppSettingsRegex.Replace(type.Name, "App");
		}

		private static readonly ConcurrentDictionary<Type, string> AppNames = new ConcurrentDictionary<Type, string>();
		private static readonly Regex AppSettingsRegex = new Regex("AppSettings$");
	}
}