/**
 * CountdownDisplay.tsx
 * Renders the days / hours / minutes / seconds tiles.
 * Shows a warning color when the deadline is less than 24 hours away,
 * and a "Time's Up" message when the countdown reaches zero.
 */

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import { useTheme } from '@mui/material/styles';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import { type TimeRemaining, pad } from '../../utils/timeUtils';

interface TimeTileProps {
  value: number;
  label: string;
  urgent: boolean;
}

function TimeTile({ value, label, urgent }: TimeTileProps) {
  const theme = useTheme();

  const tileColor = urgent
    ? theme.palette.error.main
    : theme.palette.primary.main;

  const borderColor = urgent
    ? `${theme.palette.error.main}44`
    : `${theme.palette.primary.main}33`;

  return (
    <Paper
      elevation={4}
      sx={{
        minWidth: { xs: 72, sm: 90, md: 110 },
        py: { xs: 2, md: 3 },
        px: { xs: 1.5, md: 2 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: `2px solid ${borderColor}`,
        bgcolor: 'background.paper',
        borderRadius: 3,
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        boxShadow: urgent
          ? `0 0 24px ${theme.palette.error.main}33`
          : `0 0 24px ${theme.palette.primary.main}22`,
      }}
    >
      <Typography
        variant="h3"
        component="span"
        sx={{
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          color: tileColor,
          lineHeight: 1,
          fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
          transition: 'color 0.4s ease',
          letterSpacing: '0.04em',
        }}
      >
        {pad(value)}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          mt: 0.75,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: urgent ? 'error.light' : 'text.secondary',
          fontWeight: 500,
          fontSize: { xs: '0.6rem', sm: '0.7rem' },
          transition: 'color 0.4s ease',
        }}
      >
        {label}
      </Typography>
    </Paper>
  );
}

interface CountdownDisplayProps {
  timeRemaining: TimeRemaining;
}

export default function CountdownDisplay({ timeRemaining }: CountdownDisplayProps) {
  const theme = useTheme();
  const { days, hours, minutes, seconds, isExpired, isNearDeadline } = timeRemaining;

  if (isExpired) {
    return (
      <Fade in timeout={600}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            py: 4,
          }}
        >
          <AlarmOffIcon
            sx={{
              fontSize: 72,
              color: 'error.main',
              filter: `drop-shadow(0 0 16px ${theme.palette.error.main})`,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'error.main',
              textAlign: 'center',
              textShadow: `0 0 32px ${theme.palette.error.main}`,
              letterSpacing: '0.04em',
            }}
          >
            Time's Up!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            The deadline has passed.
          </Typography>
        </Box>
      </Fade>
    );
  }

  return (
    <Box>
      {isNearDeadline && (
        <Fade in timeout={500}>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              mb: 2.5,
              color: 'error.main',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.55 },
              },
            }}
          >
            ⚠ Less than 24 hours remaining!
          </Typography>
        </Fade>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1.5, sm: 2 },
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <TimeTile value={days} label="Days" urgent={isNearDeadline} />
        <TimeTile value={hours} label="Hours" urgent={isNearDeadline} />
        <TimeTile value={minutes} label="Minutes" urgent={isNearDeadline} />
        <TimeTile value={seconds} label="Seconds" urgent={isNearDeadline} />
      </Box>
    </Box>
  );
}
