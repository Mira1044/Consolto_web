import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { useSignup } from '../hooks/useSignup';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { LoginLayout } from '../components/LoginLayout';
import { SignupLayout } from '../components/SignupLayout';
import { ForgotPasswordLayout } from '../components/ForgotPasswordLayout';
import { ROUTES } from '@/routes/config';
import { Hero } from '@/pages/home';

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
  const forgotPassword = useForgotPassword({ onBackToLogin: () => setMode('login') });

  const goHome = () => navigate(ROUTES.HOME);

  const renderRight = () => {
    if (mode === 'signup') {
      return (
        <SignupLayout
          {...signup}
          onBackToHome={goHome}
          onGoToLogin={() => setMode('login')}
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

    return (
      <LoginLayout
        {...login}
        onBackToHome={goHome}
        onForgotPassword={() => setMode('forgot')}
        onGoToSignup={() => setMode('signup')}
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
