import { sessionParamsSchema, streamTokenSchema, activeSessionSchema } from '../models/sessionModel';

/**
 * Validate session params (from navigation state / URL).
 */
export const validateSessionParams = (data) => {
  const result = sessionParamsSchema.safeParse(data);
  if (result.success) {
    return { success: true, value: result.data };
  }
  return {
    success: false,
    errors: result.error.flatten().fieldErrors,
  };
};

/**
 * Validate the stream token response from the backend.
 */
export const validateStreamToken = (data) => {
  const result = streamTokenSchema.safeParse(data);
  if (result.success) {
    return { success: true, value: result.data };
  }
  return {
    success: false,
    errors: result.error.flatten().fieldErrors,
  };
};

/**
 * Validate the active session check response.
 */
export const validateActiveSession = (data) => {
  const result = activeSessionSchema.safeParse(data);
  if (result.success) {
    return { success: true, value: result.data };
  }
  return {
    success: false,
    errors: result.error.flatten().fieldErrors,
  };
};
