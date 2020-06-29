import { Checkbox, TableCell, Typography } from '@material-ui/core';
import { IPropertyScheme } from '@Shared/Validation/IPropertyScheme';
import { NestedPropertyDescriptor } from '@Shared/Validation/NestedPropertyDescriptor';
import { Property } from '@Shared/Validation/Property';
import { EmptyObject } from '@Shared/Validation/Types';
import { observer } from 'mobx-react';
import * as React from 'react';

type TableDisplayForProps<TModel, TKey extends keyof TModel> = {
	model: TModel;
	property: IPropertyScheme<TModel, TKey>;
};

@observer
export class TableDisplayFor<TModel, TKey extends keyof TModel>
	extends React.Component<TableDisplayForProps<TModel, TKey>> {
	render() {
		const { model, property } = this.props;

		const safeModel = model || EmptyObject.instance;
		if (Property.isStringDescriptor(property) || Property.isNumberDescriptor(property) || Property.isSelectListDescriptor(property) || Property.isMomentDescriptor(property)) {
			const modelValue = property.getFormattedValue(property.modelDisplayable(safeModel) as any);
			const postfix = typeof property.postfix === 'function'
				? property.postfix(safeModel)
				: property.postfix;
			return <TableCell>
				<Typography variant='body1'>
					{EmptyObject.is(modelValue) ? '' : modelValue} {postfix}
				</Typography>
			</TableCell>;
		}

		if (Property.isBooleanDescriptor(property)) {
			const modelValue = property.getFormattedValue(property.modelDisplayable(safeModel) as any);
			return <Checkbox
				checked={EmptyObject.is(modelValue) ? false : modelValue}
				value={EmptyObject.is(modelValue) ? false : modelValue}
				disabled />;
		}

		if (property instanceof NestedPropertyDescriptor) {
			const innerModel = model[property.propertyName as keyof TModel];
			return property.innerProperties
				.map(prop => <TableDisplayFor
					model={innerModel}
					property={prop}
					key={prop.displayName} />);
		}
		return null;
	}
}