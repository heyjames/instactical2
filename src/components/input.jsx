import React from 'react';

const Input = ({ name, label, placeholder, value, onChange, type, error, bReadOnly, autoFocus, onKeyPress, addToClass }) => {
  let renderLabel = (label) ? <label htmlFor={name}>{label}</label> : null;

  return (
    <React.Fragment>
      {renderLabel}
      <input
        className={"form-control form-control-sm" + " " + addToClass}
        name={name}
        id={name}
        type={type}
        onChange={onChange}
        value={value}
        readOnly={bReadOnly}
        autoFocus={autoFocus}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </React.Fragment>
  );
}

export default Input;