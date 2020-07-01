import { Box, Button, Drawer, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Store } from './Store';

export const TeamsDrawer = observer(({ store }: { store: Store }) =>
	<Drawer open={store.teamDrawerOpen} onClose={() => store.teamDrawerOpen = false} anchor='right'>
		<Box p={2}>
			<Typography variant='h6'>Зарегистрированные команды</Typography>
			<Table size='small'>
				<TableHead>
					<TableRow>
						<TableCell>
							Название
						</TableCell>
						<TableCell>
							Зарегистрирована
						</TableCell>
						<TableCell />
					</TableRow>
				</TableHead>
				<TableBody>

					{store.teamsAndRegistrations.map(tnr => <TableRow key={tnr.id}>
						<TableCell>
							{tnr.name.fullForm}
						</TableCell>
						<TableCell>
							{tnr.registered ? <CheckIcon /> : <ClearIcon />}
						</TableCell>
						<TableCell>
							<Button variant='outlined' onClick={() => store.registerTeam(tnr.id, !tnr.registered)}>
								{tnr.registered ? 'Снять с регистрации' : 'Зарегистрировать'}
							</Button>
						</TableCell>
					</TableRow>)}
				</TableBody>
			</Table>
		</Box>
	</Drawer>);
