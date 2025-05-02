import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../styles/theme';
const ThemeContext = createContext(undefined);
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    useEffect(() => {
        localStorage.setItem('theme', themeMode);
    }, [themeMode]);
    const toggleTheme = () => {
        setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    };
    const theme = themeMode === 'light' ? lightTheme : darkTheme;
    return (_jsx(ThemeContext.Provider, { value: { themeMode, toggleTheme }, children: _jsx(StyledThemeProvider, { theme: theme, children: children }) }));
};
