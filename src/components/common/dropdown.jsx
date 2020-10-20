import React from 'react';

const Dropdown = ({ name, id, customClass, customStyle, label, size, value, onChange, data, dataProperty, dataProperty2, placeholder = null, disabled = false }) => {
  if (placeholder === null || placeholder === "") {
    placeholder = " -- Select An Option -- ";
  }

  return (
    <select
      className={customClass}
      name={name}
      onChange={onChange}
      value={value}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {data.map((item, index) => {
        return (
          <option
            key={index}
            value={item[dataProperty]}
          >
            {item[dataProperty2]}
          </option>
        )
      })}
    </select>
  );
}

export default Dropdown;