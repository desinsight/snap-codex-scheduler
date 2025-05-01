import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import loadingReducer from '../../store/slices/loadingSlice';
import LoginForm from './LoginForm';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../utils/i18n';
import { AuthService } from '../../services/api/auth.service';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
  },
});

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe('LoginForm', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = createTestStore();
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  const renderLoginForm = () => {
    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <LoginForm />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );
  };

  it('should render login form', () => {
    renderLoginForm();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    const mockLogin = jest.spyOn(AuthService, 'login').mockResolvedValueOnce({
      token: 'test-token',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should handle login failure', async () => {
    const mockLogin = jest.spyOn(AuthService, 'login').mockRejectedValueOnce(
      new Error('Invalid credentials')
    );

    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should validate required fields', async () => {
    renderLoginForm();

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('로그인 성공 시 대시보드로 이동한다', async () => {
    renderLoginForm();
    
    const emailInput = screen.getByTestId('login-email');
    const passwordInput = screen.getByTestId('login-password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    
    const submitButton = screen.getByTestId('login-submit');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('로그인 실패 시 에러 메시지를 표시한다', async () => {
    renderLoginForm();
    
    const emailInput = screen.getByTestId('login-email');
    const passwordInput = screen.getByTestId('login-password');
    
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'WrongPassword123!' } });
    
    const submitButton = screen.getByTestId('login-submit');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('이메일 또는 비밀번호가 올바르지 않습니다')).toBeInTheDocument();
    });
  });

  it('입력 시작 시 에러 메시지를 제거한다', async () => {
    renderLoginForm();
    
    const submitButton = screen.getByTestId('login-submit');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('이메일을 입력해주세요')).toBeInTheDocument();
    });
    
    const emailInput = screen.getByTestId('login-email');
    fireEvent.change(emailInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.queryByText('이메일을 입력해주세요')).not.toBeInTheDocument();
    });
  });
}); 