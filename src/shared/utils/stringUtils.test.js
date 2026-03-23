import { describe, it, expect } from 'vitest';
import { initialsFromName } from './stringUtils';

describe('initialsFromName', () => {
  it('returns "?" for empty or falsy input', () => {
    expect(initialsFromName('')).toBe('?');
    expect(initialsFromName(null)).toBe('?');
    expect(initialsFromName(undefined)).toBe('?');
    expect(initialsFromName('   ')).toBe('?');
  });

  it('returns two-letter initials for a two-word name', () => {
    expect(initialsFromName('Priya Sharma')).toBe('PS');
    expect(initialsFromName('john doe')).toBe('JD');
  });

  it('uses first two chars of a single-word name', () => {
    expect(initialsFromName('Consultant')).toBe('CO');
  });

  it('handles three-word names (first + second initial)', () => {
    expect(initialsFromName('Dr Priya Sharma')).toBe('DP');
  });

  it('handles extra whitespace', () => {
    expect(initialsFromName('  Rahul   Mehta  ')).toBe('RM');
  });

  it('handles single character name', () => {
    expect(initialsFromName('A')).toBe('A');
  });
});
