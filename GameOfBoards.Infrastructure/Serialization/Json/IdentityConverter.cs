using System;
using System.Collections.Concurrent;
using Newtonsoft.Json;

namespace GameOfBoards.Infrastructure.Serialization.Json
{
	public class IdentityConverter: JsonConverter
	{
		public IdentityConverter()
		{
			_converters = new ConcurrentDictionary<Type, TypeConverterWrapper>();
		}

		public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) =>
			GetConverter(value.GetType()).WriteJson(writer, value, serializer);

		public override object ReadJson(JsonReader reader, Type objectType, object existingValue,
			JsonSerializer serializer) =>
			GetConverter(objectType).ReadJson(reader, serializer);

		public override bool CanConvert(Type objectType) =>
			objectType.IsIdentityType();

		private TypeConverterWrapper GetConverter(Type type)
			=> _converters.GetOrAdd(type, CreateConverter);

		private TypeConverterWrapper CreateConverter(Type type) =>
			new TypeConverterWrapper(_openIdentityConverterType.MakeGenericType(type));

		private readonly ConcurrentDictionary<Type, TypeConverterWrapper> _converters;
		private readonly Type _openIdentityConverterType = typeof(TypedIdentityConverter<>);
	}
}