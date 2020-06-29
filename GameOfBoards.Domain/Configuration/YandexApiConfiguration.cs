using EventFlow.ValueObjects;

namespace GameOfBoards.Domain.Configuration
{
	public class YandexApiConfiguration
	{
		public YandexApiConfiguration(YandexApiConfig config)
		{
			ClientSecret = new YandexClientSecret(config.ClientSecret);
			ClientId = new YandexClientId(config.ClientId);
		}
		
		public YandexClientSecret ClientSecret { get; }
		
		public YandexClientId ClientId { get; }
	}

	public class YandexApiConfig
	{
		public string ClientId { get; set; }
		
		public string ClientSecret { get; set; }
	}

	public class YandexClientId: SingleValueObject<string>
	{
		public YandexClientId(string value)
			: base(value)
		{
		}
	}

	public class YandexClientSecret: SingleValueObject<string>
	{
		public YandexClientSecret(string value)
			: base(value)
		{
		}
	}
}