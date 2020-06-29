using JetBrains.Annotations;

namespace GameOfBoards.Domain.BC.Authentication.User
{
	[UsedImplicitly]
	public class SuperuserConfiguration
	{
		public SuperuserConfiguration(string phoneNumber, string password)
		{
			PhoneNumber = phoneNumber;
			Password = password;
		}

		public string PhoneNumber { get; }

		public string Password { get; }
	}
}