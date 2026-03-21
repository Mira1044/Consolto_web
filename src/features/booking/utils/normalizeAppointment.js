/** Shared booking card normalization (used by BookingsPage + React Query fetch). */

function initialsFromName(name) {
  const cleaned = String(name || '').trim();
  if (!cleaned) return '?';
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const second = parts.length > 1 ? parts[1]?.[0] ?? '' : (parts[0]?.[1] ?? '');
  return (first + second).toUpperCase().slice(0, 3) || cleaned.slice(0, 1).toUpperCase();
}

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
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
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
  if (statusRaw.includes('cancel')) status = 'cancelled';
  else if (statusRaw.includes('complete') || statusRaw.includes('done')) status = 'completed';
  else status = computedUpcoming ? 'upcoming' : 'completed';

  const palette = [
    ['bg-violet-100 text-violet-700', '#7c3aed'],
    ['bg-blue-100 text-blue-700', '#2563eb'],
    ['bg-pink-100 text-pink-700', '#db2777'],
    ['bg-green-100 text-green-700', '#16a34a'],
    ['bg-orange-100 text-orange-700', '#ea580c'],
    ['bg-teal-100 text-teal-700', '#0d9488'],
  ];
  const [color, accent] = palette[index % palette.length];

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

/** Normalize parallel upcoming + past API responses into card models */
export function normalizeAppointmentLists(upcomingResp, pastResp) {
  const upcomingRaw = upcomingResp?.appointments || [];
  const pastRaw = pastResp?.appointments || [];
  const normalizedUpcoming = upcomingRaw.map((a, i) => normalizeAppointment(a, i));
  const normalizedPast = pastRaw.map((a, i) => normalizeAppointment(a, i + normalizedUpcoming.length));
  return { upcoming: normalizedUpcoming, past: normalizedPast };
}
