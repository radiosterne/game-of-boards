import { Avatar, Button, Container, CssBaseline, TextField, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { AccountApiControllerProxy, IAccountLoginAppSettings, UsersController } from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { Router } from '@Shared/Router';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

@observer
export class App extends React.Component<IAccountLoginAppSettings> {
	public static getTitle = () => 'Форма входа';

	@observable
	private phoneNumber = '';

	@observable
	private password = '';

	private accountController = new AccountApiControllerProxy(new HttpService());

	private checkPassword = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		this.accountController.login({
			phone: this.phoneNumber,
			password: this.password
		})
			.then(retVal => {
				if(retVal) {
					Router().go(UsersController.list());
				}
			});
	};

	render() {
		return <Container component='main' maxWidth='xs'>
			<CssBaseline />
			<Background>
				<AvatarWithMargin>
					<LockOutlinedIcon />
				</AvatarWithMargin>
				<Typography component='h1' variant='h5'>
					Вход в GameOfBoards
				</Typography>
				<Form
					noValidate
					onSubmit={this.checkPassword}>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						label='Номер телефона'
						type='tel'
						name='phone'
						autoComplete='tel'
						placeholder='+7 (XXX) XXX-XX-XX'
						autoFocus
						value={this.phoneNumber}
						onChange={evt => this.phoneNumber = evt.target.value}
					/>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						name='password'
						label='Пароль'
						type='password'
						id='password'
						autoComplete='current-password'
						value={this.password}
						onChange={evt => this.password = evt.target.value}/>
					<SubmitButton
						type='submit'
						fullWidth
						variant='contained'
						color='primary'>
						Войти
					</SubmitButton>
				</Form>
			</Background>
		</Container>;
	}
}

const Background = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: ${props => props.theme.spacing(8)}px;
`;

const Form = styled.form`
	margin-top: ${props => props.theme.spacing(1)}px;
`;

const AvatarWithMargin = styled(Avatar)`
	margin: ${props => props.theme.spacing(1)}px;
	background-color: ${props => props.theme.palette.secondary.main};
`;

const SubmitButton = styled(Button)`
	margin: ${props => props.theme.spacing(3, 0, 2)};
`;