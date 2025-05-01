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
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );

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
            <BrowserRouter>
              <RegisterForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );

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
    });
  });
}); 