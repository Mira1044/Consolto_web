/**
 * Error Logger
 * Centralized error logging utility
 */

/**
 * Log levels
 */
export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

/**
 * Error logger configuration
 */
const loggerConfig = {
  enabled: process.env.NODE_ENV !== 'test',
  logToConsole: process.env.NODE_ENV === 'development',
  logToService: process.env.NODE_ENV === 'production',
  serviceEndpoint: null, // Can be configured to send logs to external service
};

/**
 * Format error for logging
 */
const formatError = (error, context = {}) => {
  const errorData = {
    timestamp: new Date().toISOString(),
    level: LogLevel.ERROR,
    message: error?.message || 'Unknown error',
    code: error?.code,
    statusCode: error?.statusCode,
    stack: error?.stack,
    originalError: error?.originalError
      ? {
          message: error.originalError.message,
          stack: error.originalError.stack,
        }
      : null,
    context,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
    url: typeof window !== 'undefined' ? window.location.href : null,
  };

  return errorData;
};

/**
 * Log error to console (development)
 */
const logToConsole = (errorData) => {
  if (!loggerConfig.logToConsole) return;

  const { message, code, statusCode, context, stack } = errorData;

  console.group(`🚨 Error: ${message}`);
  if (code) console.error('Code:', code);
  if (statusCode) console.error('Status:', statusCode);
  if (context && Object.keys(context).length > 0) {
    console.error('Context:', context);
  }
  if (stack) console.error('Stack:', stack);
  console.groupEnd();
};

/**
 * Log error to external service (production)
 */
const logToService = async (errorData) => {
  if (!loggerConfig.logToService || !loggerConfig.serviceEndpoint) return;

  try {
    await fetch(loggerConfig.serviceEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    });
  } catch (err) {
    // Silently fail - don't break the app if logging fails
    if (loggerConfig.logToConsole) {
      console.warn('Failed to log error to service:', err);
    }
  }
};

/**
 * Main error logging function
 * @param {Error|AppError} error - The error to log
 * @param {Object} context - Additional context information
 */
export const logError = (error, context = {}) => {
  if (!loggerConfig.enabled) return;

  const errorData = formatError(error, context);

  // Log to console in development
  logToConsole(errorData);

  // Log to external service in production
  if (loggerConfig.logToService) {
    logToService(errorData).catch(() => {
      // Silently handle service logging errors
    });
  }
};

/**
 * Log warning
 */
export const logWarning = (message, context = {}) => {
  if (!loggerConfig.enabled || !loggerConfig.logToConsole) return;

  console.warn(`⚠️ Warning: ${message}`, context);
};

/**
 * Log info
 */
export const logInfo = (message, context = {}) => {
  if (!loggerConfig.enabled || !loggerConfig.logToConsole) return;

  console.info(`ℹ️ Info: ${message}`, context);
};

/**
 * Configure logger
 */
export const configureLogger = (config) => {
  Object.assign(loggerConfig, config);
};
