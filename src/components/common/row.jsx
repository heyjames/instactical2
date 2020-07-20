import React from 'react';

const Row = ({ children, addToRowClass, customColClass }) => {
  const defaultColClass = "col-md-8 offset-md-2";
  customColClass = (customColClass) ? customColClass : defaultColClass;
  addToRowClass = (addToRowClass) ? " " + addToRowClass : "";

  return (
    <div className={"row" + addToRowClass}>
      <div className={customColClass}>
        {children}
      </div>
    </div>
  );
}
 
export default Row;