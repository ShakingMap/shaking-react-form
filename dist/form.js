'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_React$Component) {
    _inherits(Form, _React$Component);

    function Form() {
        _classCallCheck(this, Form);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
    }

    _createClass(Form, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'form',
                { onSubmit: this.onFormSubmit.bind(this) },
                this.getFields(),
                this.props.children
            );
        }
    }, {
        key: 'onFormSubmit',
        value: function onFormSubmit(e) {
            var _this2 = this;

            e.preventDefault();
            var _props = this.props;
            var onSubmit = _props.onSubmit;
            var onErrors = _props.onErrors;

            var values = {};
            var errors = {};
            this.forEachKey(function (key) {
                var field = _this2.refs[key];
                field.enableValidation();
                values[key] = field.getValue();
                var error = field.getValidationError();
                if (error) errors[key] = error;
            });
            Object.keys(errors).length > 0 ? onErrors(errors) : onSubmit(values);
        }
    }, {
        key: 'forEachKey',
        value: function forEachKey(callback) {
            for (var key in this.props.schemas) {
                if (this.props.schemas.hasOwnProperty(key)) {
                    callback(key);
                }
            }
        }
    }, {
        key: 'getFields',
        value: function getFields() {
            var _this3 = this;

            var schemas = this.props.schemas;

            return Object.keys(schemas).map(function (key) {
                var fieldClass = schemas[key].fieldClass || _this3.props.fieldClass || Form.defaultFieldClass;
                return _react2.default.createElement(Field, {
                    ref: key,
                    key: key,
                    schema: schemas[key],
                    fieldClass: fieldClass,
                    value: _this3.props.values && _this3.props.values[key],
                    onChange: function onChange(value) {
                        return _this3.props.onChange(_defineProperty({}, key, value));
                    },
                    validate: schemas[key].validate || Form.defaultValidate
                });
            });
        }
    }]);

    return Form;
}(_react2.default.Component);

exports.default = Form;


Form.propTypes = {
    schemas: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.array]).isRequired,

    fieldClass: _react2.default.PropTypes.any,

    values: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.array]),

    // func(values), called with only changed values
    onChange: _react2.default.PropTypes.func,

    // func(values)
    onSubmit: _react2.default.PropTypes.func,

    // func(errors)
    onErrors: _react2.default.PropTypes.func
};

Form.defaultProps = {
    onChange: function onChange() {},
    onSubmit: function onSubmit() {},
    onValues: function onValues() {},
    onErrors: function onErrors() {}
};

Form.defaultFieldClass = null;
Form.defaultValidate = function () {};

var Field = function (_React$Component2) {
    _inherits(Field, _React$Component2);

    function Field(props) {
        _classCallCheck(this, Field);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Field).call(this, props));

        var state = {
            enableValidation: false
        };

        // if there are no values, this is an uncontrolled form
        // but the fields are controlled by form
        if (props.value === undefined) state.value = null;

        var value = _this4.getValue(props, state);
        var result = _this4.validate(value);
        state.validationError = result.validationError;
        state.validationState = result.validationState;

        _this4.state = state;
        return _this4;
    }

    _createClass(Field, [{
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextProps, nextState) {
            var oldValue = this.getValue();
            var newValue = this.getValue(nextProps, nextState);
            if (oldValue !== newValue) {
                this.enableValidation();
                this.setState(this.validate(newValue));
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var _props2 = this.props;
            var schema = _props2.schema;
            var onChange = _props2.onChange;
            var label = schema.label;
            var type = schema.type;
            var options = schema.options;

            var FieldClass = this.props.fieldClass;
            var validationState = this.state.enableValidation ? this.state.validationState : null;
            var validationError = this.state.enableValidation ? this.state.validationError : '';
            var onFieldChange = this.props.value === undefined ? function (value) {
                return _this5.setState({ value: value });
            } : onChange;

            return _react2.default.createElement(FieldClass, {
                label: label,
                type: type,
                options: options,
                value: this.getValue(),
                onChange: onFieldChange,
                validationState: validationState,
                validationError: validationError
            });
        }
    }, {
        key: 'getValue',
        value: function getValue(props, state) {
            if (!props || !state) {
                props = this.props;
                state = this.state;
            }
            return props.value !== undefined ? props.value : state.value;
        }
    }, {
        key: 'getValidationError',
        value: function getValidationError() {
            return this.state.validationError;
        }
    }, {
        key: 'enableValidation',
        value: function enableValidation() {
            var flag = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

            this.setState({ enableValidation: flag });
        }
    }, {
        key: 'validate',
        value: function validate(value) {
            var validationError = this.props.validate(value) || '';
            var validationState = validationError ? 'error' : 'success';
            return { validationError: validationError, validationState: validationState };
        }
    }]);

    return Field;
}(_react2.default.Component);

Field.propTypes = {
    schema: _react2.default.PropTypes.object.isRequired,
    fieldClass: _react2.default.PropTypes.any.isRequired,
    value: _react2.default.PropTypes.any,
    onChange: _react2.default.PropTypes.func,
    validate: _react2.default.PropTypes.func
};

