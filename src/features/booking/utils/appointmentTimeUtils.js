/**
 * Web appointment time/availability utilities.
 * Mirrors the logic from `consolto_app/utils/timeUtils.js` (mobile).
 */

const extractDateOnly = (dateStr) => {
  const s = String(dateStr || '').trim();
  if (!s) {
return '';
}
  // Handles both "YYYY-MM-DD" and ISO timestamps.
  return s.length >= 10 ? s.slice(0, 10) : s;
};

const parseBookingDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) {
return null;
}

  const dateOnly = extractDateOnly(dateStr);
  if (!dateOnly) {
return null;
}

  const t = String(timeStr || '').trim();
  // AM/PM format: "2:30 PM"
  if (t.toUpperCase().includes('AM') || t.toUpperCase().includes('PM')) {
    const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) {
return null;
}

    let hour = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3].toUpperCase();

    if (period === 'PM' && hour !== 12) {
hour += 12;
}
    if (period === 'AM' && hour === 12) {
hour = 0;
}

    // Local midnight to avoid timezone shifts from `new Date("YYYY-MM-DD")` parsing.
    const d = new Date(`${dateOnly}T00:00:00`);
    d.setHours(hour, minutes, 0, 0);
    return d;
  }

  // 24-hour format: "14:30" or "14:30:00"
  const m = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) {
return null;
}

  const hour = Number(m[1]);
  const minutes = Number(m[2]);
  const seconds = m[3] ? Number(m[3]) : 0;
  const d = new Date(`${dateOnly}T00:00:00`);
  d.setHours(hour, minutes, seconds, 0);
  return d;
};

export const formatTimeTo12Hour = (time) => {
  if (!time) {
return '';
}
  const t = String(time).trim();
  if (t.toUpperCase().includes('AM') || t.toUpperCase().includes('PM')) {
return t;
}

  const m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) {
return t;
}

  const hour = Number(m[1]);
  const minutes = m[2];

  if (hour === 0) {
return `12:${minutes} AM`;
}
  if (hour < 12) {
return `${hour}:${minutes} AM`;
}
  if (hour === 12) {
return `12:${minutes} PM`;
}
  return `${hour - 12}:${minutes} PM`;
};

export const formatAppointmentDate = (date) => {
  const dateOnly = extractDateOnly(date);
  if (!dateOnly) {
return '';
}
  const d = new Date(`${dateOnly}T00:00:00`);
  if (Number.isNaN(d.getTime())) {
return '';
}

  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatAppointmentTime = (startTime, endTime) => {
  if (!startTime || !endTime) {
return '';
}
  return `${formatTimeTo12Hour(startTime)} - ${formatTimeTo12Hour(endTime)}`;
};

export const getStatusColor = (appointmentStatus) => {
  const s = String(appointmentStatus || '').toUpperCase();
  switch (s) {
    case 'CONFIRMED':
      return '#4CAF50';
    case 'PENDING':
      return '#FF9800';
    case 'COMPLETED':
      return '#2196F3';
    case 'IN_PROGRESS':
      return '#9C27B0';
    case 'CANCELLED':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

export const isAppointmentUpcoming = (booking, currentTime = new Date()) => {
  if (!booking?.appointment_booked_date || !booking?.appointment_end_time) {
return false;
}

  const appointmentEndTime = parseBookingDateTime(booking.appointment_booked_date, booking.appointment_end_time);
  if (!appointmentEndTime) {
return false;
}

  const status = String(booking?.appointment_status || '').toUpperCase();
  return (
    appointmentEndTime.getTime() > currentTime.getTime() &&
    !['COMPLETED', 'CANCELLED'].includes(status)
  );
};

const formatCountdown = (minutes) => {
  const m = Number(minutes);
  if (!Number.isFinite(m)) {
return '';
}
  if (m < 1) {
return 'less than a minute';
}

  const days = Math.floor(m / (60 * 24));
  const hours = Math.floor((m % (60 * 24)) / 60);
  const mins = Math.floor(m % 60);

  const parts = [];
  if (days > 0) {
parts.push(`${days} day${days > 1 ? 's' : ''}`);
}
  if (hours > 0) {
parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
}
  if (mins > 0) {
parts.push(`${mins} minute${mins > 1 ? 's' : ''}`);
}

  return parts.join(' ');
};

export const getChatAvailability = (booking, currentTime = new Date()) => {
  const status = String(booking?.appointment_status || '').toUpperCase();

  if (!['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
    return { available: false, reason: 'Chat is only available for confirmed, in-progress, or completed appointments' };
  }

  const bookingDateTime = parseBookingDateTime(booking.appointment_booked_date, booking.appointment_start_time);
  const endDateTime = parseBookingDateTime(booking.appointment_booked_date, booking.appointment_end_time);

  if (!bookingDateTime || !endDateTime) {
    return { available: false, reason: 'Invalid appointment time' };
  }

  const chatWindowStart = new Date(bookingDateTime.getTime() - 15 * 60_000);
  const chatWindowEnd = new Date(endDateTime.getTime() + 30 * 24 * 60 * 60_000);

  const now = currentTime.getTime();
  const inWindow = now >= chatWindowStart.getTime() && now <= chatWindowEnd.getTime();

  if (inWindow) {
    return { available: true, reason: '' };
  }

  if (now < chatWindowStart.getTime()) {
    const minutesUntilChat = Math.ceil((chatWindowStart.getTime() - now) / 60_000);
    return { available: false, reason: `Chat available in ${formatCountdown(minutesUntilChat)}` };
  }

  return { available: false, reason: 'Chat history is no longer available' };
};

export const getVideoAvailability = (booking, currentTime = new Date()) => {
  const status = String(booking?.appointment_status || '').toUpperCase();

  if (!['CONFIRMED', 'IN_PROGRESS'].includes(status)) {
    return { available: false, reason: 'Only available for confirmed appointments' };
  }

  const bookingDateTime = parseBookingDateTime(booking.appointment_booked_date, booking.appointment_start_time);
  const endDateTime = parseBookingDateTime(booking.appointment_booked_date, booking.appointment_end_time);

  if (!bookingDateTime || !endDateTime) {
    return { available: false, reason: 'Invalid appointment time' };
  }

  const now = currentTime.getTime();
  const inWindow = now >= bookingDateTime.getTime() && now <= endDateTime.getTime();

  if (inWindow) {
    return { available: true, reason: '' };
  }

  if (now < bookingDateTime.getTime()) {
    const minutesUntilVideo = Math.ceil((bookingDateTime.getTime() - now) / 60_000);
    return { available: false, reason: `Video call starts in ${formatCountdown(minutesUntilVideo)}` };
  }

  return { available: false, reason: 'Appointment time has ended' };
};

export const canModifyBookingByDate = (booking, currentDate = new Date()) => {
  const appointmentDateOnly = extractDateOnly(booking?.appointment_booked_date);
  if (!appointmentDateOnly) {
return false;
}

  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  const appointmentDate = new Date(`${appointmentDateOnly}T00:00:00`);
  if (Number.isNaN(appointmentDate.getTime())) {
return false;
}

  const lastAllowedModifyDate = new Date(appointmentDate);
  lastAllowedModifyDate.setDate(lastAllowedModifyDate.getDate() - 2);

  return today.getTime() <= lastAllowedModifyDate.getTime();
};

