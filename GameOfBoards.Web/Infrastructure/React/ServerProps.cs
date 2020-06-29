using System;
using Functional.Maybe;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.Configuration;
// ReSharper disable MemberCanBePrivate.Global
// ReSharper disable UnusedAutoPropertyAccessor.Global

namespace GameOfBoards.Web.Infrastructure.React
{
	internal class ServerProps
	{
		public string AppName { get; }

		public object AppProps { get; }

		public UniverseState UniverseState { get; }

		public DateTime Now { get; }

		public string[] AdditionalScripts { get; }

		public bool ClientOnly { get; }

		public bool IsMobile { get; }

		public Maybe<UserView> UserView { get; }

		public ServerProps(
			string appName,
			object appProps,
			UniverseState universeState,
			DateTime now,
			string[] additionalScripts,
			bool clientOnly,
			bool isMobile,
			Maybe<UserView> userView)
		{
			AppName = appName;
			AppProps = appProps;
			UniverseState = universeState;
			Now = now;
			AdditionalScripts = additionalScripts;
			ClientOnly = clientOnly;
			IsMobile = isMobile;
			UserView = userView;
		}
	}
}