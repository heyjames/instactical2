import React from 'react';

const Button = ({ 
  label,
  customClass,
  onClick,
  css,
  fontAwesomeClass = null,
  disabled = false
}) => {
  const icon = (fontAwesomeClass) 
             ? <i className={"fa " + fontAwesomeClass} aria-hidden="true"></i>
             : null;
  return (
    <button 
      className={"btn " + customClass} 
      style={css} 
      onClick={onClick} 
      disabled={disabled}
    >
      {icon} {label}
    </button>
  );
}

export default Button;