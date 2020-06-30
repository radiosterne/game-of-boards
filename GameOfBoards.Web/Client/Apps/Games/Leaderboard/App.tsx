import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { IGamesLeaderboardAppSettings } from '@Shared/Contracts';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

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
		return <PaddedContainer fixed>
			<Grid container>
				<Grid item xs={12}>
					<Box mb={2}>
						<PaperWithMargin>
							<Typography variant='h6'>Сводка</Typography>
							<Table>
								<TableHead>
									<TableCell />
									{store.leaderboard.map(l => <TableCell key={l.name.fullForm}><b>{l.name.fullForm}</b></TableCell>)}
								</TableHead>
								<TableBody>
									{store.questionNames.map((qn, idx) => <TableRow key={qn}>
										<TableCell>{qn}</TableCell>
										{store.leaderboard.map(l => {
											const answer = l.answers[idx];
											const correct = answer ? (answer.autoCorrect || answer.markedCorrect) : false;
											return <TableCell key={l.name.fullForm}>{correct ? 'Верно' : 'Неверно'}</TableCell>;
										})}
									</TableRow>)}
									<TableRow>
										<TableCell><b>Итого:</b></TableCell>
										{store.leaderboard.map(l => <TableCell key={l.name.fullForm}>{l.total}</TableCell>)}
									</TableRow>
								</TableBody>
							</Table>
						</PaperWithMargin>
					</Box>
					<PaperWithMargin>
						<Typography variant='h6'>Первые правильные ответы на вопросы</Typography>
						<Table>
							<TableHead>
								<TableCell>
									Вопрос
								</TableCell>
								<TableCell>
									Команда
								</TableCell>
							</TableHead>
							<TableBody>
								{store.questionNames.map((qn, idx) => <TableRow key={qn}>
									<TableCell>{qn}</TableCell>
									<TableCell>{store.leaderboard
										.map(l => l.answers[idx])
										.filter(l => !!l)
										.sort((l, r) => l.moment.valueOf() - r.moment.valueOf())[0]?.teamName || ''}</TableCell>
								</TableRow>)}
							</TableBody>
						</Table>
					</PaperWithMargin>
				</Grid>
			</Grid>
		</PaddedContainer >;
	}
}

const PaddedContainer = styled(Container)`
	padding-top: ${props => props.theme.spacing(4)}px;
	padding-bottom: ${props => props.theme.spacing(4)}px;
`;

const PaperWithMargin = styled(Paper)`
	padding: ${props => props.theme.spacing(2)}px;
`;