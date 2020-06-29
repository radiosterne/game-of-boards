import { StringMap } from './Validation/Types';

export const toStringMap = <TKey extends string, TValue, TFrom>
	(values: TFrom[], keySelector: (value: TFrom) => TKey, valueSelector: (value: TFrom) => TValue, includeNull = false) =>
		values.reduce(
			(prev, next) => Object.assign(prev, { [keySelector(next)]: valueSelector(next) }),
		(includeNull ? { '—': null } : {}) as StringMap<TKey, TValue>);