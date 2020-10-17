import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './input';
import TextArea from './textArea';
import Dropdown from './dropdown';
import Button from './button';

class Form extends Component {
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

  renderCheckbox2 = (name, label, value, onChange, disabled = false) => {
    return (
      <React.Fragment>
        <input style={{ width: "20px", height: "20px", marginTop: "10px" }} type="checkbox" name={name} checked={value} onChange={onChange} disabled={disabled} /> {label}
      </React.Fragment>
    );
  }

  renderSearchCheckbox = (name, label, value, onChange, disabled = false) => {
    return (
      <label>
        <input
          style={{
            verticalAlign: "-10px",
            marginLeft: "12px",
            marginRight: "4px"
          }}
          type="checkbox"
          id={"cb" + name}
          name={name}
          checked={value}
          onChange={onChange}
          disabled={disabled}
        />
        <label className="form-check-label noselect"
          style={{
            verticalAlign: "-10px",
            fontWeight: value && "bold"
          }}
          htmlFor={"cb" + name}
        >
          {label}
        </label>
      </label>
    );
  }

  renderInput = (name, label, value, onChange, type = "text", errors, bReadOnly = false, autoFocus = false, onKeyDown, placeholder = null, addToClass = "") => {
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
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        addToClass={addToClass}
      />
    );
  }

  renderTextArea = (name, label, value, onChange, rows, errors, customStyle, addToClass, disabled) => {
    return (
      <TextArea
        name={name}
        label={label}
        rows={rows}
        onChange={this.handleChange}
        value={value}
        error={errors[name]}
        customStyle={customStyle}
        addToClass={addToClass}
        disabled={disabled}
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
    placeholder,
    disabled) => {

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
        disabled={disabled}
      />
    )
  }
}

export default Form;