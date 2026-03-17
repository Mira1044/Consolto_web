import { bookingSchema } from '../models/bookingModel';

/**
 * Validate a booking object against the domain schema.
 * Returns { success: boolean, errors?: Record<string, string[]> }
 */
export const validateBooking = (booking) => {
  const result = bookingSchema.safeParse(booking);
  if (result.success) {
    return { success: true };
  }

  const fieldErrors = result.error.flatten().fieldErrors;
  return {
    success: false,
    errors: fieldErrors,
  };
};
