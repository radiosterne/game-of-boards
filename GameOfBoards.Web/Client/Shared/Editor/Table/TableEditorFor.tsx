import DayJsUtils from '@date-io/dayjs';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, InputAdornment, TableCell, TextField } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers/MuiPickersUtilsProvider';
import { IProperty } from '@Shared/Validation/IProperty';
import { IPropertyDescriptor } from '@Shared/Validation/IPropertyDescriptor';
import { NestedProperty } from '@Shared/Validation/NestedPropertyDescriptor';
import { Property } from '@Shared/Validation/Property';
import { EmptyObject } from '@Shared/Validation/Types';
import * as dayjs from 'dayjs';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { KeyboardDatePickerWithMargin } from '../Common/KeyboardDatePickerWithMargin';
import { selectList } from '../Common/SelectList';

import { TableDisplayFor } from './TableDisplayFor';

type TableEditorForProps<TModel, TKeys extends keyof TModel> = {
	property: IProperty<TModel, TKeys>;
	rowHasErrors: boolean;
};

@observer
export class TableEditorFor<TModel, TKeys extends keyof TModel>
	extends React.Component<TableEditorForProps<TModel, TKeys>> {
	render() {
		const { property, rowHasErrors } = this.props;

		if (property instanceof NestedProperty) {
			return property.innerProperties
				.map(prop => <TableEditorFor
					property={prop}
					rowHasErrors={rowHasErrors}
					key={prop.propertyName} />);
		}

		if (property.isReadonly) {
			return EmptyObject.is(property.model)
				? <VerticallyAlignedTableCell />
				: <TableDisplayFor property={property.descriptor} model={property.model} />;
		}

		if (Property.isString(property) || Property.isNumber(property) || Property.isSelectList(property)) {
			const postfix = (property.descriptor as IPropertyDescriptor<TModel, any, any, TKeys>).postfix;
			return <VerticallyAlignedTableCell pullTop={rowHasErrors}>
				<TextField
					value={EmptyObject.is(property.displayValue) ? '' : property.displayValue}
					onChange={evt => property.displayValue = evt.target.value}
					error={!property.hasValidState}
					helperText={property.validationMessage}
					select={Property.isSelectList(property)}
					InputProps={{
						endAdornment: postfix ? <InputAdornment position='end'>{postfix}</InputAdornment> : undefined
					}}
					inputProps={{
						style: { textAlign: Property.isNumber(property) ? 'right' : 'left' }
					}}
				>
					{selectList(property)}
				</TextField>
			</VerticallyAlignedTableCell>;
		}

		if (Property.isBoolean(property)) {
			if (EmptyObject.is(property.displayValue)){
				property.displayValue = false;
			}
			return <FormControlWithMargin error={!property.hasValidState} className={property.descriptor.propertyName as string}>
				<FormGroup>
					<FormControlLabel
						control={
							<Checkbox
								checked={property.displayValue}
								onChange={evt => property.displayValue = evt.target.checked}
								value={property.displayValue}
								color='primary' />
						}
						label={property.descriptor.displayName}/>
				</FormGroup>
				<FormHelperText>{property.validationMessage}</FormHelperText>
			</FormControlWithMargin>;
		}

		if (Property.isMoment(property)) {
			return <VerticallyAlignedTableCell pullTop={rowHasErrors}>
				<MuiPickersUtilsProvider
					utils={DayJsUtils}
					locale={dayjs.locale('ru')}>
					<KeyboardDatePickerWithMargin
						disableToolbar
						variant='inline'
						format='DD.MM.YYYY'
						margin='normal'
						value={EmptyObject.is(property.displayValue) ? '' : property.displayValue}
						onChange={evt => property.displayValue = evt === null ? EmptyObject.instance : evt}
						error={!property.hasValidState}
						label={property.descriptor.displayName}
						helperText={property.validationMessage}
						KeyboardButtonProps={{
							'aria-label': 'change date',
						}}
					/>
				</MuiPickersUtilsProvider>
			</VerticallyAlignedTableCell>;
		}

		return null;
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VerticallyAlignedTableCell = styled(({ pullTop, ...other }) => <TableCell {...other} />) <{ pullTop: boolean }>`
	vertical-align: ${props => props.pullTop ? 'top' : 'inherit'};
`;

const FormControlWithMargin = styled(FormControl)`
	margin: ${props => props.theme.spacing(1)}px;
`;