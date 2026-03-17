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
export const doPasswordsMatch = (password, confirmPassword) => {
  return confirmPassword.length === 0 || password === confirmPassword;
};

/**
 * Build a display-friendly user object from raw auth response.
 */
export const buildUserFromResponse = (response) => ({
  email: response?.email ?? '',
  name: response?.name ?? '',
  id: response?.id ?? null,
});
