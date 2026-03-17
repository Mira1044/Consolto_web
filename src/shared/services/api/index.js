/**
 * API Services
 *
 * Centralized API client and utilities
 * Provides structured request/response handling
 */

// Legacy exports (for backward compatibility)
export { apiClient, apiRequest } from './apiClient';

// Error handling
export { handleApiError, processError, showErrorToUser } from './errorHandler';
export { AppError, ErrorCode } from './errors';

// Structured API Service
export {
  ApiService,
  ApiResponse,
  ApiErrorResponse,
  RequestConfig,
  apiService,
  createApiService,
} from './apiService';

// Request Builder (Fluent API)
export { RequestBuilder, api } from './requestBuilder';
