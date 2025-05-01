import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
<<<<<<< HEAD
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store';
import i18n from './utils/i18n';
=======
import { store } from './store';
import App from './App';
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221

test('renders login page', () => {
  render(
    <Provider store={store}>
<<<<<<< HEAD
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  );
  const loginTitle = screen.getByTestId('login-title');
  expect(loginTitle).toBeInTheDocument();
=======
      <App />
    </Provider>
  );
  const loginHeading = screen.getByRole('heading', { name: /로그인/i });
  expect(loginHeading).toBeInTheDocument();
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
});
