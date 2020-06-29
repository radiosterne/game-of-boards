import dayjs from 'dayjs';

import { PropertyDescriptor } from './PropertyDescriptor';
import { KeysOfType } from './Types';

abstract class BaseMomentPropertyDescriptor<TModel, TValue extends dayjs.Dayjs | null, TProperty extends KeysOfType<TModel, TValue>>
	extends PropertyDescriptor<TModel, TValue, TProperty, dayjs.Dayjs | null> {

	protected convertToDisplayable = (value: dayjs.Dayjs | null) => value;

	notNullOrNaN = () =>
		this.addValidator(val => (val === null) ? 'Неверный формат даты' : null);
}

export class MomentPropertyDescriptor<TModel, TProperty extends KeysOfType<TModel, dayjs.Dayjs>>
	extends BaseMomentPropertyDescriptor<TModel, dayjs.Dayjs, TProperty> {
		protected convertToValue = (value: dayjs.Dayjs | null) => value || dayjs();
}

export class MaybeMomentPropertyDescriptor<TModel, TProperty extends KeysOfType<TModel, dayjs.Dayjs | null>>
	extends BaseMomentPropertyDescriptor<TModel, dayjs.Dayjs | null, TProperty> {
		protected convertToValue = (value: dayjs.Dayjs) => value;
}