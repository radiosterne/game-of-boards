import { IPropertyDescriptor } from './IPropertyDescriptor';
import { Property } from './Property';
import { CleanerError, CleanerFunc, EmptyObject, Endomorphism,  FormatterFunc, KeysOfType, ToDisplayable, ToValueType, ValidatorFunc } from './Types';

/**
 * Базовый класс свойства модели, отвязанное от конкретного экземпляра модели.
 *
 * @export
 * @abstract
 * @class PropertyDescriptor
 * @implements {IPropertyDescriptor<TModel, TValue, TDisplayable, TProperty>}
 * @template TModel Тип модели.
 * @template TValue Тип значения, хранимого в модели.
 * @template TProperty Строковый тип свойства модели.
 * @template TDisplayable Тип отформатированного (и редактируемого) значения.
 */
export abstract class PropertyDescriptor<
	TModel,
	TValue,
	TProperty extends KeysOfType<TModel, TValue>,
	TDisplayable> implements IPropertyDescriptor<TModel, TValue, TDisplayable, TProperty> {
	constructor(
		public readonly propertyName: TProperty,
		public readonly displayName: string
	) { }

	public modelDisplayable = (model: TModel | EmptyObject) =>
		EmptyObject.is(model) ? model : this.convertToDisplayable(this.getterConverter(model[this.propertyName] as unknown as TValue));

	public getFormattedValue = (value: TDisplayable | EmptyObject) =>
		EmptyObject.is(value) ? value : this.formatters.reduce((prev, c) => c(prev), value);

	public getEditableValue = (display: TDisplayable) =>
		this.cleaners.reduce((prev, c) => CleanerError.is(prev) ? prev : c(prev), display);

	public getModelValue = (value: TDisplayable) =>
		this.setterConverter(this.convertToValue(value));

	public validate(value: TDisplayable) {
		const modelValue = this.convertToValue(value);
		for(const validatorFunc of this.validators) {
			const validatorFuncResult = validatorFunc(modelValue);
			if(validatorFuncResult !== null) {
				return validatorFuncResult;
			}
		}

		return null;
	}

	protected addValidator(newFunc: ValidatorFunc<TValue>) {
		this.validators.push(newFunc);
		return this;
	}

	protected addFormatter(newFunc: FormatterFunc<TDisplayable>) {
		this.formatters.push(newFunc);
		return this;
	}

	protected addCleaner(newFunc: CleanerFunc<TDisplayable>) {
		this.cleaners = [newFunc].concat(this.cleaners);
		return this;
	}

	public defaultValue: TDisplayable | EmptyObject = EmptyObject.instance;
	public isReadonly = false;
	public postfix: string | ((model: TModel | EmptyObject) => string) | undefined = undefined;
	private validators: ValidatorFunc<TValue>[] = [];
	private cleaners: CleanerFunc<TDisplayable>[] = [];
	private formatters: FormatterFunc<TDisplayable>[] = [];
	private setterConverter: Endomorphism<TValue> = x => x;
	private getterConverter: Endomorphism<TValue> = x => x;

	protected abstract convertToDisplayable: ToDisplayable<TValue, TDisplayable>;
	protected abstract convertToValue: ToValueType<TValue, TDisplayable>;

	public toProperty = (model: TModel | EmptyObject): Property<TModel, TValue, TProperty, TDisplayable> =>
		new Property<TModel, TValue, TProperty, TDisplayable>(model, this);

	public default(val: TValue) {
		this.defaultValue = this.convertToDisplayable(val);
		return this;
	}

	public readonly() {
		this.isReadonly = true;
		return this;
	}

	public withPostfix(postfix: string | ((model: TModel | EmptyObject) => string)) {
		this.postfix = postfix;
		return this;
	}

	public withConverters = (getter: Endomorphism<TValue>, setter: Endomorphism<TValue>) => {
		this.setterConverter = setter;
		this.getterConverter = getter;
		return this;
	};
}