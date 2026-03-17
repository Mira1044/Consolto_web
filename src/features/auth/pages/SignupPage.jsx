import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';
import { useLogin } from '../hooks/useLogin';
import { SignupLayout } from '../components/SignupLayout';
import { LoginLayout } from '../components/LoginLayout';
import { ROUTES } from '@/routes/config';
import { Hero } from '@/pages/home';
import { ForgotPasswordPage } from '@/auth/components/ForgotPasswordPage';

/**
 * SignupPage
 * Full-screen split: left hero, right auth panel (signup/login/forgot).
 */
export const SignupPage = () => {
  const [mode, setMode] = useState('signup'); // 'signup' | 'login' | 'forgot'
  const navigate = useNavigate();

  const handleSuccess = useCallback(() => {
    navigate(ROUTES.EXPERTS, { replace: true });
  }, [navigate]);

  const signup = useSignup({ onSuccess: handleSuccess });
  const login = useLogin({ onSuccess: handleSuccess });

  const goHome = () => navigate(ROUTES.HOME);

  const renderRight = () => {
    if (mode === 'login') {
      return (
        <LoginLayout
          {...login}
          onForgotPassword={() => setMode('forgot')}
          onGoToSignup={() => setMode('signup')}
          onBackToHome={goHome}
        />
      );
    }

    if (mode === 'forgot') {
      return <ForgotPasswordPage onBackToLogin={() => setMode('login')} />;
    }

    return <SignupLayout {...signup} onGoToLogin={() => setMode('login')} onBackToHome={goHome} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="flex h-screen w-full">
        {/* Left: full hero / marketing (60%) */}
        <div className="hidden flex-[3] lg:flex">
          <Hero />
        </div>

        {/* Right: auth panel (40%) */}
        <div className="flex flex-[2] items-center justify-center px-6 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-6 inline-flex max-w-xs self-end rounded-full bg-white/60 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === 'login'
                    ? 'bg-primary shadow text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === 'signup'
                    ? 'bg-primary shadow text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign up
              </button>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
              {renderRight()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
