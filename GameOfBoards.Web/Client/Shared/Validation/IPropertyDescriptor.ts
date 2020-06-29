import { IPropertyScheme } from './IPropertyScheme';
import { CleanerError, EmptyObject } from './Types';

/**
 * Описание схемы свойства — т.е. для какого-то свойства какого-то класса рассказывает о том, как его отображать и редактировать.
 */
export interface IPropertyDescriptor<
	TModel,
	TValue,
	TDisplayable,
	TKey extends keyof TModel>
	extends IPropertyScheme<TModel, TKey> {
	/**
	 * По модели (или её отсутствию) возвращает редактируемое значение свойства.
	 *
	 * @memberof IPropertyDescriptor
	 */
	modelDisplayable: (model: TModel | EmptyObject) => TDisplayable | EmptyObject;

	/**
	 * По редактируемому представлению свойства порождает его отформатированное представление.
	 *
	 * @memberof IPropertyDescriptor
	 */
	getFormattedValue: (value: TDisplayable | EmptyObject) => TDisplayable | EmptyObject;

	/**
	 * По отформатированному представлению свойства порождает его редактируемое представление.
	 *
	 * @memberof IPropertyDescriptor
	 */
	getEditableValue: (value: TDisplayable) => TDisplayable | CleanerError;

	/**
	 * По редактируемому представлению свойства порождает его модельное значение.
	 *
	 * @memberof IPropertyDescriptor
	 */
	getModelValue: (value: TDisplayable) => TValue;

	/**
	 * По редактируемому представлению свойства утверждает о корректности такого значения для этого свойства.
	 *
	 * Валидность обзначается null'ом, в ином случае строка содержит ошибку валидации.
	 * @memberof IPropertyDescriptor
	 */
	validate: (value: TDisplayable) => string | null;

	readonly postfix: string | ((model: TModel | EmptyObject) => string) | undefined;
	readonly defaultValue: TDisplayable | EmptyObject;
	readonly isReadonly: boolean;
}