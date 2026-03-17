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
  const { login } = useAuth();
  const { handleApiError } = useErrorHandler();

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
   * Submit the login form through the service layer.
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Client-side validation
      const validation = validateLogin(fields);
      if (!validation.success) {
        setErrors(validation.errors);
        return;
      }

      setErrors({});
      setIsLoading(true);

      try {
        const response = await authService.login(fields);
        login(response.email);
        onSuccess?.(response);
      } catch (err) {
        if (err.fieldErrors) {
          setErrors(err.fieldErrors);
        } else {
          handleApiError(err, { context: { feature: 'auth', action: 'login' } });
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
    setField,
    handleSubmit,
  };
};
