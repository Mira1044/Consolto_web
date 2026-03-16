/**
 * API Configuration
 *
 * Centralized API configuration settings
 */

/**
 * API Configuration
 */
export const apiConfig = {
  /**
   * Base URL for API requests
   * Can be overridden with VITE_API_BASE_URL environment variable
   */
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',

  /**
   * Default request timeout in milliseconds
   */
  timeout: 30000, // 30 seconds

  /**
   * Maximum number of retry attempts for failed requests
   */
  maxRetries: 3,

  /**
   * Retry delay in milliseconds
   */
  retryDelay: 1000,

  /**
   * Whether to retry on network errors
   */
  retryOnNetworkError: true,

  /**
   * Status codes that should trigger a retry
   */
  retryStatusCodes: [408, 429, 500, 502, 503, 504],

  /**
   * LocalStorage key for authentication
   */
  authKey: 'consolto_user',

  /**
   * Token key in auth object
   */
  tokenKey: 'token',
} as const;
