import { computed, observable } from 'mobx';

import { BoundSchemeFor, PartialModelFor } from './BoundScheme';
import { IProperty } from './IProperty';
import { SchemeBuilder } from './SchemeBuilder';
import { EmptyObject } from './Types';

export type ContextFor<T> = T extends SchemeBuilder<infer TModel, infer TKeys, infer TScheme>
	? ValidationContext<TModel, TKeys, TScheme>
	: never;

export class ValidationContext<TModel, TKeys extends keyof TModel, TScheme> {
	constructor(
		public readonly model: TModel | EmptyObject,
		private readonly schemeBuilder: SchemeBuilder<TModel, TKeys, TScheme>
	) {
		this.reset();
	}

	public get properties(): IProperty<TModel, TKeys>[] {
		return Object.values(this.scheme) as IProperty<TModel, TKeys>[];
	}

	@observable
	public scheme!: BoundSchemeFor<TScheme>;

	@computed
	public get isValid() {
		return this.properties
			.map(prop => prop.isValid)
			.reduce((l, r) => l && r);
	}

	public forceValidation() {
		this.properties.forEach(prop => prop.forceValidation());
	}

	@computed
	public get state(): PartialModelFor<TModel, TKeys> {
		return (Object.values(this.scheme) as { propertyName: string, modelValue: unknown }[])
			.reduce(
				(result, prop) => Object.assign(result, { [prop.propertyName]: prop.modelValue }),
				{}) as PartialModelFor<TModel, TKeys>;
	}

	public reset() {
		this.scheme = Object
			.entries(this.schemeBuilder.scheme)
			.reduce(
				(result, [key, value]) => Object.assign(result, { [key]: value.toProperty(this.model) }),
				{}) as BoundSchemeFor<TScheme>;
	}
}