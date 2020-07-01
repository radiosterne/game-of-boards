import { IAnswer, IGameView, IQuestion, IUserView } from '@Shared/Contracts';

type Answer = IAnswer & {
	teamName: string;
	autoCorrect: boolean;
	markedCorrect: boolean;
	isCorrect: boolean;
	score: number;
	questionName: string;
	questionId: string;
};

export type QuestionWithAnswers = IQuestion &  {
	answersCount: number;
	correctAnswersCount: number;
	isActive: boolean;
	answers: Answer[];
};

export const getTeamsRegistrationStatus = (game: IGameView, teams: IUserView[]) =>
	teams
		.map(t => ({ ...t, registered: game.registeredTeams.indexOf(t.id) !== -1 }))
		.sort((a, b) => a.name.fullForm.localeCompare(b.name.fullForm));

export const correlateQuestionsAndAnswers = (game: IGameView, teams: IUserView[]): QuestionWithAnswers[] =>
	game.questions
		.map(q => ({
			...q,
			isActive: game.activeQuestionId === q.questionId,
			answers: game.answers
				.filter(answer => answer.questionId === q.questionId)
				.map(answer => {
					const autoCorrect = q.rightAnswers.split(';').map(x => x.toLowerCase()).indexOf(answer.answerText.toLowerCase()) !== -1;
					const markedCorrect = game.corrections.find(c => c.questionId === q.questionId && c.teamId === answer.teamId)?.isCorrect || false;
					const isCorrect = autoCorrect || markedCorrect;
					const score = isCorrect ? q.points : 0;
					return ({
						...answer,
						teamName: teams.find(t => t.id === answer.teamId)!.name.fullForm,
						teamId: answer.teamId,
						autoCorrect: autoCorrect,
						markedCorrect: markedCorrect,
						isCorrect: isCorrect,
						score: score,
						questionName: q.shortName,
						questionId: q.questionId,
					});
				})
		}))
		.map(q => ({
			...q,
			answersCount: q.answers.length,
			correctAnswersCount: q.answers.filter(a => a.isCorrect).length
		}));