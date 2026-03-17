import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BLUE_FROM = '#2563eb';
const BLUE_TO = '#3b82f6';

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl min-h-[560px] rounded-3xl shadow-2xl shadow-blue-900/15 overflow-hidden bg-white grid lg:grid-cols-[2fr,3fr]">
        {/* Left panel */}
        <div className="relative hidden lg:flex flex-col justify-between px-10 py-10 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 text-white">
          <div className="pointer-events-none">
            <div className="absolute -top-16 -right-10 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 -left-10 w-80 h-80 rounded-full bg-blue-700/20 blur-3xl" />
          </div>
          <div className="relative flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-white/30 bg-white/10 flex items-center justify-center">
              <div className="h-4 w-4 rounded-[6px] border border-white/50 border-l-transparent border-b-transparent rotate-45" />
            </div>
            <p className="font-semibold tracking-tight">Consolto</p>
          </div>
          <div className="relative mt-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-blue-100 border border-white/15">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              3-step secure recovery
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-2">
                Forgot your password?
              </h2>
              <p className="text-sm text-slate-200/80 leading-relaxed max-w-xs">
                Verify your identity and reset your password safely in just a few moments.
              </p>
            </div>
            <div className="space-y-3 text-xs text-slate-100/90">
              <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
                <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-semibold">OTP</span>
                </div>
                <p>6‑digit code sent to your registered email</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
                <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-semibold">SSL</span>
                </div>
                <p>End‑to‑end encrypted verification</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
                <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-semibold">10m</span>
                </div>
                <p>OTP expires in 10 minutes</p>
              </div>
            </div>
          </div>
          <p className="relative text-[11px] text-slate-300/80 mt-10">
            © {new Date().getFullYear()} Consolto. All rights reserved.
          </p>
        </div>

        {/* Right panel */}
        <div className="relative flex items-center justify-center px-6 py-10 bg-slate-50">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-sm px-7 py-8">
            {/* Steps */}
            {step < 3 && (
              <div className="flex items-center gap-2 mb-6 text-[11px] tracking-wide uppercase text-slate-400">
                {['Email', 'OTP', 'Reset'].map((label, idx) => {
                  const state =
                    idx < step ? 'done' : idx === step ? 'active' : 'idle';
                  return (
                    <div key={label} className="flex items-center gap-2 flex-1">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold border ${
                          state === 'done'
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : state === 'active'
                            ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-[0_0_0_3px_rgba(37,99,235,0.25)]'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        {state === 'done' ? '✓' : idx + 1}
                      </div>
                      {idx < 2 && (
                        <div
                          className={`h-px flex-1 rounded-full ${
                            idx < step ? 'bg-blue-500' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step content */}
            {step === 0 && (
              <div className="space-y-5 animate-[fadeUp_0.35s_ease-out]">
                <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-1">
                  <span className="text-sm text-blue-600">✉</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900 mb-1">
                    Forgot your password?
                  </h1>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Enter your registered email and we&apos;ll send a 6‑digit OTP to
                    verify your identity.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="fp-email"
                    className="block text-[11px] font-semibold text-slate-600 tracking-wide uppercase mb-1.5"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                      @
                    </span>
                    <input
                      id="fp-email"
                      type="email"
                      value={emailVal}
                      onChange={(e) => setEmailVal(e.target.value)}
                      placeholder="Email"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!emailVal.includes('@') || isSending}
                  onClick={handleSendOtp}
                  className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isSending ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending OTP…
                    </>
                  ) : (
                    <>
                      Send OTP
                      <span className="text-xs">→</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  Remember it?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Go to home
                  </button>
                </p>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5 animate-[fadeUp_0.35s_ease-out]">
                <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-1">
                  <span className="text-sm text-blue-600">🔐</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900 mb-1">
                    Check your email
                  </h1>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    We sent a 6‑digit code to{' '}
                    <span className="font-semibold text-blue-600">{emailVal}</span>. It
                    expires in <span className="font-semibold">10 minutes</span>.
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 tracking-wide uppercase mb-1.5">
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
                <button
                  type="button"
                  disabled={!allOtpFilled || isVerifying}
                  onClick={handleVerifyOtp}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isVerifying ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      Verify OTP
                      <span className="text-xs">→</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  Didn&apos;t receive it?{' '}
                  <button
                    type="button"
                    onClick={() => setOtpVals(['', '', '', '', '', ''])}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-[fadeUp_0.35s_ease-out]">
                <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-1">
                  <span className="text-sm text-blue-600">🔑</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900 mb-1">
                    Set new password
                  </h1>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Choose a strong password — at least 8 characters with letters and
                    numbers.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="new-pass"
                    className="block text-[11px] font-semibold text-slate-600 tracking-wide uppercase mb-1.5"
                  >
                    New password
                  </label>
                  <input
                    id="new-pass"
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                    className="block text-[11px] font-semibold text-slate-600 tracking-wide uppercase mb-1.5"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm-pass"
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  {confirmPass && !passwordsMatch && (
                    <p className="mt-1 text-[11px] text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={!passwordsMatch || isUpdating}
                  onClick={handleResetPassword}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isUpdating ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Updating…
                    </>
                  ) : (
                    <>
                      Reset password
                      <span className="text-xs">→</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 text-center animate-[fadeUp_0.35s_ease-out]">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100">
                  <span className="text-xl">✅</span>
                </div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Password reset!
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Your password has been updated successfully. Sign in with your new
                  credentials.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-lg transition-all"
                >
                  Go to home
                  <span className="text-xs">→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
