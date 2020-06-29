import { Button, Grid } from '@material-ui/core';
import { SchemeBuilder } from '@Shared/Validation/SchemeBuilder';
import { EmptyObject } from '@Shared/Validation/Types';
import { ValidationContext } from '@Shared/Validation/ValidationContext';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { SingleDisplayFor } from './SingleDisplayFor';
import { SingleEditorFor } from './SingleEditorFor';

type SingleEditorProps<TModel, TKeys extends keyof TModel, TScheme> = {
	scheme: SchemeBuilder<TModel, TKeys, TScheme>;
	entity: TModel | EmptyObject;
	fullWidth?: boolean;
	hideEditButton?: boolean;
	hideCancelButton?: boolean;
	onSubmit?: (context: ValidationContext<TModel, TKeys, TScheme>) => void;
	contextRef?: (context: ValidationContext<TModel, TKeys, TScheme>) => void;
};

@observer
export class SingleEditor<TModel, TKeys extends keyof TModel, TScheme>
	extends React.Component<SingleEditorProps<TModel, TKeys, TScheme>> {
	constructor(props: SingleEditorProps<TModel, TKeys, TScheme>) {
		super(props);
		if (EmptyObject.is(this.props.entity) || this.props.contextRef) {
			this.createValidationContext();
		}
	}
	@observable
	private validationContext: ValidationContext<TModel, TKeys, TScheme> | null = null;

	render() {
		const { scheme, entity, onSubmit, contextRef } = this.props;
		const canBeEdited = !!onSubmit || !!contextRef;
		return <form noValidate>
			{this.validationContext
				? this.validationContext.properties.map(p =>
					<SingleEditorFor
						property={p}
						fullWidth={this.props.fullWidth}
						key={p.propertyName.toString()} />)
				: scheme.properties.map(s =>
					<SingleDisplayFor
						onInputClick={canBeEdited ? this.startEdit : undefined}
						property={s}
						model={entity as TModel}
						fullWidth={this.props.fullWidth}
						key={s.propertyName.toString()} />)
			}
			{this.props.onSubmit && !this.props.contextRef &&
				<Grid item xs={12}>
					{this.validationContext
						?
						<>
							<ButtonWithMargin
								variant='contained'
								color='primary'
								onClick={() => {
									this.validationContext!.forceValidation();
									if (this.validationContext!.isValid) {
										this.props.onSubmit!(this.validationContext!);
										this.validationContext = null;
									}
								}}>
								Сохранить
							</ButtonWithMargin>
							{!this.props.hideCancelButton && <ButtonWithMargin
								variant='contained'
								color='secondary'
								onClick={() => this.validationContext = null}>
								Отменить
							</ButtonWithMargin>}
						</>
						: !this.props.hideEditButton && <ButtonWithMargin
							variant='contained'
							color='primary'
							onClick={this.startEdit}>
								Редактировать
						</ButtonWithMargin>
					}
				</Grid>
			}
		</form>;
	}

	private createValidationContext = () => {
		this.validationContext = new ValidationContext(this.props.entity, this.props.scheme);
		if (this.props.contextRef) {
			this.props.contextRef(this.validationContext);
		}
	};

	private startEdit = this.createValidationContext;
}

const ButtonWithMargin = styled(Button)`
	margin-top: ${props => props.theme.spacing(1)}px;
	margin-right: ${props => props.theme.spacing(1)}px;
`;