using System;
using System.Threading.Tasks;
using Functional.Maybe;
using GameOfBoards.Domain.SharedKernel;

namespace GameOfBoards.Domain.Extensions
{
	public static class MaybeExtensions
	{
		public static async Task<Maybe<T>> ThenAsync<T>(this bool condition, Func<Task<T>> f)
		{
			if (!condition)
			{
				return new Maybe<T>();
			}

			var result = await f();

			return result.ToMaybe();
		}
		
		public static async Task<Maybe<TR>> SelectMaybeAsync<T, TR>(
			this Maybe<T> a,
			Func<T, Task<Maybe<TR>>> fn)
		{
			if (!a.HasValue)
			{
				return new Maybe<TR>();
			}

			return await fn(a.Value);
		}

		public static async Task<ExecutionResult> ToResult(this Task<Maybe<Error>> a)
		{
			var maybe = await a;
			return maybe.Select(ExecutionResult.Failure).OrElse(() => ExecutionResult.Success);
		}

		public static async Task<Maybe<T>> CollapseAsync<T>(this Task<Maybe<Maybe<T>>> task)
		{
			var result = await task;
			return result.Collapse();
		}
	}
}