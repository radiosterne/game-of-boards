import { PropertyDescriptor } from './PropertyDescriptor';
import { KeysOfType } from './Types';

abstract class BaseBooleanPropertyDescriptor<TModel, TValue extends boolean, TProperty extends KeysOfType<TModel, TValue>>
	extends PropertyDescriptor<TModel, TValue, TProperty, boolean> {
	constructor(
		propertyName: TProperty,
		displayName: string
	) {
		super(propertyName, displayName);
	}

	protected convertToDisplayable = (value: boolean) =>
		value !== null ? value : false;

	notNullOrNaN = () =>
		this.addValidator(val => val === false ? 'Обязательное поле' : null);
}

export class BooleanPropertyDescriptor <TModel, TProperty extends KeysOfType<TModel, boolean>>
	extends BaseBooleanPropertyDescriptor<TModel, boolean, TProperty> {
	protected convertToValue = (value: boolean) => value;
}