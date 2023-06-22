import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const withProtectedInRoute = (Component) => {
  return (props) => {
    const { authData } = useContext(AuthContext);
    
    if (authData && authData.user.currentRide) {
      return <Component {...props} />;
    }

    return <Navigate to="/rides" replace />;
  };
};

export default withProtectedInRoute;
