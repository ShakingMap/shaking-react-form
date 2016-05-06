import React from 'react';

export default class Form extends React.Component {
    render() {
        return <form onSubmit={this.onFormSubmit.bind(this)}>
            {this.getFields()}
            {this.props.children}
        </form>
    }

    onFormSubmit(e) {
        e.preventDefault();
        const {onSubmit, onErrors} = this.props;
        let values = {};
        let errors = {};
        this.forEachKey(key=> {
            const field = this.refs[key];
            field.enableValidation();
            values[key] = field.getValue();
            const error = field.getValidationError();
            if (error) errors[key] = error;
        });
        Object.keys(errors).length > 0 ? onErrors(errors) : onSubmit(values);
    }

    forEachKey(callback) {
        for (let key in this.props.schemas) {
            if (this.props.schemas.hasOwnProperty(key)) {
                callback(key);
            }
        }
    }

    getFields() {
        const {schemas, readOnly, disabled} = this.props;
        return Object.keys(schemas).map((key=> {
            const fieldClass = schemas[key].fieldClass || this.props.fieldClass || Form.defaultFieldClass;
            return <Field
                ref={key}
                key={key}
                schema={schemas[key]}
                fieldClass={fieldClass}
                value={this.props.values && this.props.values[key]}
                onChange={value=>this.props.onChange({[key]:value})}
                validate={schemas[key].validate || Form.defaultValidate}
                readOnly={readOnly}
                disabled={disabled}
            />
        }))
    }
}

Form.propTypes = {
    schemas: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]).isRequired,

    fieldClass: React.PropTypes.any,

    values: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),

    // func(values), called with only changed values
    onChange: React.PropTypes.func,

    // func(values)
    onSubmit: React.PropTypes.func,

    // func(errors)
    onErrors: React.PropTypes.func,

    readOnly: React.PropTypes.bool,

    disabled: React.PropTypes.bool
};

Form.defaultProps = {
    onChange(){},
    onSubmit(){},
    onValues(){},
    onErrors(){}
};

Form.defaultFieldClass = null;
Form.defaultValidate = function () {};

class Field extends React.Component {
    constructor(props) {
        super(props);

        const state = {
            enableValidation: false
        };

        // if there are no values, this is an uncontrolled form
        // but the fields are controlled by form
        if (props.value === undefined) state.value = null;

        const value = this.getValue(props, state);
        const result = this.validate(value);
        state.validationError = result.validationError;
        state.validationState = result.validationState;

        this.state = state;
    }

    componentWillUpdate(nextProps, nextState) {
        const oldValue = this.getValue();
        const newValue = this.getValue(nextProps, nextState);
        if (oldValue !== newValue) {
            this.enableValidation();
            this.setState(this.validate(newValue))
        }
    }

    render() {
        const {schema, onChange} = this.props;
        const {label, type, options} = schema;
        const FieldClass = this.props.fieldClass;
        const validationState = this.state.enableValidation ? this.state.validationState : null;
        const validationError = this.state.enableValidation ? this.state.validationError : '';
        const onFieldChange = this.props.value === undefined ? (value)=>this.setState({value}) : onChange;

        const readOnly = this.props.readOnly || schema.readOnly;
        const disabled = this.props.disabled || schema.disabled;

        return <FieldClass
            label={label}
            type={type}
            options={options}
            value={this.getValue()}
            onChange={onFieldChange}
            validationState={validationState}
            validationError={validationError}
            readOnly={readOnly}
            disabled={disabled}
        />
    }

    getValue(props, state) {
        if (!props || !state) {
            props = this.props;
            state = this.state;
        }
        return props.value !== undefined ? props.value : state.value;
    }

    getValidationError() {
        return this.state.validationError;
    }

    enableValidation(flag = true) {
        this.setState({enableValidation: flag});
    }

    validate(value) {
        const validationError = this.props.validate(value) || '';
        const validationState = validationError ? 'error' : 'success';
        return {validationError, validationState};
    }
}

Field.propTypes = {
    schema: React.PropTypes.object.isRequired,
    fieldClass: React.PropTypes.any.isRequired,
    value: React.PropTypes.any,
    onChange: React.PropTypes.func,
    validate: React.PropTypes.func,
    readOnly: React.PropTypes.bool,
    disabled: React.PropTypes.bool
};