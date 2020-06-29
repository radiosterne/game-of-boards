using System.Linq;

namespace GameOfBoards.Domain.Extensions
{
	/// <remarks>
	/// Выбор имени класса (StringEx in place of StringExtensions)
	/// обоснован желанием кратко обращаться к его методам в неэкстеншн-контекстах:
	/// (e.g. Maybe{string}.Where(StringEx.NotEmpty)) 
	/// </remarks>
	public static class StringEx
	{
		public static string Remove(this string from, params char[] chars) =>
			new string(from
				.ToCharArray()
				.Where(c => !chars.Contains(c))
				.ToArray());

		public static bool NotEmpty(this string input) =>
			!input.Empty();

		public static bool Empty(this string input) =>
			string.IsNullOrWhiteSpace(input);
	}
}