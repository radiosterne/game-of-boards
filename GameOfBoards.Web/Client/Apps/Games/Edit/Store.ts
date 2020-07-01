import { CommonStore } from '@Layout';
import { GameApiControllerProxy, GameState, IGameView, IGamesEditAppSettings, IUserView } from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { SchemeBuilder } from '@Shared/Validation/SchemeBuilder';
import { EmptyObject } from '@Shared/Validation/Types';
import { ContextFor } from '@Shared/Validation/ValidationContext';
import { computed, observable } from 'mobx';

type ArrayItem<T> = T extends (infer R)[] ? R : never;


export class Store {
	private service = new GameApiControllerProxy(new HttpService());

	constructor(props: IGamesEditAppSettings) {
		this.game = props.game;
		this.teams = props.teams;
		this.teamDrawerOpen = false;
		this.openedQuestionId = null;
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
	public teams: IUserView[];

	@observable
	public teamDrawerOpen: boolean;

	@observable
	public openedQuestionId: string | null;

	@computed
	public get openedQuestion() {
		return this.openedQuestionId
			? this.questions.find(x => x.questionId === this.openedQuestionId)!
			: null;
	}

	@computed
	public get teamsAndRegistrations() {
		return this.teams
			.map(t => ({ ...t, registered: this.game.registeredTeams.indexOf(t.id) !== -1 }))
			.sort((a, b) => a.name.fullForm.localeCompare(b.name.fullForm));
	}

	public registerTeam = (teamId: string, registered: boolean) => {
		this.service.registerTeam({ id: this.game.id, teamId: teamId, registered: registered })
			.then(CommonStore.instance.handleError)
			.then(v => this.game = v);
	};

	public markCorrect = (teamId: string, questionId: string, correct: boolean) => {
		this.service.updateTeamAnswerStatus({ id: this.game.id, teamId: teamId, questionId: questionId, isCorrect: correct })
			.then(CommonStore.instance.handleError)
			.then(v => this.game = v);
	};

	public updateActiveQuestion = (questionId: string, active: boolean) => {
		this.service.updateActiveQuestion({
			id: this.game.id,
			questionId: questionId,
			isActive: active
		})
			.then(CommonStore.instance.handleError)
			.then(v => this.game = v);
	};

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
						autoCorrect: q.rightAnswers.split(';').map(x => x.toLowerCase()).indexOf(answer.answerText.toLowerCase()) !== -1,
						markedCorrect: this.game.corrections.find(c => c.questionId === q.questionId && c.teamId === answer.teamId)?.isCorrect || false
					}))
			}));
	}

	public questionEditScheme = SchemeBuilder.for<ArrayItem<Store['questions']>>()
		.string('shortName', 'Название')
		.string('rightAnswers', 'Правильный ответ');

	public updateQuestion = (context: ContextFor<Store['questionEditScheme']>) => {
		const { state, model } = context;
		this.service.updateQuestion({
			id: this.game.id,
			questionId: EmptyObject.is(model) ? null : model.questionId,
			shortName: state.shortName,
			rightAnswers: state.rightAnswers
		})
			.then(CommonStore.instance.handleError)
			.then(v => this.game = v);
	};

	public updateState = (state: GameState) => {
		this.service.updateState({
			id: this.game.id,
			state: state,
		})
			.then(CommonStore.instance.handleError)
			.then(v => this.game = v);
	};
}