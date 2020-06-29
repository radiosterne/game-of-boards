import { IPropertyScheme } from './IPropertyScheme';
import { EmptyObject } from './Types';

export interface IProperty<TModel, TKey extends keyof TModel> {
	readonly propertyName: TKey;
	readonly validationMessage: string | null;
	readonly isValid: boolean;
	readonly hasValidState: boolean;
	readonly hasBeenUpdated: boolean;
	readonly descriptor: IPropertyScheme<TModel, TKey>;
	readonly isReadonly: boolean;
	readonly model: TModel | EmptyObject;
	forceValidation: () => void;
}

export interface IDisplayableProperty<TModel, TKey extends keyof TModel, TDisplayable>
	extends IProperty<TModel, TKey> {
	displayValue: TDisplayable | EmptyObject;
}