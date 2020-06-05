import React from 'react';

const TextArea = ({ name, label, rows, value, onChange, error, customStyle }) => {

  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        className="form-control"
        name={name}
        id={name}
        rows={rows}
        onChange={onChange}
        value={value}
        style={customStyle}
      >
      </textarea>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}

export default TextArea;