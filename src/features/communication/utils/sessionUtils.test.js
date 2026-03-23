import { describe, it, expect } from 'vitest';
import {
  parseAppointmentDateTime,
  getTimeWindows,
  evaluateTimeStatus,
  getCallId,
  getChannelId,
  getFileType,
  FILE_LIMITS,
} from './sessionUtils';

describe('parseAppointmentDateTime', () => {
  it('returns null for missing inputs', () => {
    expect(parseAppointmentDateTime(null, '10:00 AM')).toBeNull();
    expect(parseAppointmentDateTime('2026-03-24', null)).toBeNull();
    expect(parseAppointmentDateTime(null, null)).toBeNull();
  });

  it('parses AM/PM format', () => {
    const d = parseAppointmentDateTime('2026-03-24', '2:30 PM');
    expect(d).toBeInstanceOf(Date);
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(30);
  });

  it('handles 12:00 AM as midnight', () => {
    const d = parseAppointmentDateTime('2026-03-24', '12:00 AM');
    expect(d.getHours()).toBe(0);
  });

  it('handles 12:00 PM as noon', () => {
    const d = parseAppointmentDateTime('2026-03-24', '12:00 PM');
    expect(d.getHours()).toBe(12);
  });

  it('parses 24-hour format', () => {
    const d = parseAppointmentDateTime('2026-03-24', '14:30');
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(30);
  });

  it('parses 24-hour format with seconds', () => {
    const d = parseAppointmentDateTime('2026-03-24', '14:30:45');
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(30);
    expect(d.getSeconds()).toBe(45);
  });

  it('returns null for unparseable time', () => {
    expect(parseAppointmentDateTime('2026-03-24', 'invalid')).toBeNull();
  });
});

describe('getTimeWindows', () => {
  it('returns null when start or end cannot be parsed', () => {
    expect(getTimeWindows('2026-03-24', null, '3:00 PM')).toBeNull();
    expect(getTimeWindows(null, '2:00 PM', '3:00 PM')).toBeNull();
  });

  it('computes correct windows', () => {
    const w = getTimeWindows('2026-03-24', '2:00 PM', '2:30 PM');
    expect(w).not.toBeNull();

    expect(w.videoStart.getHours()).toBe(14);
    expect(w.videoEnd.getHours()).toBe(14);
    expect(w.videoEnd.getMinutes()).toBe(30);

    // Chat opens 15 min before
    expect(w.chatWindowStart.getTime()).toBe(w.videoStart.getTime() - 15 * 60_000);

    // Message cutoff 5 min after end
    expect(w.messageCutoff.getTime()).toBe(w.videoEnd.getTime() + 5 * 60_000);

    // Two-min warning 2 min before end
    expect(w.twoMinWarning.getTime()).toBe(w.videoEnd.getTime() - 2 * 60_000);
  });
});

describe('evaluateTimeStatus', () => {
  const makeWindows = () => {
    const videoStart = new Date('2026-03-24T14:00:00');
    const videoEnd = new Date('2026-03-24T14:30:00');
    return {
      videoStart,
      videoEnd,
      chatWindowStart: new Date(videoStart.getTime() - 15 * 60_000),
      chatWindowEnd: new Date(videoEnd.getTime() + 30 * 24 * 60 * 60_000),
      messageCutoff: new Date(videoEnd.getTime() + 5 * 60_000),
      twoMinWarning: new Date(videoEnd.getTime() - 2 * 60_000),
    };
  };

  it('returns "waiting" for video mode before start', () => {
    const w = makeWindows();
    const now = new Date('2026-03-24T13:50:00');
    const result = evaluateTimeStatus(w, 'video', now);
    expect(result.status).toBe('waiting');
    expect(result.expired).toBe(false);
  });

  it('returns "active" during video window', () => {
    const w = makeWindows();
    const now = new Date('2026-03-24T14:10:00');
    const result = evaluateTimeStatus(w, 'video', now);
    expect(result.status).toBe('active');
    expect(result.expired).toBe(false);
    expect(result.showTwoMinWarning).toBe(false);
  });

  it('shows two-min warning near end of video', () => {
    const w = makeWindows();
    const now = new Date('2026-03-24T14:29:00');
    const result = evaluateTimeStatus(w, 'video', now);
    expect(result.status).toBe('active');
    expect(result.showTwoMinWarning).toBe(true);
  });

  it('returns "expired" for video mode after end', () => {
    const w = makeWindows();
    const now = new Date('2026-03-24T14:31:00');
    const result = evaluateTimeStatus(w, 'video', now);
    expect(result.status).toBe('expired');
    expect(result.expired).toBe(true);
  });

  it('returns "waiting" for chat mode before window', () => {
    const w = makeWindows();
    const now = new Date('2026-03-24T13:40:00');
    const result = evaluateTimeStatus(w, 'chat', now);
    expect(result.status).toBe('waiting');
  });

  it('returns "active" for chat mode in window before video start', () => {
    const w = makeWindows();
    const now = new Date('2026-03-24T13:50:00');
    const result = evaluateTimeStatus(w, 'chat', now);
    expect(result.status).toBe('active');
  });

  it('returns "video_available" for chat mode during video window', () => {
    const w = makeWindows();
    const now = new Date('2026-03-24T14:10:00');
    const result = evaluateTimeStatus(w, 'chat', now);
    expect(result.status).toBe('video_available');
  });
});

describe('getCallId / getChannelId', () => {
  it('prefixes appointment ID', () => {
    expect(getCallId('abc123')).toBe('appointment-abc123');
    expect(getChannelId('abc123')).toBe('appointment-abc123');
  });
});

describe('getFileType', () => {
  it('identifies image types', () => {
    expect(getFileType('image/png')).toBe('image');
    expect(getFileType('image/jpeg')).toBe('image');
  });

  it('identifies video types', () => {
    expect(getFileType('video/mp4')).toBe('video');
  });

  it('defaults to document', () => {
    expect(getFileType('application/pdf')).toBe('document');
    expect(getFileType(null)).toBe('document');
    expect(getFileType('')).toBe('document');
  });
});

describe('FILE_LIMITS', () => {
  it('defines expected size limits', () => {
    expect(FILE_LIMITS.image).toBe(10 * 1024 * 1024);
    expect(FILE_LIMITS.video).toBe(50 * 1024 * 1024);
    expect(FILE_LIMITS.document).toBe(10 * 1024 * 1024);
  });
});
