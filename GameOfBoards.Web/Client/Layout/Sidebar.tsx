import { Collapse, Divider, Drawer, Hidden, List, ListItem, ListItemText } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { Router } from '@Shared/Router';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { RouteTable } from './RouteTable';

export type Props = {
	routeTable: RouteTable;
};

@observer
export class Sidebar extends React.Component<Props, {}> {
	render() {
		const { routeTable } = this.props;
		return <nav>
			<Hidden smUp implementation='css'>
				<StyledDrawer
					variant='temporary'
					anchor='left'
					open={routeTable.sidebarOpen}
					onClose={() => routeTable.sidebarOpen = false}
					ModalProps={{
						keepMounted: true
					}}>
					<SidebarContent routeTable={this.props.routeTable} />
				</StyledDrawer>
			</Hidden>
			<Hidden xsDown implementation='css'>
				<StyledDrawer
					variant='permanent'
					open>
					<SidebarContent routeTable={this.props.routeTable} />
				</StyledDrawer>
			</Hidden>
		</nav>;
	}
}

const SidebarContent = observer((props: Props) => {
	const { routeTable } = props;
	return (
		<div>
			<Header>
				<img src='/logo-csbi.png' style={{ height: '64px', padding: '5px', objectFit: 'contain', maxWidth: '240px' }} />
			</Header>
			<Divider />
			<List>
				{routeTable.menuSchema
					.filter(group => group.visible)
					.map((group) => (
						<React.Fragment key={group.title}>
							<ListItem button onClick={() => routeTable.toggleGroup(group.title)} >
								<ListItemText primary={group.title} />
								{group.active ? null : (group.expanded ? <ExpandLess /> : <ExpandMore />)}
							</ListItem>
							<Collapse in={group.active || group.expanded} timeout='auto' unmountOnExit>
								<List component='div' disablePadding>
									{group.links
										.filter(l => l.show)
										.map(link =>
											<NestedListItem button key={link.title} onClick={() => Router().go(link.to)}>
												<MenuItem active={link.active}>{link.title}</MenuItem>
											</NestedListItem>)}
								</List>
							</Collapse>
						</React.Fragment>
					))}
			</List>
		</div>
	);
});

const StyledDrawer = styled(Drawer)`
	width: ${props => props.theme.sidebarWidth};

	& .MuiPaper-root {
		width: ${props => props.theme.sidebarWidth};
	}
` as typeof Drawer;

const NestedListItem = styled(ListItem)`
	padding-left: ${props => props.theme.spacing(4)}px;
` as typeof ListItem;

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const MenuItem = styled.span<{ active: boolean }>`
	color: ${props => props.active
		? props.theme.palette.secondary.main
		: props.theme.palette.primary.main};
	font-weight: ${props => props.active
		? props.theme.typography.fontWeightMedium
		: props.theme.typography.fontWeightRegular};
`;
