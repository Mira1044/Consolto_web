/**
 * Booking service
 * Placeholder for future API integration for bookings.
 *
 * This layer isolates any HTTP details from hooks/components,
 * making it easy to swap mock data with real API calls later.
 */

// import { api } from '@/shared/services/api';

export const bookingService = {
  /**
   * Create a booking.
   * In the future, this would POST to the backend.
   */
  async createBooking(booking) {
    // Example real call (commented until backend exists):
    // return api.post('/bookings').body(booking).getData();

    // For now, simulate async success to keep the API surface consistent.
    return Promise.resolve({
      ...booking,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    });
  },
};
