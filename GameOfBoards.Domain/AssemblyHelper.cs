using System.Reflection;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("GameOfBoards.Domain.Tests")]

namespace GameOfBoards.Domain
{
	
	public static class AssemblyHelper
	{
		public static Assembly GetDomainAssembly() => typeof(AssemblyHelper).Assembly;
	}
}