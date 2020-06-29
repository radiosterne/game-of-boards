import { computed } from 'mobx';

import { BoundSchemeFor } from './BoundScheme';
import { IPropertiesScheme } from './IPropertiesScheme';
import { IProperty } from './IProperty';
import { IPropertyScheme } from './IPropertyScheme';
import { EmptyObject } from './Types';

export class NestedPropertyDescriptor<
	TModel,
	TProperty extends keyof TModel,
	TInnerKeys extends keyof NonNullable<TModel[TProperty]>,
	TInnerScheme,
	TInnerSchemeBuilder extends IPropertiesScheme<NonNullable<TModel[TProperty]>, TInnerKeys> & { scheme: TInnerScheme }>
implements IPropertyScheme<TModel, TProperty> {
	constructor(
		public readonly propertyName: TProperty,
		public readonly displayName: string,
		public readonly innerSchemeBuilder: TInnerSchemeBuilder) {
	}

	toProperty = (model: TModel | EmptyObject): NestedProperty<TModel, TProperty, TInnerKeys, TInnerScheme, TInnerSchemeBuilder> =>
		new NestedProperty<TModel, TProperty, TInnerKeys, TInnerScheme, TInnerSchemeBuilder>(model, this.propertyName, this);

	public get innerProperties(): IPropertyScheme<NonNullable<TModel[TProperty]>, keyof NonNullable<TModel[TProperty]>>[] {
		return this.innerSchemeBuilder.properties;
	}
}

export class NestedProperty<
	TModel,
	TProperty extends keyof TModel,
	TInnerKeys extends keyof NonNullable<TModel[TProperty]>,
	TInnerScheme,
	TInnerSchemeBuilder extends IPropertiesScheme<NonNullable<TModel[TProperty]>, TInnerKeys> & { scheme: TInnerScheme }>
implements IProperty<TModel, TProperty> {
	constructor(
		public readonly model: TModel | EmptyObject,
		public readonly propertyName: TProperty,
		public readonly descriptor: NestedPropertyDescriptor<TModel, TProperty, TInnerKeys, TInnerScheme, TInnerSchemeBuilder>) {
		const innerObject = EmptyObject.is(this.model)
			? EmptyObject.instance
			: (this.model[this.propertyName] || EmptyObject.instance);

		this.scheme = Object
			.entries(descriptor.innerSchemeBuilder.scheme)
			.reduce(
				(result, [key, value]) => Object.assign(result, { [key]: value.toProperty(innerObject) }),
				{}) as BoundSchemeFor<TInnerScheme>;
	}

	public readonly scheme: BoundSchemeFor<TInnerScheme>;

	public get innerProperties(): IProperty<NonNullable<TModel[TProperty]>, TInnerKeys>[] {
		return Object.values(this.scheme) as unknown as IProperty<NonNullable<TModel[TProperty]>, TInnerKeys>[];
	}

	validationMessage: string | null = null;

	@computed
	public get isValid() {
		return this.innerProperties
			.map(p => p.isValid)
			.reduce((l, r) => l && r);
	}

	@computed
	public get hasBeenUpdated() {
		return this.innerProperties
			.map(p => p.hasBeenUpdated)
			.reduce((l, r) => l || r);
	}

	@computed
	public get hasValidState() {
		return this.innerProperties
			.map(p => p.hasValidState)
			.reduce((l, r) => l && r);
	}

	public forceValidation() {
		this.innerProperties.forEach(p => p.forceValidation());
	}

	public get isReadonly() {
		return false;
	}
}
