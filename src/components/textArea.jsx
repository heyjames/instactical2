import React from 'react';

const TextArea = ({ name, label, rows, value, onChange, error, customStyle = null, addToClass }) => {
  addToClass = (addToClass) ? " " + addToClass : "";

  return (
    <React.Fragment>
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        className={"form-control form-control-sm" + addToClass}
        name={name}
        id={name}
        rows={rows}
        onChange={onChange}
        value={value}
        style={customStyle}
      >
      </textarea>
      {error && <div className="alert alert-danger">{error}</div>}
    </React.Fragment>
  );
}

export default TextArea;