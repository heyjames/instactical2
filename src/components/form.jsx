import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './input';
import TextArea from './textArea';
import Dropdown from './dropdown';
import Button from './button';

class Form extends Component {
  // state = {
  //   data: {},
  //   errors: {}
  // }

  // // return Error: Object || null
  // validateProperty = ({ name, value }) => {
  //   const obj = { [name]: value };
  //   const schema = { [name]: this.schema[name] };
  //   const { error } = Joi.validate(obj, schema);

  //   return error ? error.details[0].message : null
  // }

  // // return Error: Object || null
  // validate = () => {
  //   const options = { abortEarly: false };
  //   const { error } = Joi.validate(this.state.data, this.schema, options);

  //   if (!error) return null;

  //   const errors = {};
  //   for (let item of error.details) errors[item.path[0]] = item.message;
  //   return errors;
  // }

  // handleChange = ({ currentTarget: input }) => {
  //   const errors = { ...this.state.errors };
  //   const errorMessage = this.validateProperty(input);
  //   if (errorMessage) errors[input.name] = errorMessage;
  //   else delete errors[input.name];

  //   const data = { ...this.state.data }
  //   data[input.name] = input.value;
  //   this.setState({ data, errors });
  // }

  // handleSubmit = e => {
  //   e.preventDefault();

  //   const errors = this.validate();
  //   this.setState({ errors: errors || {} });
  //   if (errors) return;

  //   this.doSubmit(e);
  // }

  renderButton = (label, customClass, onClick, css = null, fontAwesome = null, disabled = false) => {
    return (
      <Button
        label={label}
        customClass={customClass}
        onClick={onClick}
        css={css}
        fontAwesome={fontAwesome}
        disabled={disabled}
      />
    );
  }

  renderCheckbox = (name, label, value, onChange) => {
    return (

      <div className="form-group">
        <div>
          <label>{label}</label>
        </div>

        <input style={{ width: "20px", height: "20px", marginTop: "7px" }} type="checkbox" name={name} checked={value} onChange={onChange} />
      </div>
    );
  }

  renderCheckbox2 = (name, label, value, onChange) => {
    return (
      <React.Fragment>
        <input style={{ width: "20px", height: "20px", marginTop: "10px" }} type="checkbox" name={name} checked={value} onChange={onChange} /> {label}
      </React.Fragment>
    );
  }

  renderInput = (name, label, value, onChange, type = "text", errors, bReadOnly = false, autoFocus = false, keyPressed = null, placeholder) => {
    return (
      <Input
        type={type}
        name={name}
        label={label}
        onChange={onChange}
        value={value}
        error={errors[name]}
        bReadOnly={bReadOnly}
        autoFocus={autoFocus}
        onKeyPress={keyPressed}
        placeholder={placeholder}
      />
    );
  }

  renderTextArea = (name, label, value, onChange, rows, errors, customStyle) => {
    return (
      <TextArea
        name={name}
        label={label}
        rows={rows}
        onChange={this.handleChange}
        value={value}
        error={errors[name]}
        customStyle={customStyle}
      />
    );
  }

  renderDropdown = (
    name,
    customClass,
    customStyle = null,
    label = null,
    size = null,
    value,
    onChange,
    data,
    dataProperty,
    dataProperty2,
    placeholder) => {

    return (
      <Dropdown
        name={name}
        id={name}
        customClass={customClass}
        customStyle={customStyle}
        label={label}
        size={size}
        value={value}
        onChange={onChange}
        data={data}
        dataProperty={dataProperty}
        dataProperty2={dataProperty2}
        placeholder={placeholder}
      />
    )
  }
}

export default Form;