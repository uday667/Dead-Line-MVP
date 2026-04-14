/**
 * App.tsx
 * Root component. Provides the MUI theme and renders the full-page
 * centered layout containing the CountdownTimer card.
 */

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import theme from './theme';
import CountdownTimer from './components/CountdownTimer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3 },
          py: 6,
          background: 'radial-gradient(ellipse at 50% 0%, #0d2e4e 0%, #0a1929 60%)',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 640 }}>
          <CountdownTimer />

          {/* Footer */}
          <Typography
            variant="caption"
            component="p"
            sx={{
              textAlign: 'center',
              mt: 3,
              color: 'text.secondary',
              opacity: 0.5,
              letterSpacing: '0.08em',
            }}
          >
            Deadline is saved automatically in your browser.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
