import { IconButton, TableCell, TableRow } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import { SchemeBuilder } from '@Shared/Validation/SchemeBuilder';
import { EmptyObject } from '@Shared/Validation/Types';
import { ValidationContext } from '@Shared/Validation/ValidationContext';
import { observer } from 'mobx-react';
import * as React from 'react';

import { TableEditorFor } from './TableEditorFor';

type EditRowProps<TModel, TKeys extends keyof TModel, TScheme> = {
	scheme: SchemeBuilder<TModel, TKeys, TScheme>;
	entity: TModel | EmptyObject;
	onEdit: (context: ValidationContext<TModel, TKeys, TScheme>) => void;
	onCancel: () => void;
	showCustomCell: boolean;
};

@observer
export class EditRow<TModel, TKeys extends keyof TModel, TScheme>
	extends React.Component<EditRowProps<TModel, TKeys, TScheme>> {
	constructor(props: EditRowProps<TModel, TKeys, TScheme>) {
		super(props);
		this.validationContext = new ValidationContext(props.entity, props.scheme);
	}

	render() {
		const rowHasErrors = !this.validationContext.properties
			.map(prop => prop.isValid)
			.reduce((l, r) => l && r);

		return <TableRow>
			{this.validationContext.properties
				.map(prop => <TableEditorFor
					rowHasErrors={rowHasErrors}
					property={prop}
					key={prop.propertyName.toString()} />)}
			{this.props.showCustomCell && <TableCell/>}
			<TableCell>
				<IconButton
					disabled={rowHasErrors}
					onClick={() => {
						this.validationContext.forceValidation();
						if(this.validationContext.isValid) {
							this.props.onEdit(this.validationContext);
						}
					}}>
					<CheckIcon />
				</IconButton>
				<IconButton onClick={() => this.props.onCancel()}>
					<CancelIcon />
				</IconButton>
			</TableCell>
		</TableRow>;
	}

	private readonly validationContext: ValidationContext<TModel, TKeys, TScheme>;
}
