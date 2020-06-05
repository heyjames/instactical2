import React from 'react';

const Dropdown = ({ name, id, customClass, customStyle, label, size, value, onChange, data, dataProperty, dataProperty2 }) => {
  return (
    <select
      className={customClass}
      name={name}
      onChange={onChange}
      value={value}
    >
      <option value=""> -- Select An Option -- </option>
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