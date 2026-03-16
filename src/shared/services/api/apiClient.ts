/**
 * API Client
 *
 * Centralized axios instance with interceptors for request/response handling
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { handleApiError, showErrorToUser } from './errorHandler';
import type { RequestConfig } from '@/shared/types/api';
import { apiConfig } from '@/config/api';

/**
 * Create axios instance with default configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: apiConfig.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return client;
};

/**
 * Request Interceptor
 * Adds authentication token and custom headers
 */
const setupRequestInterceptor = (client: AxiosInstance): void => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get auth token from localStorage
      try {
        const stored = localStorage.getItem(apiConfig.authKey);
        if (stored) {
          const user = JSON.parse(stored);
          const token = user?.[apiConfig.tokenKey];
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          } else if (user?.email) {
            // Fallback: use email as token identifier if no token exists
            config.headers['X-User-Email'] = user.email;
          }
        }
      } catch {
        // Ignore localStorage errors
      }

      // Add custom headers from request config
      const customConfig = config as InternalAxiosRequestConfig & { skipAuth?: boolean; skipErrorHandler?: boolean };
      if (customConfig.skipAuth) {
        delete config.headers.Authorization;
        delete config.headers['X-User-Email'];
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

/**
 * Response Interceptor
 * Handles responses and errors globally
 */
const setupResponseInterceptor = (client: AxiosInstance): void => {
  client.interceptors.response.use(
    (response) => {
      // Transform response data if needed
      // If API returns { data: {...}, success: true }, extract data
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return {
          ...response,
          data: response.data.data,
          originalResponse: response.data,
        };
      }
      return response;
    },
    (error) => {
      const config = error.config as AxiosRequestConfig & RequestConfig;

      // Skip error handler if flag is set
      if (config?.skipErrorHandler) {
        return Promise.reject(error);
      }

      // Handle error globally
      const appError = handleApiError(error);

      // Show error to user (can be disabled per request)
      showErrorToUser(appError);

      // Handle specific error codes
      if (appError.code === 'UNAUTHORIZED') {
        // Clear auth and redirect to login
        localStorage.removeItem(apiConfig.authKey);
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }

      return Promise.reject(appError);
    }
  );
};

/**
 * Create and configure API client
 */
export const apiClient = ((): AxiosInstance => {
  const client = createApiClient();
  setupRequestInterceptor(client);
  setupResponseInterceptor(client);
  return client;
})();

/**
 * API Request Helper
 * Wraps axios requests with proper typing and error handling
 */
export const apiRequest = {
  /**
   * GET request
   */
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig & RequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  /**
   * POST request
   */
  post: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & RequestConfig
  ): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  /**
   * PUT request
   */
  put: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & RequestConfig
  ): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  /**
   * PATCH request
   */
  patch: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & RequestConfig
  ): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  /**
   * DELETE request
   */
  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig & RequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};
