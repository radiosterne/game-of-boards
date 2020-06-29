using System;
using System.Linq;
using System.Reflection;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using GameOfBoards.Web.Infrastructure.React;
using Reinforced.Typings;
using Reinforced.Typings.Ast;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Generators;

namespace GameOfBoards.Web.Infrastructure.Typings
{
	[UsedImplicitly]
	public class CreateUrlGenerator : MethodCodeGenerator
	{
		public override RtFuncion GenerateNode(MethodInfo action, RtFuncion result, TypeResolver resolver)
		{
			try
			{
				result = base.GenerateNode(action, result, resolver);
				if (result == null) return null;

				var actualReturnType = StripGenerics(action.ReturnType);
				var appName = AppNameHelpers.GetAppNameForType(actualReturnType);

				var locationDescriptorType = actualReturnType != typeof(FileContentResult)
					? "LocationDescriptor"
					: "LocationDescriptorBase";

				result.ReturnType = new RtSimpleTypeName(
					locationDescriptorType, new RtSimpleTypeName($"'{appName}'"));

				result.IsStatic = true;

				// ReSharper disable once PossibleNullReferenceException -- знаем, что метод объявлен в классе контроллера
				var cleanedControllerName =
					action.DeclaringType.Name.Replace("Controller", string.Empty).ToLowerInvariant();

				var queryStringParametersList = result.Arguments
					.Select(arg => $"\t\t{arg.Identifier.IdentifierName}: {arg.Identifier.IdentifierName},")
					.ToList();

				var queryStringParameters = string.Empty;

				if (queryStringParametersList.Count > 0)
				{
					var lastIndex = queryStringParametersList.Count - 1;
					queryStringParametersList[lastIndex] =
						queryStringParametersList[lastIndex].Replace(",", string.Empty);
					queryStringParameters = "\r\n" + string.Join("\r\n", queryStringParametersList) + "\r\n\t";
				}

				var baseUrl = $"/{cleanedControllerName}/{action.Name.ToLowerInvariant()}";

				result.Body = new RtRaw(
					$@"return new {locationDescriptorType}(
	'{AppNameHelpers.GetAppNameForType(actualReturnType)}',
	'{baseUrl}',
	{{{queryStringParameters}}}
);"
				);

				return result;
			}
			catch (Exception)
			{
				//File.AppendAllText(@"C:\temp\reinforced.log.txt", ex.ToString());

				return null;
			}
		}

		private static Type StripGenerics(Type t) => t.IsGenericType ? StripGenerics(t.GetGenericArguments()[0]) : t;
	}
}