using System;
using System.Linq;
using Reinforced.Typings;
using Reinforced.Typings.Ast;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Generators;

namespace GameOfBoards.Web.Infrastructure.Typings
{
	public class DomainEventMapGenerator : ClassCodeGenerator
	{
		public override RtClass GenerateNode(Type eventType, RtClass result, TypeResolver resolver) =>
			new RtClass
			{
				Name = new RtSimpleTypeName("DomainEventMap"),
				Members = {GetMapCreatorFunction()}
			};

		private static RtFuncion GetMapCreatorFunction()
		{
			// Плохо. Но что делать?
			var domainEventTypesMap = ExportableTypesContainer.Instance.Events
				.Select(eventType => $"map.set('{eventType.Name}', {eventType.Name});")
				.StringJoin("\r\n");

			return new RtFuncion
			{
				Identifier = new RtIdentifier("create"),
				IsStatic = true,
				AccessModifier = AccessModifier.Public,
				Body = new RtRaw($@"const map = new Map<string, any>();
{domainEventTypesMap}
return map;")
			};
		}
	}
}