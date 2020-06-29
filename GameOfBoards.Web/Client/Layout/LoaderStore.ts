import { computed, observable } from 'mobx';

export class LoaderStore {
	@observable
	private loadersCount = 0;

	@computed
	public get isLoading() {
		return this.loadersCount > 0;
	}

	public addLoader = <T>(promise: Promise<T>) => {
		this.loadersCount++;

		promise.finally(() => {
			this.loadersCount--;
		});

		return promise;
	};
}