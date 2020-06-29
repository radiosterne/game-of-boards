using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Infrastructure.Serialization.Bson
{
	public class SystemTimeSerializer: SerializerBase<DateTime>, IChildSerializerConfigurable
	{
		public override DateTime Deserialize(
			BsonDeserializationContext context,
			BsonDeserializationArgs args)
			=>
				new BsonDateTime(context.Reader.ReadDateTime())
					.ToUniversalTime()
					.CleanKind();


		public override void Serialize(
			BsonSerializationContext context,
			BsonSerializationArgs args,
			DateTime value)
			=> context.Writer.WriteDateTime(value.ToUnspecifiedMillisecondsSinceEpoch());


		public IBsonSerializer WithChildSerializer(IBsonSerializer childSerializer)
			=> ChildSerializer;

		public IBsonSerializer ChildSerializer => new DateTimeSerializer();
	}
}