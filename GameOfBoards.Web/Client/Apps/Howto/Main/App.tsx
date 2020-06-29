import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { IHowtoMainAppSettings } from '@Shared/Contracts';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

@observer
export class App extends React.Component<IHowtoMainAppSettings> {
	public static getTitle = () => 'Тестовая главная';

	// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
	render() {
		return <>
			<CardWithMargin>
				<CardContent>
					<Typography color='textPrimary' gutterBottom>
						textPrimary!
					</Typography>{' '}
					<Typography color='textSecondary' gutterBottom>
						textSecondary!
					</Typography>{' '}
					<Typography color='primary' gutterBottom>
						primary!
					</Typography>{' '}
					<Button color='primary' variant='contained'>
						Здравствуй, мир!
					</Button>{' '}
					<Button color='secondary' variant='contained'>
						Здравствуй, мир!
					</Button>
				</CardContent>
			</CardWithMargin>
			<CardFitToSize>
				<CardContent>
					<Typography color='error' gutterBottom>
						Я живой!
					</Typography>
				</CardContent>
			</CardFitToSize>
		</>;
	}
}

const CardWithMargin = styled(Card)`
	margin: ${props => props.theme.spacing(2)}px;
` as typeof Card;

const CardFitToSize = styled(CardWithMargin)`
	display: inline-block;
` as typeof Card;