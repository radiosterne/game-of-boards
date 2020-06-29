using System;
using System.Threading;
using System.Threading.Tasks;
using JetBrains.Annotations;
using EventFlow;
using EventFlow.Configuration;
using EventFlow.Queries;
using Functional.Maybe;
using Newtonsoft.Json;
using GameOfBoards.Domain.Extensions;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.BC.Authentication.User
{
	[UsedImplicitly]
	public class SuperuserEnsuringService: IBootstrap
	{
		private readonly IQueryProcessor _queryProcessor;
		private readonly ICommandBus _commandBus;
		private readonly SuperuserConfiguration _config;

		public SuperuserEnsuringService(
			IQueryProcessor queryProcessor,
			ICommandBus commandBus,
			SuperuserConfiguration config)
		{
			_queryProcessor = queryProcessor;
			_commandBus = commandBus;
			_config = config;
		}

		public async Task BootAsync(CancellationToken cancellationToken)
		{
			var result = await PhoneNumber.Create(_config.PhoneNumber)
				.Chain(() => Password.Create(_config.Password))
				.DoAsync(async val =>
				{
					var (phoneNumber, password) = val;

					var existingReadModel = await _queryProcessor.ProcessAsync(
						new UserViewByPhoneQuery(phoneNumber),
						cancellationToken);

					return (await existingReadModel
						.SelectAsync(async readModel =>
						{
							var validPassword = await _queryProcessor
								.ProcessAsync(
									new CheckUserPasswordQuery(phoneNumber, password),
									cancellationToken);

							return await (!validPassword).ThenAsync(async () =>
							{
								var changingPasswordResult = await _commandBus.PublishAsync(
									new ChangePasswordCommand(new UserId(readModel.Id), password.Value),
									cancellationToken);
								return changingPasswordResult.Error;
							});
						})
						.OrElseAsync(async () =>
						{
							var creationResult = await _commandBus.PublishAsync(
								new CreateUserCommand(
									"Админ",
									"Админович".ToMaybe(),
									"Админский".ToMaybe(),
									phoneNumber.Value,
									password.Value.ToMaybe()),
								cancellationToken);

							return creationResult.Error.ToMaybe();
						}))
						.Collapse();
				});

			var error = result.ErrorOrDefault();
			if (error != null)
			{
				throw new ApplicationException($"Exception initializing superuser: {JsonConvert.SerializeObject(error)}");
			}
		}
	}
}