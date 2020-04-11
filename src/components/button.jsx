import React from 'react';

const Button = ({ label, onClick, style: customStyle }) => {
  let style = "btn ";
  if (customStyle) style += customStyle;

  return (
    <button className={style} onClick={onClick}>{label}</button>
  );
}

export default Button;