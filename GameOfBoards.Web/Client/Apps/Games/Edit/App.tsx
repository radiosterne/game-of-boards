import { Box, Button, Container, Grid, IconButton, MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import ViewListIcon from '@material-ui/icons/ViewList';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { GameState, IGamesEditAppSettings } from '@Shared/Contracts';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { QuestionDrawer } from './QuestionDrawer';
import { Store } from './Store';
import { TeamsDrawer } from './TeamsDrawer';

@observer
export class App extends React.Component<IGamesEditAppSettings> {
	public static getTitle = (props: IGamesEditAppSettings) => `Управление игрой «${props.game.name}»`;

	private store: Store;

	constructor(props: IGamesEditAppSettings) {
		super(props);
		this.store = new Store(props);
	}

	render() {
		const store = this.store;
		return <PaddedContainer fixed>
			<Grid container>
				<Grid item xs={12}>
					<Box mb={2}>
						<PaperWithMargin>
							<Typography variant='h6'>Общие настройки</Typography>
							<Grid container>
								<Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
									<Typography variant='button' style={{ marginRight: '8px' }}>Состояние:</Typography>
									<TextField
										value={store.game.state}
										onChange={evt => store.updateState(evt.target.value as any as GameState)}
										select>
										<MenuItem value={GameState.Closed}>
											Закрыта
										</MenuItem>
										<MenuItem value={GameState.Open}>
											Открыта
										</MenuItem>
										<MenuItem value={GameState.Finished}>
											Завершена
										</MenuItem>
									</TextField>
								</Grid>
								<Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
									<Typography variant='button' style={{ marginRight: '8px' }}>Список команд:</Typography>
									<Button variant='outlined' onClick={() => store.teamDrawerOpen = true} size='small'>
										открыть
									</Button>
								</Grid>
							</Grid>
						</PaperWithMargin>
					</Box>
					<PaperWithMargin>
						<Typography variant='h6'>Список вопросов</Typography>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell />
									<TableCell>Вопрос</TableCell>
									<TableCell>Ответы</TableCell>
									<TableCell>Сдано</TableCell>
									<TableCell>Правильно</TableCell>
									<TableCell />
									<TableCell />
									<TableCell />
									<TableCell />
								</TableRow>
							</TableHead>
							<TableBody>
								{store.questions.map((question, idx) =>
									<TableRow key={idx}>
										<TableCell>{idx + 1}</TableCell>
										<TableCell>{question.shortName}</TableCell>
										<TableCell>{question.rightAnswers}</TableCell>
										<TableCell align='right'><b>{question.answersCount}</b></TableCell>
										<TableCell align='right'><b>{question.correctAnswersCount}</b></TableCell>
										<TableCell>
											<Button
												variant='contained'
												onClick={() => store.updateActiveQuestion(question.questionId, !question.isActive)}
												color={question.isActive ? 'secondary' : 'primary'}
												style={{ color: '#fff' }}>
												{question.isActive ? 'Закрыть' : 'Открыть'}
											</Button>
										</TableCell>
										<TableCell>
											<IconButton
												onClick={() => navigator.clipboard.writeText(question.questionText)}>
												<FileCopyIcon color='primary' />
											</IconButton>
										</TableCell>
										<TableCell>
											<IconButton
												onClick={() => store.openQuestion(question.questionId)}>
												<ViewListIcon color='primary' />
											</IconButton>
										</TableCell>
										<TableCell>
											<IconButton
												onClick={() => store.editQuestion(question.questionId)}>
												<EditIcon color='primary' />
											</IconButton>
										</TableCell>
									</TableRow>)}
							</TableBody>
						</Table>
						<Box pt={1}>
							<Button
								variant='outlined'
								onClick={store.createQuestion}
								color='primary'>
								Добавить вопрос
							</Button>
						</Box>
					</PaperWithMargin>
				</Grid>
			</Grid>
			<TeamsDrawer store={store} />
			<QuestionDrawer store={store} />
		</PaddedContainer >;
	}

	componentWillUnmount = () => {
		this.store.unsubscribe();
	};
}

const PaddedContainer = styled(Container)`
	padding-top: ${props => props.theme.spacing(4)}px;
	padding-bottom: ${props => props.theme.spacing(4)}px;
`;

const PaperWithMargin = styled(Paper)`
	padding: ${props => props.theme.spacing(2)}px;
`;