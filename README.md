# Shaking React Form
build and use extensible react forms easily.

## Activation
Writing forms is terrible, writing forms with validations is extremely terrible. We want to build forms with validations
easily, meanwhile, we want to use different styles. By searching and learning some existing react form projects, I found
them difficult to use or hard to extend...

## Design Targets
- based on react
- schema driven
- least dependencies
- simple and robust
- easy to use
- easy to extend with different layouts, styles, input types

## Install
This package depends on React, so you should make sure that React is installed first.

After that, `npm install shaking-react-form --save`.

Then **install at least one shaking-react-form-field package**, such as 

- `npm install react-bootstrap-shacking-react-form-field --save`, see [github](https://github.com/ShakingMap/react-bootstrap-shaking-react-form-field)
- ...

## Relations between Form and Field
In order to achieve high extendability, the system is divide into **form** part and **field** part. The form part is 
responsible to manage the whole state and logic, while the field part takes responsibility to show individual fields,
such as how to layout and style input field, and how to show validation errors.

With such design, the core form part can be short, stable and robust with about only 100 lines, while infinite types
and styles of field can be created and work with the core form. the code of field part may looks a little more than the
core form, but with concentrated focus, implement a series of fields is not hard.

## Simple Usage
### Define schemas
A schema is the core of a form field. It's just a plain js object with fields: label, type, validate, options and
fieldClass. for example:

    ```
    {
        label: 'username',
        type: 'text',
        validate(value){
            if (!value) return 'username is required'
        },
        options: {
            placeholder: 'input username'
        },
        fieldClass: ReactBootstrapField
    }
    ```

- **label** - label of the field, can be omitted.
- **type** - type of the field. the form itself doesn't has any limit with type, it's the **fieldClass** which decide what
types it can and how to handle.
- **validate** - define how to validate the value of the field. return an error string to indicate a validation error.
- **options** - other options the field may need. it's the **fieldClass** which decide what options it can and how to handle.
- **filedClass** - import from any shaking-react-form-field package, decide how to render this field.

Here is a complete code demo:

    ```
    import React from 'react';
    import {Button} from 'react-bootstrap';
    
    import ReactBootstrapField from 'react-bootstrap-shaking-react-form-field';
    import ShackingForm from 'shaking-react-form';
    
    const schemas = [
        {
            label: 'username',
            type: 'text',
            validate(v){
                if (!v) return 'username is required'
            },
            options: {
                placeholder: 'inpute username'
            }
        },
    
        {
            label: 'password',
            type: 'password',
            validate(v){
                if (!v) return 'password is required'
            }
        },
    
        {
            label: 'countries',
            type: 'group.select',
            validate(v) {
                if (v.japan) return 'cannot select Japan'
            },
            options: {
                group: {
                    japan: 'Japan',
                    china: 'China',
                    america: 'America'
                },
                multiple: true
            }
        }
    ];
    
    export default class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                _schemas: schemas
            }
        }
    
        render() {
            return <div className="container">
                <h1>test page</h1>
                <ShackingForm
                    schemas={this.state._schemas}
                    onSubmit={(values)=>console.log(values)}
                    values={this.state} // if values are not specified, the form is uncontrolled
                    onChange={(values)=>{this.setState(values)}}
                >
                    <Button bsStyle="primary" type="submit">Submit</Button>
                </ShackingForm>
            </div>
        }
    }
    
    ShackingForm.defaultFieldClass = ReactBootstrapField;
    ```

Note: In the last line, we can set default field class this way for all for fields. We can also specify **fieldClass**
prop of ShakingForm to let all fields of this form to use this field class.

Also note: The form does not know any thing about the values and options. They are only passed up and down, only the field
class know how to handle them. By keeping the form unknown of the diversity of the fields, we can extend the whole system
without touch the core form.

If you want to know what types and options you can use, and what kind of values the fields need, you may refer to the
field class projects.

- [react-bootstrap](https://github.com/ShakingMap/react-bootstrap-shaking-react-form-field)
- ...

## Advanced
Hopefully, with the separation of form and field, we can build the whole system gradually and together. Building a form
class may look harder than use, but don't worry, there are actually only several pieces of conventions and once you get 
the idea, you will find yourself full of creativity and productivity.

A form class is just a react component class which receives several specific props and should act by some rules.

props:

- **schema** - same as described before. the component should render correctly with the label, type and options.
- **value, onChange(value)** - this time the component should decide what kind of value it receives and should properly
call onChange when the value change.
- **schema.validate** - an unusual duty of our fields is to properly display validation errors. Call this method against
received value to get validation errors (or nothing if ok).
- **enableValidation** - if this flag is false, field should not validate and display validation errors.
- **onFocus, onBlur** - these callbacks are used by form to optimize UX.

methods:

- **getDefaultValue(schema): value** - this method should return the default value of a specific schema

A good way to get started is by looking through the code of 
[react-bootstrap](https://github.com/ShakingMap/react-bootstrap-shaking-react-form-field)