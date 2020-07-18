import React from 'react';

const Admin = ({ children, user }) => {
  return (
    <React.Fragment>
      {(user && user.isAdmin) && children}
    </React.Fragment>
  );
}
 
export default Admin;