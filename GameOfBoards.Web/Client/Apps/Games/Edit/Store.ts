import { CommonStore } from '@Layout';
import { GameApiControllerProxy, GameState, IGameView, IGamesEditAppSettings, IUserView } from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { computed, observable } from 'mobx';
import * as xlsx from 'xlsx';
import { correlateQuestionsAndAnswers, getTeamsRegistrationStatus } from '../CommonLogic';
import { OpenedQuestionStore } from './OpenedQuestionStore';
import { QuestionEditorStore } from './QuestionEditorStore';


export class Store {
	private service = new GameApiControllerProxy(new HttpService());

	constructor(props: IGamesEditAppSettings) {
		this.game = props.game;
		this.teams = props.teams;
		this.teamDrawerOpen = false;
		this.openedQuestionStore = null;
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
	public openedQuestionStore: OpenedQuestionStore | null;

	public openQuestion = (questionId: string) => {
		this.openedQuestionStore = new OpenedQuestionStore(
			this,
			questionId,
			this.teamsAndRegistrations.filter(t => t.registered),
			v => this.game = v);
	};

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

	public savePasswords = () => {
		const teams = this.teamsAndRegistrations
			.filter(t => t.isTeam && t.registered)
			.map(t => [ t.name.fullForm, `https://csbi.blumenkraft.me/account/shortLogin?id=${t.id}&salt=${encodeURIComponent(t.salt || '')}`]);

		const results = [['Команда', 'Ссылка']];
		results.push(...teams);

		const book = xlsx.utils.book_new();
		const sheet = xlsx.utils.aoa_to_sheet(results);
		xlsx.utils.book_append_sheet(book, sheet, 'Ссылки');
		xlsx.writeFile(book, `${this.game.name}.xlsx`);
	};
}