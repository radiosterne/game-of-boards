import { Box, Grid, IconButton, Modal, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import { IGamesLeaderboardAppSettings } from '@Shared/Contracts';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { Centerer } from '../../../Layout/Centerer';

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
							<Typography variant='h6' style={{ display: 'inline' }}>Сводка</Typography>
							<IconButton style={{ marginLeft: '8px' }} size='small' onClick={() => store.scoringTableOpen = true}><FormatListNumberedIcon /></IconButton>
							<Table size='small' style={{ maxWidth: '100%', overflowX: 'scroll', minWidth: '800px' }}>
								<TableHead>
									<TableCell><b>Вопрос</b></TableCell>
									{store.leaderboard.map(l => <TableCell key={l.name}><b>{l.name}</b></TableCell>)}
								</TableHead>
								<TableBody>
									{store.questionNames.map(qn => <TableRow key={qn.id}>
										<TableCell>{qn.name}</TableCell>
										{store.leaderboard.map(l => {
											const answer = l.answers.find(a => a.questionId === qn.id);
											const state = answer
												? (answer.autoCorrect || answer.markedCorrect)
													? 'Верно'
													: 'Неверно'
												: 'Нет ответа';
											const color = answer
												? (answer.autoCorrect || answer.markedCorrect)
													? '#94ac24'
													: '#000'
												: '#808080';

											const shouldBeBold = answer && (answer.autoCorrect || answer.markedCorrect);
											return <TableCell style={{ color: color, fontWeight: shouldBeBold ? 'bold' : 'normal' }} key={l.name}>{state}</TableCell>;
										})}
									</TableRow>)}
									<TableRow>
										<TableCell><b>Итого:</b></TableCell>
										{store.leaderboard.map(l => <TableCell key={l.name}><b>{l.total}</b></TableCell>)}
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
											{store.leaderboard
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

const ScoringTablePopup = observer(({ store }: { store: Store }) =>
	<Modal
		open={store.scoringTableOpen}
		onClose={() => store.scoringTableOpen = false}>
		<Centerer>
			<Backdrop square>
				<WhiteTable>
					<TableHead>
						<TableRow style={{ backgroundColor: '#213c5e' }}>
							<TableCell><Typography variant='h5' style={{ color: 'white' }}>Место</Typography></TableCell>
							<TableCell><Typography variant='h5' style={{ color: 'white' }}>Название команды</Typography></TableCell>
							<TableCell><Typography variant='h5' style={{ color: 'white' }}>Правильных ответов</Typography></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{store.scoringTable.map((team, idx) => <TableRow key={team.name} style={{ backgroundColor: idx % 2 === 0 ? '#5e708c' : '#8b99ac', color: '#fff' }}>
							<TableCell><Typography variant='h5' style={{ color: 'white' }}>{team.place}</Typography></TableCell>
							<TableCell><Typography variant='h5' style={{ color: 'white' }}>{team.name}</Typography></TableCell>
							<TableCell align='right'><Typography variant='h5' style={{ color: 'white' }}>{team.total}</Typography></TableCell>
						</TableRow>)}
					</TableBody>
				</WhiteTable>
			</Backdrop>
		</Centerer>
	</Modal>);

const PaperWithMargin = styled(Paper)`
	padding: ${props => props.theme.spacing(2)}px;
`;

const Backdrop = styled(Paper)`
	min-height: 80%;
	max-height: 80%;
`;

const WhiteTable = styled(Table)`
	color: white;
`;