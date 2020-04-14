import React from 'react';

const Button = ({ label, style, onClick }) => {
  return (
    <button className={"btn " + style} onClick={onClick}>{label}</button>
  );
}

export default Button;