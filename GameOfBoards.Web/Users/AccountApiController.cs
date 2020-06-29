using System.Threading;
using System.Threading.Tasks;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Domain.Extensions;
using GameOfBoards.Domain.SharedKernel;
using GameOfBoards.Web.Infrastructure;

namespace GameOfBoards.Web.Users
{
	public class AccountApiController: BaseApiController
	{
		public AccountApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
		}

		public async Task<ActionResult<bool>> Login(LoginCommand command)
		{
			var passwordResult = await PhoneNumber.Create(command.Phone)
				.Chain(() => Password.Create(command.Password))
				.Select(val =>
				{
					var (phoneNumber, password) = val;

					var existingReadModel = QueryProcessor.Process(
						new UserViewByPhoneQuery(phoneNumber),
						CancellationToken.None);

					return (phoneNumber, password, existingReadModel.Select(model => UserId.With(model.Id)));
				})
				.DoAsync(async val =>
				{
					var (phoneNumber, password, id) = val;

					var passwordCorrect = await id
						.SelectAsync(model =>
							QueryProcessor.ProcessAsync(
								new CheckUserPasswordQuery(phoneNumber, password), CancellationToken.None))
						.OrElse(() => false);

					return (!passwordCorrect)
						.Then(() => Error.Create("Пароль не совпадает с введённым"));
				});

			return (await passwordResult
				.DoAsync(val =>
				{
					var (_, __, maybeId) = val;
					return maybeId.Select(id => HttpContext.SignIn(id)).OrElse(Task.CompletedTask);
				}))
				.Match(_ => true, _ => false);
		}
	}

	public class LoginCommand
	{
		public LoginCommand(string phone, string password)
		{
			Phone = phone;
			Password = password;
		}

		public string Phone { get; }
		
		public string Password { get; }
	}
}