import { CommonStore } from '@Layout';
import { Collections } from '@Shared/Collections';
import { GameApiControllerProxy, IGameView, IGamesLeaderboardAppSettings, IUserView } from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { computed, observable } from 'mobx';


export class Store {

	constructor(props: IGamesLeaderboardAppSettings) {
		this.game = props.game;
		this.teams = props.teams;
		setInterval(() => new GameApiControllerProxy(new HttpService()).get({ id: this.game.id }).then(CommonStore.instance.handleError).then(v => this.game = v), 10000);
	}

	@observable
	public game: IGameView;

	@observable
	public teams: IUserView[];

	@computed
	public get teamsAndRegistrations() {
		return this.teams
			.map(t => ({ ...t, registered: this.game.registeredTeams.indexOf(t.id) !== -1 }))
			.sort((a, b) => a.name.fullForm.localeCompare(b.name.fullForm));
	}

	@computed
	public get questions() {
		return this.game.questions
			.map((q, idx) => ({
				...q,
				isActive: this.game.activeQuestionId === q.questionId,
				answers: this.game.answers
					.filter(answer => answer.questionId === q.questionId)
					.map(answer => ({
						...answer,
						teamName: this.teams.find(t => t.id === answer.teamId)!.name.fullForm,
						autoCorrect: q.rightAnswers.split(';').map(x => x.toLowerCase()).indexOf(answer.answerText.toLowerCase()) !== -1,
						markedCorrect: this.game.corrections.find(c => c.questionId === q.questionId && c.teamId === answer.teamId)?.isCorrect || false,
						question: q.shortName,
						questionIdx: idx
					}))
			}));
	}

	@computed
	public get leaderboard() {
		return Collections.chain(this.questions)
			.flatMap(q => q.answers)
			.groupBy(q => q.teamName)
			.map(group => ({
				name: group[0].teamName,
				total: group.filter(g => g.autoCorrect || g.markedCorrect).length,
				answers: Collections.sortBy(group, g => g.questionIdx)
			}))
			.value();
	}

	@computed
	public get questionNames() {
		return Collections.chain(this.questions)
			.map(q => q.shortName)
			.value();
	}
}