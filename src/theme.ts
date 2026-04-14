import { createTheme } from '@mui/material/styles';

/**
 * App Theme Configuration
 * Dark mode theme with a deep blue palette for the countdown timer app
 */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#29b6f6',
      light: '#73e8ff',
      dark: '#0086c3',
    },
    secondary: {
      main: '#26c6da',
    },
    error: {
      main: '#ef5350',
      light: '#ff6f60',
    },
    warning: {
      main: '#ffa726',
    },
    success: {
      main: '#66bb6a',
    },
    background: {
      default: '#0a1929',
      paper: '#0d2137',
    },
    text: {
      primary: '#e3f2fd',
      secondary: '#90caf9',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

export default theme;
