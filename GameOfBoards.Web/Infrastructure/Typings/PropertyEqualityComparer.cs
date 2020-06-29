using System.Collections.Generic;
using System.Reflection;

namespace GameOfBoards.Web.Infrastructure.Typings
{
	public class PropertyEqualityComparer: IEqualityComparer<PropertyInfo>
	{
		private PropertyEqualityComparer() {}

		public bool Equals(PropertyInfo x, PropertyInfo y)
		{
			return x.Name == y.Name;
		}

		public int GetHashCode(PropertyInfo obj)
		{
			return 0;
		}
		
		public static readonly PropertyEqualityComparer Instance = new PropertyEqualityComparer();
	}
}