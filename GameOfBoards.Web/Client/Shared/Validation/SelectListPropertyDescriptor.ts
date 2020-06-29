import { PropertyDescriptor } from './PropertyDescriptor';
import { KeysOfType, SelectList } from './Types';

export class SelectListPropertyDescriptor<TModel,
	TValue,
	TProperty extends KeysOfType<TModel, TValue>,
	TKeys extends string>
	extends PropertyDescriptor<TModel, TValue, TProperty, TKeys> {

	constructor(
		propertyName: TProperty,
		displayName: string,
		private readonly selectList: SelectList<TKeys, TValue>) {
		super(propertyName, displayName);
	}

	protected convertToDisplayable = (val: TValue) => this.keys().find(key => this.getSelectList()[key] === val)!;
	protected convertToValue = (key: TKeys) => this.getSelectList()[key];

	public keys = () => Object.keys(this.getSelectList()) as TKeys[];

	private getSelectList = () => typeof this.selectList === 'function' ? this.selectList() : this.selectList;
}

export class MaybeSelectListPropertyDescriptor<TModel,
	TValue,
	TProperty extends KeysOfType<TModel, TValue | null>,
	TKeys extends string>
	extends PropertyDescriptor<TModel, TValue | null, TProperty, string> {

	constructor(
		propertyName: TProperty,
		displayName: string,
		private readonly selectList: SelectList<TKeys, TValue>) {
		super(propertyName, displayName);
	}

	protected convertToDisplayable = (val: TValue | null) => val === null ? '' : this.keys().find(key => this.getSelectList()[key] === val)!;
	protected convertToValue = (key: TKeys) => this.getSelectList()[key];

	public keys = () => Object.keys(this.getSelectList()) as TKeys[];

	private getSelectList = () => typeof this.selectList === 'function' ? this.selectList() : this.selectList;
}