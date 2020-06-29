using EventFlow.Aggregates;
using EventFlow.ReadStores;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Authentication.User
{
	public class UserView:
		MongoDbReadModel,
		IAmReadModelFor<User, UserId, UserNameUpdated>,
		IAmReadModelFor<User, UserId, UserPhoneUpdated>
	{
		public PersonName Name { get; private set; }
		
		public PhoneNumber PhoneNumber { get; private set; }

		public void Apply(IReadModelContext context, IDomainEvent<User, UserId, UserNameUpdated> domainEvent)
		{
			SetId(domainEvent);
			Name = domainEvent.AggregateEvent.Name;
		}

		public void Apply(IReadModelContext context, IDomainEvent<User, UserId, UserPhoneUpdated> domainEvent)
		{
			SetId(domainEvent);
			PhoneNumber = domainEvent.AggregateEvent.PhoneNumber;
		}
	}
}