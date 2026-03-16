/**
 * Common API Types
 *
 * Standardized types for API requests and responses
 */

/**
 * Standard API Response structure
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  errors?: ApiError[];
}

/**
 * API Error structure
 */
export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  success: boolean;
}

/**
 * Request configuration options
 */
export interface RequestConfig {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * HTTP Methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
