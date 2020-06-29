import { KeyboardDatePicker } from '@material-ui/pickers/DatePicker/DatePicker';
import styled from 'styled-components';

export const KeyboardDatePickerWithMargin = styled(KeyboardDatePicker)`
	margin: ${props => props.theme.spacing(1)}px;
`;