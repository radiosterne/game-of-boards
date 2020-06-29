using System;
using System.Security.Cryptography;
using EventFlow.ValueObjects;

namespace GameOfBoards.Domain.BC.Authentication.User
{
	public class Salt: SingleValueObject<string>
	{
		public Salt(string value)
			: base(value)
		{
		}

		public static Salt Create()
		{
			var rng = new RNGCryptoServiceProvider();
			var buff = new byte[10];
			rng.GetBytes(buff);

			return new Salt(Convert.ToBase64String(buff));
		}
	}
}