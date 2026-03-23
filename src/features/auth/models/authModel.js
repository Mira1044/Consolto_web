import { z } from 'zod';

/**
 * Auth domain models & schemas
 * Represents the login and signup form data.
 */

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Default empty login form values.
 */
export const createDefaultLogin = () => ({
  email: '',
  password: '',
});

/**
 * Default empty signup form values.
 */
export const createDefaultSignup = () => ({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

export const forgotPasswordEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const createDefaultForgotPassword = () => ({
  email: '',
  otp: ['', '', '', '', '', ''],
  newPassword: '',
  confirmPassword: '',
});
