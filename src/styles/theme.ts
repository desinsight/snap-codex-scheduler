import { DefaultTheme } from 'styled-components';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Shape { borderRadius: number | number[]; }
}

const borderRadii = [4, 8, 16]; // [small, medium, large]

export const radius = (size: keyof DefaultTheme['borderRadius']) => {
  return ({ theme }: { theme: DefaultTheme }) => theme.borderRadius[size];
};

// 기본 테마 설정
export const baseColors = {
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
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
  },
};

// MUI 테마 생성
const theme = createTheme({
  palette: {
    ...baseColors,
  },
  shape: {
    borderRadius: borderRadii[0],
  },
});

export default theme;
