import { Button, Input } from '@/shared/components/ui';

const STEPS = ['Email', 'OTP', 'Reset'];

function StepIndicator({ currentStep }) {
  return (
    <div className="relative mb-6 text-[11px] uppercase tracking-wide text-slate-400">
      <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-200" />
      <div className="relative flex items-center justify-between">
        {STEPS.map((label, idx) => {
          const state = idx < currentStep ? 'done' : idx === currentStep ? 'active' : 'idle';
          return (
            <div key={label} className="flex w-1/3 flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border bg-white text-[11px] font-semibold transition-colors ${
                  state === 'done'
                    ? 'border-blue-600 text-blue-600'
                    : state === 'active'
                      ? 'border-blue-500 text-blue-700 shadow-[0_0_0_3px_rgba(37,99,235,0.25)]'
                      : 'border-slate-300 text-slate-400'
                }`}
              >
                {idx < currentStep ? '✓' : idx + 1}
              </div>
              <span className="text-[10px] tracking-wide text-slate-500">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmailStep({ email, errors, isSending, onEmailChange, onSendOtp }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-1 text-lg font-semibold text-slate-900">Forgot your password?</h3>
        <p className="text-sm leading-relaxed text-slate-500">
          Enter your registered email and we&apos;ll send a 6‑digit OTP to verify your identity.
        </p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="fp-email">
          Email address
        </label>
        <Input
          autoComplete="email"
          id="fp-email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
        {errors?.email?.[0] && <p className="mt-1 text-sm text-red-500">{errors.email[0]}</p>}
      </div>
      <Button
        fullWidth
        disabled={!email.includes('@') || isSending}
        isLoading={isSending}
        size="lg"
        type="button"
        onClick={onSendOtp}
      >
        {isSending ? 'Sending OTP…' : 'Send OTP'}
      </Button>
    </div>
  );
}

function OtpStep({ email, otp, allOtpFilled, isVerifying, onOtpChange, onVerifyOtp }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-1 text-lg font-semibold text-slate-900">Check your email</h3>
        <p className="text-sm leading-relaxed text-slate-500">
          We sent a 6‑digit code to{' '}
          <span className="font-semibold text-blue-600">{email}</span>. It expires in{' '}
          <span className="font-semibold">10 minutes</span>.
        </p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Enter OTP</label>
        <div className="flex gap-2">
          {otp.map((v, idx) => (
            <input
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className="h-11 flex-1 rounded-lg border border-slate-200 bg-slate-50 text-center text-sm font-semibold text-blue-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              inputMode="numeric"
              maxLength={1}
              value={v}
              onChange={(e) => onOtpChange(idx, e.target.value)}
            />
          ))}
        </div>
      </div>
      <Button
        fullWidth
        disabled={!allOtpFilled || isVerifying}
        isLoading={isVerifying}
        size="lg"
        type="button"
        onClick={onVerifyOtp}
      >
        {isVerifying ? 'Verifying…' : 'Verify OTP'}
      </Button>
    </div>
  );
}

function ResetStep({
  newPassword,
  confirmPassword,
  errors,
  passwordsMatch,
  passwordStrength,
  strengthColor,
  isUpdating,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onResetPassword,
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-1 text-lg font-semibold text-slate-900">Set new password</h3>
        <p className="text-sm leading-relaxed text-slate-500">
          Choose a strong password — at least 8 characters with letters and numbers.
        </p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="new-pass">
          New password
        </label>
        <Input
          autoComplete="new-password"
          id="new-pass"
          placeholder="Min. 8 characters"
          type="password"
          value={newPassword}
          onChange={(e) => onNewPasswordChange(e.target.value)}
        />
        {errors?.newPassword?.[0] && (
          <p className="mt-1 text-sm text-red-500">{errors.newPassword[0]}</p>
        )}
        <div className="mt-2 flex h-1.5 gap-1.5">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="flex-1 rounded-full bg-slate-200 transition-colors"
              style={{ backgroundColor: passwordStrength > idx ? strengthColor : '#e2e8f0' }}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="confirm-pass">
          Confirm password
        </label>
        <Input
          autoComplete="new-password"
          id="confirm-pass"
          placeholder="Repeat your password"
          type="password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
        />
        {confirmPassword && !passwordsMatch && (
          <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
        )}
      </div>
      <Button
        fullWidth
        disabled={!passwordsMatch || isUpdating}
        isLoading={isUpdating}
        size="lg"
        type="button"
        onClick={onResetPassword}
      >
        {isUpdating ? 'Updating…' : 'Reset password'}
      </Button>
    </div>
  );
}

function SuccessStep({ onGoToLogin }) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
        <span className="text-xl">✅</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">Password reset!</h3>
      <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate-500">
        Your password has been updated successfully. Sign in with your new credentials.
      </p>
      <Button fullWidth size="lg" type="button" onClick={onGoToLogin}>
        Back to sign in
      </Button>
    </div>
  );
}

const STEP_COMPONENTS = [EmailStep, OtpStep, ResetStep, SuccessStep];

/**
 * ForgotPasswordLayout
 *
 * Pure presentation component for the forgot-password flow.
 * All state and logic live in useForgotPassword — this just renders.
 */
export function ForgotPasswordLayout({
  step,
  email,
  otp,
  newPassword,
  confirmPassword,
  errors,
  isSending,
  isVerifying,
  isUpdating,
  allOtpFilled,
  passwordsMatch,
  passwordStrength,
  strengthColor,
  onEmailChange,
  onOtpChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSendOtp,
  onVerifyOtp,
  onResetPassword,
  onGoToLogin,
}) {
  const stepProps = [
    { email, errors, isSending, onEmailChange, onSendOtp },
    { email, otp, allOtpFilled, isVerifying, onOtpChange, onVerifyOtp },
    {
      newPassword,
      confirmPassword,
      errors,
      passwordsMatch,
      passwordStrength,
      strengthColor,
      isUpdating,
      onNewPasswordChange,
      onConfirmPasswordChange,
      onResetPassword,
    },
    { onGoToLogin },
  ];

  const StepComponent = STEP_COMPONENTS[step];

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900">Forgot password</h2>
        <p className="mt-2 text-gray-600">Reset your password in a few quick steps.</p>
      </div>

      <div className="space-y-6">
        {step < 3 && <StepIndicator currentStep={step} />}
        <StepComponent {...stepProps[step]} />
      </div>

      <div className="text-center text-sm text-gray-600">
        Remembered your password?{' '}
        <button
          className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          type="button"
          onClick={onGoToLogin}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
