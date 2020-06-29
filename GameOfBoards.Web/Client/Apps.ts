import { AppNames } from './AppNames';
import { App as AccountLoginApp } from './Apps/Account/Login/App';
import { App as HowtoMainApp } from './Apps/Howto/Main/App';
import { App as UsersListApp } from './Apps/Users/List/App';
import { StaticApp } from './StaticApp';

export const Apps = {
	'AccountLoginApp': { app: AccountLoginApp, cssClass: 'AccountLogin' },
	'HowtoMainApp': { app: HowtoMainApp, cssClass: 'HowtoMain' },
	'UsersListApp': { app: UsersListApp, cssClass: 'UsersList' },
} as { [key in AppNames]: { app: StaticApp, cssClass: string } };