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

  const handleSuccess = useCallback(() => {
    navigate(ROUTES.HOME, { replace: true });
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
      {/* Top-left Consolto logo + text */}
      <div className="absolute left-4 sm:left-6 top-4 z-10 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center shadow-sm">
          <div className="h-5 w-5 rounded-full border border-blue-500 flex items-center justify-center">
            <span className="text-[10px] text-blue-500 font-semibold">...</span>
          </div>
        </div>
        <span className="text-xl font-semibold tracking-tight text-blue-600">
          consolto
        </span>
      </div>

      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* Top on tablet, left on desktop */}
        <div className="hidden md:flex w-full md:h-[46vh] lg:h-auto lg:basis-[65%]">
          <Hero />
        </div>

        {/* Right: auth panel */}
        <div className="flex w-full lg:basis-[35%] items-start md:items-center justify-center px-4 sm:px-6 lg:px-12 py-10 sm:py-12 lg:py-0">
          <div className="w-full max-w-md">
            {renderRight()}
          </div>
        </div>
      </div>
    </div>
  );
};
