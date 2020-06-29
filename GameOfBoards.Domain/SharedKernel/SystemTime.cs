using System;

namespace GameOfBoards.Domain.SharedKernel
{
	public static class SystemTime
	{
		public static void InitTimeDelta(double delta) => _localTimeDelta = delta;
		private static double _localTimeDelta = 3.0;
		private static double LocalTimeDelta => _localTimeDelta;

		public static DateTime Now => CleanKind(DateTime.UtcNow).AddHours(LocalTimeDelta);
		public static Date Today => Now.AsDate();

		/// <summary>
		/// Выражает идею, что это не UTC и не "локальное любого текущего региона", а именно время в поясе системы, вручную собранное так.
		/// </summary>
		/// <param name="dt"></param>
		/// <returns></returns>
		public static DateTime CleanKind(this DateTime dt) =>
			new DateTime(dt.Year, dt.Month, dt.Day, dt.Hour, dt.Minute, dt.Second, DateTimeKind.Unspecified);
	}
}