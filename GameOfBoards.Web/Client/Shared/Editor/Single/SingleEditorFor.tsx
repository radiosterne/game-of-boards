import DayJsUtils from '@date-io/dayjs';
import { Checkbox, ClickAwayListener, FormControl, FormControlLabel, FormGroup, FormHelperText, Grow, InputAdornment, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers/MuiPickersUtilsProvider';
import { Collections } from '@Shared/Collections';
import { IDisplayableProperty, IProperty } from '@Shared/Validation/IProperty';
import { IPropertyDescriptor } from '@Shared/Validation/IPropertyDescriptor';
import { NestedProperty } from '@Shared/Validation/NestedPropertyDescriptor';
import { Property } from '@Shared/Validation/Property';
import { SelectListPropertyDescriptor } from '@Shared/Validation/SelectListPropertyDescriptor';
import { EmptyObject } from '@Shared/Validation/Types';
import * as dayjs from 'dayjs';
import { observer, useLocalStore, useObserver } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { FieldWithMargin } from '../Common/FieldWithMargin';
import { KeyboardDatePickerWithMargin } from '../Common/KeyboardDatePickerWithMargin';
import { selectList } from '../Common/SelectList';

import { SingleDisplayFor } from './SingleDisplayFor';

type SingleEditorForProps<TModel, TKeys extends keyof TModel> = {
	property: IProperty<TModel, TKeys>;
	fullWidth?: boolean;
};

const selectListLength = 7;

@observer
export class SingleEditorFor<TModel, TKeys extends keyof TModel>
	extends React.Component<SingleEditorForProps<TModel, TKeys>> {
	render() {
		const { property } = this.props;

		if (property instanceof NestedProperty) {
			return property.innerProperties
				.map(prop => <SingleEditorFor
					property={prop}
					fullWidth={this.props.fullWidth}
					key={prop.propertyName} />);
		}

		if (property.isReadonly) {
			return EmptyObject.is(property.model)
				? <div></div>
				: <SingleDisplayFor property={property.descriptor} model={property.model} disabled />;
		}

		const postfix = (property.descriptor as IPropertyDescriptor<TModel, any, any, TKeys>).postfix;
		if (Property.isString(property) || Property.isNumber(property)) {
			return <FieldWithMargin
				value={EmptyObject.is(property.displayValue) ? '' : property.displayValue}
				onChange={evt => property.displayValue = evt.target.value}
				error={!property.hasValidState}
				label={property.descriptor.displayName}
				helperText={property.validationMessage}
				fullWidth={this.props.fullWidth}
				inputProps={{
					style: { textAlign: Property.isNumber(property) ? 'right' : 'left' }
				}}
				InputProps={{
					endAdornment: postfix ? <InputAdornment position='end'>{postfix}</InputAdornment> : undefined
				}}
				className={property.descriptor.propertyName as string} />;
		}

		if (Property.isBoolean(property)) {
			if (EmptyObject.is(property.displayValue)){
				property.displayValue = false;
			}
			return <FormControlWithMargin error={!property.hasValidState} className={property.descriptor.propertyName as string}>
				<FormGroup>
					<FormControlLabel
						control={
							<Checkbox
								checked={property.displayValue}
								onChange={evt => property.displayValue = evt.target.checked}
								value={property.displayValue}
								color='primary' />
						}
						label={property.descriptor.displayName}/>
				</FormGroup>
				<FormHelperText>{property.validationMessage}</FormHelperText>
			</FormControlWithMargin>;
		}

		if (Property.isSelectList(property)) {
			const descriptor = property.descriptor as SelectListPropertyDescriptor<TModel, any, any, string>;
			return descriptor.keys().length > selectListLength
				? <Suggest property={property} fullWidth={this.props.fullWidth} />
				: <FieldWithMargin
					value={EmptyObject.is(property.displayValue) ? '' : property.displayValue}
					onChange={evt => property.displayValue = evt.target.value}
					error={!property.hasValidState}
					label={property.descriptor.displayName}
					helperText={property.validationMessage}
					fullWidth={this.props.fullWidth}
					select
					InputProps={{
						endAdornment: postfix ? <InputAdornment position='end'>{postfix}</InputAdornment> : undefined
					}}
					className={property.descriptor.propertyName as string}>
					{selectList(property)}
				</FieldWithMargin>;
		}

		if (Property.isMoment(property)) {
			return <MuiPickersUtilsProvider
				utils={DayJsUtils}
				locale={dayjs.locale('ru')}>
				<KeyboardDatePickerWithMargin
					disableToolbar
					variant='inline'
					format='DD.MM.YYYY'
					margin='normal'
					value={EmptyObject.is(property.displayValue) ? '' : property.displayValue}
					onChange={evt => property.displayValue = evt === null ? EmptyObject.instance : evt}
					error={!property.hasValidState}
					label={property.descriptor.displayName}
					helperText={property.validationMessage}
					fullWidth={this.props.fullWidth}
					KeyboardButtonProps={{
						'aria-label': 'change date',
					}}
					className={property.descriptor.propertyName as string}
				/>
			</MuiPickersUtilsProvider>;
		}

		return null;
	}
}

interface SuggestProps<TModel, TKeys extends keyof TModel>{
	property: IDisplayableProperty<TModel, TKeys, string>;
	fullWidth?: boolean;
}

const Suggest = <TModel, TKeys extends keyof TModel>(props: SuggestProps<TModel, TKeys>) => {
	const { property, fullWidth } = props;
	const fieldRef = React.useRef(null);
	const descriptor = property.descriptor as SelectListPropertyDescriptor<TModel, any, any, string>;
	const suggest = useLocalStore(() => ({
		filter: EmptyObject.is(property.displayValue) ? '' : property.displayValue,
		suggests: [] as string[],
		get popupOpen() {
			return suggest.suggests.length > 0;
		},
		onTextFieldChanged: (value: string) => {
			suggest.filter = value;
			suggest.suggests = Collections
				.chain(descriptor.keys())
				.filter(t => t.toLowerCase().match(`([^а-яА-Яa-zA-Z]|^)${value.toLowerCase()}`) !== null)
				.take(selectListLength)
				.value();
		},
		onItemClick: (value: string) => {
			property.displayValue = value;
			suggest.filter = value;
			suggest.suggests = [];
		},
		onClickAway: () => {
			suggest.filter = EmptyObject.is(property.displayValue) ? '' : property.displayValue;
			suggest.suggests = [];
		}
	}));

	return useObserver(() => <>
		<FieldWithMargin
			ref={fieldRef}
			value={suggest.filter}
			onChange={evt => suggest.onTextFieldChanged(evt.target.value)}
			label={property.descriptor.displayName}
			helperText={property.validationMessage}
			fullWidth={fullWidth}
			className={property.descriptor.propertyName as string} />
		<Popper open={suggest.popupOpen} anchorEl={fieldRef.current} transition placement='bottom-start' style={{ zIndex: 9999, maxWidth: '400px' }}>
			{({ TransitionProps, placement }) => {
				return <Grow
					{...TransitionProps}
					style={{ transformOrigin: placement === 'bottom' ? 'left top' : 'left bottom' }}>
					<Paper>
						<ClickAwayListener onClickAway={() => suggest.onClickAway()}>
							<MenuList id='menu-list-grow'>
								{suggest.suggests.map((s, ix) =>
									<MenuItem key={ix.toString()} onClick={() => suggest.onItemClick(s)}>
										{s}
									</MenuItem>)}
							</MenuList>
						</ClickAwayListener>
					</Paper>
				</Grow>;}
			}
		</Popper>
	</>);
};

const FormControlWithMargin = styled(FormControl)`
	margin: ${props => props.theme.spacing(1)}px;
`;