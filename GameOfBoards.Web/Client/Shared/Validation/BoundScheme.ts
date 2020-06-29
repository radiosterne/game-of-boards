import { IPropertyScheme } from './IPropertyScheme';

type BoundPropertyFor<T> =
	T extends IPropertyScheme<any, any>
	? ReturnType<T['toProperty']>
	: never;

export type BoundSchemeFor<TScheme> = {
	[Key in keyof TScheme]:	BoundPropertyFor<TScheme[Key]>
};

export type PartialModelFor<TModel, TKeys extends keyof TModel> = {
	[Key in TKeys]: TModel[Key]
};