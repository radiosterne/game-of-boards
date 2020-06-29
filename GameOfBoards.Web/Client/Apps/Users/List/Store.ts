import { IUserView, UserApiControllerProxy } from '@Shared/Contracts';
import { HttpService } from '@Shared/HttpService';
import { SchemeBuilder } from '@Shared/Validation/SchemeBuilder';
import { EmptyObject } from '@Shared/Validation/Types';
import { ContextFor } from '@Shared/Validation/ValidationContext';
import { computed, observable } from 'mobx';

export class Store {
	private userService = new UserApiControllerProxy(new HttpService());

	constructor(
		users: IUserView[]
	) {
		this.users = users;
	}

	@observable
	private users: IUserView[];

	@computed
	public get sortedUsers() {
		return this.users
			.slice()
			.sort((l, r) => l.name.fullForm.localeCompare(r.name.fullForm));
	}

	public onSubmit = (context: ContextFor<Store['scheme']>) => {
		if (!EmptyObject.is(context.model)) {
			const { name, phoneNumber } = context.scheme;
			const model = context.model;
			if (name.hasBeenUpdated) {
				const { firstName, middleName, lastName } = name.scheme;
				this.userService
					.updateName({
						id: model.id,
						firstName: firstName.modelValue,
						middleName: middleName.modelValue,
						lastName: lastName.modelValue
					})
					.then(name => this.users
						.filter(u => u.id === model.id)
						.forEach(u => u.name = name));
			}
			if (phoneNumber.hasBeenUpdated) {
				const { modelValue } = phoneNumber;
				this.userService
					.changePhone({
						id: model.id,
						phoneNumber: modelValue
					})
					.then(number => this.users
						.filter(u => u.id === model.id)
						.forEach(u => u.phoneNumber = number));
			}
		} else {
			const { name, phoneNumber } = context.scheme;
			const { firstName, middleName, lastName } = name.scheme;

			this.userService
				.create({
					firstName: firstName.modelValue,
					middleName: middleName.modelValue,
					lastName: lastName.modelValue,
					phoneNumber: phoneNumber.modelValue,
					password: null
				})
				.then(view => this.users.push(view));
		}
	};

	public scheme = SchemeBuilder.for<IUserView>()
		.nested(
			'name',
			'Имя пользователя',
			innerScheme => innerScheme
				.string('firstName', 'Имя', p => p.notNullOrEmpty())
				.maybeString('middleName', 'Отчество', p => p.notWhitespace().default(null))
				.maybeString('lastName', 'Фамилия', p => p.notWhitespace().default(null)))
		.string('phoneNumber', 'Телефонный номер', p => p.formatAsPhone());
}