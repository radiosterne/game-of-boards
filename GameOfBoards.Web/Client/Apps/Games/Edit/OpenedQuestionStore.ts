import { CommonStore } from '@Layout';
import { GameApiControllerProxy, IGameView, IUserView } from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { computed, observable } from 'mobx';
import { QuestionWithAnswers } from '../CommonLogic';

export class OpenedQuestionStore {
	private service = new GameApiControllerProxy(new HttpService());

	constructor(
		private gameHolder: GameHolder,
		public questionId: string,
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
	public get question() {
		return this.gameHolder.questions.find(q => q.questionId === this.questionId)!;
	}


	@computed
	public get teamsWithoutAnswer() {
		return this.registeredTeams.filter(rt => this.question.answers.find(a => a.teamId === rt.id) === undefined);
	}


	@computed
	public get savingDisabled() {
		return this.selectedTeamId === '' || this.answer.trim() === '' || this.teamsWithoutAnswer.find(t => t.id === this.selectedTeamId) === undefined;
	}


	public saveAnswer = () => {
		this.service.updateTeamAnswerManually({
			id: this.gameHolder.game.id,
			questionId: this.question.questionId,
			teamId: this.selectedTeamId,
			answer: this.answer
		})
			.then(CommonStore.instance.handleError)
			.then(this.onSave)
			.then(() => {
				this.answer = '';
				this.selectedTeamId = '';
			});
	};


	public markCorrect = (teamId: string, isCorrect: boolean) => {
		this.service.updateTeamAnswerStatus({
			id: this.gameHolder.game.id,
			teamId: teamId,
			questionId: this.question.questionId,
			isCorrect: isCorrect
		})
			.then(CommonStore.instance.handleError)
			.then(this.onSave);
	};
}
type GameHolder = {
	game: IGameView;
	questions: QuestionWithAnswers[];
};
