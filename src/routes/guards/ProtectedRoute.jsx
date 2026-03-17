import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/config';

/**
 * ProtectedRoute - Guards routes that require authentication
 * Redirects unauthenticated users to login page
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.redirectTo - Path to redirect to if not authenticated (default: '/login')
 */
export const ProtectedRoute = ({ children, redirectTo = ROUTES.LOGIN }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
