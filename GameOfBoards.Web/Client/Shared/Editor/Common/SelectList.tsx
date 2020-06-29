import { MenuItem } from '@material-ui/core';
import { IProperty } from '@Shared/Validation/IProperty';
import { Property } from '@Shared/Validation/Property';
import { SelectListPropertyDescriptor } from '@Shared/Validation/SelectListPropertyDescriptor';
import * as React from 'react';

/**
 * Закон Божий гласит, что это должен бы быть SFC. Но это не он, потому что так не работает из-за ref'а.
 */
export const selectList = <TModel, TKeys extends keyof TModel>(property: IProperty<TModel, TKeys>) => {
	if (!Property.isSelectList(property)) {
		return null;
	}

	const descriptor = property.descriptor as SelectListPropertyDescriptor<TModel, any, any, string>;

	return descriptor.keys().map(option => (
		<MenuItem key={option} value={option}>
			{option}
		</MenuItem>
	));
};