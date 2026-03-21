import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/config';

/**
 * PublicRoute - Redirects authenticated users away from guest-only pages (login/signup on `/`, etc.)
 *
 * Do not restore `location.state.from` here: it sent users to `/bookings` after login and
 * conflicted with post-login navigation. Always use `redirectTo` (default: experts).
 */
export const PublicRoute = ({ children, redirectTo = ROUTES.EXPERTS }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
