import { Container, Grid, Paper } from '@material-ui/core';
import { IGamesListAppSettings } from '@Shared/Contracts';
import { TableEditor } from '@Shared/Editor';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { Store } from './Store';

@observer
export class App extends React.Component<IGamesListAppSettings> {
	public static getTitle = () => 'Список Game';

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