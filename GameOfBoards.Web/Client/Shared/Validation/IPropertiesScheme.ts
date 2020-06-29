import { IPropertyScheme } from './IPropertyScheme';

export interface IPropertiesScheme<TModel, TKeys extends keyof TModel> {
	properties: IPropertyScheme<TModel, TKeys>[];
}
