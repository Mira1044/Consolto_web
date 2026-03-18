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
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { login } = useAuth();
  const { handleApiError, showSuccess } = useErrorHandler();
  const setInlineFromApiMessage = useCallback((message) => {
    const msg = String(message || 'Invalid credentials');
    const lower = msg.toLowerCase();
    if (lower.includes('password')) {
      setErrors({ password: [msg] });
      return true;
    }
    if (lower.includes('email')) {
      setErrors({ email: [msg] });
      return true;
    }
    return false;
  }, []);

  /**
   * Update a single field value and clear its error.
   */
  const setField = useCallback(
    (key) => (e) => {
      const value = e.target.value;
      setFields((prev) => {
        const next = { ...prev, [key]: value };

        // Real-time validation on change:
        // show only the currently edited field's error until submit.
        const validation = validateLogin(next);
        if (validation.success) {
          setErrors((prevErrors) => {
            if (!prevErrors?.[key]) return prevErrors;
            const { [key]: _removed, ...rest } = prevErrors;
            return rest;
          });
        } else {
          const fieldError = validation.errors?.[key];
          setErrors((prevErrors) => {
            if (hasSubmitted) return validation.errors || {};
            if (!fieldError?.length) {
              if (!prevErrors?.[key]) return prevErrors;
              const { [key]: _removed, ...rest } = prevErrors;
              return rest;
            }
            return { [key]: fieldError };
          });
        }

        return next;
      });
    },
    [hasSubmitted],
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
        setErrors(validation.errors);
        return;
      }

      setErrors({});
      setIsLoading(true);

      try {
        const authUser = await authService.login(fields);
        login(authUser);
        showSuccess('Login successful');
        onSuccess?.(authUser);
      } catch (err) {
        if (err.fieldErrors) {
          setErrors(err.fieldErrors);
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
    [fields, login, onSuccess, handleApiError, setInlineFromApiMessage],
  );

  return {
    fields,
    errors,
    isLoading,
    setField,
    handleSubmit,
  };
};
