import { Checkbox, FormControl, FormControlLabel, FormGroup, InputAdornment } from '@material-ui/core';
import { IPropertyScheme } from '@Shared/Validation/IPropertyScheme';
import { NestedPropertyDescriptor } from '@Shared/Validation/NestedPropertyDescriptor';
import { Property } from '@Shared/Validation/Property';
import { EmptyObject } from '@Shared/Validation/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { FieldWithMargin } from '../Common/FieldWithMargin';

type SingleDisplayForProps<TModel, TKey extends keyof TModel> = {
	model: TModel;
	property: IPropertyScheme<TModel, TKey>;
	fullWidth?: boolean;
	disabled?: boolean;
	onInputClick?: () => any;
};

@observer
export class SingleDisplayFor<TModel, TKey extends keyof TModel>
	extends React.Component<SingleDisplayForProps<TModel, TKey>> {
	render() {
		const { model, property, disabled } = this.props;

		const safeModel = model || EmptyObject.instance;
		if (Property.isStringDescriptor(property) || Property.isNumberDescriptor(property) || Property.isSelectListDescriptor(property)) {
			const modelValue = property.getFormattedValue(property.modelDisplayable(safeModel) as any);
			const postfix = property.postfix;
			return <FieldWithMargin
				value={EmptyObject.is(modelValue) ? '' : modelValue}
				label={property.displayName}
				fullWidth={this.props.fullWidth}
				InputProps={{
					readOnly: true,
					disabled: disabled,
					endAdornment: postfix ? <InputAdornment position='end'>{postfix}</InputAdornment> : undefined
				}}
				className={property.propertyName as string}
				inputProps={{
					style: { textAlign: Property.isNumberDescriptor(property) ? 'right' : 'left' },
					onClick: this.props.onInputClick
				}}
			/>;
		}

		if (Property.isBooleanDescriptor(property)) {
			const modelValue = property.getFormattedValue(property.modelDisplayable(safeModel) as any);
			return <FormControlWithMargin className={property.propertyName as string}>
				<FormGroup>
					<FormControlLabel
						onClick={this.props.onInputClick}
						control={
							<Checkbox
								checked={EmptyObject.is(modelValue) ? false : modelValue}
								value={EmptyObject.is(modelValue) ? false : modelValue}
								disabled />
						}
						label={property.displayName}/>
				</FormGroup>
			</FormControlWithMargin>;
		}

		if (Property.isMomentDescriptor(property)) {
			const modelValue = property.getFormattedValue(property.modelDisplayable(safeModel) as any);
			const display = EmptyObject.is(modelValue) ? 'Не выбрано' : modelValue.format('YYYY-MM-DD');
			const postfix = property.postfix;
			return <FieldWithMargin
				value={display}
				label={property.displayName}
				fullWidth={this.props.fullWidth}
				InputProps={{
					readOnly: true,
					disabled: disabled,
					endAdornment: postfix ? <InputAdornment position='end'>{postfix}</InputAdornment> : undefined
				}}
				className={property.propertyName as string}
				inputProps={{
					style: { textAlign: Property.isNumberDescriptor(property) ? 'right' : 'left' },
					onClick: this.props.onInputClick
				}}
			/>;
		}

		if (property instanceof NestedPropertyDescriptor) {
			const innerModel = EmptyObject.is(safeModel) ? EmptyObject.instance : model[property.propertyName as keyof TModel];
			return property.innerProperties
				.map(prop => <SingleDisplayFor
					onInputClick={this.props.onInputClick}
					model={innerModel}
					property={prop}
					key={prop.displayName}
					fullWidth={this.props.fullWidth}
					disabled={disabled} />);
		}

		return null;
	}
}

const FormControlWithMargin = styled(FormControl)`
	margin: ${props => props.theme.spacing(1)}px;
`;