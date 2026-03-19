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

    // Support both shapes:
    // 1) { data: Appointment[], pagination }
    // 2) { data: { data: Appointment[], pagination } }
    const container = payload?.data && Array.isArray(payload.data)
      ? payload
      : payload?.data && Array.isArray(payload.data.data)
        ? payload.data
        : payload;

    const list = Array.isArray(container?.data) ? container.data : [];
    const pagination = container?.pagination ?? null;

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

    const container = payload?.data && Array.isArray(payload.data)
      ? payload
      : payload?.data && Array.isArray(payload.data.data)
        ? payload.data
        : payload;

    const list = Array.isArray(container?.data) ? container.data : [];
    const pagination = container?.pagination ?? null;

    return { appointments: list, pagination };
  },

  /**
   * Cancel an appointment.
   * Mirrors mobile:
   *  POST /appointment/cancel/consultant
   *  POST /appointment/cancel/user
   */
  async cancelAppointment({ appointmentId, roleTab, reasonToCancel }) {
    const endpoint = roleTab === 'consultant' ? '/appointment/cancel/consultant' : '/appointment/cancel/user';
    return apiRequest.post(endpoint, {
      appointmentId,
      reason_to_cancel: reasonToCancel,
    });
  },

  /**
   * Reschedule an appointment.
   * Mirrors mobile:
   *  PUT /appointment/reschedule/consultant
   *  PUT /appointment/reschedule/user
   */
  async rescheduleAppointment({ appointmentId, roleTab, newAvailabilityId, booking_date }) {
    const endpoint = roleTab === 'consultant' ? '/appointment/reschedule/consultant' : '/appointment/reschedule/user';

    const body = {
      appointmentId,
      newAvailabilityId,
    };

    // Only send booking_date for WEEKLY/DAILY slots (SPECIFIC doesn't need it).
    if (booking_date) body.booking_date = booking_date;

    return apiRequest.put(endpoint, body);
  },
};
