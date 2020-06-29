import * as dayjs from 'dayjs';

import { BooleanPropertyDescriptor } from './BooleanPropertyDescriptor';
import { IPropertiesScheme } from './IPropertiesScheme';
import { IPropertyScheme } from './IPropertyScheme';
import { MaybeMomentPropertyDescriptor, MomentPropertyDescriptor } from './MomentPropertyDescriptor';
import { NestedPropertyDescriptor } from './NestedPropertyDescriptor';
import { MaybeNumberPropertyDescriptor, NumberPropertyDescriptor } from './NumberPropertyDescriptor';
import { MaybeSelectListPropertyDescriptor, SelectListPropertyDescriptor } from './SelectListPropertyDescriptor';
import { MaybeStringAutocompletePropertyDescriptor, StringAutocompletePropertyDescriptor } from './StringAutocompletePropertyDescriptor';
import {
	MaybeStringPropertyDescriptor,
	StringPropertyDescriptor
} from './StringPropertyDescriptor';
import { KeysOfType, SelectList } from './Types';

type Extend<TScheme, TKey extends string | number | symbol, TNew> = TScheme & {
	[K in TKey]: TNew;
};

export class SchemeBuilder<
	TModel,
	TKeys extends keyof TModel,
	TScheme> implements IPropertiesScheme<TModel, TKeys> {
	private constructor(
		scheme: TScheme,
		public readonly canEdit: ((model: TModel) => boolean) | null) {
		this.scheme = scheme;
		this.canEdit = canEdit;
	}

	public readonly scheme: TScheme;

	public maybeString<TKey extends KeysOfType<TModel, string | null>>(
		prop: Exclude<TKey, TKeys>,
		displayName: string,
		buildFunc?: (prop: MaybeStringPropertyDescriptor<TModel, TKey>) => void) {
		const property = new MaybeStringPropertyDescriptor<TModel, TKey>(prop, displayName);
		if (buildFunc) {
			buildFunc(property);
		}
		return this.with<TKey, typeof property>(property);
	}

	public string<TKey extends KeysOfType<TModel, string>>(
		prop: Exclude<TKey, TKeys>,
		displayName: string,
		buildFunc?: (prop: StringPropertyDescriptor<TModel, TKey>) => void) {
		const property = new StringPropertyDescriptor<TModel, TKey>(prop, displayName);
		if (buildFunc) {
			buildFunc(property);
		}
		return this.with<TKey, typeof property>(property);
	}

	public maybeNumber<TKey extends KeysOfType<TModel, number | null>>(
		prop: Exclude<TKey, TKeys>,
		displayName: string,
		buildFunc?: (prop: MaybeNumberPropertyDescriptor<TModel, TKey>) => void) {
		const property = new MaybeNumberPropertyDescriptor<TModel, TKey>(prop, displayName);
		if (buildFunc) {
			buildFunc(property);
		}
		return this.with<TKey, typeof property>(property);
	}

	public number<TKey extends KeysOfType<TModel, number>>(
		prop: Exclude<TKey, TKeys>,
		displayName: string,
		buildFunc?: (prop: NumberPropertyDescriptor<TModel, TKey>) => void) {
		const property = new NumberPropertyDescriptor<TModel, TKey>(prop, displayName);
		if (buildFunc) {
			buildFunc(property);
		}
		return this.with<TKey, typeof property>(property);
	}

	public boolean<TKey extends KeysOfType<TModel, boolean>>(
		prop: Exclude<TKey, TKeys>,
		displayName: string,
		buildFunc?: (prop: BooleanPropertyDescriptor<TModel, TKey>) => void) {
		const property = new BooleanPropertyDescriptor<TModel, TKey>(prop, displayName);
		if (buildFunc) {
			buildFunc(property);
		}
		return this.with<TKey, typeof property>(property);
	}

	public moment<TKey extends KeysOfType<TModel, dayjs.Dayjs>>(
		prop: Exclude<TKey, TKeys>,
		displayName: string,
		buildFunc?: (prop: MomentPropertyDescriptor<TModel, TKey>) => void) {
		const property = new MomentPropertyDescriptor<TModel, TKey>(prop, displayName);
		if (buildFunc) {
			buildFunc(property);
		}
		return this.with<TKey, typeof property>(property);
	}

	public maybeMoment<TKey extends KeysOfType<TModel, dayjs.Dayjs | null>>(
		prop: Exclude<TKey, TKeys>,
		displayName: string,
		buildFunc?: (prop: MaybeMomentPropertyDescriptor<TModel, TKey>) => void) {
		const property = new MaybeMomentPropertyDescriptor<TModel, TKey>(prop, displayName);
		if (buildFunc) {
			buildFunc(property);
		}
		return this.with<TKey, typeof property>(property);
	}

	public nested<
		TKey extends Exclude<keyof TModel, TKeys>,
		TInnerKeys extends keyof NonNullable<TModel[TKey]>,
		TInnerScheme>(
		prop: TKey,
		displayName: string,
		schemeBuilder: (scheme: SchemeBuilder<NonNullable<TModel[TKey]>, never, {}>) => SchemeBuilder<NonNullable<TModel[TKey]>, TInnerKeys, TInnerScheme>) {
		const scheme = SchemeBuilder.for<NonNullable<TModel[TKey]>>();

		const property = new NestedPropertyDescriptor<
			TModel,
			TKey,
			TInnerKeys,
			TInnerScheme,
			SchemeBuilder<NonNullable<TModel[TKey]>, TInnerKeys, TInnerScheme>>(
				prop,
				displayName,
				schemeBuilder(scheme));

		return this.with<TKey, typeof property>(property);
	}

	public select<
		TValue extends string | number | boolean | string[] | boolean | undefined,
		TKey extends KeysOfType<TModel, TValue>,
		TDisplayKeys extends string>(
		prop: Exclude<TKey, TKeys>,
		displayName: string,
		selectList: SelectList<TDisplayKeys, TValue>) {
		const property = new SelectListPropertyDescriptor<TModel, TValue, TKey, TDisplayKeys>(
			prop,
			displayName,
			selectList);

		return this.with<TKey, typeof property>(property);
	}

	public maybeSelect<
		TValue extends string | number | boolean | string[] | undefined,
		TKey extends KeysOfType<TModel, TValue | null>,
		TDisplayKeys extends string>(
		prop: Exclude<TKey, TKeys>,
		displayName: string,
		selectList: SelectList<TDisplayKeys, TValue | null>) {
		const property = new MaybeSelectListPropertyDescriptor<TModel, TValue | null, TKey, TDisplayKeys>(
			prop,
			displayName,
			selectList);

		return this.with<TKey, typeof property>(property);
	}

	public stringAutocomplete<TKey extends KeysOfType<TModel, string>>(
		prop: Exclude<TKey, TKeys>,
		displayName: string,
		selectList: SelectList<string, string>
	) {
		const property = new StringAutocompletePropertyDescriptor<TModel, TKey>(
			prop,
			displayName,
			selectList);

		return this.with<TKey, typeof property>(property);
	}

	public maybeStringAutocomplete<TKey extends KeysOfType<TModel, string | null>>(
		prop: Exclude<TKey, TKeys>,
		displayName: string,
		selectList: SelectList<string, string>
	) {
		const property = new MaybeStringAutocompletePropertyDescriptor<TModel, TKey>(
			prop,
			displayName,
			selectList);

		return this.with<TKey, typeof property>(property);
	}

	public with<TNewKey extends keyof TModel, TProperty extends IPropertyScheme<TModel, TNewKey>>(
		propertyProducer: TProperty) {
		const newScheme = this.asScheme<TNewKey, TProperty>(propertyProducer);
		const scheme: any = {
			...this.scheme,
			...newScheme
		};

		return new SchemeBuilder<
			TModel, TKeys | TNewKey, Extend<TScheme, TNewKey, TProperty>>(scheme, this.canEdit);
	}

	public canEditWhen(canEdit: (model: TModel) => boolean) {
		return new SchemeBuilder<TModel, TKeys, TScheme>(this.scheme, canEdit);
	}

	private asScheme = <
		TNewKey extends keyof TModel,
		TProperty extends IPropertyScheme<TModel, TNewKey>>(propertyProducer: TProperty) => {
		return {
			[propertyProducer.propertyName]: propertyProducer
		} as { [key in TNewKey]: TProperty };
	};

	public static for = <TModel>() => {
		return new SchemeBuilder<TModel, never, {}>({}, null);
	};

	public get properties(): IPropertyScheme<TModel, TKeys>[] {
		return Object.values(this.scheme);
	}
}