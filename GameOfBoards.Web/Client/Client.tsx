import { DomainErrorPopover } from '@Layout';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider as MaterialThemeProvider, Theme } from '@material-ui/core/styles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { StylesProvider } from '@material-ui/styles';
import { IUserView } from '@Shared/Contracts';
import { createBrowserHistory } from 'history';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { AppNames } from './AppNames';
import { Apps } from './Apps';
import { FullScreenLoader, Header, Sidebar } from './Layout';
import { CommonStore } from './Layout/CommonStore';
import { RouteTable } from './Layout/RouteTable';
import { createMaterialUITheme } from './Shared/createMaterialUITheme';
import { createStyledComponentsTheme } from './Shared/createStyledComponentsTheme';
import { LocationDescriptorSimple } from './Shared/LocationDescriptor';
import { LoggingService } from './Shared/Logging/LoggingService';
import { Router, createRouter } from './Shared/Router';

type ClientProps = {
	appName: AppNames;
	appProps: any;
	titleReporter?: (title: string) => void;
	width?: Breakpoint;
	user: IUserView | null;
};

@observer
export class Client extends React.Component<ClientProps> {
	constructor(props: ClientProps) {
		super(props);
		const title = Apps[props.appName].app.getTitle(props.appProps);
		this.commonStore = new CommonStore(props.appName, props.appProps, title, props.user);
		CommonStore.instance = this.commonStore;
		this.routeTable = new RouteTable(this.commonStore);
		this.loggingService = new LoggingService();
		this.materialTheme = createMaterialUITheme();
	}

	private commonStore: CommonStore;
	public routeTable: RouteTable;
	private loggingService: LoggingService;
	private materialTheme: Theme;

	public static materialUiStylesId = 'material-ui-styles';

	render() {
		const { currentAppName } = this.commonStore;
		const { currentRoute } = this.routeTable;
		const { noLayout } = currentRoute;
		const className = `${Apps[currentAppName].cssClass} App wrapper`;

		if (this.props.titleReporter) {
			this.props.titleReporter(currentRoute.title);
		}

		const loaderStore = this.commonStore.loaderStore;

		return <MaterialThemeProvider theme={this.materialTheme}>
			<StylesProvider injectFirst>
				<ThemeProvider theme={createStyledComponentsTheme(this.materialTheme)}>
					<div className={className}>
						<CssBaseline />
						{!noLayout && <Header store={this.commonStore} routeTable={this.routeTable} />}
						{!noLayout && <Sidebar routeTable={this.routeTable} />}
						<FullScreenLoader loaderStore={loaderStore} />
						<DomainErrorPopover store={this.commonStore} />
						{noLayout
							? <AppSwitcher
								store={this.commonStore}
								loggingService={this.loggingService}
								routeTable={this.routeTable} />
							: <MainField>
								<AppSwitcher
									store={this.commonStore}
									loggingService={this.loggingService}
									routeTable={this.routeTable} />
							</MainField>}
					</div>
				</ThemeProvider>
			</StylesProvider>
		</MaterialThemeProvider>;
	}

	componentDidMount = () => {
		const materialUiServerStyles = document.getElementById(Client.materialUiStylesId);
		if (materialUiServerStyles) {
			materialUiServerStyles.parentNode!.removeChild(materialUiServerStyles);
		}
	};
}

type AppSwitcherProps = {
	store: CommonStore;
	routeTable: RouteTable;
	loggingService: LoggingService;
};

const MainField = styled.div`
	${props => props.theme.breakpoints.up('sm')} {
		width: calc(100% - ${props => props.theme.sidebarWidth});
		margin-left: ${props => props.theme.sidebarWidth};
	}
`;

@observer
class AppSwitcher extends React.Component<AppSwitcherProps> {
	@computed
	private get currentApp() {
		return Apps[this.props.store.currentAppName];
	}

	@computed
	private get currentAppProps() {
		return this.props.store.currentAppProps;
	}

	render() {
		const app = this.currentApp;
		return React.createElement(app.app, { ...this.currentAppProps, key: Date.now() });
	}

	componentDidMount() {
		const { store, loggingService } = this.props;
		const history = createBrowserHistory();
		createRouter(history, loggingService, store);
		const url = window.location.pathname + window.location.search;
		Router().replace(new LocationDescriptorSimple(store.currentAppName, url));
	}

	componentDidUpdate() {
		window.scrollTo(0, this.props.store.restoreScrollTo);
		const title = document.getElementsByTagName('title')[0];
		const currentAppTitle = this.currentApp.app.getTitle(this.currentAppProps);
		if (title) {
			title.innerText = this.props.routeTable.currentRoute.title;
		}
		this.props.store.currentAppTitle = currentAppTitle;
	}
}