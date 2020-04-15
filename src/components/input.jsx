import React from 'react';

// account.username = value
// this.handleChange = onChange
// const Input = ({ name, label, error, ...rest }) => {
const Input = ({ name, label, value, onChange, type, error, bReadOnly }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        className="form-control"
        name={name}
        id={name}
        type={type}
        onChange={onChange}
        value={value}
        readOnly={bReadOnly}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}

export default Input;