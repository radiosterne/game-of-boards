import { Button, Grid, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { NestedPropertyDescriptor } from '@Shared/Validation/NestedPropertyDescriptor';
import { SchemeBuilder } from '@Shared/Validation/SchemeBuilder';
import { EmptyObject } from '@Shared/Validation/Types';
import { ValidationContext } from '@Shared/Validation/ValidationContext';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { DisplayRow } from './DisplayRow';
import { EditRow } from './EditRow';

type TableEditorProps<TModel, TKeys extends keyof TModel, TScheme> = {
	scheme: SchemeBuilder<TModel, TKeys, TScheme>;
	entities: TModel[];
	onSubmit: (context: ValidationContext<TModel, TKeys, TScheme>) => void;
	customCell?: {
		title: string;
		render: (m: TModel) => ReactNode;
	};
	canCreate: boolean;
	createText?: string;
	createAtTheTop?: boolean;
	onDelete?: (m: TModel) => void;
};

@observer
export class TableEditor<TModel, TKeys extends keyof TModel, TScheme>
	extends React.Component<TableEditorProps<TModel, TKeys, TScheme>> {
	@observable
	private editingIndex: number | null = null;

	@observable
	public creating = false;

	constructor(props: TableEditorProps<TModel, TKeys, TScheme>) {
		super(props);
	}

	render() {
		const { scheme, entities, canCreate, createAtTheTop, onDelete } = this.props;
		return <Grid container>
			{canCreate && createAtTheTop && <RightGrid item xs={12}>
				<ButtonWithBottomMargin
					variant='outlined'
					color='primary'
					onClick={() => this.creating = true}>
					{this.props.createText || 'Создать'}
				</ButtonWithBottomMargin>
			</RightGrid>}
			<ScrollableGrid item xs={12}>
				<Table>
					<TableHead>
						<TableRow>
							{scheme.properties
								.map(this.headersForProperty)
								.reduce((l, r) => l.concat(r), [])}
							{this.props.customCell && <TableCell>
								{this.props.customCell.title}
							</TableCell>}
							<TableCell />
						</TableRow>
					</TableHead>
					<TableBody>
						{this.creating && createAtTheTop && <EditRow
							entity={EmptyObject.instance}
							scheme={scheme}
							onEdit={(ctx) => {
								this.props.onSubmit(ctx);
								this.creating = false;
							}}
							showCustomCell={!!this.props.customCell}
							onCancel={() => this.creating = false} />}
						{entities.map((e, idx) =>
							this.editingIndex === idx
								? <EditRow
									entity={e}
									scheme={scheme}
									onEdit={(ctx) => {
										this.props.onSubmit(ctx);
										this.editingIndex = null;
									}}
									onCancel={() => this.editingIndex = null}
									showCustomCell={!!this.props.customCell}
									key={idx} />
								: <DisplayRow
									entity={e}
									scheme={scheme}
									onEdit={() => this.editingIndex = idx}
									canEdit={!this.props.scheme.canEdit || this.props.scheme.canEdit(e)}
									customCell={this.props.customCell && this.props.customCell.render}
									onDelete={onDelete}
									key={idx} />)}
						{this.creating && !createAtTheTop && <EditRow
							entity={EmptyObject.instance}
							scheme={scheme}
							onEdit={(ctx) => {
								this.props.onSubmit(ctx);
								this.creating = false;
							}}
							showCustomCell={!!this.props.customCell}
							onCancel={() => this.creating = false} />}
					</TableBody>
				</Table>
			</ScrollableGrid>
			{this.props.canCreate && !createAtTheTop && <RightGrid item xs={12}>
				<ButtonWithTopMargin
					variant='outlined'
					color='primary'
					onClick={() => this.creating = true}>
					{this.props.createText || 'Создать'}
				</ButtonWithTopMargin>
			</RightGrid>}
		</Grid>;
	}

	private headersForProperty = (property: { displayName: string }): JSX.Element[] =>
		property instanceof NestedPropertyDescriptor
			? property.innerProperties
				.map(prop => this.headersForProperty(prop))
				.reduce((l, r) => l.concat(r), [])
			: [<TableCell key={property.displayName}>{property.displayName}</TableCell>];
}

const ButtonWithTopMargin = styled(Button)`
	margin-top: ${props => props.theme.spacing(1)}px;
`;

const ButtonWithBottomMargin = styled(Button)`
	margin-bottom: ${props => props.theme.spacing(1)}px;
`;

const RightGrid = styled(Grid)`
	text-align: right;
`;

const ScrollableGrid = styled(Grid)`
	overflow-x: scroll;
`;