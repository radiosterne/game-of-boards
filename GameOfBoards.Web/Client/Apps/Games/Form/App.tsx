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
				<Grid container>
					<Grid item xs={12}>
						<PaperWithMargin>
							{!store.currentActiveQuestion && <Typography variant='h5'>Приём ответов пока закрыт</Typography>}
							{store.currentActiveQuestion && store.currentActiveQuestionIsAnswered && <Typography variant='h5'>Ваш ответ на вопрос {store.currentActiveQuestion.name} принят!</Typography>}
							{store.currentActiveQuestion && !store.currentActiveQuestionIsAnswered &&
								<>
									<Typography variant='h5'>Вопрос {store.currentActiveQuestion.name}</Typography>
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
}

const PaddedContainer = styled(Container)`
	padding-top: ${props => props.theme.spacing(4)}px;
	padding-bottom: ${props => props.theme.spacing(4)}px;
`;

const PaperWithMargin = styled(Paper)`
	padding: ${props => props.theme.spacing(2)}px;
`;