/**
 * Session utility functions.
 * Mirrors the time-window logic from consolto_app/app/(specific)/videoCall.jsx.
 */

/**
 * Parse an appointment date + time string into a Date object.
 * Handles: "2:30 PM", "14:30", "14:30:00".
 */
export function parseAppointmentDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;

  const dateOnly = String(dateStr).trim().slice(0, 10);
  const t = String(timeStr).trim();

  // AM/PM format
  const ampm = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let h = Number(ampm[1]);
    const m = Number(ampm[2]);
    const p = ampm[3].toUpperCase();
    if (p === 'PM' && h !== 12) h += 12;
    if (p === 'AM' && h === 12) h = 0;
    const d = new Date(`${dateOnly}T00:00:00`);
    d.setHours(h, m, 0, 0);
    return d;
  }

  // 24-hour format: "14:30" or "14:30:00"
  const h24 = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (h24) {
    const d = new Date(`${dateOnly}T00:00:00`);
    d.setHours(Number(h24[1]), Number(h24[2]), h24[3] ? Number(h24[3]) : 0, 0);
    return d;
  }

  return null;
}

/**
 * Compute the time windows for video and chat based on appointment times.
 *
 * From mobile app:
 *   - Video window: exact appointment start → end
 *   - Chat window:  15 min before start → 30 days after end
 *   - Message cut-off: 5 min after end
 */
export function getTimeWindows(appointmentDate, startTime, endTime) {
  const start = parseAppointmentDateTime(appointmentDate, startTime);
  const end = parseAppointmentDateTime(appointmentDate, endTime);
  if (!start || !end) return null;

  const chatWindowStart = new Date(start.getTime() - 15 * 60_000);
  const chatWindowEnd = new Date(end.getTime() + 30 * 24 * 60 * 60_000);
  const messageCutoff = new Date(end.getTime() + 5 * 60_000);
  const twoMinWarning = new Date(end.getTime() - 2 * 60_000);

  return {
    videoStart: start,
    videoEnd: end,
    chatWindowStart,
    chatWindowEnd,
    messageCutoff,
    twoMinWarning,
  };
}

/**
 * Evaluate current time against the session windows and return a status object.
 */
export function evaluateTimeStatus(windows, mode, now = new Date()) {
  const { videoStart, videoEnd, chatWindowStart, chatWindowEnd, messageCutoff, twoMinWarning } =
    windows;

  const isInVideoWindow = now >= videoStart && now <= videoEnd;
  const isInChatWindow = now >= chatWindowStart && now <= chatWindowEnd;
  const canSendMessage = now <= messageCutoff;
  const showTwoMinWarning = now >= twoMinWarning && now < videoEnd;

  if (mode === 'chat') {
    if (!isInChatWindow) {
      if (now < chatWindowStart) {
        const mins = Math.ceil((chatWindowStart - now) / 60_000);
        return { status: 'waiting', message: `Chat available in ${mins} min`, canSendMessage: false, expired: false };
      }
      return { status: 'expired', message: 'Chat session has ended', canSendMessage: false, expired: true };
    }
    if (now > videoEnd) {
      return { status: 'completed', message: 'Appointment completed', canSendMessage, expired: false };
    }
    if (isInVideoWindow) {
      return { status: 'video_available', message: 'Video call is now available! You can switch to video.', canSendMessage, expired: false, showTwoMinWarning };
    }
    return { status: 'active', message: 'Chat is now available', canSendMessage, expired: false, showTwoMinWarning };
  }

  // Video mode
  if (!isInVideoWindow) {
    if (now < videoStart) {
      const mins = Math.ceil((videoStart - now) / 60_000);
      return { status: 'waiting', message: `Video call starts in ${mins} min`, canSendMessage, expired: false };
    }
    return { status: 'expired', message: 'Appointment time has ended', canSendMessage: false, expired: true };
  }

  return {
    status: 'active',
    message: 'Video call is active',
    canSendMessage,
    expired: false,
    showTwoMinWarning,
  };
}

/**
 * Generate the Stream call ID from an appointment ID.
 * Must match mobile: `appointment-${appointmentId}`
 */
export function getCallId(appointmentId) {
  return `appointment-${appointmentId}`;
}

/**
 * Generate the Stream channel ID from an appointment ID.
 * Must match mobile: `appointment-${appointmentId}`
 */
export function getChannelId(appointmentId) {
  return `appointment-${appointmentId}`;
}

/**
 * Request browser permissions for camera and microphone.
 * Returns { camera: boolean, microphone: boolean }.
 */
export async function requestMediaPermissions() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return { camera: true, microphone: true };
  } catch {
    return { camera: false, microphone: false };
  }
}

/**
 * Max file sizes (matching mobile app limits).
 */
export const FILE_LIMITS = {
  image: 10 * 1024 * 1024, // 10 MB
  video: 50 * 1024 * 1024, // 50 MB
  document: 10 * 1024 * 1024, // 10 MB
};

/**
 * Determine file type from MIME type.
 */
export function getFileType(mimeType) {
  if (!mimeType) return 'document';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'document';
}

/**
 * Session storage key for active session tracking.
 * Web equivalent of AsyncStorage 'activeStreamSession'.
 */
const SESSION_STORAGE_KEY = 'consolto_active_stream_session';

export function saveActiveSession(appointmentId) {
  try {
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ appointmentId, timestamp: Date.now() }),
    );
  } catch { /* ignore */ }
}

export function getActiveSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearActiveSession() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch { /* ignore */ }
}
