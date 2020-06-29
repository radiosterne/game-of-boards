using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Infrastructure.Serialization.Bson
{
	public class DateSerializer : SerializerBase<Date>
	{
		public override Date Deserialize(
			BsonDeserializationContext context,
			BsonDeserializationArgs args)
			=>
				DateTimeSerializer.DateOnlyInstance.Deserialize(context, args).AsDate();


		public override void Serialize(
			BsonSerializationContext context,
			BsonSerializationArgs args,
			Date value)
			=> DateTimeSerializer.DateOnlyInstance.Serialize(context, args, value.Start);
	}
}