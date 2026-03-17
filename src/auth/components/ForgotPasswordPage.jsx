import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/shared/components/ui';

export function ForgotPasswordPage({ onBackToLogin }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [emailVal, setEmailVal] = useState('');
  const [otpVals, setOtpVals] = useState(['', '', '', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const allOtpFilled = otpVals.every((v) => v);
  const passwordsMatch = newPass.length >= 8 && newPass === confirmPass;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSendOtp = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setStep(1);
    }, 800);
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2);
    }, 800);
  };

  const handleResetPassword = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setStep(3);
    }, 800);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    } else {
      if (onBackToLogin) {
        onBackToLogin();
      } else {
        navigate('/');
      }
    }
  };

  const handleOtpChange = (index, value) => {
    const v = value.replace(/\D/g, '').slice(-1);
    setOtpVals((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
  };

  const passwordStrength = (() => {
    let str = 0;
    if (newPass.length >= 6) str++;
    if (newPass.length >= 10) str++;
    if (/[A-Z]/.test(newPass) && /[0-9]/.test(newPass)) str++;
    if (/[^A-Za-z0-9]/.test(newPass)) str++;
    return str;
  })();

  const strengthColor = ['#ef4444', '#f97316', '#eab308', '#22c55e'][
    Math.max(0, passwordStrength - 1)
  ];

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900">Forgot password</h2>
        <p className="mt-2 text-gray-600">
          Reset your password in a few quick steps.
        </p>
      </div>

      <div className="space-y-6">
        {/* Steps indicator */}
        {step < 3 && (
          <div className="relative mb-6 text-[11px] tracking-wide uppercase text-slate-400">
            {/* Timeline connector line */}
            <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-200" />
            <div className="relative flex items-center justify-between">
              {['Email', 'OTP', 'Reset'].map((label, idx) => {
                const state = idx < step ? 'done' : idx === step ? 'active' : 'idle';
                const isCompleted = idx < step;

                return (
                  <div key={label} className="flex flex-col items-center gap-1 w-1/3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold border transition-colors bg-white ${
                        state === 'done'
                          ? 'border-blue-600 text-blue-600'
                          : state === 'active'
                          ? 'border-blue-500 text-blue-700 shadow-[0_0_0_3px_rgba(37,99,235,0.25)]'
                          : 'border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <span className="text-[10px] tracking-wide text-slate-500">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step content */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Forgot your password?
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Enter your registered email and we&apos;ll send a 6‑digit OTP to verify
                your identity.
              </p>
            </div>
            <div>
              <label
                htmlFor="fp-email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <Input
                id="fp-email"
                type="email"
                value={emailVal}
                onChange={(e) => setEmailVal(e.target.value)}
                placeholder="Email"
                autoComplete="email"
              />
            </div>
            <Button
              type="button"
              disabled={!emailVal.includes('@') || isSending}
              isLoading={isSending}
              fullWidth
              size="lg"
              onClick={handleSendOtp}
            >
              {isSending ? 'Sending OTP…' : 'Send OTP'}
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Check your email
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                We sent a 6‑digit code to{' '}
                <span className="font-semibold text-blue-600">{emailVal}</span>. It
                expires in <span className="font-semibold">10 minutes</span>.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <div className="flex gap-2">
                {otpVals.map((v, idx) => (
                  <input
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    value={v}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    maxLength={1}
                    inputMode="numeric"
                    className="h-11 flex-1 rounded-lg border border-slate-200 bg-slate-50 text-center text-sm font-semibold text-blue-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                ))}
              </div>
            </div>
            <Button
              type="button"
              disabled={!allOtpFilled || isVerifying}
              isLoading={isVerifying}
              fullWidth
              size="lg"
              onClick={handleVerifyOtp}
            >
              {isVerifying ? 'Verifying…' : 'Verify OTP'}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Set new password
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Choose a strong password — at least 8 characters with letters and
                numbers.
              </p>
            </div>
            <div>
              <label
                htmlFor="new-pass"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New password
              </label>
              <Input
                id="new-pass"
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
              />
              <div className="mt-2 flex gap-1.5 h-1.5">
                {[0, 1, 2, 3].map((idx) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div
                    key={idx}
                    className="flex-1 rounded-full bg-slate-200 transition-colors"
                    style={{
                      backgroundColor:
                        passwordStrength > idx ? strengthColor : '#e2e8f0',
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm-pass"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm password
              </label>
              <Input
                id="confirm-pass"
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
              />
              {confirmPass && !passwordsMatch && (
                <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
              )}
            </div>
            <Button
              type="button"
              disabled={!passwordsMatch || isUpdating}
              isLoading={isUpdating}
              fullWidth
              size="lg"
              onClick={handleResetPassword}
            >
              {isUpdating ? 'Updating…' : 'Reset password'}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 text-center">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100">
              <span className="text-xl">✅</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Password reset!
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
              Your password has been updated successfully. Sign in with your new
              credentials.
            </p>
            <Button
              type="button"
              fullWidth
              size="lg"
              onClick={() => (onBackToLogin ? onBackToLogin() : navigate('/'))}
            >
              Back to sign in
            </Button>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-gray-600">
        Remembered your password?{' '}
        <button
          type="button"
          onClick={() => (onBackToLogin ? onBackToLogin() : navigate('/'))}
          className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
