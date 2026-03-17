import { useCallback } from 'react';
import { useError } from './ErrorContext';
import { handleApiError as processApiError } from '../api/errorHandler';
import { logError } from './errorLogger';
import { ToastType } from './ErrorToast';

/**
 * Hook for handling errors with automatic processing and display
 * @returns {Object} Error handling functions
 */
export const useErrorHandler = () => {
  const { handleError, addError } = useError();

  /**
   * Handle API errors
   */
  const handleApiError = useCallback(
    (error, options = {}) => {
      const appError = processApiError(error);
      logError(appError, options.context);
      return handleError(appError, options);
    },
    [handleError]
  );

  /**
   * Handle generic errors
   */
  const handleGenericError = useCallback(
    (error, options = {}) => {
      return handleError(error, options);
    },
    [handleError]
  );

  /**
   * Show success message
   */
  const showSuccess = useCallback(
    (message, options = {}) => {
      return addError(
        { message, isSuccess: true },
        {
          type: ToastType.SUCCESS,
          ...options,
        }
      );
    },
    [addError]
  );

  /**
   * Show info message
   */
  const showInfo = useCallback(
    (message, options = {}) => {
      return addError(
        { message },
        {
          type: ToastType.INFO,
          ...options,
        }
      );
    },
    [addError]
  );

  /**
   * Show warning message
   */
  const showWarning = useCallback(
    (message, options = {}) => {
      return addError(
        { message },
        {
          type: ToastType.WARNING,
          ...options,
        }
      );
    },
    [addError]
  );

  /**
   * Show error message
   */
  const showError = useCallback(
    (error, options = {}) => {
      return handleError(error, options);
    },
    [handleError]
  );

  /**
   * Execute async function with error handling
   */
  const executeWithErrorHandling = useCallback(
    async (asyncFn, options = {}) => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error, options);
        throw error; // Re-throw so caller can handle if needed
      }
    },
    [handleError]
  );

  return {
    handleApiError,
    handleGenericError,
    showSuccess,
    showInfo,
    showWarning,
    showError,
    executeWithErrorHandling,
  };
};

/**
 * Hook for async operations with automatic error handling
 * @param {Function} asyncFn - Async function to execute
 * @param {Object} options - Error handling options
 * @returns {Function} Wrapped function with error handling
 */
export const useAsyncErrorHandler = (asyncFn, options = {}) => {
  const { executeWithErrorHandling } = useErrorHandler();

  return useCallback(
    async (...args) => {
      return executeWithErrorHandling(() => asyncFn(...args), options);
    },
    [asyncFn, executeWithErrorHandling, options]
  );
};
