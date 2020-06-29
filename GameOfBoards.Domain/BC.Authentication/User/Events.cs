using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Authentication.User
{
	public class UserNameUpdated: BusinessAggregateEvent<User, UserId>
	{
		public UserNameUpdated(PersonName name, BusinessCallContext context)
			: base(context)
		{
			Name = name;
		}
		
		public PersonName Name { get; }
	}
	
	public class UserPhoneUpdated : BusinessAggregateEvent<User, UserId>
	{
		public UserPhoneUpdated(PhoneNumber phoneNumber, BusinessCallContext context)
			: base(context)
		{
			PhoneNumber = phoneNumber;
		}

		public PhoneNumber PhoneNumber { get; }
	}
	
	public class UserPasswordUpdated: BusinessAggregateEvent<User, UserId>
	{
		public UserPasswordUpdated(PasswordHash passwordHash, Salt salt, BusinessCallContext context)
			: base(context)
		{
			PasswordHash = passwordHash;
			Salt = salt;
		}

		public PasswordHash PasswordHash { get; }
		
		public Salt Salt { get; }
	}
}