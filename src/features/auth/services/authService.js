/**
 * Auth service
 *
 * Mirrors the real backend auth flow used in the mobile `consolto_app`,
 * but keeps the existing web folder structure.
 *
 * This layer isolates HTTP details from hooks/components.
 */

import { apiRequest } from '@/shared/services/api';
import { validateLogin, validateSignup } from '../validators/authValidator';

export const authService = {
  /**
   * Log in with email and password against the real API.
   *
   * Returns a normalized auth user object that includes the backend user
   * fields plus the `token`, ready to be stored by `AuthContext`.
   */
  async login(credentials) {
    const validation = validateLogin(credentials);
    if (!validation.success) {
      const err = new Error('Validation failed');
      err.fieldErrors = validation.errors;
      throw err;
    }

    // Backend is expected to behave like the mobile app:
    // POST /auth/login -> { data: { token, user } }
    // Our axios layer unwraps `data`, so we receive { token, user } here.
    const data = await apiRequest.post('/auth/login', validation.value, {
      skipAuth: true,
    });

    const { token, user } = data || {};
    if (!token || !user) {
      throw new Error('Invalid login response from server');
    }

    // Normalize to a single object that includes the token.
    return { ...user, token };
  },

  /**
   * Sign up with name, email, password against the real API.
   *
   * Returns whatever the backend returns, but if a `{ token, user }`
   * shape is present, callers can log the user in immediately.
   */
  async signup(data) {
    const validation = validateSignup(data);
    if (!validation.success) {
      const err = new Error('Validation failed');
      err.fieldErrors = validation.errors;
      throw err;
    }

    // Backend is expected to behave similarly to mobile register:
    // POST /auth/register -> { data: ... }
    // Our axios layer unwraps `data`, so we receive it directly.
    const result = await apiRequest.post('/auth/register', validation.value, {
      skipAuth: true,
    });

    return result;
  },
};
