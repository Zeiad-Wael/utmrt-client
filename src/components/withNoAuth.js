import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const withNoAuth = (Component) => {
  return (props) => {
    const { authData } = useContext(AuthContext);

    if (!authData || !authData.token) {
      return <Component {...props} />;
    }

    return <Navigate to="/" replace />;
  };
};

export default withNoAuth;
