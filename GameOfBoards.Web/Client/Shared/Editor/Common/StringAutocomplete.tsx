// import MenuItem from '@material-ui/core/MenuItem';
// import NoSsr from '@material-ui/core/NoSsr';
// import Paper from '@material-ui/core/Paper';
// import { createStyles, emphasize, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
// import TextField, { BaseTextFieldProps } from '@material-ui/core/TextField';
// import Typography from '@material-ui/core/Typography';
// import { Omit } from '@material-ui/types';
// import * as React from 'react';
// import { CSSProperties, HTMLAttributes } from 'react';
// import Select from 'react-select';
// import { ValueContainerProps } from 'react-select/src/components/containers';
// import { ControlProps } from 'react-select/src/components/Control';
// import { MenuProps, NoticeProps } from 'react-select/src/components/Menu';
// import { OptionProps } from 'react-select/src/components/Option';
// import { PlaceholderProps } from 'react-select/src/components/Placeholder';
// import { SingleValueProps } from 'react-select/src/components/SingleValue';
// import { observer } from 'mobx-react';

// interface OptionType {
// 	label: string;
// 	value: string;
// }

// const useStyles = makeStyles((theme: Theme) =>
// 	createStyles({
// 		root: {
// 			flexGrow: 1,
// 			height: 250,
// 			minWidth: 290,
// 		},
// 		input: {
// 			display: 'flex',
// 			padding: 0,
// 			height: 'auto',
// 		},
// 		valueContainer: {
// 			display: 'flex',
// 			flexWrap: 'wrap',
// 			flex: 1,
// 			alignItems: 'center',
// 			overflow: 'hidden',
// 		},
// 		chip: {
// 			margin: theme.spacing(0.5, 0.25),
// 		},
// 		chipFocused: {
// 			backgroundColor: emphasize(
// 				theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
// 				0.08,
// 			),
// 		},
// 		noOptionsMessage: {
// 			padding: theme.spacing(1, 2),
// 		},
// 		singleValue: {
// 			fontSize: 16,
// 		},
// 		placeholder: {
// 			position: 'absolute',
// 			left: 2,
// 			bottom: 6,
// 			fontSize: 16,
// 		},
// 		paper: {
// 			position: 'absolute',
// 			zIndex: 1,
// 			marginTop: theme.spacing(1),
// 			left: 0,
// 			right: 0,
// 		},
// 		divider: {
// 			height: theme.spacing(2),
// 		},
// 	}),
// );

// const NoOptionsMessage = (props: NoticeProps<OptionType>) =>
// 	<Typography
// 		color='textSecondary'
// 		className={props.selectProps.classes.noOptionsMessage}
// 		{...props.innerProps}>
// 		{props.children}
// 	</Typography>;

// type InputComponentProps = Pick<BaseTextFieldProps, 'inputRef'> & HTMLAttributes<HTMLDivElement>;

// const inputComponent = ({ inputRef, ...props }: InputComponentProps) =>
// 	<div ref={inputRef} {...props} />;

// const Control = (props: ControlProps<OptionType>) => {
// 	const {
// 		children,
// 		innerProps,
// 		innerRef,
// 		selectProps: { classes, TextFieldProps },
// 	} = props;

// 	return (
// 		<TextField
// 			fullWidth
// 			InputProps={{
// 				inputComponent,
// 				inputProps: {
// 					className: classes.input,
// 					ref: innerRef,
// 					children,
// 					...innerProps,
// 				},
// 			}}
// 			{...TextFieldProps}
// 		/>
// 	);
// };

// const Option = (props: OptionProps<OptionType>) =>
// 	<MenuItem
// 		ref={props.innerRef}
// 		selected={props.isFocused}
// 		component='div'
// 		style={{
// 			fontWeight: props.isSelected ? 500 : 400,
// 		}}
// 		{...props.innerProps}
// 	>
// 		{props.children}
// 	</MenuItem>;

// type MuiPlaceholderProps = Omit<PlaceholderProps<OptionType>, 'innerProps'> &
// 	Partial<Pick<PlaceholderProps<OptionType>, 'innerProps'>>;

// const Placeholder = (props: MuiPlaceholderProps) => {
// 	const { selectProps, innerProps = {}, children } = props;
// 	return (
// 		<Typography color='textSecondary' className={selectProps.classes.placeholder} {...innerProps}>
// 			{children}
// 		</Typography>
// 	);
// };

// const SingleValue = (props: SingleValueProps<OptionType>) =>
// 	<Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
// 		{props.children}
// 	</Typography>;

// const ValueContainer = (props: ValueContainerProps<OptionType>) =>
// 	<div className={props.selectProps.classes.valueContainer}>{props.children}</div>;

// const Menu = (props: MenuProps<OptionType>) =>
// 	<Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
// 		{props.children}
// 	</Paper>;

// const components = {
// 	Control: Control,
// 	Menu: Menu,
// 	NoOptionsMessage: NoOptionsMessage,
// 	Option: Option,
// 	Placeholder: Placeholder,
// 	SingleValue: SingleValue,
// 	ValueContainer: ValueContainer,
// };

// type StringAutocompleteProps = {
// 	value: string | null;
// 	onChange: (val: string) => void;
// };

// export const StringAutocomplete = observer(({ value, onChange }: StringAutocompleteProps) => {
// 	const classes = useStyles();
// 	const theme = useTheme();

// 	const selectStyles = {
// 		input: (base: CSSProperties) => ({
// 			...base,
// 			color: theme.palette.text.primary,
// 			'& input': {
// 				font: 'inherit',
// 			}
// 		})
// 	};

// 	return (
// 		<div className={classes.root}>
// 			<NoSsr>
// 				<Select
// 					classes={classes}
// 					styles={selectStyles}
// 					inputId='react-select-single'
// 					TextFieldProps={{
// 						label: 'Country',
// 						InputLabelProps: {
// 							htmlFor: 'react-select-single',
// 							shrink: true,
// 						},
// 					}}
// 					placeholder='Search a country (start with a)'
// 					options={suggestions}
// 					components={components}
// 					value={value || ''}
// 					onChange={onChange}
// 				/>
// 			</NoSsr>
// 		</div>
// 	);
// });