import React from 'react';

const Container = ({ children, style }) => {
  return (
    <div className="jumbotron jumbotron-fluid" style={style}>
      <div className="container">
        {children}
      </div>
    </div>
  );
}
 
export default Container;