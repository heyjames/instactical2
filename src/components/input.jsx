import React from 'react';

const Input = ({ name, label, value, onChange, type, error, bReadOnly, autoFocus, onKeyPress, enclosingTag }) => {
  let renderLabel = (label) ? <label htmlFor={name}>{label}</label> : null;

  let openingTag = "<div className=\"form-group\">";
  let closingTag = "</div>";
  if (enclosingTag === "span") {
    openingTag = "<span className=\"form-group\">";
    closingTag = "</span>";
  }
  // console.log(closingTag);
  return (
    <div className="form-group">
      {renderLabel}
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
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}

export default Input;