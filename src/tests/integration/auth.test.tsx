import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../utils/i18n';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import loadingReducer from '../../store/slices/loadingSlice';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import { setupTestEnvironment, cleanupTestEnvironment } from '../../utils/testUtils';

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
  },
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    setupTestEnvironment();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    cleanupTestEnvironment();
  });

  describe('Login', () => {
    const renderLoginForm = () => {
      return render(
        <Provider store={mockStore}>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );
    };

    it('잘못된 인증 정보로 로그인 시도 시 에러 메시지를 표시한다', async () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('login-email');
      const passwordInput = screen.getByTestId('login-password');
      const submitButton = screen.getByTestId('login-submit');

      fireEvent.change(emailInput, { target: { value: 'invalid@email.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('이메일 또는 비밀번호가 올바르지 않습니다')).toBeInTheDocument();
      });
    });

    it('로그인 시도 중 로딩 상태를 표시한다', async () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('login-email');
      const passwordInput = screen.getByTestId('login-password');
      const submitButton = screen.getByTestId('login-submit');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockStore.getState().loading.isLoading).toBe(true);
      });
    });

    it('로그인 성공 시 대시보드로 이동한다', async () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('login-email');
      const passwordInput = screen.getByTestId('login-password');
      const submitButton = screen.getByTestId('login-submit');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });
  });

  describe('Registration', () => {
    const renderRegisterForm = () => {
      return render(
        <Provider store={mockStore}>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <RegisterForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );
    };

    it('이미 사용 중인 이메일로 회원가입 시도 시 에러 메시지를 표시한다', async () => {
      renderRegisterForm();

      const nameInput = screen.getByTestId('register-name');
      const emailInput = screen.getByTestId('register-email');
      const passwordInput = screen.getByTestId('register-password');
      const submitButton = screen.getByTestId('register-submit');

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'existing@email.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('이미 사용 중인 이메일입니다')).toBeInTheDocument();
      });
    });

    it('회원가입 성공 시 로그인 페이지로 이동한다', async () => {
      renderRegisterForm();

      const nameInput = screen.getByTestId('register-name');
      const emailInput = screen.getByTestId('register-email');
      const passwordInput = screen.getByTestId('register-password');
      const submitButton = screen.getByTestId('register-submit');

      fireEvent.change(nameInput, { target: { value: 'New User' } });
      fireEvent.change(emailInput, { target: { value: 'new@email.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });
  });
}); 