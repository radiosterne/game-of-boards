using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EventFlow.MongoDB.ReadStores;
using EventFlow.Queries;
using Functional.Maybe;
using JetBrains.Annotations;
using GameOfBoards.Domain.Extensions;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Authentication.User
{
	public class CheckUserPasswordQuery: IQuery<bool>
	{
		public CheckUserPasswordQuery(PhoneNumber phoneNumber, Password password)
		{
			PhoneNumber = phoneNumber;
			Password = password;
		}

		public Password Password { get; }

		public PhoneNumber PhoneNumber { get; }
	}
	
	public class ListUserViewsQuery: IQuery<IReadOnlyCollection<UserView>>
	{
	}
	
	public class UserViewByIdQuery: IQuery<Maybe<UserView>>
	{
		public UserViewByIdQuery(UserId id)
		{
			Id = id;
		}

		public UserId Id { get; }
	}
	
	public class UserViewByPhoneQuery: IQuery<Maybe<UserView>>
	{
		public UserViewByPhoneQuery(PhoneNumber phoneNumber)
		{
			PhoneNumber = phoneNumber;
		}

		public PhoneNumber PhoneNumber { get; }
	}
	
	[UsedImplicitly]
	public class UserQueryHandler:
		IQueryHandler<UserViewByIdQuery, Maybe<UserView>>,
		IQueryHandler<UserViewByPhoneQuery, Maybe<UserView>>,
		IQueryHandler<CheckUserPasswordQuery, bool>,
		IQueryHandler<ListUserViewsQuery, IReadOnlyCollection<UserView>>
	{
		private readonly IMongoDbReadModelStore<UserView> _userViewStore;
		private readonly IMongoDbReadModelStore<UserPasswordReadModel> _userPasswordStore;

		public UserQueryHandler(
			IMongoDbReadModelStore<UserView> userViewStore,
			IMongoDbReadModelStore<UserPasswordReadModel> userPasswordStore)
		{
			_userViewStore = userViewStore;
			_userPasswordStore = userPasswordStore;
		}

		public async Task<Maybe<UserView>>
			ExecuteQueryAsync(UserViewByIdQuery query, CancellationToken cancellationToken)
		{
			var result = await _userViewStore.GetAsync(query.Id.Value, cancellationToken);
			return result.ReadModel.ToMaybe();
		}

		public async Task<bool> ExecuteQueryAsync(CheckUserPasswordQuery query, CancellationToken cancellationToken)
		{
			var readModel = await _userPasswordStore
				.FindMaybeAsync(
					rm => rm.PhoneNumber == query.PhoneNumber,
					cancellationToken);

			return readModel
				.Select(rm => PasswordHash.Create(query.Password, rm.Salt) == rm.PasswordHash)
				.OrElse(false);
		}

		public Task<Maybe<UserView>> ExecuteQueryAsync(UserViewByPhoneQuery query, CancellationToken cancellationToken)
			=> _userViewStore
				.FindMaybeAsync(
					rm => rm.PhoneNumber == query.PhoneNumber,
					cancellationToken);

		public Task<IReadOnlyCollection<UserView>> ExecuteQueryAsync(ListUserViewsQuery query,
			CancellationToken cancellationToken)
			=> _userViewStore.ListAsync(_ => true, cancellationToken);
	}
}