<<<<<<< HEAD
/// <reference types="@testing-library/jest-dom" />

import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18next from '../../utils/i18n';
import loadingReducer from '../../store/slices/loadingSlice';
import authReducer from '../../store/slices/authSlice';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import { handleApiError } from '../../utils/errorHandling';
import { useAuth } from '../../hooks/useAuth';
import { act } from 'react-dom/test-utils';
import { ErrorCode } from '../../utils/errorHandling';
import { mockUser, mockAuthResponse, mockErrorResponse } from '../../utils/testUtils';

interface AuthState {
  user: {
    id: string;
    email: string;
  } | null;
  token: {
    accessToken: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface RootState {
  auth: AuthState;
  loading: {
    isLoading: boolean;
  };
}

const createTestStore = () => {
  const store = configureStore({
    reducer: {
      loading: loadingReducer,
      auth: authReducer as any,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
      loading: {
        isLoading: false,
      },
    },
  });

  return {
    ...store,
    getState: () => store.getState() as RootState,
  };
};

describe('Authentication Integration', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Login Form', () => {
    it('should render login form correctly', () => {
      render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
=======
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
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );
<<<<<<< HEAD

      expect(screen.getByText('로그인')).toBeInTheDocument();
      expect(screen.getByLabelText('이메일')).toBeInTheDocument();
      expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    });

    it('should handle login success', async () => {
      render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );

      await act(async () => {
        store.dispatch({
          type: 'auth/login/fulfilled',
          payload: mockAuthResponse,
        });
      });

      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(store.getState().auth.user).toEqual(mockUser);
      expect(store.getState().auth.token).toEqual({ accessToken: mockAuthResponse.accessToken });
    });

    it('should handle login failure', async () => {
      render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );

      await act(async () => {
        store.dispatch({
          type: 'auth/login/rejected',
          payload: '이메일 또는 비밀번호가 올바르지 않습니다',
        });
      });

      expect(screen.getByText('이메일 또는 비밀번호가 올바르지 않습니다')).toBeInTheDocument();
      expect(store.getState().auth.isAuthenticated).toBe(false);
      expect(store.getState().auth.error).toBe('이메일 또는 비밀번호가 올바르지 않습니다');
    });
  });

  describe('Register Form', () => {
    it('should render register form correctly', () => {
      render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
=======
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
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
            <BrowserRouter>
              <RegisterForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );
<<<<<<< HEAD

      expect(screen.getByText('회원가입')).toBeInTheDocument();
      expect(screen.getByLabelText('이메일')).toBeInTheDocument();
      expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
      expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument();
    });

    it('should handle registration success', async () => {
      render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            <BrowserRouter>
              <RegisterForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );

      await act(async () => {
        store.dispatch({
          type: 'auth/register/fulfilled',
          payload: mockAuthResponse,
        });
      });

      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(store.getState().auth.user).toEqual(mockUser);
      expect(store.getState().auth.token).toEqual({ accessToken: mockAuthResponse.accessToken });
    });

    it('should handle registration failure', async () => {
      render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            <BrowserRouter>
              <RegisterForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );

      await act(async () => {
        store.dispatch({
          type: 'auth/register/rejected',
          payload: '이미 사용 중인 이메일입니다',
        });
      });

      expect(screen.getByText('이미 사용 중인 이메일입니다')).toBeInTheDocument();
      expect(store.getState().auth.isAuthenticated).toBe(false);
      expect(store.getState().auth.error).toBe('이미 사용 중인 이메일입니다');
    });
  });

  describe('Error Handling', () => {
    it('should handle validation error', () => {
      const result = handleApiError(new Error('Invalid input'));
      expect(result.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(result.message).toBe('Invalid input');
    });

    it('should handle network error', () => {
      const result = handleApiError(new Error('Network Error'));
      expect(result.code).toBe(ErrorCode.NETWORK_ERROR);
      expect(result.message).toBe('Network Error');
=======
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
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    });
  });
}); 