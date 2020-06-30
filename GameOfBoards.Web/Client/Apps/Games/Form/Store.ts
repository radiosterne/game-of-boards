import { CommonStore } from '@Layout';
import { GameApiControllerProxy, IGameThinView, IGamesFormAppSettings } from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { computed, observable } from 'mobx';


export class Store {
	private service = new GameApiControllerProxy(new HttpService());

	constructor(props: IGamesFormAppSettings) {
		this.game = props.game;
		this.answer = '';
		this.interval = setInterval(() =>
			new GameApiControllerProxy(new HttpService(true))
				.getThin({ id: this.game.id })
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
	public game: IGameThinView;

	@observable
	public answer: string;

	@computed
	public get currentActiveQuestion() {
		return this.game.questions.find(q => q.id === this.game.activeQuestion) || null;
	}

	@computed
	public get currentActiveQuestionIsAnswered() {
		const q = this.currentActiveQuestion;
		if (!q) {
			return false;
		}
		else {
			return this.game.answeredQuestions.indexOf(q.id) !== -1;
		}
	}

	public answerQuestion = () => {
		const q = this.currentActiveQuestion;
		if (!q) {
			return;
		}

		this.service.updateTeamAnswer({
			id: this.game.id,
			questionId: q.id,
			answer: this.answer,
			teamId: CommonStore.instance.user!.id
		})
			.then(CommonStore.instance.handleError)
			.then(v => {
				this.game = v;
				this.answer = '';
			});
	};
}