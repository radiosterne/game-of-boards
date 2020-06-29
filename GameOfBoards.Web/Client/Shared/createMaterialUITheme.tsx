import { Theme, createMuiTheme } from '@material-ui/core/styles';

export const createMaterialUITheme: () => Theme = () => createMuiTheme({
	palette: {
		primary: {
			main: '#2270b8'
		},
		secondary: {
			main: '#52b552'
		},
		text: {
			primary: '#333',
			secondary: '#666',
			disabled: '#ccc',
			hint: '#999'
		}
	}
});