import { Modal, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import chunk from 'lodash-es/chunk';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { Centerer } from '../../../Layout/Centerer';
import { Store } from './Store';

type LeaderboardEntry = {
	name: string;
	place: number;
	total: number;
};

export const ScoringTablePopup = observer(({ store }: { store: Store }) => {
	const halfLength = Math.ceil(store.leaderboard.length / 2);
	const chunks = store.leaderboard.length < 9
		? [store.leaderboard]
		: chunk(store.leaderboard, halfLength);

	return <Modal
		open={store.scoringTableOpen}
		onClose={() => store.scoringTableOpen = false}>
		<Centerer>
			<Backdrop>
				{chunks.map((x, idx) => <LeaderboardTable entries={x} key={idx} />)}
			</Backdrop>
		</Centerer>
	</Modal>;
});

const LeaderboardTable = observer(({ entries }: { entries: LeaderboardEntry[] }) => <WhiteTable>
	<TableHead>
		<TableRow style={{ backgroundColor: '#213c5e' }}>
			<TableCell><Typography variant='h6' style={{ color: 'white' }}>Место</Typography></TableCell>
			<TableCell><Typography variant='h6' style={{ color: 'white' }}>Название команды</Typography></TableCell>
			<TableCell><Typography variant='h6' style={{ color: 'white' }}>Баллы</Typography></TableCell>
		</TableRow>
	</TableHead>
	<TableBody>
		{entries.map((team, idx) => <TableRow key={team.name} style={{ backgroundColor: idx % 2 === 0 ? '#5e708c' : '#8b99ac', color: '#fff' }}>
			<TableCell><Typography variant='h6' style={{ color: 'white' }}>{team.place}</Typography></TableCell>
			<TableCell><Typography variant='h6' style={{ color: 'white' }}>{team.name}</Typography></TableCell>
			<TableCell align='right'><Typography variant='h6' style={{ color: 'white' }}>{team.total}</Typography></TableCell>
		</TableRow>)}
	</TableBody>
</WhiteTable>);

export const Backdrop = styled(Paper)`
	min-height: 90%;
	max-height: 90%;
	display: flex;
	padding: 20px
`;

export const WhiteTable = styled(Table)`
	color: white;
	margin-left: 16px;
	:first-of-type {
		margin-left: 0px;
	}
`;