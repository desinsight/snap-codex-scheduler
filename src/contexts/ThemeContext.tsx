import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { flatLightTheme, flatDarkTheme } from '../styles/theme';
import { merge } from 'lodash';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode, customTheme?: any }> = ({ children, customTheme }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme as ThemeMode;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const currentTheme = themeMode === 'light' ? flatLightTheme : flatDarkTheme;
  const mergedTheme = customTheme ? merge({}, currentTheme, customTheme) : currentTheme;

  // 디버깅: 실제 theme 객체 구조 확인
  console.log('ThemeProvider theme:', mergedTheme);

  // MUI용 theme 생성 (필요하다면 mergedTheme를 기반으로)
  const muiTheme = createTheme({
    ...mergedTheme,
    shape: {
      borderRadius: 8,
      ...mergedTheme.shape,
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '16px',
      ...mergedTheme.borderRadius,
    },
  });

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <StyledThemeProvider theme={muiTheme}>
          {children}
        </StyledThemeProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
