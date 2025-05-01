import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  colors: {
    primary: '#2196F3',
    secondary: '#FF4081',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FFC107',
    border: '#E0E0E0',
    disabled: '#BDBDBD',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontFamily: "'Noto Sans KR', sans-serif",
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.1)',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
};

export const darkTheme: DefaultTheme = {
  colors: {
    primary: '#64B5F6',
    secondary: '#FF80AB',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    error: '#EF5350',
    success: '#66BB6A',
    warning: '#FFD54F',
    border: '#424242',
    disabled: '#616161',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontFamily: "'Noto Sans KR', sans-serif",
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.3)',
    medium: '0 4px 8px rgba(0,0,0,0.3)',
    large: '0 8px 16px rgba(0,0,0,0.3)',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
};

export const media = {
  mobile: `@media (min-width: ${lightTheme.breakpoints.mobile})`,
  tablet: `@media (min-width: ${lightTheme.breakpoints.tablet})`,
  desktop: `@media (min-width: ${lightTheme.breakpoints.desktop})`,
  wide: `@media (min-width: ${lightTheme.breakpoints.wide})`,
}; 