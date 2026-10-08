export interface Period {
  month: number;
  year: number;
}

/**
 * Returns the active period (month 1-12 and 4-digit year) from a Date object or current time.
 */
export function getActivePeriod(date: Date = new Date()): Period {
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
}

/**
 * Formats period into string representation MM/YYYY or Arabic label
 */
export function formatPeriod(month: number, year: number): string {
  const paddedMonth = String(month).padStart(2, '0');
  return `${paddedMonth}/${year}`;
}

/**
 * Checks if a given date falls within the specified month and year.
 */
export function isSamePeriod(date: Date | string, month: number, year: number): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return false;
  return d.getMonth() + 1 === month && d.getFullYear() === year;
}

/**
 * Checks if the given period is the currently active period.
 */
export function isCurrentPeriod(month: number, year: number, referenceDate: Date = new Date()): boolean {
  const active = getActivePeriod(referenceDate);
  return active.month === month && active.year === year;
}
