import { AppNames } from './AppNames';
import { App as AccountLoginApp } from './Apps/Account/Login/App';
import { App as GamesEditApp } from './Apps/Games/Edit/App';
import { App as GamesFormApp } from './Apps/Games/Form/App';
import { App as GamesLeaderboardApp } from './Apps/Games/Leaderboard/App';
import { App as GamesListApp } from './Apps/Games/List/App';
import { App as UsersListApp } from './Apps/Users/List/App';
import { StaticApp } from './StaticApp';

export const Apps = {
	'AccountLoginApp': { app: AccountLoginApp, cssClass: 'AccountLogin' },
	'GamesEditApp': { app: GamesEditApp, cssClass: 'GamesEdit' },
	'GamesFormApp': { app: GamesFormApp, cssClass: 'GamesForm' },
	'GamesLeaderboardApp': { app: GamesLeaderboardApp, cssClass: 'GamesLeaderboard' },
	'GamesListApp': { app: GamesListApp, cssClass: 'GamesList' },
	'UsersListApp': { app: UsersListApp, cssClass: 'UsersList' },
} as { [key in AppNames]: { app: StaticApp, cssClass: string } };