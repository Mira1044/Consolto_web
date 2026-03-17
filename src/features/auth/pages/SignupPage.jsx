import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';
import { SignupLayout } from '../components/SignupLayout';
import { ROUTES } from '@/routes/config';

/**
 * SignupPage
 * Thin page wrapper: wires routing to feature hook and presentational layout.
 * No business logic lives here.
 */
export const SignupPage = () => {
  const navigate = useNavigate();

  const handleSuccess = useCallback(() => {
    navigate(ROUTES.EXPERTS, { replace: true });
  }, [navigate]);

  const signup = useSignup({ onSuccess: handleSuccess });

  return <SignupLayout {...signup} />;
};
