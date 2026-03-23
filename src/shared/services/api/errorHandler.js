/**
 * Error Handler Service
 *
 * Centralized error handling for API requests
 */

import axios from 'axios';
import { AppError, ErrorCode } from './errors';

/**
 * Maps HTTP status codes to ErrorCode
 */
const getErrorCodeFromStatus = (status) => {
  switch (status) {
    case 401:
      return ErrorCode.UNAUTHORIZED;
    case 403:
      return ErrorCode.FORBIDDEN;
    case 404:
      return ErrorCode.NOT_FOUND;
    case 422:
    case 400:
      return ErrorCode.VALIDATION_ERROR;
    case 500:
    case 502:
    case 503:
    case 504:
      return ErrorCode.SERVER_ERROR;
    default:
      return ErrorCode.UNKNOWN_ERROR;
  }
};

/**
 * Handles axios errors and converts them to AppError
 */
export const handleApiError = (error) => {
  // Network error (no response from server)
  if (axios.isAxiosError(error)) {
    const axiosError = error;

    // Network error (no response)
    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
        return new AppError(
          'Request timeout. Please check your connection and try again.',
          ErrorCode.TIMEOUT_ERROR,
          undefined,
          error
        );
      }
      return new AppError(
        'Network error. Please check your internet connection.',
        ErrorCode.NETWORK_ERROR,
        undefined,
        error
      );
    }

    // HTTP error response
    const { status, data } = axiosError.response;
    const errorCode = getErrorCodeFromStatus(status);

    // Extract error message from response
    let errorMessage = 'An error occurred';
    if (data?.message) {
      errorMessage = data.message;
    } else if (data?.errors && data.errors.length > 0) {
      errorMessage = data.errors.map((e) => e.message).join(', ');
    } else if (axiosError.message) {
      errorMessage = axiosError.message;
    }

    return new AppError(errorMessage, errorCode, status, error);
  }

  // AppError instance
  if (error instanceof AppError) {
    return error;
  }

  // Generic Error
  if (error instanceof Error) {
    return new AppError(error.message, ErrorCode.UNKNOWN_ERROR, undefined, error);
  }

  // Unknown error type
  return new AppError(
    'An unexpected error occurred',
    ErrorCode.UNKNOWN_ERROR,
    undefined,
    error
  );
};

/**
 * Processes error and returns standardized error handler response
 */
export const processError = (error) => {
  const appError = handleApiError(error);

  return {
    message: appError.message,
    code: appError.code,
    statusCode: appError.statusCode,
    shouldRetry: appError.code === ErrorCode.NETWORK_ERROR || appError.code === ErrorCode.TIMEOUT_ERROR,
  };
};

/**
 * Shows user-friendly error message
 * This integrates with the centralized error handling system
 * If ErrorContext is available, it will use toast notifications
 * Otherwise, falls back to console logging
 */
export const showErrorToUser = (error) => {
  const errorResponse = processError(error);

  // Log error for debugging
  console.error('API Error:', {
    message: errorResponse.message,
    code: errorResponse.code,
    statusCode: errorResponse.statusCode,
  });

  // Try to use error context if available (lazy import to avoid circular dependencies)
  // This will be handled by the ErrorContext when used through hooks
  // For direct calls, we'll just log - the context will handle display
  if (import.meta.env.DEV) {
    // In development, show alert as fallback if error context is not available
    // This should rarely happen as errors should be handled through hooks
    console.warn('Error displayed without ErrorContext. Consider using useErrorHandler hook.');
  }
};
