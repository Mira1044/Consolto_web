import { useState, useCallback } from 'react';
import { createDefaultLogin } from '../models/authModel';
import { validateLogin } from '../validators/authValidator';
import { authService } from '../services/authService';
import { useAuth } from '@/context/AuthContext';
import { useErrorHandler } from '@/shared/services/error';

/**
 * useLogin
 * Feature-level hook that encapsulates login form state and submission.
 */
export const useLogin = ({ onSuccess } = {}) => {
  const [fields, setFields] = useState(createDefaultLogin());
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [_hasSubmitted, setHasSubmitted] = useState(false);
  const { login } = useAuth();
  const { handleApiError, showSuccess } = useErrorHandler();

  const setSingleInvalidCredentialError = useCallback((field = 'email') => {
    setErrors({ [field]: ['Invalid credentials'] });
  }, []);

  const setInlineFromApiMessage = useCallback((message) => {
    const msg = String(message || '').toLowerCase();
    if (msg.includes('password')) {
      setSingleInvalidCredentialError('password');
      return true;
    }
    if (msg.includes('email')) {
      setSingleInvalidCredentialError('email');
      return true;
    }
    if (msg.includes('credential') || msg.includes('invalid')) {
      setSingleInvalidCredentialError('email');
      return true;
    }
    return false;
  }, [setSingleInvalidCredentialError]);

  const setPriorityValidationError = useCallback(
    (validation) => {
      // Show one field at a time: email first, then password.
      if (validation?.errors?.email?.length) {
        setSingleInvalidCredentialError('email');
        return;
      }
      if (validation?.errors?.password?.length) {
        setSingleInvalidCredentialError('password');
      }
    },
    [setSingleInvalidCredentialError],
  );

  /**
   * Update a single field value.
   * Validation is intentionally not run here.
   * Errors are shown only when user clicks Sign in.
   */
  const setField = useCallback(
    (key) => (e) => {
      const {value} = e.target;
      setFields((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  /**
   * Submit the login form through the service layer.
   * On success, store the full auth user (including token) in context
   * so that the web app mirrors the mobile auth flow.
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setHasSubmitted(true);

      // Client-side validation
      const validation = validateLogin(fields);
      if (!validation.success) {
        setPriorityValidationError(validation);
        return;
      }

      setIsLoading(true);

      try {
        const authUser = await authService.login(fields);
        login(authUser);
        setErrors({});
        showSuccess('Login successful');
        onSuccess?.(authUser);
      } catch (err) {
        if (err.fieldErrors) {
          if (err.fieldErrors.email?.length) {
setSingleInvalidCredentialError('email');
} else {
setSingleInvalidCredentialError('password');
}
        } else {
          // For login we don't want a toast for validation errors.
          const appError = handleApiError(err, {
            context: { feature: 'auth', action: 'login' },
            showToUser: false,
          });

          const wasInline = setInlineFromApiMessage(appError?.message);
          if (!wasInline) {
            // Non-field errors (network/server) can still be surfaced as toast.
            handleApiError(err, { context: { feature: 'auth', action: 'login' } });
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fields, login, onSuccess, handleApiError, setInlineFromApiMessage, setPriorityValidationError, setSingleInvalidCredentialError],
  );

  return {
    fields,
    errors,
    isLoading,
    setField,
    handleSubmit,
  };
};
