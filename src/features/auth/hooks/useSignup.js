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
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  /**
   * Submit the signup form through the service layer.
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
        login(response.email);
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
