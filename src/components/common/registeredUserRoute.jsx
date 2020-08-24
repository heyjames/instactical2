import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from '../../services/authService';

const RegisteredUserRoute = ({ component: Component, render, path }) => {
  return (
    <Route
      path={path}
      render={props => {
        if (!auth.getCurrentUser()) {
          return <Redirect to={{ pathname: "/", state: { from: props.location } }} />;
        }
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  )
}

export default RegisteredUserRoute;