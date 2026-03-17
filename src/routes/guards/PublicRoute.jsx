import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * PublicRoute - Redirects authenticated users away from public-only pages (like login/signup)
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.redirectTo - Path to redirect to if user is authenticated (default: '/experts')
 */
export const PublicRoute = ({ children, redirectTo = '/experts' }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (isLoggedIn) {
    // Redirect authenticated users to the specified route or the page they were trying to access
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
