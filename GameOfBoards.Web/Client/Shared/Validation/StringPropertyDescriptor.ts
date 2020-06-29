import proschet from 'proschet';

import { PropertyDescriptor } from './PropertyDescriptor';
import { KeysOfType } from './Types';

abstract class BaseStringPropertyDescriptor<TModel, TValue extends string | null, TProperty extends KeysOfType<TModel, TValue>>
	extends PropertyDescriptor<TModel, TValue, TProperty, string> {

	protected convertToDisplayable = (value: string | null) => value || '';

	formatAsPhone() {
		this.addValidator((val) => {
			return val && val.length === 12
				? null
				: 'Введите телефон полностью';
		});

		this.addCleaner((value) => {
			return '+' + value
				.replace(/\D/g, '')
				.substr(0, 11);
		});

		return this.addFormatter((value) => {
			let mask = '';

			if(value)
			{
				mask = '+X (XXX) XXX-XX-XX';
				let lastIndex = -1;

				for(const char of value) {
					if(char === '+') {
						continue;
					}
					lastIndex = mask.indexOf('X');
					mask = mask.substr(0, lastIndex) + char + mask.substr(lastIndex + 1);
				}

				mask = mask.substr(0, lastIndex + 1);
			}

			return mask;
		});
	}

	length = (firstBoundary: number, secondBoundary?: number) =>
		this.addValidator(StringPropertyDescriptor.lengthValidator(firstBoundary, secondBoundary));

	lengthOrNull(firstBoundary: number, secondBoundary?: number) {
		const baseValidator = StringPropertyDescriptor.lengthValidator(firstBoundary, secondBoundary);
		this.addValidator(val => val === null ? null : baseValidator(val));
		return this;
	}

	notNullOrEmpty = () =>
		this.addValidator(val => (val && val.length > 0) ? null : 'Не может быть пустым');

	notWhitespace = () =>
		this.addValidator(val => val !== null && val.match(/^\s+$/) !== null ? 'Не может быть пустым' : null);

	email = () =>
		this.addValidator(val => val === null || (val.length > 3 && val.indexOf('@') >= 0) ? null : 'Невалидный e-mail');

	private static lengthValidator = (leftBoundary: number, rightBoundary?: number) =>
		rightBoundary
			? (val: string | null) =>
				val && val.length >= leftBoundary && val.length <= rightBoundary
					? null
					: `Длина от ${leftBoundary} до ${rightBoundary} символов`
			: (val: string | null) =>
				val && val.length >= leftBoundary
					? null
					: `Длина больше ${leftBoundary} ${BaseStringPropertyDescriptor.symbolForms(leftBoundary)}`;

	private static readonly symbolForms = proschet(['символ', 'символа', 'символов']);
}

export class StringPropertyDescriptor<TModel, TProperty extends KeysOfType<TModel, string>>
	extends BaseStringPropertyDescriptor<TModel, string, TProperty> {
		protected convertToValue = (value: string) => value;
}

export class MaybeStringPropertyDescriptor<TModel, TProperty extends KeysOfType<TModel, string | null>>
	extends BaseStringPropertyDescriptor<TModel, string | null, TProperty> {
		protected convertToValue = (value: string) => value.length > 0 ? value : null;
}
