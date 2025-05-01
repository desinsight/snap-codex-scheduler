import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login, register, refreshToken } from './authSlice';
import { AuthService } from '../../services/api/auth.service';
<<<<<<< HEAD
=======
import { saveTokens, updateToken, clearTokens } from '../../utils/token';
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221

// AuthService 모의 객체 생성
jest.mock('../../services/api/auth.service');

describe('Auth Slice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should handle successful login', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        expiresIn: 3600,
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        },
      };

      (AuthService.login as jest.Mock).mockResolvedValue(mockResponse);

      await store.dispatch(login(mockCredentials));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockResponse.user);
      expect(state.token).toBe(mockResponse.token);
      expect(state.error).toBeNull();
    });

    it('should handle login failure', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockError = new Error('Invalid credentials');
      (AuthService.login as jest.Mock).mockRejectedValue(mockError);

      await store.dispatch(login(mockCredentials));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBe('Login failed');
    });
  });

  describe('register', () => {
    it('should handle successful registration', async () => {
      const mockCredentials = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        expiresIn: 3600,
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        },
      };

      (AuthService.register as jest.Mock).mockResolvedValue(mockResponse);

      await store.dispatch(register(mockCredentials));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockResponse.user);
      expect(state.token).toBe(mockResponse.token);
      expect(state.error).toBeNull();
    });

    it('should handle registration failure', async () => {
      const mockCredentials = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockError = new Error('Email already exists');
      (AuthService.register as jest.Mock).mockRejectedValue(mockError);

      await store.dispatch(register(mockCredentials));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBe('Registration failed');
    });
  });

  describe('refreshToken', () => {
    it('should handle successful token refresh', async () => {
      const mockResponse = {
        token: 'new-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600,
      };

      (AuthService.refreshToken as jest.Mock).mockResolvedValue(mockResponse);

      await store.dispatch(refreshToken());

      const state = store.getState().auth;
      expect(state.token).toBe(mockResponse.token);
      expect(state.error).toBeNull();
    });

    it('should handle token refresh failure', async () => {
      const mockError = new Error('Refresh token expired');
      (AuthService.refreshToken as jest.Mock).mockRejectedValue(mockError);

      await store.dispatch(refreshToken());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBe('Token refresh failed');
    });
  });
}); 