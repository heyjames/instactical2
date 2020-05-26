import React from 'react';

const Button = ({ label, customClass, onClick, css }) => {
  return (
    <button className={"btn " + customClass} style={css} onClick={onClick}>{label}</button>
  );
}

export default Button;