import { CommonStore } from '@Layout';
import { Collections } from '@Shared/Collections';
import { GameApiControllerProxy, IGameView, IGamesLeaderboardAppSettings, IUserView } from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { computed, observable } from 'mobx';


export class Store {

	constructor(props: IGamesLeaderboardAppSettings) {
		this.game = props.game;
		this.teams = props.teams;
		this.interval = setInterval(() =>
			new GameApiControllerProxy(new HttpService(true))
				.get({ id: this.game.id })
				.then(CommonStore.instance.handleError)
				.then(v => this.game = v),
		10000);
	}

	private interval: any;

	public unsubscribe = () => {
		if(this.interval) {
			clearInterval(this.interval);
		}
	};

	@observable
	public game: IGameView;

	@observable
	public teams: IUserView[];

	@computed
	public get registeredTeams() {
		return this.teams
			.map(t => ({ ...t, registered: this.game.registeredTeams.indexOf(t.id) !== -1 }))
			.filter(t => t.registered)
			.sort((a, b) => a.name.fullForm.localeCompare(b.name.fullForm));
	}

	@computed
	public get questions() {
		return this.game.questions
			.map(q => ({
				...q,
				isActive: this.game.activeQuestionId === q.questionId,
				answers: this.game.answers
					.filter(answer => answer.questionId === q.questionId)
					.map(answer => ({
						...answer,
						teamName: this.teams.find(t => t.id === answer.teamId)!.name.fullForm,
						teamId: answer.teamId,
						autoCorrect: q.rightAnswers.split(';').map(x => x.toLowerCase()).indexOf(answer.answerText.toLowerCase()) !== -1,
						markedCorrect: this.game.corrections.find(c => c.questionId === q.questionId && c.teamId === answer.teamId)?.isCorrect || false,
						question: q.shortName,
						questionId: q.questionId
					}))
			}));
	}

	@computed
	public get leaderboard() {
		const teams = Collections.chain(this.questions)
			.flatMap(q => q.answers)
			.groupBy(q => q.teamName)
			.map(group => ({
				name: group[0].teamName,
				teamId: group[0].teamId,
				total: group.filter(g => g.autoCorrect || g.markedCorrect).length,
				answers: group
			}))
			.value();

		return Collections.chain(this.registeredTeams)
			.map(rt => teams.find(t => t.teamId === rt.id) || { name: rt.name.fullForm, teamId: rt.id, total: 0, answers: [] as any[] })
			.value();
	}

	@computed
	public get questionNames() {
		return Collections.chain(this.questions)
			.map(q => ({ id: q.questionId, name: q.shortName }))
			.value();
	}
}