import { IconButton, TableCell, TableRow } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { SchemeBuilder } from '@Shared/Validation/SchemeBuilder';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ReactNode } from 'react';

import { TableDisplayFor } from './TableDisplayFor';

type DisplayRowProps<TModel, TKeys extends keyof TModel, TScheme> = {
	scheme: SchemeBuilder<TModel, TKeys, TScheme>;
	entity: TModel;
	onEdit: () => void;
	canEdit: boolean;
	customCell?: (m: TModel) => ReactNode;
	onDelete?: (m: TModel) => void;
};

@observer
export class DisplayRow<TModel, TKeys extends keyof TModel, TScheme>
	extends React.Component<DisplayRowProps<TModel, TKeys, TScheme>> {
	render() {
		const { scheme, entity, onEdit, customCell, canEdit, onDelete } = this.props;
		return <TableRow>
			{scheme.properties.map(s => <TableDisplayFor
				property={s}
				model={entity}
				key={s.propertyName.toString()} />)}
			{customCell && <TableCell>
				{customCell(entity)}
			</TableCell>}
			<TableCell>
				{canEdit && <IconButton
					onClick={onEdit}>
					<CreateIcon />
				</IconButton>}
				{onDelete && <IconButton
					onClick={() => onDelete(entity)}>
					<DeleteIcon />
				</IconButton>}
			</TableCell>
		</TableRow>;
	}
}
