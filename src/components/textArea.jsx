import React, { Component } from 'react';

const TextArea = ({ name, label, rows, value, error, onChange }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <textarea
        className="form-control"
        name={name}
        id={name}
        rows={rows}
        value={value}
        onChange={onChange}>
      </textarea>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}

export default TextArea;