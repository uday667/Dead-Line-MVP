/**
 * ProgressBar.tsx
 * Displays a labeled progress bar showing how much time remains
 * relative to the total duration from start to deadline.
 * Color transitions to error (red) when the deadline is near.
 */

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

interface ProgressBarProps {
  percent: number;      // 0-100, represents time remaining
  isNear: boolean;      // true when < 24h remaining
  isExpired: boolean;
}

export default function ProgressBar({ percent, isNear, isExpired }: ProgressBarProps) {
  const theme = useTheme();

  const barColor = isExpired
    ? theme.palette.error.main
    : isNear
      ? theme.palette.warning.main
      : theme.palette.primary.main;

  const label = isExpired
    ? '0% remaining'
    : `${Math.round(percent)}% time remaining`;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontSize: '0.65rem',
          }}
        >
          Progress
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: isNear ? 'warning.main' : 'text.secondary',
            fontWeight: 600,
            fontSize: '0.65rem',
          }}
        >
          {label}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={isExpired ? 0 : percent}
        sx={{
          height: 10,
          borderRadius: 5,
          bgcolor: 'rgba(255,255,255,0.08)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            bgcolor: barColor,
            transition: 'background-color 0.5s ease, transform 0.4s linear',
            boxShadow: `0 0 10px ${barColor}88`,
          },
        }}
      />
    </Box>
  );
}
