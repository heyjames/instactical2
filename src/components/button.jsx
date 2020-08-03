import React from 'react';

const Button = ({ 
  label,
  customClass,
  onClick,
  css,
  fontAwesome,
  disabled = false
}) => {
  const icon = (fontAwesome)
             ? <i className={"fa " + fontAwesome} aria-hidden="true"></i>
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