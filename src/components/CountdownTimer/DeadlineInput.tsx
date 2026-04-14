/**
 * DeadlineInput.tsx
 * Provides a datetime-local input for setting the countdown deadline,
 * along with Set and Clear action buttons.
 */

import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AlarmAddIcon from '@mui/icons-material/AlarmAdd';
import ClearIcon from '@mui/icons-material/Clear';
import { toDatetimeLocalString } from '../../utils/timeUtils';

interface DeadlineInputProps {
  currentDeadline: number | null;
  onSet: (ms: number) => void;
  onClear: () => void;
}

export default function DeadlineInput({ currentDeadline, onSet, onClear }: DeadlineInputProps) {
  const [inputValue, setInputValue] = useState<string>(() => {
    if (currentDeadline) {
      return toDatetimeLocalString(new Date(currentDeadline));
    }
    return '';
  });
  const [error, setError] = useState<string>('');

  const handleSet = () => {
    if (!inputValue) {
      setError('Please select a date and time.');
      return;
    }
    const parsed = new Date(inputValue).getTime();
    if (isNaN(parsed)) {
      setError('Invalid date and time.');
      return;
    }
    if (parsed <= Date.now()) {
      setError('Deadline must be in the future.');
      return;
    }
    setError('');
    onSet(parsed);
  };

  const handleClear = () => {
    setInputValue('');
    setError('');
    onClear();
  };

  /* Build the min attribute value – 1 minute from now */
  const minDateTime = toDatetimeLocalString(new Date(Date.now() + 60_000));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography
        variant="overline"
        sx={{
          color: 'text.secondary',
          letterSpacing: '0.12em',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        Set Your Deadline
      </Typography>

      <TextField
        type="datetime-local"
        label="Deadline"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (error) setError('');
        }}
        error={!!error}
        helperText={error}
        fullWidth
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { min: minDateTime },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '& fieldset': { borderColor: 'primary.dark' },
            '&:hover fieldset': { borderColor: 'primary.main' },
          },
          '& input::-webkit-calendar-picker-indicator': {
            filter: 'invert(0.7)',
            cursor: 'pointer',
          },
        }}
      />

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<AlarmAddIcon />}
          onClick={handleSet}
          sx={{
            fontWeight: 600,
            py: 1.25,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(41, 182, 246, 0.35)',
            '&:hover': {
              boxShadow: '0 6px 24px rgba(41, 182, 246, 0.5)',
            },
          }}
        >
          Start Countdown
        </Button>

        {currentDeadline && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            sx={{
              borderRadius: 2,
              px: 2,
              minWidth: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            Clear
          </Button>
        )}
      </Box>
    </Box>
  );
}
