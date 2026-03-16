/**
 * Error Handler Service
 *
 * Centralized error handling for API requests
 */

import axios, { type AxiosError } from 'axios';
import { AppError, ErrorCode, type ErrorHandlerResponse } from '@/shared/types/errors';

/**
 * Maps HTTP status codes to ErrorCode
 */
const getErrorCodeFromStatus = (status: number): ErrorCode => {
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
export const handleApiError = (error: unknown): AppError => {
  // Network error (no response from server)
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; errors?: Array<{ message: string }> }>;

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
export const processError = (error: unknown): ErrorHandlerResponse => {
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
 * This can be extended to integrate with toast notifications, modals, etc.
 */
export const showErrorToUser = (error: unknown): void => {
  const errorResponse = processError(error);

  // Log error for debugging
  console.error('API Error:', {
    message: errorResponse.message,
    code: errorResponse.code,
    statusCode: errorResponse.statusCode,
  });

  // TODO: Integrate with toast notification system
  // Example: toast.error(errorResponse.message);

  // For now, we'll use alert as fallback (remove in production)
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-alert
    alert(`Error: ${errorResponse.message}`);
  }
};
