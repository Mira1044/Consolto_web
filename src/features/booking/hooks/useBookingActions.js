import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/config';
import { useErrorHandler } from '@/shared/services/error';
import { bookingService } from '../services/bookingService';
import { useSessionGuard } from './useSessionGuard';
import { toDateOnly, timeToMinutes } from '../utils/bookingNormalization';

/**
 * useBookingActions
 *
 * Encapsulates every action a user can take on a booking:
 * cancel, reschedule, complete, book-again, join session.
 * Also owns modal/sheet state for cancel and reschedule flows.
 */
export function useBookingActions({ userRole, onRefresh }) {
  const navigate = useNavigate();
  const { handleApiError } = useErrorHandler();
  const { guardJoin } = useSessionGuard();

  // Modal state
  const [modal, setModal] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);

  // Cancel flow
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Reschedule flow
  const [rescheduleFilterDate, setRescheduleFilterDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  // Complete flow
  const [completeLoading, setCompleteLoading] = useState(false);
  const [completeBookingId, setCompleteBookingId] = useState(null);

  const closeModal = useCallback(() => {
    setModal(null);
    setActiveBooking(null);
    setCancelReason('');
    setCancelLoading(false);
    setRescheduleFilterDate('');
    setAvailableSlots([]);
    setSelectedAvailabilityId('');
    setLoadingSlots(false);
    setRescheduleLoading(false);
  }, []);

  const openDetails = useCallback((booking) => {
    setActiveBooking(booking);
    setModal('details');
  }, []);

  const openSummary = useCallback((booking) => {
    setActiveBooking(booking);
    setModal('summary');
  }, []);

  // -- Availability slots (shared by reschedule) --

  const fetchAvailabilitySlots = useCallback(async (consultantId, duration, currentBookingRaw, dateOnly = '') => {
    if (!consultantId || !duration) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    setAvailableSlots([]);

    try {
      const params = { consultant_id: consultantId, duration, is_booked: false };
      if (dateOnly) {
params.date = dateOnly;
}

      const payload = await bookingService.getAvailabilitySlots(params);

      const slots = Array.isArray(payload?.data?.data)
        ? payload.data.data
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

      const currentAvailabilityId =
        currentBookingRaw?.availability_id || currentBookingRaw?.availabilityId || currentBookingRaw?.availabilityID;
      const currentAppointmentBookedDate = currentBookingRaw?.appointment_booked_date;

      const filteredSlots = slots
        .filter((slot) => {
          if (!slot) {
return false;
}
          if (slot.type === 'SPECIFIC') {
            return slot._id !== currentAvailabilityId && slot.available_date !== currentAppointmentBookedDate;
          }
          return slot._id !== currentAvailabilityId;
        })
        .sort((a, b) => timeToMinutes(a?.start_time) - timeToMinutes(b?.start_time));

      setAvailableSlots(filteredSlots);
    } catch (err) {
      handleApiError(err, { context: { feature: 'booking', action: 'fetchAvailabilitySlots' } });
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [handleApiError]);

  // -- Cancel --

  const handleCancel = useCallback((booking) => {
    setActiveBooking(booking);
    setCancelReason('');
    setCancelLoading(false);
    setModal('cancel');
  }, []);

  const handleConfirmCancel = useCallback(async () => {
    if (!activeBooking) {
return;
}
    const raw = activeBooking?.raw || {};
    const appointmentId = raw?._id || activeBooking?.id;
    const reason = cancelReason.trim();

    if (!appointmentId) {
return;
}
    if (reason.length < 20) {
      window.alert('Cancellation reason must be at least 20 characters.');
      return;
    }

    setCancelLoading(true);
    try {
      await bookingService.cancelAppointment({ appointmentId, roleTab: userRole, reasonToCancel: reason });
      setModal(null);
      setActiveBooking(null);
      setCancelReason('');
      onRefresh();
    } catch (err) {
      handleApiError(err, { context: { feature: 'booking', action: 'cancelAppointment' } });
    } finally {
      setCancelLoading(false);
    }
  }, [activeBooking, cancelReason, userRole, handleApiError, onRefresh]);

  // -- Reschedule --

  const handleReschedule = useCallback(async (booking) => {
    const raw = booking?.raw || {};
    const consultantId = raw?.consultant?._id || raw?.consultant_id;
    const duration = raw?.appointment_duration;
    const initialDate = toDateOnly(raw?.appointment_booked_date);

    if (!consultantId || !duration || !initialDate) {
return;
}

    setActiveBooking(booking);
    setModal('reschedule');
    setRescheduleFilterDate(initialDate);
    setAvailableSlots([]);
    setSelectedAvailabilityId('');

    await fetchAvailabilitySlots(consultantId, duration, raw, initialDate);
  }, [fetchAvailabilitySlots]);

  const handleRescheduleDateChange = useCallback(async (newDateValue) => {
    const dateOnly = String(newDateValue || '').slice(0, 10);
    setRescheduleFilterDate(dateOnly);
    setSelectedAvailabilityId('');

    const raw = activeBooking?.raw || {};
    const consultantId = raw?.consultant?._id || raw?.consultant_id;
    const duration = raw?.appointment_duration;

    if (!consultantId || !duration || !dateOnly) {
return;
}
    await fetchAvailabilitySlots(consultantId, duration, raw, dateOnly);
  }, [activeBooking, fetchAvailabilitySlots]);

  const handleConfirmReschedule = useCallback(async () => {
    if (!activeBooking) {
return;
}
    const raw = activeBooking?.raw || {};
    const appointmentId = raw?._id || activeBooking?.id;

    const bookingDate = rescheduleFilterDate;
    const selectedSlot = availableSlots.find((s) => s._id === selectedAvailabilityId);

    if (!appointmentId) {
return;
}
    if (!selectedAvailabilityId) {
 window.alert('Please select a time slot.'); return;
}
    if (!bookingDate) {
 window.alert('Please select a date for the appointment.'); return;
}
    if (!selectedSlot) {
 window.alert('Selected slot is no longer available. Please try again.'); return;
}

    setRescheduleLoading(true);
    try {
      await bookingService.rescheduleAppointment({
        appointmentId,
        roleTab: userRole,
        newAvailabilityId: selectedAvailabilityId,
        booking_date: ['WEEKLY', 'DAILY'].includes(selectedSlot?.type) ? bookingDate : undefined,
      });

      setModal(null);
      setActiveBooking(null);
      setSelectedAvailabilityId('');
      setAvailableSlots([]);
      setRescheduleFilterDate('');
      onRefresh();
    } catch (err) {
      handleApiError(err, { context: { feature: 'booking', action: 'rescheduleAppointment' } });
    } finally {
      setRescheduleLoading(false);
    }
  }, [activeBooking, rescheduleFilterDate, availableSlots, selectedAvailabilityId, userRole, handleApiError, onRefresh]);

  // -- Complete --

  const handleCompleteBooking = useCallback(async (booking) => {
    const raw = booking?.raw || {};
    const appointmentId = raw?._id || booking?.id;
    if (!appointmentId) {
return;
}

    const ok = window.confirm('Are you sure you want to mark this appointment as completed?');
    if (!ok) {
return;
}

    setCompleteBookingId(appointmentId);
    setCompleteLoading(true);
    try {
      await bookingService.markAppointmentComplete({ appointmentId });
      onRefresh();
    } catch (err) {
      handleApiError(err, { context: { feature: 'booking', action: 'markAppointmentComplete' } });
    } finally {
      setCompleteLoading(false);
      setCompleteBookingId(null);
    }
  }, [handleApiError, onRefresh]);

  // -- Book Again --

  const handleBookAgain = useCallback(async (booking) => {
    try {
      const consultantId =
        booking?.raw?.consultant?._id ??
        booking?.raw?.consultantId ??
        booking?.raw?.consultant_id ??
        booking?.raw?.consultantID ??
        null;

      if (!consultantId) {
        navigate(ROUTES.EXPERTS);
        return;
      }

      const { expert } = await bookingService.getConsultantForRebooking(consultantId);
      navigate(ROUTES.BOOKING, { state: { expert, duration: 15 } });
    } catch (err) {
      handleApiError(err, { context: { feature: 'booking', action: 'bookAgain' } });
    }
  }, [handleApiError, navigate]);

  // -- Session navigation --

  const buildSessionStateFromBooking = useCallback((booking, sessionMode) => {
    const raw = booking?.raw || {};
    const appointmentId = raw?._id || booking?.id;
    const appointmentDate = String(raw?.appointment_booked_date || raw?.appointmentDate || '').slice(0, 10);
    const appointmentStartTime = raw?.appointment_start_time || raw?.appointmentStartTime || '';
    const appointmentEndTime = raw?.appointment_end_time || raw?.appointmentEndTime || '';

    const otherUserName =
      userRole === 'consultant'
        ? raw?.user?.firstName && raw?.user?.lastName
          ? `${raw.user.firstName} ${raw.user.lastName}`
          : raw?.user?.firstName || raw?.user?.phoneNumber || 'Client'
        : raw?.consultant?.user_name || raw?.consultant?.name || 'Consultant';

    const rawOtherUserId =
      userRole === 'consultant'
        ? raw?.user?._id || raw?.user?.id || (typeof raw?.user === 'string' ? raw.user : null) || raw?.user_id
        : raw?.consultant?._id || raw?.consultant?.id || (typeof raw?.consultant === 'string' ? raw.consultant : null) || raw?.consultant_id;

    const otherUserId =
      rawOtherUserId && typeof rawOtherUserId === 'object'
        ? rawOtherUserId._id || rawOtherUserId.id || ''
        : rawOtherUserId || '';

    if (!appointmentId || !appointmentDate) {
      window.alert('Unable to open this session — missing appointment details.');
      return null;
    }

    return {
      appointmentId,
      appointmentStartTime,
      appointmentEndTime,
      appointmentDate,
      otherUserName,
      otherUserId: String(otherUserId),
      mode: sessionMode,
      userRole,
      appointmentStatus: raw?.appointment_status,
    };
  }, [userRole]);

  const openSessionFromBooking = useCallback((booking, sessionMode) => {
    const sessionState = buildSessionStateFromBooking(booking, sessionMode);
    if (!sessionState) {
return;
}

    guardJoin(() => {
      navigate(
        ROUTES.SESSION.replace(':appointmentId', encodeURIComponent(String(sessionState.appointmentId))),
        { state: sessionState },
      );
    });
  }, [buildSessionStateFromBooking, guardJoin, navigate]);

  return {
    modal,
    activeBooking,
    closeModal,
    openDetails,
    openSummary,

    cancelReason,
    setCancelReason,
    cancelLoading,
    handleCancel,
    handleConfirmCancel,

    rescheduleFilterDate,
    availableSlots,
    selectedAvailabilityId,
    setSelectedAvailabilityId,
    loadingSlots,
    rescheduleLoading,
    handleReschedule,
    handleConfirmReschedule,
    handleRescheduleDateChange,

    completeLoading,
    completeBookingId,
    handleCompleteBooking,

    handleBookAgain,
    openSessionFromBooking,
  };
}
