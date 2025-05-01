import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { store } from '../../store';
import i18n from '../../utils/i18n';

export const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  );
};

export const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  refreshToken: jest.fn(),
  getCurrentUser: jest.fn(),
};

export const clearMocks = () => {
  jest.clearAllMocks();
  localStorage.clear();
}; 