import { PropertyDescriptor } from './PropertyDescriptor';
import { KeysOfType, SelectList } from './Types';

export class StringAutocompletePropertyDescriptor<TModel,
	TProperty extends KeysOfType<TModel, string>>
	extends PropertyDescriptor<TModel, string, TProperty, string> {

	constructor(
		propertyName: TProperty,
		displayName: string,
		private readonly autocompleteList: SelectList<string, string>) {
		super(propertyName, displayName);
	}

	protected convertToDisplayable = (val: string) => val;
	protected convertToValue = (key: string) => key;

	public getAutocompleteList = () => typeof this.autocompleteList === 'function' ? this.autocompleteList() : this.autocompleteList;
}

export class MaybeStringAutocompletePropertyDescriptor<TModel,
	TProperty extends KeysOfType<TModel, string | null>>
	extends PropertyDescriptor<TModel, string | null, TProperty, string | null> {

	constructor(
		propertyName: TProperty,
		displayName: string,
		private readonly autocompleteList: SelectList<string, string>) {
		super(propertyName, displayName);
	}

	protected convertToDisplayable = (val: string | null) => val;
	protected convertToValue = (key: string | null) => key;

	public getAutocompleteList = () => typeof this.autocompleteList === 'function' ? this.autocompleteList() : this.autocompleteList;
}