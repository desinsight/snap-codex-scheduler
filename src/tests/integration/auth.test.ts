import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18next from '../../utils/i18n';
import loadingReducer from '../../store/slices/loadingSlice';
import authReducer from '../../store/slices/authSlice';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import { handleApiError } from '../../utils/errorHandling';

const createTestStore = () => {
  return configureStore({
    reducer: {
      loading: loadingReducer,
      auth: authReducer,
    },
  });
};

describe('Authentication Integration', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Login Flow', () => {
    it('should handle successful login', async () => {
      render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );

      fireEvent.change(screen.getByLabelText('이메일'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('비밀번호'), {
        target: { value: 'StrongPassword123!' },
      });
      fireEvent.click(screen.getByText('로그인'));

      await waitFor(() => {
        expect(store.getState().loading.isLoading).toBe(true);
      });

      await waitFor(() => {
        expect(store.getState().auth.isAuthenticated).toBe(true);
        expect(store.getState().loading.isLoading).toBe(false);
      });
    });

    it('should handle failed login with invalid credentials', async () => {
      render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );

      fireEvent.change(screen.getByLabelText('이메일'), {
        target: { value: 'wrong@example.com' },
      });
      fireEvent.change(screen.getByLabelText('비밀번호'), {
        target: { value: 'WrongPassword123!' },
      });
      fireEvent.click(screen.getByText('로그인'));

      await waitFor(() => {
        expect(screen.getByText('이메일 또는 비밀번호가 올바르지 않습니다')).toBeInTheDocument();
      });
    });

    it('should handle account lockout after multiple failed attempts', async () => {
      render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );

      // Simulate multiple failed login attempts
      for (let i = 0; i < 5; i++) {
        fireEvent.change(screen.getByLabelText('이메일'), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText('비밀번호'), {
          target: { value: 'WrongPassword123!' },
        });
        fireEvent.click(screen.getByText('로그인'));
      }

      await waitFor(() => {
        expect(screen.getByText('계정이 잠겼습니다. 15분 후에 다시 시도해주세요.')).toBeInTheDocument();
      });
    });
  });

  describe('Registration Flow', () => {
    it('should handle successful registration', async () => {
      render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            <BrowserRouter>
              <RegisterForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );

      fireEvent.change(screen.getByLabelText('이름'), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText('이메일'), {
        target: { value: 'newuser@example.com' },
      });
      fireEvent.change(screen.getByLabelText('비밀번호'), {
        target: { value: 'StrongPassword123!' },
      });
      fireEvent.change(screen.getByLabelText('비밀번호 확인'), {
        target: { value: 'StrongPassword123!' },
      });
      fireEvent.click(screen.getByText('회원가입'));

      await waitFor(() => {
        expect(store.getState().loading.isLoading).toBe(true);
      });

      await waitFor(() => {
        expect(store.getState().auth.isAuthenticated).toBe(true);
        expect(store.getState().loading.isLoading).toBe(false);
      });
    });

    it('should handle registration with existing email', async () => {
      render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            <BrowserRouter>
              <RegisterForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );

      fireEvent.change(screen.getByLabelText('이름'), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText('이메일'), {
        target: { value: 'existing@example.com' },
      });
      fireEvent.change(screen.getByLabelText('비밀번호'), {
        target: { value: 'StrongPassword123!' },
      });
      fireEvent.change(screen.getByLabelText('비밀번호 확인'), {
        target: { value: 'StrongPassword123!' },
      });
      fireEvent.click(screen.getByText('회원가입'));

      await waitFor(() => {
        expect(screen.getByText('이미 사용 중인 이메일입니다')).toBeInTheDocument();
      });
    });
  });

  describe('Language Switching', () => {
    it('should switch between Korean and English', async () => {
      render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );

      // Check Korean text
      expect(screen.getByText('로그인')).toBeInTheDocument();
      expect(screen.getByText('이메일')).toBeInTheDocument();
      expect(screen.getByText('비밀번호')).toBeInTheDocument();

      // Switch to English
      i18next.changeLanguage('en');

      // Check English text
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle network errors', async () => {
      const error = new Error('Network Error');
      const result = handleApiError(error);
      
      expect(result).toEqual({
        message: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
        code: 'NETWORK_ERROR',
      });
    });

    it('should handle API errors with different status codes', async () => {
      const errors = [
        { response: { status: 401 } },
        { response: { status: 403 } },
        { response: { status: 404 } },
        { response: { status: 500 } },
      ];

      const expectedMessages = [
        '세션이 만료되었습니다. 다시 로그인해주세요.',
        '접근 권한이 없습니다.',
        '요청하신 리소스를 찾을 수 없습니다.',
        '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      ];

      errors.forEach((error, index) => {
        const result = handleApiError(error);
        expect(result.message).toBe(expectedMessages[index]);
      });
    });
  });
}); 