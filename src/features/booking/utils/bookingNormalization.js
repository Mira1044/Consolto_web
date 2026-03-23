/**
 * Pure utility functions for normalizing backend appointment data
 * into the shape consumed by booking UI components.
 */

import { initialsFromName } from '@/shared/utils/stringUtils';

export { initialsFromName };

const PALETTE = [
  ['bg-violet-100 text-violet-700', '#7c3aed'],
  ['bg-blue-100 text-blue-700', '#2563eb'],
  ['bg-pink-100 text-pink-700', '#db2777'],
  ['bg-green-100 text-green-700', '#16a34a'],
  ['bg-orange-100 text-orange-700', '#ea580c'],
  ['bg-teal-100 text-teal-700', '#0d9488'],
];

export function formatDateTime({ bookedDate, startTime }) {
  const d = bookedDate ? new Date(bookedDate) : null;
  if (!d || Number.isNaN(d.getTime())) {
    return { date: 'Date not set', time: startTime || 'Time not set', ts: null };
  }

  const date = d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  let ts = null;
  if (startTime) {
    const m = String(startTime).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (m) {
      let hour = Number(m[1]);
      const minute = Number(m[2]);
      const period = m[3].toUpperCase();
      if (period === 'PM' && hour !== 12) {
hour += 12;
}
      if (period === 'AM' && hour === 12) {
hour = 0;
}
      const withTime = new Date(d);
      withTime.setHours(hour, minute, 0, 0);
      ts = withTime.getTime();
    }
  }

  return { date, time: startTime || 'Time not set', ts };
}

export function normalizeAppointment(a, index) {
  const consultantFromBooking =
    a?.consultant_id && typeof a.consultant_id === 'object' ? a.consultant_id : a?.consultant;

  const consultantName =
    consultantFromBooking?.user_name ??
    a?.consultant?.user_name ??
    a?.consultant_name ??
    a?.consultant?.name ??
    a?.consultant?.userName ??
    'Consultant';

  const specialization =
    (Array.isArray(consultantFromBooking?.specialization) && consultantFromBooking.specialization[0]) ||
    (Array.isArray(a?.consultant?.specialization) && a.consultant.specialization[0]) ||
    a?.specialization ||
    a?.category ||
    'Consultation';

  const modeRaw = a?.mode ?? a?.meeting_type ?? a?.type ?? a?.session_type ?? a?.appointment_mode;
  const mode = String(modeRaw || '').toLowerCase().includes('video') ? 'Video' : 'In-person';

  const statusRaw = String(a?.status ?? a?.appointment_status ?? '').toLowerCase();
  const when = formatDateTime({
    bookedDate: a?.appointment_booked_date ?? a?.scheduledAt ?? a?.start_time ?? a?.startTime ?? a?.dateTime ?? a?.createdAt,
    startTime: a?.appointment_start_time ?? a?.start_time_label ?? a?.startTimeLabel ?? a?.start_time,
  });
  const now = Date.now();
  const computedUpcoming = when.ts != null ? when.ts > now : statusRaw === 'upcoming';

  let status = 'upcoming';
  if (statusRaw.includes('cancel')) {
status = 'cancelled';
} else if (statusRaw.includes('complete') || statusRaw.includes('done')) {
status = 'completed';
} else {
status = computedUpcoming ? 'upcoming' : 'completed';
}

  const [color, accent] = PALETTE[index % PALETTE.length];

  return {
    id: a?._id ?? a?.id ?? `appt-${index}`,
    doctor: String(consultantName).trim(),
    specialty: String(specialization).trim(),
    date: when.date,
    time: when.time,
    mode,
    status,
    avatar: initialsFromName(consultantName),
    color,
    accent,
    raw: a,
  };
}

export function toDateOnly(d) {
  return String(d || '').slice(0, 10);
}

export function timeToMinutes(timeStr) {
  const t = String(timeStr || '').trim();
  if (!t) {
return 0;
}

  const m12 = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m12) {
    let hour = Number(m12[1]);
    const mins = Number(m12[2]);
    const period = m12[3].toUpperCase();
    if (period === 'PM' && hour !== 12) {
hour += 12;
}
    if (period === 'AM' && hour === 12) {
hour = 0;
}
    return hour * 60 + mins;
  }

  const m24 = t.match(/^(\d{1,2}):(\d{2})$/);
  if (m24) {
    return Number(m24[1]) * 60 + Number(m24[2]);
  }

  return 0;
}
