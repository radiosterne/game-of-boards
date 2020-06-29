import { splitBy } from '@Shared/TypographyHelpers';

import { PropertyDescriptor } from './PropertyDescriptor';
import { CleanerError, KeysOfType } from './Types';

abstract class BaseNumberPropertyDescriptor<TModel, TValue extends number | null, TProperty extends KeysOfType<TModel, TValue>>
	extends PropertyDescriptor<TModel, TValue, TProperty, string> {
	constructor(
		propertyName: TProperty,
		displayName: string
	) {
		super(propertyName, displayName);
		this.addCleaner(value => {
			const match = value.match(/^-?[0-9.]*$/);
			if (match) {
				return value;
			}
			return CleanerError.instance;
		});
	}

	protected convertToDisplayable = (value: number | null) =>
		value !== null && !Number.isNaN(value) ? value.toString() : '';

	splitBy(n: number) {
		return this.addFormatter(splitBy(n, false))
			.addCleaner(value => value.replace(/ /g, ''));
	}

	asRoubles() {
		return this.addFormatter(NumberPropertyDescriptor.safeRound)
			.splitBy(3)
			.withPostfix('₽');
	}

	asPercents() {
		return this.withConverters(
			n => (typeof n === 'number' ? n * 100 : n) as TValue,
			n => (typeof n === 'number' ? n / 100 : n) as TValue)
			.withPostfix('%')
			.addFormatter(s => {
				const split = s.split('.');
				return split.length > 1
					? split[0] + '.' + split[1].substring(0, 2)
					: s;
			});
	}

	notNullOrNaN = () =>
		this.addValidator(val => (val === null || isNaN(val!)) ? 'Должно быть числом' : null);

	protected static safeRound = (inp: string) => {
		const parsed = parseFloat(inp);
		if(Number.isNaN(parsed)) {
			return '';
		}

		return Math.round(parsed).toString();
	};
}

export class NumberPropertyDescriptor<TModel, TProperty extends KeysOfType<TModel, number>>
	extends BaseNumberPropertyDescriptor<TModel, number, TProperty> {
	protected convertToValue = (value: string) => Number.parseFloat(value);
}

export class MaybeNumberPropertyDescriptor<TModel, TProperty extends KeysOfType<TModel, number | null>>
	extends BaseNumberPropertyDescriptor<TModel, number | null, TProperty> {
	protected convertToValue = (value: string) => value.length > 0 ? Number.parseFloat(value) : null;
}