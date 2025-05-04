import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { CssBaseline } from '@mui/material';
import { GlobalStyle } from './styles/GlobalStyle';
import theme from './styles/theme';
import App from './App';
import './index.css';
import './i18n';

// Theme 디버깅
if (process.env.NODE_ENV === 'development') {
  console.log('Theme object:', theme);
  console.log('Theme palette:', theme?.palette);
  console.log('Theme text:', theme?.palette?.text);
}

// Theme이 유효한지 확인
if (!theme || !theme.palette || !theme.palette.text) {
  console.error('Invalid theme configuration. Make sure theme object is properly initialized.', theme);
  // throw new Error('Invalid theme configuration. Make sure theme object is properly initialized.');
}

async function initializeMockServiceWorker() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
  return Promise.resolve();
}

const Root: React.FC = () => {
  return (
    <React.StrictMode>
      <HashRouter>
        <MuiThemeProvider theme={theme}>
          <StyledThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyle />
            <App />
          </StyledThemeProvider>
        </MuiThemeProvider>
      </HashRouter>
    </React.StrictMode>
  );
};

initializeMockServiceWorker().then(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Failed to find the root element');
  }
  
  ReactDOM.createRoot(rootElement).render(<Root />);
});
