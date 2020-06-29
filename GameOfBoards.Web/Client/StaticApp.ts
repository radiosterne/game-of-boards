import * as React from 'react';

export type StaticApp = React.ComponentClass<{}, any> & {
	getTitle: (props: any) => string;
};