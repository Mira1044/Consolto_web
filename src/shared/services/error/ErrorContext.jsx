import { createContext, useContext, useState, useCallback } from 'react';
import { AppError } from '../api/errors';

/**
 * Error Context
 * Provides global error state and handlers throughout the application
 */

const ErrorContext = createContext(null);

/**
 * Error Provider Component
 * Wraps the application to provide error handling capabilities
 */
export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  /**
   * Add an error to the error queue
   */
  const addError = useCallback((error, options = {}) => {
    // Handle plain message strings or objects with message property
    let errorObj = error;
    if (typeof error === 'string') {
      errorObj = { message: error };
    } else if (error && typeof error === 'object' && !(error instanceof AppError) && !(error instanceof Error)) {
      // Plain object with message - keep as is for success/info/warning
      errorObj = error;
    } else if (error instanceof AppError) {
      errorObj = error;
    } else if (error instanceof Error) {
      errorObj = new AppError(error.message, undefined, undefined, error);
    } else {
      errorObj = new AppError(error?.message || 'An error occurred');
    }

    const errorData = {
      id: Date.now() + Math.random(),
      error: errorObj instanceof AppError || errorObj instanceof Error ? errorObj : null,
      message: errorObj?.message || errorObj?.message || 'An error occurred',
      timestamp: new Date(),
      ...options,
    };

    setErrors((prev) => [...prev, errorData]);
    setIsErrorVisible(true);

    // Auto-hide after duration (default: 5 seconds)
    const duration = options.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeError(errorData.id);
      }, duration);
    }

    return errorData.id;
  }, []);

  /**
   * Remove an error from the queue
   */
  const removeError = useCallback((errorId) => {
    setErrors((prev) => {
      const filtered = prev.filter((err) => err.id !== errorId);
      if (filtered.length === 0) {
        setIsErrorVisible(false);
      }
      return filtered;
    });
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors([]);
    setIsErrorVisible(false);
  }, []);

  /**
   * Handle error with automatic processing and display
   */
  const handleError = useCallback((error, options = {}) => {
    const appError = error instanceof AppError ? error : new AppError(error?.message || 'An error occurred');

    // Log error
    if (options.log !== false) {
      console.error('Error handled:', {
        message: appError.message,
        code: appError.code,
        statusCode: appError.statusCode,
        error: appError.originalError || appError,
      });
    }

    // Show to user if not explicitly disabled
    if (options.showToUser !== false) {
      addError(appError, options);
    }

    return appError;
  }, [addError]);

  const value = {
    errors,
    isErrorVisible,
    addError,
    removeError,
    clearErrors,
    handleError,
  };

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
};

/**
 * Hook to use error context
 * @throws {Error} If used outside ErrorProvider
 */
export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within ErrorProvider');
  }
  return context;
};
