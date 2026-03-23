/**
 * API Client
 *
 * Centralized axios instance with interceptors for request/response handling
 */

import axios from 'axios';
import { handleApiError, showErrorToUser } from './errorHandler';
import { apiConfig } from '@/config/api';

/**
 * Create axios instance with default configuration
 */
const createApiClient = () => {
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
const setupRequestInterceptor = (client) => {
  client.interceptors.request.use(
    (config) => {
      // Get auth token from localStorage
      try {
        const stored = localStorage.getItem(apiConfig.authKey);
        if (stored) {
          const user = JSON.parse(stored);
          const token = user?.[apiConfig.tokenKey];
          if (token) {
            // eslint-disable-next-line no-param-reassign -- axios request config mutation
            config.headers.Authorization = `Bearer ${token}`;
          } else if (user?.email) {
            // Fallback: use email as token identifier if no token exists
            // eslint-disable-next-line no-param-reassign -- axios request config mutation
            config.headers['X-User-Email'] = user.email;
          }
        }
      } catch {
        // Ignore localStorage errors
      }

      // Add custom headers from request config
      const customConfig = config;
      if (customConfig.skipAuth) {
        // eslint-disable-next-line no-param-reassign -- axios request config mutation
        delete config.headers.Authorization;
        // eslint-disable-next-line no-param-reassign -- axios request config mutation
        delete config.headers['X-User-Email'];
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};

/**
 * Response Interceptor
 * Handles responses and errors globally
 */
const setupResponseInterceptor = (client) => {
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
      const {config} = error;

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
        // Use React Router if available, otherwise fallback to window.location
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (currentPath !== '/' && currentPath !== '/login') {
            // Only redirect if not already on login page
            window.location.href = '/login';
          }
        }
      }

      return Promise.reject(appError);
    }
  );
};

/**
 * Create and configure API client
 */
export const apiClient = (() => {
  const client = createApiClient();
  setupRequestInterceptor(client);
  setupResponseInterceptor(client);
  return client;
})();

/**
 * API Request Helper
 * Wraps axios requests with proper typing and error handling
 */
/**
 * Legacy API Request Helper
 * Wraps axios requests with proper error handling
 * @deprecated Use apiService or api builder for new code
 */
export const apiRequest = {
  /**
   * GET request
   */
  get: async (url, config = {}) => {
    const response = await apiClient.get(url, config);
    return response.data;
  },

  /**
   * POST request
   */
  post: async (url, data, config = {}) => {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  /**
   * PUT request
   */
  put: async (url, data, config = {}) => {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },

  /**
   * PATCH request
   */
  patch: async (url, data, config = {}) => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  },

  /**
   * DELETE request
   */
  delete: async (url, config = {}) => {
    const response = await apiClient.delete(url, config);
    return response.data;
  },
};
