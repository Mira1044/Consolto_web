/**
 * Auth utility functions
 * Pure functions for auth-related helpers.
 */

/**
 * localStorage key used for persisting user data.
 */
export const AUTH_STORAGE_KEY = 'consolto_user';

/**
 * Check whether two passwords match.
 * Returns true if confirmPassword is empty (not yet typed) or passwords are equal.
 */
export const doPasswordsMatch = (password, confirmPassword) => confirmPassword.length === 0 || password === confirmPassword;

/**
 * Build a display-friendly user object from raw auth response.
 */
export const buildUserFromResponse = (response) => ({
  email: response?.email ?? '',
  name: response?.name ?? '',
  id: response?.id ?? null,
});

const STRENGTH_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

/**
 * Compute a 0–4 password strength score.
 */
export const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 6) {
    score++;
  }
  if (password.length >= 10) {
    score++;
  }
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
    score++;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  }
  return score;
};

/**
 * Map a strength score (1–4) to a hex color.
 */
export const getStrengthColor = (score) =>
  STRENGTH_COLORS[Math.max(0, score - 1)] ?? STRENGTH_COLORS[0];
