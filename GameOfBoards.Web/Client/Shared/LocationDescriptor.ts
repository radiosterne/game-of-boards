import { AppNames } from '../AppNames';

type QueryStringParameterValue = string | number | boolean | null | undefined;

export interface ILocationDescriptor {
	appName: AppNames;
	getUrl(forJson: boolean): string;
	addParameter(key: string, value: QueryStringParameterValue): ILocationDescriptor;
	setHash(hash: string): ILocationDescriptor;
}

export class LocationDescriptorBase<T extends string> {
	constructor(
		public readonly appName: T,
		private readonly baseUrl: string,
		private readonly queryStringParameters: {[key: string]: QueryStringParameterValue}
	){}

	private hash: string | undefined;

	getUrl(forJson = false): string {
		const queryStringEntities =
			Object.keys(this.queryStringParameters)
				.filter(key => this.queryStringParameters[key] !== null && this.queryStringParameters[key] !== undefined)
				.map(key => `${key}=${this.queryStringParameters[key]}`);

		if(forJson) {
			queryStringEntities.push('returnJson=true');
		}

		const queryString = queryStringEntities.join('&');

		const url = queryString === '' ? this.baseUrl : `${this.baseUrl}?${queryString}`;

		return this.hash ? `${url}#${this.hash}` : url;
	}

	addParameter(key: string, value: QueryStringParameterValue) {
		this.queryStringParameters[key] = value;
		return this;
	}

	setHash(hash: string) {
		this.hash = hash;
		return this;
	}
}

export class LocationDescriptor<T extends AppNames> extends LocationDescriptorBase<T> {
	route(title: string, show: boolean) {
		return new Route<T>(this, title, show);
	}
}

export class Route<T extends AppNames> {
	constructor(
		public readonly to: LocationDescriptor<T>,
		public readonly title: string,
		public readonly show: boolean
	) {
		this.branchHeader = false;
		this.noLayout = false;
	}

	public withBranchHeader() {
		this.branchHeader = true;
		return this;
	}

	public withIcon(icon: string) {
		this.icon = icon;
		return this;
	}

	public withoutLayout() {
		this.noLayout = true;
		return this;
	}

	public branchHeader: boolean;
	public noLayout: boolean;
	public icon?: string;
}

export class LocationDescriptorSimple {
	constructor(
		public readonly appName: AppNames,
		private readonly url: string
	) {}

	getUrl(forJson = false): string {
		if(!forJson) {
			return this.url;
		}

		if(this.url.indexOf('?') >= 0) {
			return this.url + '&returnJson=true';
		}

		if(this.url.lastIndexOf('/') === this.url.length - 1) {
			return this.url + '?returnJson=true';
		}

		return this.url + '/?returnJson=true';
	}
}