import React from 'react';

const Input2 = ({ name, label, value, onChange, type, error, bReadOnly, autoFocus, onKeyPress, enclosingTag }) => {
  let renderLabel = (label) ? <label htmlFor={name}>{label}</label> : null;

  let openingTag = "<div className=\"form-group\">";
  let closingTag = "</div>";
  if (enclosingTag === "span") {
    openingTag = "<span className=\"form-group\">";
    closingTag = "</span>";
  }

  return (
    <input
      className="form-control form-control-sm"
      name={name}
      id={name}
      type={type}
      onChange={onChange}
      value={value}
      readOnly={bReadOnly}
      autoFocus={autoFocus}
      onKeyPress={onKeyPress}
    />
  );
}

export default Input2;