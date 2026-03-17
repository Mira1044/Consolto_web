import { useState, useCallback, useMemo } from 'react';
import { createDefaultSignup } from '../models/authModel';
import { validateSignup } from '../validators/authValidator';
import { doPasswordsMatch } from '../utils/authUtils';
import { authService } from '../services/authService';
import { useAuth } from '@/context/AuthContext';
import { useErrorHandler } from '@/shared/services/error';

/**
 * useSignup
 * Feature-level hook that encapsulates signup form state and submission.
 */
export const useSignup = ({ onSuccess } = {}) => {
  const [fields, setFields] = useState(createDefaultSignup());
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { handleApiError } = useErrorHandler();

  /**
   * Derived: whether passwords currently match.
   */
  const passwordsMatch = useMemo(
    () => doPasswordsMatch(fields.password, fields.confirmPassword),
    [fields.password, fields.confirmPassword],
  );

  /**
   * Update a single field value and clear its error.
   */
  const setField = useCallback(
    (key) => (e) => {
      const value = e.target.value;
      setFields((prev) => {
        const next = { ...prev, [key]: value };

        // Real-time validation on change
        const validation = validateSignup(next);
        if (validation.success) {
          setErrors({});
        } else {
          setErrors(validation.errors || {});
        }

        return next;
      });
    },
    [],
  );

  /**
   * Submit the signup form through the service layer.
   * If the backend returns a token + user (like mobile),
   * log the user in immediately; otherwise fall back to the
   * previous email-only behaviour.
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Client-side validation
      const validation = validateSignup(fields);
      if (!validation.success) {
        setErrors(validation.errors);
        return;
      }

      setErrors({});
      setIsLoading(true);

      try {
        const response = await authService.signup(fields);

        if (response && typeof response === 'object') {
          const { token, user, email, ...rest } = response;

          if (token && user) {
            // Mobile-like: { token, user }
            login({ ...user, token });
          } else if (token) {
            // Fallback: embed token into response itself
            login({ ...rest, email, token });
          } else if (email) {
            // Legacy behaviour
            login(email);
          }
        }

        window.alert('Account created successfully');
        onSuccess?.(response);
      } catch (err) {
        if (err.fieldErrors) {
          setErrors(err.fieldErrors);
        } else {
          handleApiError(err, { context: { feature: 'auth', action: 'signup' } });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fields, login, onSuccess, handleApiError],
  );

  return {
    fields,
    errors,
    isLoading,
    passwordsMatch,
    setField,
    handleSubmit,
  };
};
