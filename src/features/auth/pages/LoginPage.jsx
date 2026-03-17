import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { LoginLayout } from '../components/LoginLayout';
import { ROUTES } from '@/routes/config';

/**
 * LoginPage
 * Thin page wrapper: wires routing to feature hook and presentational layout.
 * No business logic lives here.
 */
export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.EXPERTS;

  const handleSuccess = useCallback(() => {
    navigate(from, { replace: true });
  }, [navigate, from]);

  const login = useLogin({ onSuccess: handleSuccess });

  return <LoginLayout {...login} />;
};
