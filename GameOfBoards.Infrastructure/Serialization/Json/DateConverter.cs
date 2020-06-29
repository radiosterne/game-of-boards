using System;
using Newtonsoft.Json;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Infrastructure.Serialization.Json
{
	public class DateConverter : ValueBasedTypeConverter<Date>
	{
		public DateConverter() : base(DateTimeConverter.ValuePropertyName, JsonToken.Date)
		{
		}

		protected override string ToValue(Date v) => v.Start.ToString(DateTimeConverter.Format);


		protected override Date FromValue(object value)
		{
			if (value is DateTime time)
			{
				return time.AsDate();
			}

			throw new InvalidOperationException("value must be DateTime");
		}
	}
}