/**
 * useCountdown.ts
 * Custom hook that manages countdown state, Supabase persistence,
 * and a 1-second interval tick.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getTimeRemaining, getProgressPercent, type TimeRemaining } from '../utils/timeUtils';
import { saveDeadline, getDeadline, clearDeadline as clearDeadlineDb } from '../services/deadlineService';

export interface CountdownState {
  deadline: number | null;       // deadline timestamp in ms
  startTime: number | null;      // when the deadline was set, in ms
  timeRemaining: TimeRemaining | null;
  progressPercent: number;
  setDeadline: (ms: number) => void;
  clearDeadline: () => void;
  isLoading: boolean;
}

export function useCountdown(): CountdownState {
  const [deadline, setDeadlineState] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [progressPercent, setProgressPercent] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load saved deadline from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const record = await getDeadline();
        if (isMounted && record) {
          setDeadlineState(record.deadline);
          setStartTime(record.start_time);
        }
      } catch (error) {
        console.error('Failed to load deadline:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const tick = useCallback(() => {
    if (!deadline) return;
    const tr = getTimeRemaining(deadline);
    setTimeRemaining(tr);

    if (startTime) {
      setProgressPercent(getProgressPercent(deadline, startTime));
    }
  }, [deadline, startTime]);

  /* Start / stop the 1-second interval whenever the deadline changes */
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (deadline) {
      tick(); // immediate tick so there's no 1-second blank
      intervalRef.current = setInterval(tick, 1000);
    } else {
      setTimeRemaining(null);
      setProgressPercent(100);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [deadline, tick]);

  const setDeadlineFunc = useCallback((ms: number) => {
    const now = Date.now();
    setDeadlineState(ms);
    setStartTime(now);

    (async () => {
      try {
        await saveDeadline(ms, now);
      } catch (error) {
        console.error('Failed to save deadline:', error);
      }
    })();
  }, []);

  const clearDeadlineFunc = useCallback(() => {
    setDeadlineState(null);
    setStartTime(null);
    setTimeRemaining(null);
    setProgressPercent(100);

    (async () => {
      try {
        await clearDeadlineDb();
      } catch (error) {
        console.error('Failed to clear deadline:', error);
      }
    })();
  }, []);

  return {
    deadline,
    startTime,
    timeRemaining,
    progressPercent,
    setDeadline: setDeadlineFunc,
    clearDeadline: clearDeadlineFunc,
    isLoading,
  };
}
