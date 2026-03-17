/**
 * Centralized Error Handling System
 *
 * This module provides a comprehensive error handling solution for the entire application.
 * It includes error boundaries, context, toast notifications, logging, and hooks.
 *
 * Usage:
 *   import { ErrorProvider, ErrorBoundary, useErrorHandler } from '@/shared/services/error';
 */

// Context and Provider
export { ErrorProvider, useError } from './ErrorContext';

// Error Boundary
export { ErrorBoundary } from './ErrorBoundary';

// Toast Notifications
export { ErrorToast, ToastType } from './ErrorToast';

// Hooks
export { useErrorHandler, useAsyncErrorHandler } from './hooks';

// Logger
export { logError, logWarning, logInfo, configureLogger, LogLevel } from './errorLogger';

// Re-export error types from API services
export { AppError, ErrorCode } from '../api/errors';
