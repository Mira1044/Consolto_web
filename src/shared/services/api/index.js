/**
 * API Services
 *
 * Centralized API client and utilities
 */

export { apiClient, apiRequest } from './apiClient';
export { handleApiError, processError, showErrorToUser } from './errorHandler';
export { AppError, ErrorCode } from '@/shared/types/errors';
