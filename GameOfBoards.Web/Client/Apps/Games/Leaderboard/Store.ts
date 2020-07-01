import { CommonStore } from '@Layout';
import { Collections } from '@Shared/Collections';
import { GameApiControllerProxy, IGameView, IGamesLeaderboardAppSettings, IUserView } from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { computed, observable } from 'mobx';
import { correlateQuestionsAndAnswers, getTeamsRegistrationStatus } from '../CommonLogic';

export class Store {
	constructor(props: IGamesLeaderboardAppSettings) {
		this.game = props.game;
		this.teams = props.teams;
		this.scoringTableOpen = false;
		this.interval = setInterval(() =>
			new GameApiControllerProxy(new HttpService(true))
				.get({ id: this.game.id })
				.then(CommonStore.instance.handleError)
				.then(v => this.game = v),
		3000);
	}

	private interval: any;

	public unsubscribe = () => {
		if (this.interval) {
			clearInterval(this.interval);
		}
	};

	@observable
	public game: IGameView;

	@observable
	public scoringTableOpen: boolean;

	@observable
	public teams: IUserView[];

	@computed
	public get registeredTeams() {
		return getTeamsRegistrationStatus(this.game, this.teams)
			.filter(t => t.registered);
	}

	@computed
	public get questions() {
		return correlateQuestionsAndAnswers(this.game, this.teams);
	}

	@computed
	public get scoreboard() {
		const teams = Collections.chain(this.questions)
			.flatMap(q => q.answers)
			.groupBy(q => q.teamName)
			.map(group => ({
				name: group[0].teamName,
				teamId: group[0].teamId,
				total: group.reduce((acc, next) => acc + next.score, 0),
				answers: group
			}))
			.value();

		return Collections.chain(this.registeredTeams)
			.map(rt => teams.find(t => t.teamId === rt.id) || { name: rt.name.fullForm, teamId: rt.id, total: 0, answers: [] })
			.value();
	}

	@computed
	public get leaderboard() {
		const scoreboard = this.scoreboard;
		return Collections.chain(scoreboard)
			.groupBy(c => c.total)
			.map(group => ({
				total: group[0].total,
				teams: group
			}))
			.flatMap(group => {
				const before = this.scoreboard.filter(t => t.total > group.total).length;
				const place = before + 1;
				return group.teams.map(t => ({ name: t.name, total: t.total, place: place }));
			})
			.sortBy(x => x.place, x => x.name)
			.value();
	}

	@computed
	public get questionNames() {
		return this.questions
			.map(q => ({ id: q.questionId, name: q.shortName, isActive: q.isActive }));
	}
}