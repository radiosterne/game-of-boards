using System;
using System.Linq;
using EventFlow.Core;
using Newtonsoft.Json;

namespace GameOfBoards.Infrastructure.Serialization.Json
{
	public class EventFlowJsonSerializer : IJsonSerializer
	{
		public string Serialize(object obj, bool indented = false) => 
			JsonConvert.SerializeObject(obj, indented ? SettingsIndented : SettingsNotIndented);

		public object Deserialize(string json, Type type) => 
			JsonConvert.DeserializeObject(json, type, SettingsNotIndented);

		public T Deserialize<T>(string json) => 
			JsonConvert.DeserializeObject<T>(json, SettingsNotIndented);
		
		private static readonly JsonSerializerSettings SettingsNotIndented = new JsonSerializerSettings
		{
			Formatting = Formatting.None,
			Converters = JsonSerializerSettingsExtensions.Converters.ToList()
		};

		private static readonly JsonSerializerSettings SettingsIndented = new JsonSerializerSettings
		{
			Formatting = Formatting.Indented,
			Converters = JsonSerializerSettingsExtensions.Converters.ToList()
		};
	}
}