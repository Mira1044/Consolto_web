import { describe, it, expect } from 'vitest';
import { formatDateTime, normalizeAppointment, toDateOnly, timeToMinutes } from './bookingNormalization';

describe('formatDateTime', () => {
  it('returns defaults when bookedDate is missing', () => {
    const result = formatDateTime({ bookedDate: null, startTime: '10:00 AM' });
    expect(result.date).toBe('Date not set');
    expect(result.time).toBe('10:00 AM');
    expect(result.ts).toBeNull();
  });

  it('returns defaults when both are missing', () => {
    const result = formatDateTime({});
    expect(result.date).toBe('Date not set');
    expect(result.time).toBe('Time not set');
    expect(result.ts).toBeNull();
  });

  it('parses a valid date and AM time', () => {
    const result = formatDateTime({ bookedDate: '2026-03-24', startTime: '10:30 AM' });
    expect(result.date).toContain('2026');
    expect(result.time).toBe('10:30 AM');
    expect(result.ts).toBeGreaterThan(0);
  });

  it('handles PM times correctly', () => {
    const result = formatDateTime({ bookedDate: '2026-03-24', startTime: '2:00 PM' });
    const d = new Date(result.ts);
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(0);
  });

  it('handles 12:00 PM (noon)', () => {
    const result = formatDateTime({ bookedDate: '2026-03-24', startTime: '12:00 PM' });
    const d = new Date(result.ts);
    expect(d.getHours()).toBe(12);
  });

  it('handles 12:00 AM (midnight)', () => {
    const result = formatDateTime({ bookedDate: '2026-03-24', startTime: '12:00 AM' });
    const d = new Date(result.ts);
    expect(d.getHours()).toBe(0);
  });
});

describe('normalizeAppointment', () => {
  it('normalizes a basic appointment object', () => {
    const raw = {
      _id: 'abc123',
      consultant: { user_name: 'Dr. Smith', specialization: ['Cardiology'] },
      mode: 'video',
      status: 'upcoming',
      appointment_booked_date: '2026-04-01',
      appointment_start_time: '9:00 AM',
    };

    const result = normalizeAppointment(raw, 0);
    expect(result.id).toBe('abc123');
    expect(result.doctor).toBe('Dr. Smith');
    expect(result.specialty).toBe('Cardiology');
    expect(result.mode).toBe('Video');
    expect(result.avatar).toBe('DS');
    expect(result.raw).toBe(raw);
  });

  it('falls back to defaults for missing fields', () => {
    const result = normalizeAppointment({}, 2);
    expect(result.doctor).toBe('Consultant');
    expect(result.specialty).toBe('Consultation');
    expect(result.id).toBe('appt-2');
  });

  it('detects cancelled status', () => {
    const result = normalizeAppointment({ status: 'cancelled' }, 0);
    expect(result.status).toBe('cancelled');
  });

  it('detects completed status', () => {
    const result = normalizeAppointment({ status: 'completed' }, 0);
    expect(result.status).toBe('completed');
  });

  it('cycles through palette colors', () => {
    const r0 = normalizeAppointment({}, 0);
    const r1 = normalizeAppointment({}, 1);
    expect(r0.color).not.toBe(r1.color);
    expect(r0.accent).not.toBe(r1.accent);
  });
});

describe('toDateOnly', () => {
  it('extracts YYYY-MM-DD from an ISO string', () => {
    expect(toDateOnly('2026-03-24T10:30:00.000Z')).toBe('2026-03-24');
  });

  it('returns empty string for falsy input', () => {
    expect(toDateOnly(null)).toBe('');
    expect(toDateOnly('')).toBe('');
  });
});

describe('timeToMinutes', () => {
  it('parses 12-hour AM time', () => {
    expect(timeToMinutes('9:00 AM')).toBe(540);
    expect(timeToMinutes('12:00 AM')).toBe(0);
  });

  it('parses 12-hour PM time', () => {
    expect(timeToMinutes('2:30 PM')).toBe(870);
    expect(timeToMinutes('12:00 PM')).toBe(720);
  });

  it('parses 24-hour time', () => {
    expect(timeToMinutes('14:30')).toBe(870);
    expect(timeToMinutes('0:00')).toBe(0);
  });

  it('returns 0 for empty or invalid input', () => {
    expect(timeToMinutes('')).toBe(0);
    expect(timeToMinutes(null)).toBe(0);
    expect(timeToMinutes('garbage')).toBe(0);
  });
});
