import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from '../../services/authService';

const ProtectedRoute = ({ component: Component, render, path }) => {
  return (
    <Route
      path={path}
      render={props => {
        if (!auth.getCurrentUser() || !auth.getCurrentUser().isAdmin) {
          return <Redirect to={{ pathname: "/unauthorized" }} />;
        }

        if (!auth.getCurrentUser()) {
          return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />;
        }
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  )
}

export default ProtectedRoute;