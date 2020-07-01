import { Box, Grid, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import { IGamesLeaderboardAppSettings } from '@Shared/Contracts';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { ScoringTablePopup } from './ScoringTablePopup';
import { Store } from './Store';

@observer
export class App extends React.Component<IGamesLeaderboardAppSettings> {
	public static getTitle = (props: IGamesLeaderboardAppSettings) => `Игра ${props.game.name}`;

	private store: Store;

	constructor(props: IGamesLeaderboardAppSettings) {
		super(props);
		this.store = new Store(props);
	}

	render() {
		const store = this.store;
		return <Box p={2}>
			<Grid container>
				<Grid item xs={12}>
					<Box mb={2}>
						<PaperWithMargin style={{ overflowX: 'scroll' }}>
							<Typography variant='h5' style={{ display: 'inline' }}>Сводка</Typography>
							<IconButton style={{ marginLeft: '8px', marginTop: '-6px' }} size='small' onClick={() => store.scoringTableOpen = true}><FormatListNumberedIcon /></IconButton>
							<Table
								size='small'
								style={{ maxWidth: '100%', overflowX: 'scroll', minWidth: '800px' }}>
								<TableHead>
									<TableCell><b>Вопрос</b></TableCell>
									{store.scoreboard.map(l =>
										<TableCell
											key={l.name}>
											<b>{l.name}</b>
										</TableCell>)}
								</TableHead>
								<TableBody>
									{store.questionNames.map(qn => <TableRow key={qn.id}>
										<TableCell
											style={{
												backgroundColor: qn.isActive ? '#94ac24' : 'unset',
												color: qn.isActive ? '#fff' : '#333'
											}}>
											{qn.name}
										</TableCell>
										{store.scoreboard.map(l => {
											const answer = l.answers.find(a => a.questionId === qn.id);
											const state = answer
												? answer.isCorrect
													? 'Верно'
													: 'Неверно'
												: 'Нет ответа';
											const color = answer
												? answer.isCorrect
													? '#94ac24'
													: '#000'
												: '#808080';

											const shouldBeBold = answer && answer.isCorrect;
											return <TableCell style={{ color: color, fontWeight: shouldBeBold ? 'bold' : 'normal' }} key={l.name}>{state}</TableCell>;
										})}
									</TableRow>)}
									<TableRow>
										<TableCell><b>Итого:</b></TableCell>
										{store.scoreboard.map(l => <TableCell key={l.name}><b>{l.total}</b></TableCell>)}
									</TableRow>
								</TableBody>
							</Table>
						</PaperWithMargin>
					</Box>
					<PaperWithMargin>
						<Typography variant='h6'>Первые правильные ответы на вопросы</Typography>
						<Table size='small'>
							<TableHead>
								<TableCell>
									Вопрос
								</TableCell>
								<TableCell>
									Команда
								</TableCell>
							</TableHead>
							<TableBody>
								{store.questionNames.map(qn => <TableRow key={qn.id}>
									<TableCell>{qn.name}</TableCell>
									<TableCell>
										<b>
											{store.scoreboard
												.map(l => l.answers.find(a => a.questionId === qn.id))
												.filter(l => !!l && (l.autoCorrect || l.markedCorrect))
												.sort((l, r) => l!.moment.valueOf() - r!.moment.valueOf())[0]?.teamName || ''}
										</b>
									</TableCell>
								</TableRow>)}
							</TableBody>
						</Table>
					</PaperWithMargin>
				</Grid>
			</Grid>
			<ScoringTablePopup store={store} />
		</Box>;
	}

	componentWillUnmount = () => {
		this.store.unsubscribe();
	};
}

const PaperWithMargin = styled(Paper)`
	padding: ${props => props.theme.spacing(2)}px;
`;