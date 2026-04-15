import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import './App.css';
import { formatDuration, getProgressRemainingPercent, getTimeRemaining } from './utils/time';

type InitialState = {
  deadline: Date;
  startTime: Date;
  inputValue: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Convert a Date object into the datetime-local input format.
 */
const toLocalDateTimeValue = (date: Date): string => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

/**
 * Start with a sensible default (24h from now) so users do not land on an empty screen.
 * This is front-end only and does not use any database.
 */
const createInitialState = (): InitialState => {
  const startTime = new Date();
  const deadline = new Date(startTime.getTime() + ONE_DAY_IN_MS);

  return {
    deadline,
    startTime,
    inputValue: toLocalDateTimeValue(deadline),
  };
};

function App() {
  const [initial] = useState<InitialState>(createInitialState);
  const [deadline, setDeadline] = useState<Date>(initial.deadline);
  const [startTime, setStartTime] = useState<Date>(initial.startTime);
  const [inputValue, setInputValue] = useState(initial.inputValue);
  const [now, setNow] = useState(() => new Date());

  // Tick every second so the countdown updates live.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const timeRemaining = useMemo(() => getTimeRemaining(deadline, now), [deadline, now]);

  const progressRemaining = useMemo(
    () => getProgressRemainingPercent(startTime, deadline, now),
    [deadline, startTime, now],
  );

  const isNearDeadline = timeRemaining > 0 && timeRemaining < ONE_DAY_IN_MS;
  const isExpired = timeRemaining <= 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue) return;

    const nextDeadline = new Date(inputValue);
    if (Number.isNaN(nextDeadline.getTime())) return;

    const nextStart = new Date();

    setDeadline(nextDeadline);
    setStartTime(nextStart);
    setNow(new Date());
  };

  const handleReset = () => {
    const resetState = createInitialState();
    setDeadline(resetState.deadline);
    setStartTime(resetState.startTime);
    setInputValue(resetState.inputValue);
    setNow(new Date());
  };

  const parts = formatDuration(timeRemaining);

  return (
    <main className="app-shell">
      <section className="card" aria-live="polite">
        <h1>Deadline Countdown</h1>
        <p className="subtitle">Simple front-end timer with no backend or database.</p>

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
            <button type="button" className="ghost" onClick={handleReset}>
              Reset to +24h
            </button>
          </div>
        </form>

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
      </section>
    </main>
  );
}

export default App;
