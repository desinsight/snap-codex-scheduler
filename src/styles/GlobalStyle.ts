import { createGlobalStyle, css } from 'styled-components';
import type { Theme as MuiTheme } from '@mui/material/styles';

// 기본 fallback 값 정의
const defaultTheme = {
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  palette: {
    background: {
      default: '#ffffff',
      paper: '#f9fafb',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
    grey: {
      100: '#f3f4f6',
      400: '#9ca3af',
    },
  },
  shape: {
    borderRadius: 8,
  },
};

// theme 안전 접근 헬퍼 함수
const getThemeValue = <T extends unknown>(
  theme: MuiTheme | undefined,
  path: string[],
  fallback: T
): T => {
  try {
    return path.reduce((acc: any, key) => acc?.[key], theme) ?? fallback;
  } catch {
    return fallback;
  }
};

export const GlobalStyle = createGlobalStyle<{ theme?: MuiTheme }>`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => 
      getThemeValue(theme, ['typography', 'fontFamily'], defaultTheme.typography.fontFamily)};
    background-color: ${({ theme }) => 
      getThemeValue(theme, ['palette', 'background', 'default'], defaultTheme.palette.background.default)};
    color: ${({ theme }) => 
      getThemeValue(theme, ['palette', 'text', 'primary'], defaultTheme.palette.text.primary)};
    line-height: 1.5;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    color: inherit;
  }

  input, textarea {
    font: inherit;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ::selection {
    background-color: ${({ theme }) => theme?.palette?.primary?.main || '#1976d2'};
    color: ${({ theme }) => theme?.palette?.primary?.contrastText || '#ffffff'};
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme?.palette?.grey?.[100] || '#f3f4f6'};
    border-radius: ${({ theme }) => theme?.shape?.borderRadius || 8}px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme?.palette?.grey?.[400] || '#9ca3af'};
    border-radius: ${({ theme }) => theme?.shape?.borderRadius || 8}px;
  }

  .button {
    border-radius: ${({ theme }) => theme?.shape?.borderRadius || 8}px;
  }

  .card {
    border-radius: ${({ theme }) => theme?.shape?.borderRadius || 8}px;
  }

  .fade-enter {
    opacity: 0;
    transition: opacity ${({ theme }) => theme?.transitions?.duration?.standard || 300}ms;
  }

  .fade-enter-active {
    opacity: 1;
    transition: opacity ${({ theme }) => theme?.transitions?.duration?.standard || 300}ms;
  }

  .fade-exit {
    opacity: 1;
    transition: transform ${({ theme }) => theme?.transitions?.duration?.standard || 300}ms;
  }

  .fade-exit-active {
    opacity: 0;
    transition: transform ${({ theme }) => theme?.transitions?.duration?.standard || 300}ms;
  }

  .slide-enter {
    transform: translateX(100%);
  }

  .slide-enter-active {
    transform: translateX(0);
    transition: transform ${({ theme }) => theme?.transitions?.duration?.standard || 300}ms ${({ theme }) => theme?.transitions?.easing?.easeOut || 'cubic-bezier(0.4, 0, 0.2, 1)'};
  }

  .slide-exit {
    transform: translateX(0);
  }

  .slide-exit-active {
    transform: translateX(-100%);
    transition: transform ${({ theme }) => theme?.transitions?.duration?.standard || 300}ms ${({ theme }) => theme?.transitions?.easing?.easeOut || 'cubic-bezier(0.4, 0, 0.2, 1)'};
  }
`;
