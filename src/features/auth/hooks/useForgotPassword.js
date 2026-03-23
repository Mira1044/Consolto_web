import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useErrorHandler } from '@/shared/services/error';
import { getPasswordStrength, getStrengthColor } from '../utils/authUtils';
import { createDefaultForgotPassword } from '../models/authModel';

/**
 * useForgotPassword
 *
 * Encapsulates the three-step forgot-password flow:
 *   0 → enter email  →  1 → verify OTP  →  2 → reset password  →  3 → success
 *
 * Follows the same service → hook → component pattern as useLogin / useSignup.
 */
export const useForgotPassword = ({ onBackToLogin } = {}) => {
  const navigate = useNavigate();
  const { handleApiError } = useErrorHandler();

  const defaults = createDefaultForgotPassword();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState(defaults.email);
  const [otp, setOtp] = useState(defaults.otp);
  const [newPassword, setNewPassword] = useState(defaults.newPassword);
  const [confirmPassword, setConfirmPassword] = useState(defaults.confirmPassword);

  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  const allOtpFilled = otp.every(Boolean);
  const passwordsMatch = newPassword.length >= 8 && newPassword === confirmPassword;

  const passwordStrength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);
  const strengthColor = useMemo(() => getStrengthColor(passwordStrength), [passwordStrength]);

  const handleOtpChange = useCallback((index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
  }, []);

  const goBack = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1);
    } else if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate('/');
    }
  }, [step, onBackToLogin, navigate]);

  const goToLogin = useCallback(() => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate('/');
    }
  }, [onBackToLogin, navigate]);

  const handleSendOtp = useCallback(async () => {
    setIsSending(true);
    setErrors({});
    try {
      await authService.sendOtp(email);
      setStep(1);
    } catch (err) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
      } else {
        handleApiError(err, { context: { feature: 'auth', action: 'sendOtp' } });
      }
    } finally {
      setIsSending(false);
    }
  }, [email, handleApiError]);

  const handleVerifyOtp = useCallback(async () => {
    setIsVerifying(true);
    setErrors({});
    try {
      await authService.verifyOtp({ email, otp: otp.join('') });
      setStep(2);
    } catch (err) {
      handleApiError(err, { context: { feature: 'auth', action: 'verifyOtp' } });
    } finally {
      setIsVerifying(false);
    }
  }, [email, otp, handleApiError]);

  const handleResetPassword = useCallback(async () => {
    setIsUpdating(true);
    setErrors({});
    try {
      await authService.resetPassword({
        email,
        otp: otp.join(''),
        newPassword,
        confirmPassword,
      });
      setStep(3);
    } catch (err) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
      } else {
        handleApiError(err, { context: { feature: 'auth', action: 'resetPassword' } });
      }
    } finally {
      setIsUpdating(false);
    }
  }, [email, otp, newPassword, confirmPassword, handleApiError]);

  return {
    step,
    email,
    setEmail,
    otp,
    handleOtpChange,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    errors,

    isSending,
    isVerifying,
    isUpdating,

    allOtpFilled,
    passwordsMatch,
    passwordStrength,
    strengthColor,

    handleSendOtp,
    handleVerifyOtp,
    handleResetPassword,
    goBack,
    goToLogin,
  };
};
