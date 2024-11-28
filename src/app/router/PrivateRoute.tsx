import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useUserStore();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user && user.isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
