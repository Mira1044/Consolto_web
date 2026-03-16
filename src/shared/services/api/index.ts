/**
 * API Services
 *
 * Centralized API client and utilities
 */

export { apiClient, apiRequest } from './apiClient';
export { handleApiError, processError, showErrorToUser } from './errorHandler';
export type { ApiResponse, ApiError, PaginatedResponse, RequestConfig } from '@/shared/types/api';
export { AppError, ErrorCode } from '@/shared/types/errors';
export type { ErrorHandlerResponse } from '@/shared/types/errors';
