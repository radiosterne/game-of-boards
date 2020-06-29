using System.Linq;
using EventFlow.ValueObjects;
using Functional.Either;
using GameOfBoards.Domain.Extensions;

namespace GameOfBoards.Domain.SharedKernel
{
	public class PhoneNumber : SingleValueObject<string>
	{
		public static Either<PhoneNumber, Error> Create(string value)
		{
			if (value.Empty())
			{
				return Error.Create("Переданный номер телефона пуст или null.");
			}

			var cleaned = value.Remove('(', ')', '-', '+', ' ');

			if (cleaned.Length < 10)
			{
				return Error.Create("Переданный номер телефона слишком короткий");
			}

			if (cleaned.Any(c => !char.IsDigit(c)))
			{
				return Error.Create("Переданный номер телефона содержит нецифровые символы");
			}

			var firstDigit = cleaned[0];
			if (cleaned.Length == 11 && firstDigit == '8')
			{
				cleaned = $"+7{cleaned.Substring(1)}";
			}
			else if (cleaned.Length == 11 && firstDigit == '7')
			{
				cleaned = $"+{cleaned}";
			}
			else if (cleaned.Length == 10 && firstDigit == '9')
			{
				cleaned = $"+7{cleaned}";
			}
			
			return new PhoneNumber(cleaned);
		}

		private PhoneNumber(string value) : base(value)
		{
		}
	}
}