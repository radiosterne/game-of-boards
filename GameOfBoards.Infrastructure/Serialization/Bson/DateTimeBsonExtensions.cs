using System;
using MongoDB.Bson;

namespace GameOfBoards.Infrastructure.Serialization.Bson
{
	public static class DateTimeBsonExtensions
	{
		public static long ToUnspecifiedMillisecondsSinceEpoch(this DateTime dt)
			=> (dt - BsonConstants.UnixEpoch).Ticks / 10000L;
	}
}