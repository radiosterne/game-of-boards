import { Button, Container, Grid, Paper } from '@material-ui/core';
import { IUsersListAppSettings } from '@Shared/Contracts';
import { TableEditor } from '@Shared/Editor';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { Store } from './Store';

@observer
export class App extends React.Component<IUsersListAppSettings> {
	public static getTitle = () => 'Список пользователей';

	private store: Store;

	constructor(props: IUsersListAppSettings) {
		super(props);
		this.store = new Store(props.users);
	}

	render() {
		return <PaddedContainer fixed>
			<Grid container>
				<Grid item xs={12}>
					<PaperWithMargin>
						<TableEditor
							entities={this.store.sortedUsers}
							scheme={this.store.scheme}
							onSubmit={this.store.onSubmit}
							customCell={{
								title: '',
								render: user =>
									<>
										<Button variant='outlined' onClick={() => this.store.changeTeamStatus(user.id, !user.isTeam)}>
											{user.isTeam ? 'Не команда' : 'Сделать командой'}
										</Button>
										{user.isTeam && <Button
											style={{ marginLeft: '8px' }}
											variant='outlined'
											onClick={() => {
												const url = `https://gameofboards.blumenkraft.me/account/shortLogin?id=${user.id}&salt=${encodeURIComponent(user.salt || '')}`;
												navigator.clipboard.writeText(url);
											}}>Ссылка на вход</Button>}
									</>
							}}
							canCreate />
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