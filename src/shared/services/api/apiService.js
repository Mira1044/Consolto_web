/**
 * Structured API Service
 *
 * Centralized, structured API request/response handling
 * Provides consistent request/response structure throughout the application
 */

import { apiClient } from './apiClient';
import { handleApiError } from './errorHandler';
import { ErrorCode } from './errors';

/**
 * Request Configuration Options
 */
export class RequestConfig {
  constructor(options = {}) {
    this.skipAuth = options.skipAuth ?? false;
    this.skipErrorHandler = options.skipErrorHandler ?? false;
    this.timeout = options.timeout;
    this.headers = options.headers ?? {};
    this.params = options.params ?? {};
    this.retry = options.retry ?? false;
    this.retryCount = options.retryCount ?? 3;
    this.showLoading = options.showLoading ?? true;
    this.showSuccess = options.showSuccess ?? false;
    this.successMessage = options.successMessage;
    this.context = options.context ?? {};
  }
}

/**
 * Standardized API Response Structure
 */
export class ApiResponse {
  constructor(data, meta = {}) {
    this.data = data;
    this.success = true;
    this.message = meta.message;
    this.statusCode = meta.statusCode;
    this.headers = meta.headers;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Check if response has data
   */
  hasData() {
    return this.data !== null && this.data !== undefined;
  }

  /**
   * Get data or default value
   */
  getData(defaultValue = null) {
    return this.hasData() ? this.data : defaultValue;
  }
}

/**
 * Standardized API Error Response
 */
export class ApiErrorResponse {
  constructor(error, meta = {}) {
    this.success = false;
    this.error = error;
    this.message = error.message || 'An error occurred';
    this.code = error.code || ErrorCode.UNKNOWN_ERROR;
    this.statusCode = error.statusCode;
    this.timestamp = new Date().toISOString();
    this.meta = meta;
  }
}

/**
 * Structured API Service
 * Provides consistent request/response handling
 */
export class ApiService {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }

