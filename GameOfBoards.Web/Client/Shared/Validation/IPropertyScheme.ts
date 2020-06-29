import { IProperty } from './IProperty';
import { EmptyObject } from './Types';

export interface IPropertyScheme<TModel, TKey extends keyof TModel> {
	/**
	 * Порождает из этой схемы свойства редактируемое свойство (для существующей или пустой модели).
	 */
	toProperty: (model: TModel | EmptyObject) => IProperty<TModel, TKey>;
	propertyName: TKey;
	displayName: string;
}