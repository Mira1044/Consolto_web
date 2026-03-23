import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';
import { useLogin } from '../hooks/useLogin';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { SignupLayout } from '../components/SignupLayout';
import { LoginLayout } from '../components/LoginLayout';
import { ForgotPasswordLayout } from '../components/ForgotPasswordLayout';
import { ROUTES } from '@/routes/config';
import { Hero } from '@/pages/home';

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
  const forgotPassword = useForgotPassword({ onBackToLogin: () => setMode('login') });

  const goHome = () => navigate(ROUTES.HOME);

  const renderRight = () => {
    if (mode === 'login') {
      return (
        <LoginLayout
          {...login}
          onBackToHome={goHome}
          onForgotPassword={() => setMode('forgot')}
          onGoToSignup={() => setMode('signup')}
        />
      );
    }

    if (mode === 'forgot') {
      return (
        <ForgotPasswordLayout
          {...forgotPassword}
          onConfirmPasswordChange={forgotPassword.setConfirmPassword}
          onEmailChange={forgotPassword.setEmail}
          onGoToLogin={forgotPassword.goToLogin}
          onNewPasswordChange={forgotPassword.setNewPassword}
          onOtpChange={forgotPassword.handleOtpChange}
          onResetPassword={forgotPassword.handleResetPassword}
          onSendOtp={forgotPassword.handleSendOtp}
          onVerifyOtp={forgotPassword.handleVerifyOtp}
        />
      );
    }

    return <SignupLayout {...signup} onBackToHome={goHome} onGoToLogin={() => setMode('login')} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="flex h-screen w-full">
        {/* Left: full hero / marketing (60%) */}
        <div className="hidden min-h-0 w-full flex-[3] self-stretch lg:flex lg:min-h-screen">
          <Hero />
        </div>

        {/* Right: auth panel (40%) */}
        <div className="flex flex-[2] items-center justify-center px-6 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-6 inline-flex max-w-xs self-end rounded-full bg-white/60 p-1 shadow-sm">
              <button
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === 'login'
                    ? 'bg-primary shadow text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                type="button"
                onClick={() => setMode('login')}
              >
                Sign in
              </button>
              <button
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === 'signup'
                    ? 'bg-primary shadow text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                type="button"
                onClick={() => setMode('signup')}
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
