import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { GlobalStyle } from './styles/GlobalStyle';
import AppRoutes from './routes';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <GlobalStyle />
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
