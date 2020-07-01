import { CommonStore } from '@Layout';
import { GameApiControllerProxy, IGameView, IQuestion } from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { observable } from 'mobx';

export class QuestionEditorStore {
	private service = new GameApiControllerProxy(new HttpService());

	constructor(
		private gameId: string,
		private question: IQuestion | null,
		private onSave: (view: IGameView) => void,
		private onCancel: () => void
	) {
		this.shortName = question?.shortName || '';
		this.rightAnswers = question?.rightAnswers || '';
		this.points = question?.points || 1;
		this.questionText = question?.questionText || '';
	}


	@observable
	public shortName: string;


	@observable
	public rightAnswers: string;


	@observable
	public points: number;


	@observable
	public questionText: string;


	public save = () => this.service.updateQuestion({
		id: this.gameId,
		questionId: this.question ? this.question.questionId : null,
		shortName: this.shortName,
		rightAnswers: this.rightAnswers,
		points: this.points,
		questionText: this.questionText,
	})
		.then(CommonStore.instance.handleError)
		.then(this.onSave);


	public cancel = () => this.onCancel();
}
