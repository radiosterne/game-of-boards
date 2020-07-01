import { Box, Button, Divider, Drawer, TextField, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Store } from './Store';

export const QuestionEditor = observer(({ store }: { store: Store }) => {
	const questionEditor = store.questionEditor;
	return <Drawer open={!!questionEditor} onClose={() => questionEditor?.cancel()} anchor='right'>
		{questionEditor &&
			<Box p={2} style={{ minWidth: '600px' }}>
				<Typography variant='h6'>Редактирование вопроса</Typography>
				<Divider />
				<Box pt={1}>
					<TextField
						value={questionEditor.shortName}
						label='Название'
						onChange={evt => questionEditor.shortName = evt.target.value}
						style={{ width: '100%' }} />
				</Box>
				<Box pt={1}>
					<TextField
						value={questionEditor.points}
						label='Балл'
						onChange={evt => questionEditor.points = parseInt(evt.target.value) || 0}
						style={{ width: '100%' }} />
				</Box>
				<Box pt={1}>
					<TextField
						value={questionEditor.rightAnswers}
						label='Правильные ответы'
						multiline
						onChange={evt => questionEditor.rightAnswers = evt.target.value}
						style={{ width: '100%' }} />
				</Box>
				<Box pt={1}>
					<TextField
						value={questionEditor.questionText}
						label='Текст вопроса'
						multiline
						rows={10}
						onChange={evt => questionEditor.questionText = evt.target.value}
						style={{ width: '100%' }} />
				</Box>
				<Box pt={1}>
					<Button
						variant='outlined'
						color='primary'
						disabled={questionEditor.savingDisabled}
						onClick={questionEditor.save}>
						Сохранить
					</Button>
				</Box>
			</Box>}
	</Drawer>;
});