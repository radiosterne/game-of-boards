using EventFlow.ValueObjects;
using Functional.Either;
using Functional.Maybe;
using GameOfBoards.Domain.Extensions;

namespace GameOfBoards.Domain.SharedKernel
{
	public class PersonName : ValueObject
	{
		public PersonName(string firstName, Maybe<string> middleName, Maybe<string> lastName)
		{
			FirstName = firstName;
			MiddleName = middleName;
			LastName = lastName;
		}

		public string FirstName { get; }

		public Maybe<string> MiddleName { get; }
		public Maybe<string> LastName { get; }

		public Maybe<string> ShortOfficialForm =>
			LastName.Select(last => $"{last} {FirstName[0]}.{MiddleName.Select(m => $"{m[0]}.").OrElseDefault()}");

		public string FullForm => $"{FirstName}{MiddleName.Select(n => $" {n}").OrElseDefault()}{LastName.Select(n => $" {n}").OrElseDefault()}";

		public override string ToString() => FullForm;

		public static Either<PersonName, Error> Create(string firstName, Maybe<string> middleName,
			Maybe<string> lastName)
		{
			if (firstName.Empty())
			{
				return Error.Create("Имя человека не может быть пусто.");
			}
			
			return new PersonName(firstName, middleName.Where(StringEx.NotEmpty), lastName.Where(StringEx.NotEmpty));
		}
	}
}