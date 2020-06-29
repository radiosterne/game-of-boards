import { TextField } from '@material-ui/core';
import styled from 'styled-components';

export const FieldWithMargin = styled(TextField)`
	margin: ${props => props.theme.spacing(1)}px;
`;