import { observer } from 'mobx-react';
import * as React from 'react';

const version = '#{Octopus.Release.Number}';

export const Footer = observer(() =>
	<footer>
		<span>Вы работаете с GameOfBoards {version}</span>
	</footer>);