  /**
   * Build full URL
   */
  buildUrl(endpoint) {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    return `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }

  /**
   * Create request configuration
   */
  createRequestConfig(config = {}) {
    return new RequestConfig(config);
  }

  /**
   * Transform response to standardized format
   */
  transformResponse(response, _config) {
    const { data, status, headers } = response;

    // Handle different response structures
    let responseData = data;
    let message = null;

    // If response has nested data structure
    if (data && typeof data === 'object') {
      if ('data' in data) {
        responseData = data.data;
      }
      if ('message' in data) {
        message = data.message;
      }
    }

    return new ApiResponse(responseData, {
      message,
      statusCode: status,
      headers,
    });
  }

  /**
   * Handle error and transform to standardized format
   */
  transformError(error, config) {
    const appError = handleApiError(error);
    return new ApiErrorResponse(appError, {
      config: config.context,
    });
  }

  /**
   * GET Request
   * @param {string} endpoint - API endpoint
   * @param {RequestConfig|Object} config - Request configuration
   * @returns {Promise<ApiResponse>}
   */
  async get(endpoint, config = {}) {
    const requestConfig = config instanceof RequestConfig ? config : this.createRequestConfig(config);
    const url = this.buildUrl(endpoint);

    try {
      const response = await apiClient.get(url, {
        params: requestConfig.params,
        headers: requestConfig.headers,
        timeout: requestConfig.timeout,
        skipAuth: requestConfig.skipAuth,
        skipErrorHandler: requestConfig.skipErrorHandler,
      });

      return this.transformResponse(response, requestConfig);
    } catch (error) {
      if (requestConfig.skipErrorHandler) {
        throw this.transformError(error, requestConfig);
      }
      throw this.transformError(error, requestConfig);
    }
  }

  /**
   * POST Request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {RequestConfig|Object} config - Request configuration
   * @returns {Promise<ApiResponse>}
   */
  async post(endpoint, data = null, config = {}) {
    const requestConfig = config instanceof RequestConfig ? config : this.createRequestConfig(config);
    const url = this.buildUrl(endpoint);

    try {
      const axiosConfig = {
        headers: requestConfig.headers,
      };

      if (requestConfig.timeout) {
        axiosConfig.timeout = requestConfig.timeout;
      }

      axiosConfig.skipAuth = requestConfig.skipAuth;
      axiosConfig.skipErrorHandler = requestConfig.skipErrorHandler;

      const response = await apiClient.post(url, data, axiosConfig);

      return this.transformResponse(response, requestConfig);
    } catch (error) {
      if (requestConfig.skipErrorHandler) {
        throw this.transformError(error, requestConfig);
      }
      throw this.transformError(error, requestConfig);
    }
  }

  /**
   * PUT Request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {RequestConfig|Object} config - Request configuration
   * @returns {Promise<ApiResponse>}
   */
  async put(endpoint, data = null, config = {}) {
    const requestConfig = config instanceof RequestConfig ? config : this.createRequestConfig(config);
    const url = this.buildUrl(endpoint);

    try {
      const axiosConfig = {
        headers: requestConfig.headers,
      };

      if (requestConfig.timeout) {
        axiosConfig.timeout = requestConfig.timeout;
      }

      axiosConfig.skipAuth = requestConfig.skipAuth;
      axiosConfig.skipErrorHandler = requestConfig.skipErrorHandler;

      const response = await apiClient.put(url, data, axiosConfig);

      return this.transformResponse(response, requestConfig);
    } catch (error) {
      if (requestConfig.skipErrorHandler) {
        throw this.transformError(error, requestConfig);
      }
      throw this.transformError(error, requestConfig);
    }
  }

  /**
   * PATCH Request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {RequestConfig|Object} config - Request configuration
   * @returns {Promise<ApiResponse>}
   */
  async patch(endpoint, data = null, config = {}) {
    const requestConfig = config instanceof RequestConfig ? config : this.createRequestConfig(config);
    const url = this.buildUrl(endpoint);

    try {
      const axiosConfig = {
        headers: requestConfig.headers,
      };

      if (requestConfig.timeout) {
        axiosConfig.timeout = requestConfig.timeout;
      }

      axiosConfig.skipAuth = requestConfig.skipAuth;
      axiosConfig.skipErrorHandler = requestConfig.skipErrorHandler;

      const response = await apiClient.patch(url, data, axiosConfig);

      return this.transformResponse(response, requestConfig);
    } catch (error) {
      if (requestConfig.skipErrorHandler) {
        throw this.transformError(error, requestConfig);
      }
      throw this.transformError(error, requestConfig);
    }
  }

  /**
   * DELETE Request
   * @param {string} endpoint - API endpoint
   * @param {RequestConfig|Object} config - Request configuration
   * @returns {Promise<ApiResponse>}
   */
  async delete(endpoint, config = {}) {
    const requestConfig = config instanceof RequestConfig ? config : this.createRequestConfig(config);
    const url = this.buildUrl(endpoint);

    try {
      const axiosConfig = {
        headers: requestConfig.headers,
      };

      if (requestConfig.timeout) {
        axiosConfig.timeout = requestConfig.timeout;
      }

      axiosConfig.skipAuth = requestConfig.skipAuth;
      axiosConfig.skipErrorHandler = requestConfig.skipErrorHandler;

      const response = await apiClient.delete(url, axiosConfig);

      return this.transformResponse(response, requestConfig);
    } catch (error) {
      if (requestConfig.skipErrorHandler) {
        throw this.transformError(error, requestConfig);
      }
      throw this.transformError(error, requestConfig);
    }
  }

  /**
   * Upload file(s)
   * @param {string} endpoint - API endpoint
   * @param {FormData|File|File[]} files - File(s) to upload
   * @param {RequestConfig|Object} config - Request configuration
   * @returns {Promise<ApiResponse>}
   */
  async upload(endpoint, files, config = {}) {
    const requestConfig = config instanceof RequestConfig ? config : this.createRequestConfig(config);
    const url = this.buildUrl(endpoint);

    // Create FormData if needed
    let formData = files;
    if (files instanceof File) {
      formData = new FormData();
      formData.append('file', files);
    } else if (Array.isArray(files)) {
      formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
    }

    try {
      const axiosConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...requestConfig.headers,
        },
        timeout: requestConfig.timeout || 60000, // Default 60s for uploads
      };

      axiosConfig.skipAuth = requestConfig.skipAuth;
      axiosConfig.skipErrorHandler = requestConfig.skipErrorHandler;

      const response = await apiClient.post(url, formData, axiosConfig);

      return this.transformResponse(response, requestConfig);
    } catch (error) {
      if (requestConfig.skipErrorHandler) {
        throw this.transformError(error, requestConfig);
      }
      throw this.transformError(error, requestConfig);
    }
  }

  /**
   * Download file
   * @param {string} endpoint - API endpoint
   * @param {RequestConfig|Object} config - Request configuration
   * @returns {Promise<Blob>}
   */
  async download(endpoint, config = {}) {
    const requestConfig = config instanceof RequestConfig ? config : this.createRequestConfig(config);
    const url = this.buildUrl(endpoint);

    try {
      const axiosConfig = {
        responseType: 'blob',
        params: requestConfig.params,
        headers: requestConfig.headers,
      };

      if (requestConfig.timeout) {
        axiosConfig.timeout = requestConfig.timeout;
      }

      axiosConfig.skipAuth = requestConfig.skipAuth;
      axiosConfig.skipErrorHandler = requestConfig.skipErrorHandler;

      const response = await apiClient.get(url, axiosConfig);

      return response.data;
    } catch (error) {
      if (requestConfig.skipErrorHandler) {
        throw this.transformError(error, requestConfig);
      }
      throw this.transformError(error, requestConfig);
    }
  }
}

/**
 * Default API Service Instance
 * Use this for general API calls
 */
export const apiService = new ApiService();

/**
 * Create a new API service instance with custom base URL
 * Useful for feature-specific services
 */
export const createApiService = (baseURL) => new ApiService(baseURL);
