import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuthGuard();

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/page-not-found" replace />;
  }

  return <>{children}</>;
};