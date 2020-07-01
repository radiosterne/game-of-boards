import { Box, Button, Divider, Drawer, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Store } from './Store';

export const QuestionDrawer = observer(({ store }: { store: Store }) => <Drawer open={!!store.openedQuestionStore} onClose={() => store.openedQuestionId = null} anchor='right'>
	<Box p={2}>
		<Typography variant='h6'>Вопрос {store.openedQuestionStore?.question.shortName}</Typography>
		<Divider />
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
					{store.openedQuestionStore?.question.answers.map(a => <TableRow key={a.teamId}>
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
								onClick={() => store.openedQuestionStore?.markCorrect(a.teamId, !a.markedCorrect)}>
								{a.markedCorrect ? 'Снять' : 'Зачесть'}
							</Button>
						</TableCell>
					</TableRow>)}
				</TableBody>
			</Table>
		</Box>
	</Box>
</Drawer>);
