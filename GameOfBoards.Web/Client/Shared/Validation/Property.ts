import * as dayjs from 'dayjs';
import { computed, observable } from 'mobx';

import { BooleanPropertyDescriptor } from './BooleanPropertyDescriptor';
import { IDisplayableProperty, IProperty } from './IProperty';
import { IPropertyDescriptor } from './IPropertyDescriptor';
import { IPropertyScheme } from './IPropertyScheme';
import { MaybeMomentPropertyDescriptor, MomentPropertyDescriptor } from './MomentPropertyDescriptor';
import { MaybeNumberPropertyDescriptor, NumberPropertyDescriptor } from './NumberPropertyDescriptor';
import { MaybeSelectListPropertyDescriptor, SelectListPropertyDescriptor } from './SelectListPropertyDescriptor';
import {
	MaybeStringPropertyDescriptor,
	StringPropertyDescriptor
} from './StringPropertyDescriptor';
import { CleanerError, EmptyObject } from './Types';

export class Property<TModel, TValue, TKey extends keyof TModel, TDisplayable>
implements IDisplayableProperty<TModel, TKey, TDisplayable> {
	constructor(
		public model: TModel | EmptyObject,
		public readonly descriptor: IPropertyDescriptor<TModel, TValue, TDisplayable, TKey>) {
		const descriptorDefault = descriptor.defaultValue;
		this.value = EmptyObject.is(model)
			? descriptorDefault
			: descriptor.modelDisplayable(model);
	}

	public static isString = <TModel, TKey extends keyof TModel>
	(prop: IProperty<TModel, TKey>): prop is IDisplayableProperty<TModel, TKey, string> => {
		return Property.isStringDescriptor(prop.descriptor);
	};

	public static isStringDescriptor = <TModel, TKey extends keyof TModel>
	(descriptor: IPropertyScheme<TModel, TKey>): descriptor is IPropertyDescriptor<TModel, any, string, TKey> => {
		return descriptor instanceof StringPropertyDescriptor || descriptor instanceof MaybeStringPropertyDescriptor;
	};

	public static isNumber = <TModel, TKey extends keyof TModel>
	(prop: IProperty<TModel, TKey>): prop is IDisplayableProperty<TModel, TKey, number> => {
		return Property.isNumberDescriptor(prop.descriptor);
	};

	public static isNumberDescriptor = <TModel, TKey extends keyof TModel>
	(descriptor: IPropertyScheme<TModel, TKey>): descriptor is IPropertyDescriptor<TModel, any, number, TKey> => {
		return descriptor instanceof NumberPropertyDescriptor || descriptor instanceof MaybeNumberPropertyDescriptor;
	};

	public static isBoolean = <TModel, TKey extends keyof TModel>
	(prop: IProperty<TModel, TKey>): prop is IDisplayableProperty<TModel, TKey, boolean> => {
		return Property.isBooleanDescriptor(prop.descriptor);
	};

	public static isBooleanDescriptor = <TModel, TKey extends keyof TModel>
	(descriptor: IPropertyScheme<TModel, TKey>): descriptor is IPropertyDescriptor<TModel, any, boolean, TKey> => {
		return descriptor instanceof BooleanPropertyDescriptor;
	};

	public static isSelectListDescriptor = <TModel, TKey extends keyof TModel>(descriptor: IPropertyScheme<TModel, TKey>): descriptor is IPropertyDescriptor<TModel, any, string, TKey> => {
		return descriptor instanceof SelectListPropertyDescriptor || descriptor instanceof MaybeSelectListPropertyDescriptor;
	};

	public static isSelectList = <TModel, TKey extends keyof TModel>
	(prop: IProperty<TModel, TKey>): prop is IDisplayableProperty<TModel, TKey, string> => {
		return Property.isSelectListDescriptor(prop.descriptor);
	};

	public static isMoment = <TModel, TKey extends keyof TModel>
	(prop: IProperty<TModel, TKey>): prop is IDisplayableProperty<TModel, TKey, dayjs.Dayjs> => {
		return Property.isMomentDescriptor(prop.descriptor);
	};

	public static isMomentDescriptor = <TModel, TKey extends keyof TModel>
	(descriptor: IPropertyScheme<TModel, TKey>): descriptor is IPropertyDescriptor<TModel, any, dayjs.Dayjs, TKey> => {
		return descriptor instanceof MomentPropertyDescriptor || descriptor instanceof MaybeMomentPropertyDescriptor;
	};

	@observable
	private value: TDisplayable | EmptyObject;

	@observable
	public hasBeenUpdated = false;

	@observable
	private validationForced = false;

	@computed
	public get modelValue() {
		if (EmptyObject.is(this.value)) {
			throw 'never';
		}

		return this.descriptor.getModelValue(this.value);
	}

	@computed
	public get displayValue() {
		return EmptyObject.is(this.value)
			? EmptyObject.instance
			: this.descriptor.getFormattedValue(this.value);
	}

	public set displayValue(value: TDisplayable | EmptyObject) {
		this.hasBeenUpdated = true;
		if(EmptyObject.is(value)) {
			this.value = value;
		}
		else {
			const rawValue = this.descriptor.getEditableValue(value);
			if(!CleanerError.is(rawValue)) {
				this.value = rawValue;
			}
		}
	}

	public get propertyName() {
		return this.descriptor.propertyName;
	}

	@computed
	public get hasValidState() {
		if (!this.hasBeenUpdated && !this.validationForced) {
			return true;
		}

		return this.isValid;
	}

	@computed
	public get isValid() {
		return this.isReadonly
			? true
			: EmptyObject.is(this.value)
				? false
				: this.descriptor.validate(this.value) === null;
	}

	@computed
	public get validationMessage() {
		return EmptyObject.is(this.value)
			? null
			: this.descriptor.validate(this.value);
	}

	public get isReadonly() {
		return this.descriptor.isReadonly;
	}

	forceValidation() {
		this.validationForced = true;
	}
}