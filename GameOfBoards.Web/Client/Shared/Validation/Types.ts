export type KeysOfType<TModel, TValueType> = {
	[Prop in keyof TModel]:
	TModel[Prop] extends TValueType
	? Prop
	: never;
}[keyof TModel];

export type Endomorphism<T> = (value: T) => T;

export type ValidatorFunc<TValueType> = (value: TValueType) => string | null;
export type CleanerFunc<TDisplayable> = (value: TDisplayable) => TDisplayable | CleanerError;
export type FormatterFunc<TDisplayable> = Endomorphism<TDisplayable>;
export type ToDisplayable<TValueType, TDisplayable> = (value: TValueType) => TDisplayable;
export type ToValueType<TValueType, TDisplayable> = (value: TDisplayable) => TValueType;

const NominalTypeSymbol = Symbol('Nominal');

export class EmptyObject {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() { }

	[NominalTypeSymbol] = 'EmptyObject' as const;

	public static instance = new EmptyObject();

	public static is = (obj: any): obj is EmptyObject => {
		return obj instanceof EmptyObject;
	};
}

export class CleanerError {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() { }

	[NominalTypeSymbol] = 'CleanerError' as const;

	public static instance = new CleanerError();

	public static is = (obj: any): obj is CleanerError => {
		return obj instanceof CleanerError;
	};
}

export type StringMap<TKeys extends string, TValue> = {
	[Key in TKeys]: TValue
};

export type SelectList<TKeys extends string, TValue> =
	StringMap<TKeys, TValue>
	| (() => StringMap<TKeys, TValue>);