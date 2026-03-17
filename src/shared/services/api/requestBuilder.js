/**
 * Request Builder
 *
 * Fluent API for building and executing API requests
 * Provides a chainable interface for constructing requests
 */

import { apiService, RequestConfig } from './apiService';

/**
 * Request Builder Class
 * Provides fluent interface for building API requests
 */
export class RequestBuilder {
  constructor(method, endpoint) {
    this.method = method;
    this.endpoint = endpoint;
    this.data = null;
    this.config = new RequestConfig();
  }

  /**
   * Set request data/body
   */
  data(data) {
    this.data = data;
    return this;
  }

  /**
   * Set query parameters
   */
  params(params) {
    this.config.params = { ...this.config.params, ...params };
    return this;
  }

  /**
   * Set custom headers
   */
  headers(headers) {
    this.config.headers = { ...this.config.headers, ...headers };
    return this;
  }

  /**
   * Set timeout
   */
  timeout(ms) {
    this.config.timeout = ms;
    return this;
  }

  /**
   * Skip authentication
   */
  skipAuth() {
    this.config.skipAuth = true;
    return this;
  }

  /**
   * Skip error handler (handle errors manually)
   */
  skipErrorHandler() {
    this.config.skipErrorHandler = true;
    return this;
  }

  /**
   * Set context for error logging
   */
  context(context) {
    this.config.context = { ...this.config.context, ...context };
    return this;
  }

  /**
   * Show success message after request
   */
  showSuccess(message) {
    this.config.showSuccess = true;
    this.config.successMessage = message;
    return this;
  }

  /**
   * Execute the request
   */
  async execute() {
    const methodMap = {
      GET: () => apiService.get(this.endpoint, this.config),
      POST: () => apiService.post(this.endpoint, this.data, this.config),
      PUT: () => apiService.put(this.endpoint, this.data, this.config),
      PATCH: () => apiService.patch(this.endpoint, this.data, this.config),
      DELETE: () => apiService.delete(this.endpoint, this.config),
    };

    const method = methodMap[this.method.toUpperCase()];
    if (!method) {
      throw new Error(`Unsupported HTTP method: ${this.method}`);
    }

    return method();
  }

  /**
   * Execute and get data directly
   */
  async getData(defaultValue = null) {
    const response = await this.execute();
    return response.getData(defaultValue);
  }
}

/**
 * API Request Builder Factory
 * Provides fluent interface for building requests
 */
export const api = {
  /**
   * Create GET request builder
   */
  get: (endpoint) => new RequestBuilder('GET', endpoint),

  /**
   * Create POST request builder
   */
  post: (endpoint) => new RequestBuilder('POST', endpoint),

  /**
   * Create PUT request builder
   */
  put: (endpoint) => new RequestBuilder('PUT', endpoint),

  /**
   * Create PATCH request builder
   */
  patch: (endpoint) => new RequestBuilder('PATCH', endpoint),

  /**
   * Create DELETE request builder
   */
  delete: (endpoint) => new RequestBuilder('DELETE', endpoint),
};
