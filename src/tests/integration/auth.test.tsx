import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import store from '../../store';
import i18n from '../../i18n';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import { clearLoginAttempts } from '../../utils/loginAttempts';
import AuthService from '../../services/api/auth.service';
import { renderWithProviders } from '../../utils/testUtils.tsx';

jest.mock('../../services/api/auth.service');

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    clearLoginAttempts();
    jest.clearAllMocks();
  });

  describe('Login Form', () => {
    it('should handle successful login', async () => {
      const mockLogin = jest.spyOn(AuthService, 'login').mockResolvedValueOnce({
        token: 'test-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      });

      renderWithProviders(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      );

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

      renderWithProviders(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      );

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

    it('should handle account lockout', async () => {
      const mockLogin = jest.spyOn(AuthService, 'login').mockRejectedValue(
        new Error('Invalid credentials')
      );

      renderWithProviders(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      );

      // Attempt login multiple times
      for (let i = 0; i < 5; i++) {
        fireEvent.change(screen.getByLabelText(/email/i), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
          target: { value: 'wrongpassword' },
        });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
          expect(mockLogin).toHaveBeenCalled();
        });
      }

      // Verify account is locked
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/account is locked/i)).toBeInTheDocument();
      });
    });
  });

  describe('Register Form', () => {
    it('should handle successful registration', async () => {
      const mockRegister = jest.spyOn(AuthService, 'register').mockResolvedValueOnce({
        token: 'test-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      });

      renderWithProviders(
        <BrowserRouter>
          <RegisterForm />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'Password123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123!' },
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
        });
      });
    });

    it('should handle registration failure', async () => {
      const mockRegister = jest.spyOn(AuthService, 'register').mockRejectedValueOnce(
        new Error('Email already exists')
      );

      renderWithProviders(
        <BrowserRouter>
          <RegisterForm />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'Password123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123!' },
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
        });
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });

    it('should validate password requirements', async () => {
      render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'weak' },
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
      });
    });
  });
}); 