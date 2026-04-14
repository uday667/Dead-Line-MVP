/**
 * timeUtils.ts
 * Utility functions for parsing, formatting, and computing countdown time values.
 */

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
  isNearDeadline: boolean; // less than 24 hours remaining
}

/**
 * Computes the time remaining until a given deadline timestamp.
 * @param deadlineMs - Deadline in milliseconds (Date.getTime())
 * @returns A TimeRemaining object with broken-down time units
 */
export function getTimeRemaining(deadlineMs: number): TimeRemaining {
  const now = Date.now();
  const diff = deadlineMs - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: true,
      isNearDeadline: false,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const isNearDeadline = totalSeconds < 86400; // less than 1 day

  return { days, hours, minutes, seconds, totalSeconds, isExpired: false, isNearDeadline };
}

/**
 * Pads a number to at least 2 digits with a leading zero.
 */
export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Computes the progress percentage of time remaining.
 * @param deadlineMs - Deadline timestamp in milliseconds
 * @param startMs - Start timestamp in milliseconds
 * @returns A number 0-100 representing percentage of time LEFT
 */
export function getProgressPercent(deadlineMs: number, startMs: number): number {
  const total = deadlineMs - startMs;
  const remaining = deadlineMs - Date.now();

  if (total <= 0) return 0;
  if (remaining <= 0) return 0;

  return Math.min(100, Math.max(0, (remaining / total) * 100));
}

/**
 * Formats a Date object to the value expected by datetime-local input.
 */
export function toDatetimeLocalString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
