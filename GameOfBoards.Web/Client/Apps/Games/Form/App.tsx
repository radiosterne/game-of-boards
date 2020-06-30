import { Box, Button, Container, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { IGamesFormAppSettings } from '@Shared/Contracts';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { Store } from './Store';

@observer
export class App extends React.Component<IGamesFormAppSettings> {
	public static getTitle = () => 'Форма ответов';

	private store: Store;

	constructor(props: IGamesFormAppSettings) {
		super(props);
		this.store = new Store(props);
	}

	render() {
		const store = this.store;
		return <>
			<img src='/title.jpg' style={{ width: '100%', height: '33vh', objectFit: 'cover' }} />
			<PaddedContainer fixed>
				<Box pb={2}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<PaperWithMargin style={{ width: '100%' }}>
								<Typography variant='button'>Игра</Typography>
								<Typography variant='h6' color='primary'>{store.game.name}</Typography>
							</PaperWithMargin>
						</Grid>
						<Grid item xs={12} md={6}>
							<PaperWithMargin style={{ width: '100%' }}>
								<Typography variant='button'>Команда</Typography>
								<Typography variant='h6' color='primary'>{store.game.teamName}</Typography>
							</PaperWithMargin>
						</Grid>
					</Grid>
				</Box>
				<Grid container>
					<Grid item xs={12}>
						<PaperWithMargin>
							{!store.currentActiveQuestion && <Typography variant='h5' color='primary'>Приём ответов пока закрыт</Typography>}
							{store.currentActiveQuestion && store.currentActiveQuestionIsAnswered && <Typography variant='h5' color='primary'>Ваш ответ на вопрос {store.currentActiveQuestion.name} принят!</Typography>}
							{store.currentActiveQuestion && !store.currentActiveQuestionIsAnswered &&
								<>
									<Typography variant='h5' color='primary'>Вопрос {store.currentActiveQuestion.name}</Typography>
									<Box mb={1} mt={1}>
										<TextField placeholder='Ваш ответ' fullWidth onChange={evt => store.answer = evt.target.value}></TextField>
									</Box>
									<Box>
										<Button color='primary' variant='contained' onClick={() => store.answerQuestion()} style={{ margin: 'auto', display: 'block' }}>Ответить</Button>
									</Box>
								</>}
						</PaperWithMargin>
					</Grid>
				</Grid>
			</PaddedContainer>
		</>;
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