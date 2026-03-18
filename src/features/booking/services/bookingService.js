/**
 * Booking service
 * Placeholder for future API integration for bookings.
 *
 * This layer isolates any HTTP details from hooks/components,
 * making it easy to swap mock data with real API calls later.
 */

import { apiRequest } from '@/shared/services/api';

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

  /**
   * Get logged-in user's appointments
   * GET /appointment/user
   *
   * Backend envelope:
   *  { success, statusCode, message, data: { data: Appointment[], pagination: {...} } }
   *
   * After interceptor unwrap, this method receives:
   *  { data: Appointment[], pagination: {...} }
   */
  async getUserAppointments(params = {}) {
    const payload = await apiRequest.get('/appointment/user', { params });
    const list = Array.isArray(payload?.data) ? payload.data : [];
    const pagination = payload?.pagination ?? null;
    return { appointments: list, pagination };
  },

  /**
   * Get logged-in consultant's appointments
   * GET /appointment/consultant
   *
   * Backend envelope:
   *  { success, statusCode, message, data: { data: Appointment[], pagination: {...} } }
   *
   * After interceptor unwrap, this method receives:
   *  { data: Appointment[], pagination: {...} }
   */
  async getConsultantAppointments(params = {}) {
    const payload = await apiRequest.get('/appointment/consultant', { params });
    const list = Array.isArray(payload?.data) ? payload.data : [];
    const pagination = payload?.pagination ?? null;
    return { appointments: list, pagination };
  },
};
