import { Box, Button, Container, Drawer, Grid, IconButton, MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import ListIcon from '@material-ui/icons/List';
import { GameState, IGamesEditAppSettings } from '@Shared/Contracts';
import { TableEditor } from '@Shared/Editor';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { Store } from './Store';

@observer
export class App extends React.Component<IGamesEditAppSettings> {
	public static getTitle = (props: IGamesEditAppSettings) => `Игра ${props.game.name}`;

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
						<TableEditor
							entities={store.questions}
							scheme={store.questionEditScheme}
							onSubmit={store.updateQuestion}
							customCell={{
								title: '',
								render: question =>
									<>
										<IconButton onClick={() => store.openedQuestionId = question.questionId}><ListIcon /></IconButton>

										<Button variant='outlined' onClick={() => store.updateActiveQuestion(question.questionId, !question.isActive)}>
											{question.isActive ? 'Закрыть приём' : 'Начать приём'}
										</Button>
									</>
							}}
							canCreate />
					</PaperWithMargin>
				</Grid>
			</Grid>
			<TeamsDrawer store={store} />
			<QuestionDrawer store={store} />
		</PaddedContainer >;
	}
}

const TeamsDrawer = observer(({ store }: { store: Store }) =>
	<Drawer open={store.teamDrawerOpen} onClose={() => store.teamDrawerOpen = false} anchor='right'>
		<Box p={1}>
			<Typography variant='h6'>Зарегистрированные команды</Typography>
			<Table size='small'>
				<TableHead>
					<TableRow>
						<TableCell>
							Название
						</TableCell>
						<TableCell>
							Зарегистрирована
						</TableCell>
						<TableCell />
					</TableRow>
				</TableHead>
				<TableBody>

					{store.teamsAndRegistrations.map(tnr =>
						<TableRow key={tnr.id}>
							<TableCell>
								{tnr.name.fullForm}
							</TableCell>
							<TableCell>
								{tnr.registered ? <CheckIcon /> : <ClearIcon />}
							</TableCell>
							<TableCell>
								<Button variant='outlined' onClick={() => store.registerTeam(tnr.id, !tnr.registered)}>
									{tnr.registered ? 'Снять с регистрации' : 'Зарегистрировать' }
								</Button>
							</TableCell>
						</TableRow>)}
				</TableBody>
			</Table>
		</Box>
	</Drawer>);

const QuestionDrawer = observer(({ store }: { store: Store }) =>
	<Drawer open={!!store.openedQuestion} onClose={() => store.openedQuestionId = null} anchor='right'>
		<Box p={1}>
			<Typography variant='h6'>Вопрос «{store.openedQuestion?.shortName}»</Typography>
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
							Зачтён автоматически
						</TableCell>
						<TableCell>
							Зачтён вручную
						</TableCell>
						<TableCell />
					</TableRow>
				</TableHead>
				<TableBody>
					{store.openedQuestion?.answers.map(a =>
						<TableRow key={a.teamId}>
							<TableCell>
								{a.teamName}
							</TableCell>
							<TableCell>
								{a.answerText}
							</TableCell>
							<TableCell>
								{a.autoCorrect ? <CheckIcon /> : <ClearIcon />}
							</TableCell>
							<TableCell>
								{a.markedCorrect ? <CheckIcon /> : <ClearIcon />}
							</TableCell>
							<TableCell>
								<Button variant='outlined' onClick={() => store.markCorrect(a.teamId, store.openedQuestion?.questionId || '', !a.markedCorrect)}>
									{a.markedCorrect ? 'Снять' : 'Зачесть'}
								</Button>
							</TableCell>
						</TableRow>)}
				</TableBody>
			</Table>
		</Box>
	</Drawer>);

const PaddedContainer = styled(Container)`
	padding-top: ${props => props.theme.spacing(4)}px;
	padding-bottom: ${props => props.theme.spacing(4)}px;
`;

const PaperWithMargin = styled(Paper)`
	padding: ${props => props.theme.spacing(2)}px;
`;