import { AppBar, Button, Hidden, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { friendlyForm } from '@Shared/PersonName';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { CommonStore } from './CommonStore';
import { RouteTable } from './RouteTable';

type Props = {
	store: CommonStore;
	routeTable: RouteTable;
	children?: React.ReactNode;
};

export const Header = observer((props: Props) => {
	const [menu, setMenu] = React.useState(null);

	const handleClick = (event: any) => {
		setMenu(event.currentTarget);
	};

	const handleClose = () => {
		setMenu(null);
	};

	const user = props.store.user;
	return <StyledAppBar position='static'>
		<StyledToolBar>
			<Hidden smUp>
				<IconButton
					color='inherit'
					edge='start'
					onClick={() => props.routeTable.sidebarOpen = true}>
					<MenuIcon />
				</IconButton>
			</Hidden>
			<Typography variant='h6'>
				{props.store.currentAppTitle}
			</Typography>
			{user && <Button color='inherit' onClick={handleClick}>
				{friendlyForm(user.name)}
			</Button>}
			<Menu
				anchorEl={menu}
				keepMounted
				open={Boolean(menu)}
				onClose={handleClose}>
				<MenuItem onClick={() => window.location.href = '/account/logout'} style={{ minWidth: 120 }}>Выйти</MenuItem>
			</Menu>
		</StyledToolBar>
	</StyledAppBar>;
});

const StyledAppBar = styled(AppBar)`
	${props => props.theme.breakpoints.up('sm')} {
		width: calc(100% - ${props => props.theme.sidebarWidth});
		margin-left: ${props => props.theme.sidebarWidth};
	}
` as typeof AppBar;

const StyledToolBar = styled(Toolbar)`
	display: flex;
	flex-flow: row;
	justify-content: space-between;
`;