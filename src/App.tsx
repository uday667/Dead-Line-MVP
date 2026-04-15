import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import './App.css';
import { formatDuration, getProgressRemainingPercent, getTimeRemaining } from './utils/time';

type SavedDeadline = {
  deadlineISO: string;
  startISO: string;
};

type InitialState = {
  deadline: Date | null;
  startTime: Date | null;
  inputValue: string;
};

const STORAGE_KEY = 'deadline-mvp:data';
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Optional fixed default deadline baked into front-end code.
 * This appears for all users/devices (including incognito) unless they clear and set a custom one.
 * Update this value and redeploy when you want to change the global default deadline.
 */
const DEFAULT_DEADLINE_ISO = '2026-04-19T12:00:00';

/**
 * Convert a Date object into the datetime-local input format.
 */
const toLocalDateTimeValue = (date: Date): string => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

const emptyInitialState = (): InitialState => ({
  deadline: null,
  startTime: null,
  inputValue: '',
});

/**
 * Load saved deadline (front-end storage only). If missing, use code-level default deadline.
 */
const loadInitialState = (): InitialState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const saved = JSON.parse(raw) as SavedDeadline;
      const deadlineDate = new Date(saved.deadlineISO);
      const startDate = new Date(saved.startISO);

      if (!Number.isNaN(deadlineDate.getTime()) && !Number.isNaN(startDate.getTime())) {
        return {
          deadline: deadlineDate,
          startTime: startDate,
          inputValue: toLocalDateTimeValue(deadlineDate),
        };
      }
    } catch {
      // Ignore invalid data and continue with fallback.
    }
    localStorage.removeItem(STORAGE_KEY);
  }

  const codeDeadline = new Date(DEFAULT_DEADLINE_ISO);
  if (Number.isNaN(codeDeadline.getTime())) {
    return emptyInitialState();
  }

  return {
    deadline: codeDeadline,
    startTime: new Date(),
    inputValue: toLocalDateTimeValue(codeDeadline),
  };
};

function App() {
  const [initial] = useState<InitialState>(loadInitialState);
  const [deadline, setDeadline] = useState<Date | null>(initial.deadline);
  const [startTime, setStartTime] = useState<Date | null>(initial.startTime);
  const [inputValue, setInputValue] = useState(initial.inputValue);
  const [now, setNow] = useState(() => new Date());

  // Tick every second so the countdown updates live.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const timeRemaining = useMemo(() => {
    if (!deadline) return 0;
    return getTimeRemaining(deadline, now);
  }, [deadline, now]);

  const progressRemaining = useMemo(() => {
    if (!deadline || !startTime) return 0;
    return getProgressRemainingPercent(startTime, deadline, now);
  }, [deadline, startTime, now]);

  const isNearDeadline = timeRemaining > 0 && timeRemaining < ONE_DAY_IN_MS;
  const isExpired = deadline !== null && timeRemaining <= 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue) return;

    const nextDeadline = new Date(inputValue);
    if (Number.isNaN(nextDeadline.getTime())) return;

    const nextStart = new Date();

    setDeadline(nextDeadline);
    setStartTime(nextStart);
    setNow(new Date());

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        deadlineISO: nextDeadline.toISOString(),
        startISO: nextStart.toISOString(),
      } satisfies SavedDeadline),
    );
  };

  /**
   * Clear removes custom save and asks for a new deadline.
   */
  const handleClear = () => {
    setDeadline(null);
    setStartTime(null);
    setInputValue('');
    localStorage.removeItem(STORAGE_KEY);
  };

  const parts = formatDuration(timeRemaining);

  return (
    <main className="app-shell">
      <section className="card" aria-live="polite">
        <h1>Deadline Countdown</h1>
        <p className="subtitle">Frontend-only save (no database). Clear to ask for a new deadline.</p>

        <form className="deadline-form" onSubmit={handleSubmit}>
          <label htmlFor="deadline-input">Deadline date &amp; time</label>
          <input
            id="deadline-input"
            type="datetime-local"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            required
          />
          <div className="actions">
            <button type="submit">Save Deadline</button>
            <button type="button" className="ghost" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>

        {deadline ? (
          <>
            <div className={`countdown ${isNearDeadline ? 'warning' : ''}`}>
              {isExpired ? (
                <p className="time-up">Time&apos;s Up</p>
              ) : (
                <>
                  <div>
                    <span>{parts.days}</span>
                    <small>Days</small>
                  </div>
                  <div>
                    <span>{parts.hours}</span>
                    <small>Hours</small>
                  </div>
                  <div>
                    <span>{parts.minutes}</span>
                    <small>Minutes</small>
                  </div>
                  <div>
                    <span>{parts.seconds}</span>
                    <small>Seconds</small>
                  </div>
                </>
              )}
            </div>

            <div className="progress-wrapper">
              <div className="progress-label">
                <span>Time remaining</span>
                <span>{progressRemaining.toFixed(1)}%</span>
              </div>
              <div className="progress-track" role="progressbar" aria-valuenow={progressRemaining}>
                <div className="progress-fill" style={{ width: `${progressRemaining}%` }} />
              </div>
            </div>
          </>
        ) : (
          <p className="subtitle">Please set and save a deadline to start the countdown.</p>
        )}
      </section>
    </main>
  );
}

export default App;
