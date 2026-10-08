import { describe, it, expect } from 'vitest';
import { getActivePeriod, formatPeriod, isSamePeriod, isCurrentPeriod } from './period';

describe('Period Domain Module', () => {
  it('should extract the correct month and year from a date', () => {
    const testDate = new Date('2026-10-15T10:30:00Z');
    const period = getActivePeriod(testDate);
    expect(period).toEqual({ month: 10, year: 2026 });
  });

  it('should correctly format a period', () => {
    expect(formatPeriod(10, 2026)).toBe('10/2026');
    expect(formatPeriod(3, 2027)).toBe('03/2027');
  });

  it('should check if a date is within the same period', () => {
    expect(isSamePeriod('2026-10-01', 10, 2026)).toBe(true);
    expect(isSamePeriod('2026-10-31', 10, 2026)).toBe(true);
    expect(isSamePeriod('2026-11-01', 10, 2026)).toBe(false);
    expect(isSamePeriod('invalid-date', 10, 2026)).toBe(false);
  });

  it('should verify current period against a reference date', () => {
    const ref = new Date('2026-10-08');
    expect(isCurrentPeriod(10, 2026, ref)).toBe(true);
    expect(isCurrentPeriod(9, 2026, ref)).toBe(false);
  });
});
