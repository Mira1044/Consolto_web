import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/config';

/**
 * ProtectedRoute - Guards routes that require authentication
 * Redirects unauthenticated users to the sign-in page (home `/`).
 * Does not pass `location.state.from` — avoids post-login jumps to Bookings / wrong screens.
 */
export const ProtectedRoute = ({ children, redirectTo = ROUTES.HOME }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate replace to={redirectTo} />;
  }

  return children;
};
