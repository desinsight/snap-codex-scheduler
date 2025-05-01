import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store';
import i18n from './utils/i18n';

test('renders login page', () => {
  render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  );
  const loginTitle = screen.getByTestId('login-title');
  expect(loginTitle).toBeInTheDocument();
});
