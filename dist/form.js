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

    function Form(props) {
        _classCallCheck(this, Form);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Form).call(this, props));

        var state = {
            _enableValidation: {}
        };

        if (!props.values) {
            (function () {
                var schemas = props.schemas;

                Object.keys(schemas).forEach(function (key) {
                    state[key] = _this.getFieldClassOfKey(key).getDefaultValue(schemas[key]);
                });
            })();
        }

        _this.state = state;
        return _this;
    }

    _createClass(Form, [{
        key: 'render',
        value: function render() {
            var children = this.props.children;


            return _react2.default.createElement(
                'form',
                { onSubmit: this.onFormSubmit.bind(this) },
                this.getFields(),
                children
            );
        }
    }, {
        key: 'onFormSubmit',
        value: function onFormSubmit(e) {
            e.preventDefault();
            var _props = this.props;
            var schemas = _props.schemas;
            var onSubmit = _props.onSubmit;

            var values = this.props.values || this.state;
            this.setState({ _enableValidation: true });
            for (var key in schemas) {
                if (schemas.hasOwnProperty(key) && schemas[key].validate && schemas[key].validate(this.getValueOfKey(key))) return;
            }
            onSubmit(values);
        }
    }, {
        key: 'getValueOfKey',
        value: function getValueOfKey(key) {
            var schemas = this.props.schemas;

            var values = this.props.values || this.state;
            return values[key] !== undefined ? values[key] : this.getFieldClassOfKey(key).getDefaultValue(schemas[key]);
        }
    }, {
        key: 'getFieldClassOfKey',
        value: function getFieldClassOfKey(key) {
            var _props2 = this.props;
            var schemas = _props2.schemas;
            var fieldClass = _props2.fieldClass;

            return schemas[key].fieldClass || fieldClass || Form.defaultFieldClass;
        }
    }, {
        key: 'getEnableValidationOfKey',
        value: function getEnableValidationOfKey(key) {
            return this.state._enableValidation === true || this.state._enableValidation[key];
        }
    }, {
        key: 'getFields',
        value: function getFields() {
            var _this2 = this;

            var _props3 = this.props;
            var schemas = _props3.schemas;
            var values = _props3.values;

            return Object.keys(schemas).map(function (key, index) {
                var schema = schemas[key];
                var FieldClass = _this2.getFieldClassOfKey(key);
                var onFieldChange = values ? function (value) {
                    return _this2.props.onChange(_defineProperty({}, key, value));
                } : function (value) {
                    return _this2.setState(_defineProperty({}, key, value));
                };
                return _react2.default.createElement(FieldClass, {
                    key: index,
                    schema: schema,
                    enableValidation: _this2.getEnableValidationOfKey(key),
                    value: _this2.getValueOfKey(key),
                    onChange: onFieldChange,
                    onFocus: null,
                    onBlur: function onBlur() {
                        var _enableValidation = _this2.state._enableValidation;

                        _enableValidation[key] = true;
                        _this2.setState({ _enableValidation: _enableValidation });
                    }
                });
            });
        }
    }]);

    return Form;
}(_react2.default.Component);

exports.default = Form;


Form.propTypes = {
    schemas: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.array]),
    fieldClass: _react2.default.PropTypes.any,

    values: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.array]),

    // func(values), called with only changed values
    onChange: _react2.default.PropTypes.func,

    // func(values)
    onSubmit: _react2.default.PropTypes.func
};

Form.defaultFieldClass = null;

