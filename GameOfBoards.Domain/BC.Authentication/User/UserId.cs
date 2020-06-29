using EventFlow.Core;

namespace GameOfBoards.Domain.BC.Authentication.User
{
	public class UserId : Identity<UserId>
	{
		public UserId(string value)
			: base(value)
		{
		}
	}
}