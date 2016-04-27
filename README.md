# Shaking React Form
build and use extensible react forms easily.

## Note
This project has been updated to version 1.X.X. There are break changes from lower versions in api.

## Activation
Writing forms is boring, writing forms with validations is extremely boring. We want to build forms with validations
easily, meanwhile, we want to use different styles. By searching and learning some existing react form projects, I found
them difficult to use or hard to extend...

## Design Goals
- based on react
- schema driven
- least dependencies
- simple and robust
- easy to use
- easy to extend with different layouts, styles, input types

## Installation
- install React
- install core form by `npm install shaking-react-form --save`
- write your form field class or install some existing field packages listed below.

## Available field packages
- [raw-shaking-react-form-field](https://github.com/ShakingMap/raw-shaking-react-form-field)
- [react-bootstrap-shaking-react-form-field](https://github.com/ShakingMap/react-bootstrap-shaking-react-form-field)

## Demo
[More demos](https://github.com/ShakingMap/shaking-react-form-demo)

Brief demo:

    import ShackingForm from 'shaking-react-form';
    import RawShakingReactFormField from 'raw-shaking-react-form-field';
    
    const schemas = {
        username: {
            label: 'Username',
            validate(v){
                if (!v) return 'username is required'
            },
            options: {
                placeholder: 'input username'
            }
        },
        
        password: {
            label: 'Password',
            type: 'password',
            validate(v){
                if (!v || v.length < 6) return 'password cannot be less than 6 letters'
            }
        },
    }
    
    class SomeReactComponent extends React.Component {
        // you can save form values as you like, here is just for convenience saving them directly into state
        constructor(props) {
            super(props);
            this.state = {};
            Object.keys(schemas).forEach(key=>this.state[key] = null);
        }
    
        render() {
            return <div>
                <ShackingForm
                    schemas={schemas}
                    values={this.state}
                    onChange={(values)=>{this.setState(values)}}
                    onSubmit={(values)=>console.log('submit', values)}
                    onErrors={(errors)=>console.log('errors', errors)}
                    fieldClass={RawShakingReactFormField}
                >
                    <button type="submit">Submit</button>
                </ShackingForm>
            </div>
        }
    }

## Apis
### props
- {Array | Object} **schemas** - schemas for form fields. a schema is like
    
        {
            type: '...', // defined by the field class you use
            label: '...',
            validate: function(value){...}, // validation function for value of this field, return a string to indicate an validation error
            options: ..., // any thing a specific field needs, defined by the field class you use  
            fieldClass: ... // you can specify a the field class for this filed individually
        }
        
- {ReactComponent} **[fieldClass]** - the field class the form will use to render the fields
- {Array | Object} **[values]** - values for form fields. if not defined, the form will be uncontrolled
- {Func} **[onChange]** - function(values), callback for change events of fields, only changed values are passed in
- {Func} **[onSubmit]** - function(values), callback for submit event of the form, won't be triggered if there are validation errors
- {Func} **[onErrors]** - function(errors), callback for submit event of the form, will be triggered only if there are validation errors

### settings
- **defaultFieldClass** - you can set a field class for all forms in your app by `ShackingForm.defaultFieldClass = ...`

## Advanced
You can create your own field classes, it's not hard, and we hope you can contribute them to the society :)

A field class is nothing but a react component which is responsible to **properly** render the field with several props:

- {String} label
- {String} type
- {Any} options
- {Any} value
- {Func(value)} onChange
- {String} validationState - null, 'success' or 'error'
- {String} validationError

there are no limit about type, options, and value, you can define and describe them clearly in your docs.

have a look at [how we do](https://github.com/ShakingMap/raw-shaking-react-form-field/blob/master/src/field.jsx) can also give you some helps.

## Q&A
### How to customize style or layout of a field?
You can create your own field class, use it for a individual field or compose it into default field class.
see [how to create field class](https://github.com/ShakingMap/shaking-react-form#advanced) and [how to compose field classes](https://github.com/ShakingMap/shaking-react-form#how-to-compose-field-classes)

### How to compose field classes
A field class can be just a swicher which renders other field class by default. So you can write such a swicher field class to compose many other field classes. [react-mapper](https://github.com/zhaoyao91/react-mapper) is a good helper for you to do this. Also refer to this [demo](https://github.com/ShakingMap/shaking-react-form-demo/tree/master/compose-field-class).
