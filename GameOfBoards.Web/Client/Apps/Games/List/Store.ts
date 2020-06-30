import { CommonStore } from '@Layout';
import { Collections } from '@Shared/Collections';
import { GameApiControllerProxy, GameState, IGameThinView, IGamesListAppSettings } from '@Shared/Contracts';
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
	private myGames: IGameThinView[];

	@computed
	public get sortedGames() {
		return Collections.chain(this.myGames)
			.sortBy(x => x.name)
			.filter(x => !this.isTeamUser || (x.registeredTeams.indexOf(this.userId) !== -1 && (x.state === GameState.Open || x.state === GameState.Finished)))
			.value();
	}

	@computed
	public get isTeamUser() {
		const user = CommonStore.instance.user;
		return !!user && user.isTeam;
	}

	@computed
	public get userId() {
		const user = CommonStore.instance.user;
		return user ? user.id : '';
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

	private refresh = (i: IGameThinView) => this.myGames =
		this.myGames
			.filter(x => x.id !== i.id)
			.concat([i]);

	public scheme = SchemeBuilder.for<IGameThinView>()
		.string('name', 'Имя', p => p.notNullOrEmpty())
		.canEditWhen(() => {
			const user = CommonStore.instance.user;
			return !!user && !user.isTeam;
		});
}