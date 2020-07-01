import { Box, Button, Divider, Drawer, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, MenuItem } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import Alert from '@material-ui/lab/Alert';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Store } from './Store';

export const QuestionDrawer = observer(({ store }: { store: Store }) => {
	const questionStore = store.openedQuestionStore;
	return <Drawer open={!!questionStore} onClose={() => store.openedQuestionStore = null} anchor='right'>
		{questionStore &&
			<Box p={2}>
				<Typography variant='h6'>Вопрос {questionStore.question.shortName}</Typography>
				<Divider />
				{!questionStore.canManuallyAnswer &&
					<Box pt={1}>
						<Alert severity='success'>Все команды дали ответ!</Alert>
					</Box>}
				{questionStore.canManuallyAnswer &&
					<Box pt={1}>
						<Typography>Ручной ввод ответа</Typography>
						<TextField
							value={questionStore.selectedTeamId}
							label='Команда'
							onChange={evt => questionStore.selectedTeamId = evt.target.value}
							style={{ width: '100%' }}
							select>
							{questionStore.teamsWithoutAnswer.map(t =>
								<MenuItem key={t.id} value={t.id}>
									{t.name.fullForm}
								</MenuItem>)}
						</TextField>
						<TextField
							value={questionStore.answer}
							label='Текст ответа'
							onChange={evt => questionStore.answer = evt.target.value}
							style={{ width: '100%' }} />
						<Box pt={1}>
							<Button
								variant='outlined'
								color='primary'
								disabled={questionStore.savingDisabled}
								onClick={questionStore.saveAnswer}>
								Отправить
							</Button>
						</Box>
					</Box>}
				<Box pt={1}>
					<Table size='small'>
						<TableHead>
							<TableRow>
								<TableCell>
									Команда
								</TableCell>
								<TableCell>
									Ответ
								</TableCell>
								<TableCell>
									Время подачи
								</TableCell>
								<TableCell>
									Зачтён автоматически
								</TableCell>
								<TableCell>
									Зачтён вручную
								</TableCell>
								<TableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							{questionStore.question.answers.map(a => <TableRow key={a.teamId}>
								<TableCell>
									<b>
										{a.teamName}
									</b>
								</TableCell>
								<TableCell>
									{a.answerText}
								</TableCell>
								<TableCell>
									{a.moment.format('DD.MM hh:mm:ss')}
								</TableCell>
								<TableCell>
									{a.autoCorrect ? <CheckIcon color='primary' /> : <ClearIcon color='primary' />}
								</TableCell>
								<TableCell>
									{a.markedCorrect ? <CheckIcon color='primary' /> : <ClearIcon color='primary' />}
								</TableCell>
								<TableCell>
									<Button
										variant='outlined'
										color='primary'
										onClick={() => questionStore.markCorrect(a.teamId, !a.markedCorrect)}>
										{a.markedCorrect ? 'Снять' : 'Зачесть'}
									</Button>
								</TableCell>
							</TableRow>)}
						</TableBody>
					</Table>
				</Box>
			</Box>}
	</Drawer>;
});
