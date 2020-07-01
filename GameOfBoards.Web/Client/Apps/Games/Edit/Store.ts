import { CommonStore } from '@Layout';
import { GameApiControllerProxy, GameState, IGameView, IGamesEditAppSettings, IUserView } from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { computed, observable } from 'mobx';
import { correlateQuestionsAndAnswers, getTeamsRegistrationStatus, QuestionWithAnswers } from '../CommonLogic';
import { QuestionEditorStore } from './QuestionEditorStore';

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
		this.questionEditor = null;
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
	public get openedQuestionStore() {
		return this.openedQuestionId
			? new OpenedQuestionStore(
				this.game.id,
				this.questions.find(x => x.questionId === this.openedQuestionId)!,
				this.teamsAndRegistrations.filter(t => t.registered),
				v => this.game = v)
			: null;
	}

	@observable
	public questionEditor: QuestionEditorStore | null;

	@computed
	public get teamsAndRegistrations() {
		return getTeamsRegistrationStatus(this.game, this.teams);
	}

	public registerTeam = (teamId: string, registered: boolean) => {
		this.service.registerTeam({ id: this.game.id, teamId: teamId, registered: registered })
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
		return correlateQuestionsAndAnswers(this.game, this.teams);
	}

	public editQuestion = (questionId: string) => {
		this.questionEditor = new QuestionEditorStore(
			this.game.id,
			this.questions.find(q => q.questionId === questionId)!,
			this.onQuestionSave,
			this.onQuestionCancel);
	};

	public createQuestion = () => {
		this.questionEditor = new QuestionEditorStore(
			this.game.id,
			null,
			this.onQuestionSave,
			this.onQuestionCancel);
	};

	public onQuestionSave = (view: IGameView) => {
		this.game = view;
		this.questionEditor = null;
	};

	public onQuestionCancel = () => {
		this.questionEditor = null;
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

export class OpenedQuestionStore {
	private service = new GameApiControllerProxy(new HttpService());

	constructor(
		private gameId: string,
		public question: QuestionWithAnswers,
		public registeredTeams: IUserView[],
		private onSave: (view: IGameView) => void
	) {
		this.answer = '';
		this.selectedTeamId = '';
	}

	@observable
	public answer: string;

	@observable
	public selectedTeamId: string;

	@computed
	public get canManuallyAnswer() {
		return this.teamsWithoutAnswer.length !== 0;
	}

	@computed
	public get teamsWithoutAnswer() {
		return this.registeredTeams.filter(rt => this.question.answers.find(a => a.teamId === rt.id) === undefined);
	}

	@computed
	public get savingDisabled() {
		return this.selectedTeamId !== '' && this.answer.trim() !== '';
	}

	public saveAnswer = () => {
		this.service.updateTeamAnswerManually({
			id: this.gameId,
			questionId: this.question.questionId,
			teamId: this.selectedTeamId,
			answer: this.answer
		})
			.then(CommonStore.instance.handleError)
			.then(this.onSave);
	};

	public markCorrect = (teamId: string, isCorrect: boolean) => {
		this.service.updateTeamAnswerStatus({ id: this.gameId, teamId: teamId, questionId: this.question.questionId, isCorrect: isCorrect })
			.then(CommonStore.instance.handleError)
			.then(this.onSave);
	};
}