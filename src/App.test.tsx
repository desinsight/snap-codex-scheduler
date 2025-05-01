import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

test('renders login page', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const loginHeading = screen.getByRole('heading', { name: /로그인/i });
  expect(loginHeading).toBeInTheDocument();
});
