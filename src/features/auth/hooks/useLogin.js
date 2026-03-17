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
      const value = e.target.value;
      setFields((prev) => {
        const next = { ...prev, [key]: value };

        // Real-time validation on change
        const validation = validateLogin(next);
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
   * Submit the login form through the service layer.
   * On success, store the full auth user (including token) in context
   * so that the web app mirrors the mobile auth flow.
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
        const authUser = await authService.login(fields);
        login(authUser);
        window.alert('Signed in successfully');
        onSuccess?.(authUser);
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
