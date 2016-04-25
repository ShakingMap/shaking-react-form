import React from 'react';

export default class Form extends React.Component {
    constructor(props) {
        super(props);

        const state = {
            _enableValidation: {}
        };

        if (!props.values) {
            const {schemas} = props;
            Object.keys(schemas).forEach((key)=> {
                state[key] = this.getFieldClassOfKey(key).getDefaultValue(schemas[key]);
            });
        }

        this.state = state;
    }

    render() {
        const {children} = this.props;

        return <form onSubmit={this.onFormSubmit.bind(this)}>
            {this.getFields()}
            {children}
        </form>
    }

    onFormSubmit(e) {
        e.preventDefault();
        const {schemas, onSubmit} = this.props;
        const values = this.props.values || this.state;
        this.setState({_enableValidation: true});
        for (let key in schemas) {
            if (schemas.hasOwnProperty(key)
                && schemas[key].validate
                && schemas[key].validate(this.getValueOfKey(key)))
                return;
        }
        onSubmit(values);
    }

    getValueOfKey(key) {
        const {schemas} = this.props;
        const values = this.props.values || this.state;
        return values[key] !== undefined ? values[key] : this.getFieldClassOfKey(key).getDefaultValue(schemas[key]);
    }

    getFieldClassOfKey(key) {
        const {schemas, fieldClass} = this.props;
        return schemas[key].fieldClass || fieldClass || Form.defaultFieldClass;
    }

    getEnableValidationOfKey(key) {
        return this.state._enableValidation === true || this.state._enableValidation[key]
    }

    getFields() {
        const {schemas, values} = this.props;
        return Object.keys(schemas).map((key, index)=> {
            const schema = schemas[key];
            const FieldClass = this.getFieldClassOfKey(key);
            const onFieldChange = values ?
                (value)=> this.props.onChange({[key]: value}) :
                (value)=> this.setState({[key]: value});
            return <FieldClass
                key={index}
                schema={schema}
                enableValidation={this.getEnableValidationOfKey(key)}
                value={this.getValueOfKey(key)}
                onChange={onFieldChange}
                onFocus={null}
                onBlur={()=>{
                    const {_enableValidation} = this.state;
                    _enableValidation[key] = true;
                    this.setState({_enableValidation});
                }}
            />
        })
    }
}

Form.propTypes = {
    schemas: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
    fieldClass: React.PropTypes.any,

    values: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),

    // func(values), called with only changed values
    onChange: React.PropTypes.func,

    // func(values)
    onSubmit: React.PropTypes.func
};

Form.defaultFieldClass = null;