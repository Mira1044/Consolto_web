import { loginSchema, signupSchema, forgotPasswordEmailSchema, resetPasswordSchema } from '../models/authModel';

/**
 * Validate login form data against the domain schema.
 * Returns { success: boolean, value?: object, errors?: Record<string, string[]> }
 */
export const validateLogin = (data) => {
  const result = loginSchema.safeParse(data);
  if (result.success) {
    return { success: true, value: result.data };
  }
  return {
    success: false,
    errors: result.error.flatten().fieldErrors,
  };
};

/**
 * Validate signup form data against the domain schema.
 * Returns { success: boolean, value?: object, errors?: Record<string, string[]> }
 */
export const validateSignup = (data) => {
  const result = signupSchema.safeParse(data);
  if (result.success) {
    return { success: true, value: result.data };
  }
  return {
    success: false,
    errors: result.error.flatten().fieldErrors,
  };
};

export const validateForgotPasswordEmail = (data) => {
  const result = forgotPasswordEmailSchema.safeParse(data);
  if (result.success) {
    return { success: true, value: result.data };
  }
  return {
    success: false,
    errors: result.error.flatten().fieldErrors,
  };
};

export const validateResetPassword = (data) => {
  const result = resetPasswordSchema.safeParse(data);
  if (result.success) {
    return { success: true, value: result.data };
  }
  return {
    success: false,
    errors: result.error.flatten().fieldErrors,
  };
};
