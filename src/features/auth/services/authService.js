/**
 * Auth service
 *
 * Handles authentication against the backend API.
 * This layer isolates HTTP details from hooks/components.
 *
 * Backend response envelope:
 *   { success, statusCode, message, data: { ... } }
 *
 * The axios response interceptor unwraps the `data` property automatically,
 * so service methods receive the inner payload directly.
 */

import { apiRequest } from '@/shared/services/api';
import { validateLogin, validateSignup, validateForgotPasswordEmail, validateResetPassword } from '../validators/authValidator';

export const authService = {
  /**
   * POST /auth/login
   *
   * Request:  { email, password }
   * Response (after interceptor unwrap):
   *   { user: { id, email, userName, role, isVerified }, token }
   *
   * Returns a flat auth object { id, email, userName, role, isVerified, token }
   * ready to be stored by AuthContext.
   */
  async login(credentials) {
    const validation = validateLogin(credentials);
    if (!validation.success) {
      const err = new Error('Validation failed');
      err.fieldErrors = validation.errors;
      throw err;
    }

    const data = await apiRequest.post('/auth/login', validation.value, {
      skipAuth: true,
      // Let the login form show validation inline instead of global toast
      skipErrorHandler: true,
    });

    const { token, user } = data || {};
    if (!token || !user) {
      throw new Error('Invalid login response from server');
    }

    return { ...user, token };
  },

  /**
   * POST /auth/register
   *
   * Request:  { name, email, password, confirmPassword }
   * Response (after interceptor unwrap): backend-defined payload
   */
  async signup(data) {
    const validation = validateSignup(data);
    if (!validation.success) {
      const err = new Error('Validation failed');
      err.fieldErrors = validation.errors;
      throw err;
    }

    const result = await apiRequest.post('/auth/register', validation.value, {
      skipAuth: true,
    });

    return result;
  },

  /**
   * POST /auth/forgot-password/send-otp
   *
   * Sends a 6-digit OTP to the provided email address.
   */
  async sendOtp(email) {
    const validation = validateForgotPasswordEmail({ email });
    if (!validation.success) {
      const err = new Error('Validation failed');
      err.fieldErrors = validation.errors;
      throw err;
    }

    return apiRequest.post('/auth/forgot-password/send-otp', { email }, {
      skipAuth: true,
      skipErrorHandler: true,
    });
  },

  /**
   * POST /auth/forgot-password/verify-otp
   *
   * Verifies the OTP sent to the user's email.
   */
  async verifyOtp({ email, otp }) {
    return apiRequest.post('/auth/forgot-password/verify-otp', { email, otp }, {
      skipAuth: true,
      skipErrorHandler: true,
    });
  },

  /**
   * POST /auth/forgot-password/reset
   *
   * Resets the password after OTP verification.
   */
  async resetPassword({ email, otp, newPassword, confirmPassword }) {
    const validation = validateResetPassword({ newPassword, confirmPassword });
    if (!validation.success) {
      const err = new Error('Validation failed');
      err.fieldErrors = validation.errors;
      throw err;
    }

    return apiRequest.post('/auth/forgot-password/reset', { email, otp, newPassword }, {
      skipAuth: true,
      skipErrorHandler: true,
    });
  },
};
