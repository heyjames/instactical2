import React from 'react';

const LoggedIn = ({ children, user }) => {
  return (
    <React.Fragment>
      {user && children}
    </React.Fragment>
  );
}
 
export default LoggedIn;