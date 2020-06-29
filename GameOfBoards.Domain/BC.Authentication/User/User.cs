using EventFlow.Aggregates;
using Functional.Maybe;
using GameOfBoards.Domain.Extensions;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Authentication.User
{
	public class User: AggregateRoot<User, UserId>,
		IEmit<UserNameUpdated>,
		IEmit<UserPasswordUpdated>,
		IEmit<UserPhoneUpdated>
		{
		public User(UserId id)
			: base(id)
		{
		}

		public ExecutionResult<UserId> Create(CreateUserCommand command, BusinessCallContext context)
			=>
				PhoneNumber
					.Create(command.PhoneNumber)
					.Chain(() => PersonName.Create(command.FirstName, command.MiddleName, command.LastName))
					.Select(val =>
					{
						var (phoneNumber, personName) = val;
						Emit(new UserNameUpdated(personName, context));
						Emit(new UserPhoneUpdated(phoneNumber, context));
						var password = command.Password
							.Select(Password.Create)
							.OrElse(() => Password.Create(phoneNumber.Value))
							.ResultOrDefault();
						var salt = Salt.Create();
						Emit(new UserPasswordUpdated(PasswordHash.Create(password, salt), salt, context));

						return ExecutionResult<UserId>.Success(Id);
					})
					.ToResult();

		public ExecutionResult<PersonName> UpdateName(UpdateUserNameCommand command, BusinessCallContext context)
			=>
				PersonName.Create(command.FirstName, command.MiddleName, command.LastName)
					.Select(val =>
					{
						Emit(new UserNameUpdated(val, context));
						return ExecutionResult<PersonName>.Success(val);
					})
					.ToResult();
		
		public ExecutionResult<PhoneNumber> ChangePhone(ChangePhoneCommand command, BusinessCallContext context)
			=>
				PhoneNumber
					.Create(command.PhoneNumber)
					.Select(val =>
					{
						Emit(new UserPhoneUpdated(val, context));
						return ExecutionResult<PhoneNumber>.Success(val);
					})
					.ToResult();

		public void Apply(UserNameUpdated aggregateEvent)
		{
		}

		public void Apply(UserPasswordUpdated aggregateEvent)
		{
		}

		public void Apply(UserPhoneUpdated aggregateEvent)
		{
		}
	}
}