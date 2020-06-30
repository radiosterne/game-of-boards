using System.Threading;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Functional.Maybe;
using EventFlow.Commands;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Authentication.User
{
	public class CreateUserCommand: Command<User, UserId, ExecutionResult<UserId>>
	{
		public CreateUserCommand(
			string firstName,
			Maybe<string> middleName,
			Maybe<string> lastName,
			string phoneNumber,
			Maybe<string> password)
			: base(UserId.New)
		{
			FirstName = firstName;
			MiddleName = middleName;
			LastName = lastName;
			PhoneNumber = phoneNumber;
			Password = password;
		}

		public string FirstName { get; }

		public Maybe<string> MiddleName { get; }

		public Maybe<string> LastName { get; }

		public string PhoneNumber { get; }

		public Maybe<string> Password { get; }
	}
	
	public class UpdateUserNameCommand: Command<User, UserId, ExecutionResult<PersonName>>
	{
		public UpdateUserNameCommand(
			UserId id,
			string firstName,
			Maybe<string> middleName,
			Maybe<string> lastName)
			: base(id)
		{
			Id = id;
			FirstName = firstName;
			MiddleName = middleName;
			LastName = lastName;
		}
		
		public UserId Id { get; }
		
		public string FirstName { get; }

		public Maybe<string> MiddleName { get; }

		public Maybe<string> LastName { get; }
	}
	
	public class ChangePhoneCommand: Command<User, UserId, ExecutionResult<PhoneNumber>>
	{
		public ChangePhoneCommand(UserId id, string phoneNumber)
			: base(id)
		{
			Id = id;
			PhoneNumber = phoneNumber;
		}
		
		public UserId Id { get; }
		
		public string PhoneNumber { get; }
	}
	
	public class ChangePasswordCommand: Command<User, UserId, ExecutionResult>
	{
		public ChangePasswordCommand(UserId aggregateId, string password)
			: base(aggregateId)
		{
			Password = password;
		}
		
		public string Password { get; }
	}

	public class UpdateUserTeamStatus: Command<User, UserId, ExecutionResult<UserId>>
	{
		public bool IsTeam { get; }

		public UpdateUserTeamStatus(UserId aggregateId, bool isTeam): base(aggregateId)
		{
			IsTeam = isTeam;
		}
	}
	
	[UsedImplicitly]
	public class UserCommandHandler:
		ICommandHandler<User, UserId, ExecutionResult<UserId>, CreateUserCommand>,
		ICommandHandler<User, UserId, ExecutionResult<PersonName>, UpdateUserNameCommand>,
		ICommandHandler<User, UserId, ExecutionResult<PhoneNumber>, ChangePhoneCommand>,
		ICommandHandler<User, UserId, ExecutionResult<UserId>, UpdateUserTeamStatus>
	{
		private readonly IBusinessCallContextProvider _contextProvider;

		public UserCommandHandler(IBusinessCallContextProvider contextProvider)
		{
			_contextProvider = contextProvider;
		}

		public Task<ExecutionResult<UserId>> ExecuteCommandAsync(User aggregate, CreateUserCommand command,
			CancellationToken cancellationToken)
			=> Task.FromResult(aggregate.Create(command, _contextProvider.GetCurrent()));

		public Task<ExecutionResult<PersonName>> ExecuteCommandAsync(
			User aggregate,
			UpdateUserNameCommand command,
			CancellationToken cancellationToken)
			=> Task.FromResult(aggregate.UpdateName(command, _contextProvider.GetCurrent()));

		public Task<ExecutionResult<PhoneNumber>> ExecuteCommandAsync(
			User aggregate,
			ChangePhoneCommand command,
			CancellationToken cancellationToken)
			=> Task.FromResult(aggregate.ChangePhone(command, _contextProvider.GetCurrent()));

		public Task<ExecutionResult<UserId>> ExecuteCommandAsync(User aggregate, UpdateUserTeamStatus command, CancellationToken cancellationToken)
			=> Task.FromResult(aggregate.UpdateTeamStatus(command, _contextProvider.GetCurrent()));
	}
}