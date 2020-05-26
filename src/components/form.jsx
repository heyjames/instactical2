import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './input';
import TextArea from './textArea';
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

  renderButton = (label, customClass, onClick, css = null) => {
    return (
      <Button
        label={label}
        customClass={customClass}
        onClick={onClick}
        css={css}
      />
    );
  }

  renderCheckbox = (name, label, value, onChange) => {
    return (
      <label>
        <input type="checkbox" name={name} checked={value} onChange={onChange} /> {label}
      </label>
    );
  }

  renderInput = (name, label, value, onChange, type = "text", errors, bReadOnly = false, autoFocus = false, keyPressed, enclosingTag) => {
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
        enclosingTag={enclosingTag}
      />
    );
  }

  renderTextArea = (name, label, value, onChange, rows, errors) => {
    return (
      <TextArea
        name={name}
        label={label}
        rows={rows}
        onChange={this.handleChange}
        value={value}
        error={errors[name]}
      />
    );
  }
}

export default Form;