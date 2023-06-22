import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const withProtectedRoute = (Component) => {
  return (props) => {
    const { authData } = useContext(AuthContext);

    if (authData && authData.token) {
      return <Component {...props} />;
    }

    return <Navigate to="/signin" replace />;
  };
};

export default withProtectedRoute;
