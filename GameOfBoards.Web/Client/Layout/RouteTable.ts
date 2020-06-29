import { Collections } from '@Shared/Collections';
import {
	AccountController,
	HowtoController,
	UsersController
} from '@Shared/Contracts';
import { Route } from '@Shared/LocationDescriptor';
import { action, computed, observable } from 'mobx';

import { AppNames } from '../AppNames';

import { CommonStore } from './CommonStore';

class RouteGroup<T extends AppNames> {
	constructor(
		public readonly title: string,
		public readonly visible: boolean,
		...links: Route<T>[]) {
		this.links = links;
	}

	public links: Route<T>[];
}

class Routes<T extends AppNames> {
	constructor(
		...routeGroups: RouteGroup<T>[]
	) {
		this.routeGroups = routeGroups;
	}

	public routeGroups: RouteGroup<T>[];

	public check = (input: T) => {
		return input ? true : false;
	};
}

export class RouteTable {
	constructor(private store: CommonStore) { }

	@observable
	private expandedGroupTitles: string[] = [];

	@observable
	public sidebarOpen = false;

	@action
	public toggleGroup = (groupTitle: string) => this.expandedGroupTitles.includes(groupTitle)
		? this.expandedGroupTitles = this.expandedGroupTitles.filter(gt => gt !== groupTitle)
		: this.expandedGroupTitles.push(groupTitle);

	@computed
	public get routes() {
		const result = new Routes(
			new RouteGroup(
				'Основная',
				true,
				HowtoController.main()
					.route('Пример', true)
			),
			new RouteGroup(
				'Пользователи',
				true,
				UsersController.list()
					.route('Список', false)
			),
			new RouteGroup(
				'Скрыто',
				true,
				AccountController.login()
					.route('Форма входа', false)
					.withoutLayout()
			)
		);

		// Используется только для того, чтобы на уровне системы типов убедиться, что в роутах обозначены все возможные приложения
		// eslint-disable-next-line no-unused-expressions
		(false as true) && this.routes.check('' as AppNames);

		return result;
	}
	@computed
	public get menuSchema() {
		const store = this.store;
		return this.routes
			.routeGroups
			.filter(x => x.links.filter(l => l.show).length > 0)
			.map(x => ({
				...x,
				expanded: this.expandedGroupTitles.includes(x.title),
				links: x.links.map(l => ({
					...l,
					active: l.to.appName === store.currentAppName
				}))
			}))
			.map(x => ({
				...x,
				active: x.links.filter(l => l.active).length > 0
			}));
	}

	@computed
	public get currentRoute() {
		return Collections
			.chain(this.routes.routeGroups.slice())
			.flatMap(r => r.links)
			.filter(r => r.to.appName === this.store.currentAppName)
			.first();
	}
}