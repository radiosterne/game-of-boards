using System;
using Newtonsoft.Json;

namespace GameOfBoards.Infrastructure.Serialization.Json
{
	public class DateTimeConverter : ValueBasedTypeConverter<DateTime>
	{
		public const string ValuePropertyName = "__dt";
		public const string Format = "yyyy-MM-ddTHH:mm:ss";

		public DateTimeConverter() : base(ValuePropertyName, JsonToken.Date)
		{
		}

		protected override string ToValue(DateTime v) => v.ToString(Format);

		protected override DateTime FromValue(object value)
		{
			if (value is DateTime time)
			{
				return time;
			}
			else throw new InvalidOperationException("value must be DateTime");
		}
	}
}