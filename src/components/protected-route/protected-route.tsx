import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '@services/store';
import { userStateSelector } from '@services/slices/user/userSlice';
import { Preloader } from '@ui';

interface ProtectedRouteOptions {
  authIsRequired: boolean;
}

interface ProtectedRouteProps {
  children: ReactNode;
  options?: ProtectedRouteOptions;
}

export const ProtectedRoute = ({ children, options }: ProtectedRouteProps) => {
  const { isAuthed, isInit, isLoading } = useSelector(userStateSelector);
  const location = useLocation();

  if (!isInit || isLoading) return <Preloader />;

  if (options?.authIsRequired && !isAuthed) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (!options?.authIsRequired && isAuthed) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  }

  return <>{children}</>;
};
