import { describe, it, expect } from 'vitest';
import { toStoredSeconds } from './apiUtils';
import { formatTime } from './time';

describe('toStoredSeconds', () => {
  it('rounds numeric input to whole seconds', () => {
    expect(toStoredSeconds(42)).toBe(42);
    expect(toStoredSeconds(42.6)).toBe(43);
    expect(toStoredSeconds('90')).toBe(90);
    expect(toStoredSeconds(0)).toBe(0);
  });

  it('stores null for absent or invalid input instead of fabricating zero', () => {
    expect(toStoredSeconds(null)).toBeNull();
    expect(toStoredSeconds(undefined)).toBeNull();
    expect(toStoredSeconds('')).toBeNull();
    expect(toStoredSeconds('abc')).toBeNull();
    expect(toStoredSeconds(NaN)).toBeNull();
    expect(toStoredSeconds(Infinity)).toBeNull();
  });
});

describe('formatTime', () => {
  it('formats seconds as m:ss', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(5)).toBe('0:05');
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(95)).toBe('1:35');
    expect(formatTime(3600)).toBe('60:00');
  });

  it('floors fractional seconds', () => {
    expect(formatTime(61.9)).toBe('1:01');
  });
});
