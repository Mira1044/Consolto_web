/**
 * Auth service
 * Placeholder for future API integration for authentication.
 *
 * This layer isolates any HTTP details from hooks/components,
 * making it easy to swap mock data with real API calls later.
 */

// import { api } from '@/shared/services/api';

import { validateLogin, validateSignup } from '../validators/authValidator';

export const authService = {
  /**
   * Log in with email and password.
   * In the future, this would POST to the backend.
   */
  async login(credentials) {
    const validation = validateLogin(credentials);
    if (!validation.success) {
      const err = new Error('Validation failed');
      err.fieldErrors = validation.errors;
      throw err;
    }

    // Example real call (commented until backend exists):
    // return api.post('/auth/login').body(validation.value).getData();

    // Simulate async network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          email: validation.value.email,
          id: Date.now(),
          token: 'mock-jwt-token',
        });
      }, 500);
    });
  },

  /**
   * Sign up with name, email, password.
   * In the future, this would POST to the backend.
   */
  async signup(data) {
    const validation = validateSignup(data);
    if (!validation.success) {
      const err = new Error('Validation failed');
      err.fieldErrors = validation.errors;
      throw err;
    }

    // Example real call (commented until backend exists):
    // return api.post('/auth/signup').body(validation.value).getData();

    // Simulate async network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          email: validation.value.email,
          name: validation.value.name,
          id: Date.now(),
          token: 'mock-jwt-token',
        });
      }, 500);
    });
  },
};
