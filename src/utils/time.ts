/**
 * Milliseconds remaining from now to deadline.
 */
export const getTimeRemaining = (deadline: Date, now: Date): number => {
  return Math.max(0, deadline.getTime() - now.getTime());
};

/**
 * Remaining percentage between start and deadline.
 */
export const getProgressRemainingPercent = (
  start: Date,
  deadline: Date,
  now: Date,
): number => {
  const total = deadline.getTime() - start.getTime();
  if (total <= 0) return 0;

  const remaining = deadline.getTime() - now.getTime();
  const percent = (remaining / total) * 100;
  return Math.min(100, Math.max(0, percent));
};

/**
 * Convert milliseconds into day/hour/minute/second parts.
 */
export const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};
