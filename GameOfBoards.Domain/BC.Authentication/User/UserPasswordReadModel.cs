using EventFlow.Aggregates;
using EventFlow.ReadStores;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Authentication.User
{
	public class UserPasswordReadModel:
		MongoDbReadModel,
		IAmReadModelFor<User, UserId, UserPasswordUpdated>,
		IAmReadModelFor<User, UserId, UserPhoneUpdated>
	{ 
		public PasswordHash PasswordHash { get; private set; }
		public Salt Salt { get; private set; }
		
		public PhoneNumber PhoneNumber { get; private set; }

		public void Apply(IReadModelContext context, IDomainEvent<User, UserId, UserPasswordUpdated> domainEvent)
		{
			SetId(domainEvent);
			PasswordHash = domainEvent.AggregateEvent.PasswordHash;
			Salt = domainEvent.AggregateEvent.Salt;
		}

		public void Apply(IReadModelContext context, IDomainEvent<User, UserId, UserPhoneUpdated> domainEvent)
		{
			SetId(domainEvent);
			PhoneNumber = domainEvent.AggregateEvent.PhoneNumber;
		}
	}
}