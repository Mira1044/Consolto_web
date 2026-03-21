import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { useSignup } from '../hooks/useSignup';
import { LoginLayout } from '../components/LoginLayout';
import { SignupLayout } from '../components/SignupLayout';
import { ROUTES } from '@/routes/config';
import { Hero } from '@/pages/home';
import { ForgotPasswordPage } from '@/auth/components/ForgotPasswordPage';

/**
 * LoginPage
 * Full-screen split: left hero, right auth panel (login/signup/forgot).
 */
export const LoginPage = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const navigate = useNavigate();

  // `/` (ROUTES.HOME) is this same login screen (guest-only). Navigating there after login
  // leaves you on a route where PublicRoute hides the form — looks like "home without login".
  // Send users to the app entry instead.
  const handleSuccess = useCallback(() => {
    navigate(ROUTES.EXPERTS, { replace: true });
  }, [navigate]);

  const login = useLogin({ onSuccess: handleSuccess });
  const signup = useSignup({ onSuccess: handleSuccess });

  const goHome = () => navigate(ROUTES.HOME);

  const renderRight = () => {
    if (mode === 'signup') {
      return (
        <SignupLayout
          {...signup}
          onGoToLogin={() => setMode('login')}
          onBackToHome={goHome}
        />
      );
    }

    if (mode === 'forgot') {
      return <ForgotPasswordPage onBackToLogin={() => setMode('login')} />;
    }

    return (
      <LoginLayout
        {...login}
        onForgotPassword={() => setMode('forgot')}
        onGoToSignup={() => setMode('signup')}
        onBackToHome={goHome}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* Top on tablet, left on desktop */}
        <div className="hidden min-h-0 w-full sm:flex sm:min-h-screen sm:flex-1 sm:self-stretch lg:h-auto lg:basis-[65%]">
          <Hero />
        </div>

        {/* Right: auth panel */}
        <div className="flex w-full lg:basis-[35%] items-start sm:flex-1 sm:items-center sm:justify-end justify-center px-4 sm:px-6 lg:px-12 py-10 sm:py-10 lg:py-0">
          <div className="w-full max-w-md">
            {renderRight()}
          </div>
        </div>
      </div>
    </div>
  );
};
