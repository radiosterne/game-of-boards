using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace GameOfBoards.Domain.Tests
{
	internal class ListAsyncCursor<TDocument>: IAsyncCursor<TDocument>
	{
		public ListAsyncCursor(IEnumerable<TDocument> current)
		{
			Current = current;
		}

		public void Dispose()
		{
		}

		public bool MoveNext(CancellationToken cancellationToken = new CancellationToken())
		{
			if (_firstBatchRequested)
			{
				return false;
			}

			_firstBatchRequested = true;
			return true;
		}

		public Task<bool> MoveNextAsync(CancellationToken cancellationToken = new CancellationToken())
			=> Task.FromResult(MoveNext(cancellationToken));

		public IEnumerable<TDocument> Current { get; }

		private bool _firstBatchRequested;
	}
}