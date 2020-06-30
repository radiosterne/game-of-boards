import { Button, Container, Grid, IconButton, Paper } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { GamesController, IGamesListAppSettings } from '@Shared/Contracts';
import { TableEditor } from '@Shared/Editor';
import { Router } from '@Shared/Router';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { Store } from './Store';

@observer
export class App extends React.Component<IGamesListAppSettings> {
	public static getTitle = () => 'Форма ответов';

	private store: Store;

	constructor(props: IGamesListAppSettings) {
		super(props);
		this.store = new Store(props);
	}

	render() {
		return <PaddedContainer fixed>
			<Grid container>
				<Grid item xs={12}>
					<PaperWithMargin>
						<TableEditor
							entities={this.store.sortedGames}
							scheme={this.store.scheme}
							onSubmit={this.store.onSubmit}
							customCell={{
								title: 'Ссылки',
								render: game => {
									const isTeamUser = this.store.isTeamUser;
									return <>
										{!isTeamUser && <IconButton
											href={GamesController.edit(game.id).getUrl(false)}
											onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
												if (!event.ctrlKey) {
													event.preventDefault();
													Router().go(GamesController.edit(game.id));
												}
											}}>
											<AssignmentIcon />
										</IconButton>}
										{!isTeamUser && <IconButton
											href={GamesController.leaderboard(game.id).getUrl(false)}
											onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
												if (!event.ctrlKey) {
													event.preventDefault();
													Router().go(GamesController.leaderboard(game.id));
												}
											}}>
											<CalendarTodayIcon />
										</IconButton>}
										{isTeamUser &&
											<Button
												variant='outlined'
												color='primary'
												onClick={() => Router().go(GamesController.form(game.id))}>
												Форма ответов
											</Button>}
									</>;
								}
							}}
							canCreate={!this.store.isTeamUser} />
					</PaperWithMargin>
				</Grid>
			</Grid>
		</PaddedContainer>;
	}
}

const PaddedContainer = styled(Container)`
	padding-top: ${props => props.theme.spacing(4)}px;
	padding-bottom: ${props => props.theme.spacing(4)}px;
`;

const PaperWithMargin = styled(Paper)`
	padding: ${props => props.theme.spacing(2)}px;
`;