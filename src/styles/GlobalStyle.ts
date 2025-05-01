import { createGlobalStyle } from 'styled-components';
import { lightTheme, darkTheme } from './theme';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.dark};
    background-color: ${({ theme }) => theme.colors.light};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      text-decoration: underline;
    }
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    background-color: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    padding: ${({ theme }) => theme.spacing.sm};
    transition: border-color 0.3s ease, background-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }

    &:disabled {
      background-color: ${({ theme }) => theme.colors.disabled};
      cursor: not-allowed;
    }
  }

  /* Accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Focus styles */
  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Responsive images */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Responsive tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: ${({ theme }) => theme.spacing.md} 0;

    th, td {
      padding: ${({ theme }) => theme.spacing.sm};
      border: 1px solid ${({ theme }) => theme.colors.border};
    }

    th {
      background-color: ${({ theme }) => theme.colors.surface};
      font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    }
  }

  /* Responsive containers */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};

    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      padding: 0 ${({ theme }) => theme.spacing.lg};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
      padding: 0 ${({ theme }) => theme.spacing.xl};
    }
  }

  /* Dark mode specific styles */
  @media (prefers-color-scheme: dark) {
    body {
      background-color: ${({ theme }) => theme.colors.background};
      color: ${({ theme }) => theme.colors.text};
    }
  }

  ul, ol {
    list-style: none;
  }
`;

export default GlobalStyle; 