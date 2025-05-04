import { DefaultTheme } from 'styled-components';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Shape { borderRadius: number | number[]; }
}

const borderRadii = [4, 8, 16]; // [small, medium, large]

export const radius = (size: keyof DefaultTheme['borderRadius']) => {
  return ({ theme }: { theme: DefaultTheme }) => theme.borderRadius[size];
};

const baseTheme = {
  colors: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      surface: '#f5f5f5',
      light: '#fafafa',
    },
    surface: '#f5f5f5',
    border: {
      main: 'rgba(0, 0, 0, 0.12)',
      light: 'rgba(0, 0, 0, 0.08)',
      dark: 'rgba(0, 0, 0, 0.15)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      medium: 400,
      long: 500,
      complex: 1000,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
};

export const lightTheme: DefaultTheme = {
  ...baseTheme,
};

export const darkTheme: DefaultTheme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: '#000000',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
      surface: '#272727',
      light: '#2a2a2a',
    },
    surface: '#272727',
    border: {
      main: 'rgba(255, 255, 255, 0.12)',
      light: 'rgba(255, 255, 255, 0.08)',
      dark: 'rgba(255, 255, 255, 0.15)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
};

const theme = createTheme({
  shape: { borderRadius: borderRadii },
  // ... existing theme config ...
});

export default theme;
