import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: '#2D5BFF',
    secondary: '#6979F8',
    success: '#00C48C',
    danger: '#FF647C',
    warning: '#FFA26B',
    info: '#00C1D4',
    background: '#F7F9FC',
    surface: '#FFFFFF',
    text: {
      primary: '#1A051D',
      secondary: '#3F3356',
      tertiary: '#6E6A7C',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #2D5BFF 0%, #6979F8 100%)',
      success: 'linear-gradient(135deg, #00C48C 0%, #00E4A1 100%)',
      danger: 'linear-gradient(135deg, #FF647C 0%, #FF8A9B 100%)',
    }
  },
  fonts: {
    body: '"TT Commons", system-ui, -apple-system, sans-serif',
    heading: '"TT Commons", system-ui, -apple-system, sans-serif',
    monospace: 'Menlo, monospace',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '2.5rem',
    '4xl': '3rem',
    '5xl': '4rem',
  },
  space: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  radii: {
    none: '0',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 2px 8px rgba(45, 91, 255, 0.05)',
    md: '0 4px 16px rgba(45, 91, 255, 0.1)',
    lg: '0 8px 32px rgba(45, 91, 255, 0.15)',
  },
  transitions: {
    fast: '0.2s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
};

export default theme; 