import { CommonStore } from '@Layout';
import { Collections } from '@Shared/Collections';
import { GameApiControllerProxy, IGameView, IGamesListAppSettings } from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { SchemeBuilder } from '@Shared/Validation/SchemeBuilder';
import { EmptyObject } from '@Shared/Validation/Types';
import { ContextFor } from '@Shared/Validation/ValidationContext';
import { computed, observable } from 'mobx';

export class Store {
	private service = new GameApiControllerProxy(new HttpService());

	constructor(public props: IGamesListAppSettings) {
		this.myGames = props.myGames;
	}

	@observable
	private myGames: IGameView[];

	@computed
	public get sortedGames() {
		return Collections.orderBy(this.myGames, x => x.name);
	}

	public onSubmit = (context: ContextFor<Store['scheme']>) => {
		const { name } = context.scheme;
		if (!EmptyObject.is(context.model)) {
			const model = context.model;
			if (name.hasBeenUpdated) {
				this.service
					.update({
						id: model.id,
						name: name.modelValue
					})
					.then(CommonStore.instance.handleError)
					.then(this.refresh);
			}
		} else {
			this.service
				.update({
					id: null,
					name: name.modelValue
				})
				.then(CommonStore.instance.handleError)
				.then(this.refresh);
		}
	};

	private refresh = (i: IGameView) => this.myGames =
		this.myGames.filter(x => x.id !== i.id)
			.concat([i]);

	public scheme = SchemeBuilder.for<IGameView>()
		.string('name', 'Имя', p => p.notNullOrEmpty());
}