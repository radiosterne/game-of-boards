using System.Threading.Tasks;
using EventFlow;
using EventFlow.Queries;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Web.Infrastructure;
using GameOfBoards.Web.Infrastructure.React;

namespace GameOfBoards.Web.Users
{
	public class AccountController: ReactController
	{
		public AccountController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState)
			: base(commandBus, queryProcessor, universeState)
		{
		}

		[AllowAnonymous]
		public Task<TypedResult<AccountLoginAppSettings>> Login() => React(new AccountLoginAppSettings());

		[PreventTypingsCreation]
		public async Task<IActionResult> Logout()
		{
			await HttpContext.SignOutAsync();
			return RedirectToAction(nameof(Login));
		}
	}

	public class AccountLoginAppSettings
	{
		
	}
}