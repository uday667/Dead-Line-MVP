/**
 * CountdownTimer/index.tsx
 * Main countdown timer card that composes DeadlineInput, CountdownDisplay,
 * and ProgressBar using the useCountdown hook.
 */

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import TimerIcon from '@mui/icons-material/Timer';
import { useTheme } from '@mui/material/styles';

import { useCountdown } from '../../hooks/useCountdown';
import DeadlineInput from './DeadlineInput';
import CountdownDisplay from './CountdownDisplay';
import ProgressBar from './ProgressBar';

export default function CountdownTimer() {
  const theme = useTheme();
  const { deadline, timeRemaining, progressPercent, setDeadline, clearDeadline, isLoading } = useCountdown();

  const isNear = timeRemaining?.isNearDeadline ?? false;
  const isExpired = timeRemaining?.isExpired ?? false;

  if (isLoading) {
    return (
      <Paper
        elevation={12}
        sx={{
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Loading...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={12}
      sx={{
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
        border: `1px solid`,
        borderColor: isNear && !isExpired
          ? `${theme.palette.error.main}55`
          : isExpired
            ? `${theme.palette.error.main}77`
            : `${theme.palette.primary.main}33`,
        boxShadow: isNear && !isExpired
          ? `0 8px 48px ${theme.palette.error.main}22`
          : `0 8px 48px rgba(0,0,0,0.6)`,
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
        <TimerIcon
          sx={{
            fontSize: 32,
            color: 'primary.main',
            filter: `drop-shadow(0 0 8px ${theme.palette.primary.main})`,
          }}
        />
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            letterSpacing: '0.02em',
          }}
        >
          Countdown Timer
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Date input */}
      <DeadlineInput
        currentDeadline={deadline}
        onSet={setDeadline}
        onClear={clearDeadline}
      />

      {/* Countdown display */}
      {timeRemaining && (
        <Fade in timeout={500}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <CountdownDisplay timeRemaining={timeRemaining} />
            <ProgressBar
              percent={progressPercent}
              isNear={isNear}
              isExpired={isExpired}
            />
          </Box>
        </Fade>
      )}
    </Paper>
  );
}
