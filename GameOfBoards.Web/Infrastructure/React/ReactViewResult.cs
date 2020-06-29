using System.IO;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using DeviceDetectorNET;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using GameOfBoards.Domain.BC.Authentication.User;
using GameOfBoards.Domain.Configuration;
using GameOfBoards.Domain.SharedKernel;
using React.AspNet;

namespace GameOfBoards.Web.Infrastructure.React
{
	/// <summary>
	/// Представление, генерирующее HTML для страницы, запускающей React-приложение.
	/// </summary>
	/// <remarks><see cref="T:System.Web.Mvc.IViewDataContainer" /> имплементирован для создания <see cref="T:System.Web.Mvc.HtmlHelper" />.</remarks>
	internal sealed class ReactViewResult<T> : TypedResult<T>
	{
		private readonly T _model;
		private readonly bool _clientOnly;
		private readonly string _appName;
		private readonly string[] _additionalScripts;
		private readonly UniverseState _universeState;
		private readonly string _userAgent;
		private readonly Maybe<UserView> _userView;

		public ReactViewResult(
			T model,
			bool clientOnly,
			string[] additionalScripts,
			UniverseState universeState,
			string userAgent,
			Maybe<UserView> userView)
			: base("never")
		{
			_model = model;
			_clientOnly = clientOnly;
			_universeState = universeState;
			_additionalScripts = additionalScripts;
			_appName = AppNameHelpers.GetAppNameForType(typeof(T));
			_userAgent = userAgent;
			_userView = userView;
		}

		public override async Task ExecuteResultAsync(ActionContext context)
		{
			var httpContext = context.HttpContext;
			httpContext.PreventResponseCaching();
			httpContext.SetContentType();
			await using var writer = httpContext.GetResponseWriter();
			await Render(_model, _clientOnly, writer);
		}

		private async Task Render(T props, bool clientOnly, TextWriter writer)
		{
			await writer.WriteAsync("<!DOCTYPE html>\r\n");

			var serverProps = new ServerProps(
				_appName,
				props,
				_universeState,
				SystemTime.Now,
				_additionalScripts,
				clientOnly,
				new DeviceDetector(_userAgent).IsMobile(),
				_userView
			);

			var content = ((IHtmlHelper)null).React("Server", serverProps);
			content?.WriteTo(writer, HtmlEncoder.Default);
		}
	}
}