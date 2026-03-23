/**
 * Booking service
 * Placeholder for future API integration for bookings.
 *
 * This layer isolates any HTTP details from hooks/components,
 * making it easy to swap mock data with real API calls later.
 */

import { apiRequest } from '@/shared/services/api';
import { initialsFromName } from '@/shared/utils/stringUtils';

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
  async getUserAppointments(params = {}, axiosConfig = {}) {
    const payload = await apiRequest.get('/appointment/user', { params, ...axiosConfig });

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
  async getConsultantAppointments(params = {}, axiosConfig = {}) {
    const payload = await apiRequest.get('/appointment/consultant', { params, ...axiosConfig });

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
   * One round-trip when possible; falls back to upcoming+past if the unified call fails.
   * @param {{ roleTab: 'user'|'consultant', signal?: AbortSignal }} opts
   */
  async loadAppointmentsForBookingsPage({ roleTab, signal }) {
    const fetchFn = roleTab === 'consultant' ? this.getConsultantAppointments : this.getUserAppointments;
    const extra = signal ? { signal } : {};
    try {
      const r = await fetchFn({ page: 1, limit: 50 }, extra);
      return { appointments: r.appointments ?? [] };
    } catch (e) {
      if (signal?.aborted) {
throw e;
}
      const [u, p] = await Promise.all([
        fetchFn({ page: 1, limit: 10, status_type: 'upcoming' }, extra),
        fetchFn({ page: 1, limit: 10, status_type: 'past' }, extra),
      ]);
      return {
        appointments: [...(u.appointments || []), ...(p.appointments || [])],
      };
    }
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
    if (booking_date) {
body.booking_date = booking_date;
}

    return apiRequest.put(endpoint, body);
  },

  /**
   * Mark appointment complete (consultant).
   * Mirrors consolto_app `useBookingActions` → PATCH `/appointment/mark-complete`
   */
  async markAppointmentComplete({ appointmentId }) {
    return apiRequest.patch('/appointment/mark-complete', { appointmentId });
  },

  /**
   * Get the logged-in user's own consultant profile (if any).
   * GET /consultant/self
   */
  async getConsultantSelf() {
    return apiRequest.get('/consultant/self');
  },

  /**
   * Fetch a consultant by ID for re-booking.
   * GET /consultant/consultants/:id
   *
   * Returns `{ expert, raw }` — the same shape BookingPage expects.
   */
  async getConsultantForRebooking(id) {
    const c = await apiRequest.get(`/consultant/consultants/${id}`);
    const name = String(c?.user_name ?? '').trim() || 'Consultant';
    const tags = Array.isArray(c?.specialization) ? c.specialization : [];
    const charge = (dur) => {
      const item = Array.isArray(c?.charges) ? c.charges.find((ch) => ch?.duration === dur) : null;
      return item?.charge_amount ?? 0;
    };
    const initials = initialsFromName(name);

    return {
      expert: {
        id: c?._id ?? `consultant-${id}`,
        name,
        tags: tags.length ? tags : ['General'],
        rating: typeof c?.avgRating === 'number' ? c.avgRating : null,
        reviews: typeof c?.totalFeedbacks === 'number' ? c.totalFeedbacks : null,
        experience: `${c?.experience_years ?? 0} years`,
        sessions: typeof c?.totalCompletedAppointments === 'number' ? c.totalCompletedAppointments : null,
        price15: charge('15_minutes'),
        price30: charge('30_minutes'),
        initials,
        color: 'bg-purple-100 text-purple-700',
      },
      raw: c,
    };
  },

  /**
   * Download an invoice for an appointment.
   * GET /user/invoice/:appointmentId
   */
  async getInvoice(appointmentId) {
    return apiRequest.get(`/user/invoice/${appointmentId}`);
  },

  /**
   * Fetch consultant availability slots.
   * GET /consultant/availability
   */
  async getAvailabilitySlots(params) {
    return apiRequest.get('/consultant/availability', { params });
  },
};
