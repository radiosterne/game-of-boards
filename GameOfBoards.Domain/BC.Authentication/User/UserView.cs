using EventFlow.Aggregates;
using EventFlow.ReadStores;
using Functional.Maybe;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Authentication.User
{
	public class UserView:
		MongoDbReadModel,
		IAmReadModelFor<User, UserId, UserNameUpdated>,
		IAmReadModelFor<User, UserId, UserPhoneUpdated>,
		IAmReadModelFor<User, UserId, UserTeamStatusUpdated>,
		IAmReadModelFor<User, UserId, UserPasswordUpdated>
	{
		public PersonName Name { get; private set; }
		
		public PhoneNumber PhoneNumber { get; private set; }
		
		public bool IsTeam { get; private set; }
		
		public Maybe<Salt> Salt { get; private set; }

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

		public void Apply(IReadModelContext context, IDomainEvent<User, UserId, UserTeamStatusUpdated> domainEvent)
		{
			SetId(domainEvent);
			IsTeam = domainEvent.AggregateEvent.IsTeam;
		}

		public void Apply(IReadModelContext context, IDomainEvent<User, UserId, UserPasswordUpdated> domainEvent)
		{
			SetId(domainEvent);
			Salt = domainEvent.AggregateEvent.Salt.ToMaybe();
		}
	}
}