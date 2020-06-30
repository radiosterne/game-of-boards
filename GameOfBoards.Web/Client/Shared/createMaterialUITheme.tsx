import { Theme, createMuiTheme } from '@material-ui/core/styles';

export const createMaterialUITheme: () => Theme = () => createMuiTheme({
	palette: {
		primary: {
			main: '#213c5e'
		},
		secondary: {
			main: '#94ac24'
		},
		text: {
			primary: '#333',
			secondary: '#666',
			disabled: '#ccc',
			hint: '#999'
		}
	}
});