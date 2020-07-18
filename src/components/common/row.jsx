import React from 'react';

const Row = ({ children, customClass }) => {
  return (
    <div className={"row " + customClass}>
      <div className="col-md-8 offset-md-2">
        {children}
      </div>
    </div>
  );
}
 
export default Row;