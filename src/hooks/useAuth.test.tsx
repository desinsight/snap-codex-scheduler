import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import { useAuth } from './useAuth';
import { AuthService } from '../services/api/auth.service';
import { isTokenValid, getToken, clearTokens } from '../utils/token';

// AuthService 모의 객체 생성
jest.mock('../services/api/auth.service');

// localStorage 모의 객체 생성
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// localStorage 모의 객체 설정
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    });
  });

  it('should handle login failure', async () => {
    const mockLogin = jest.spyOn(AuthService, 'login').mockRejectedValueOnce(
      new Error('Invalid credentials')
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'wrongpassword',
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('should handle successful registration', async () => {
    const mockRegister = jest.spyOn(AuthService, 'register').mockResolvedValueOnce({
      token: 'test-token',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mockRegister).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    });
  });

  it('should handle registration failure', async () => {
    const mockRegister = jest.spyOn(AuthService, 'register').mockRejectedValueOnce(
      new Error('Email already exists')
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mockRegister).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('should handle logout', async () => {
    const mockLogout = jest.spyOn(AuthService, 'logout').mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should handle auto login with valid token', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    };

    (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    mockLocalStorage.setItem('auth_token', 'test-token');
    mockLocalStorage.setItem('token_expiry', (Date.now() + 3600000).toString());

    const { result } = renderHook(() => useAuth(), { wrapper });

    // useEffect가 실행되기를 기다림
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('test-token');
  });

  it('should handle auto login with invalid token', async () => {
    (AuthService.getCurrentUser as jest.Mock).mockRejectedValue(new Error('Invalid token'));
    mockLocalStorage.setItem('auth_token', 'invalid-token');
    mockLocalStorage.setItem('token_expiry', (Date.now() - 1000).toString());

    const { result } = renderHook(() => useAuth(), { wrapper });

    // useEffect가 실행되기를 기다림
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should handle token refresh failure', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    (AuthService.refreshToken as jest.Mock).mockRejectedValue(new Error('Refresh failed'));
    
    await act(async () => {
      try {
        await result.current.refreshToken();
      } catch {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
      }
    });
  });

  it('should handle concurrent token refresh requests', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const mockResponse = {
      token: 'new-token',
      refreshToken: 'new-refresh-token',
      expiresIn: 3600,
    };

    // Create a promise that we can resolve later
    let resolveRefresh: (value: any) => void;
    const refreshPromise = new Promise((resolve) => {
      resolveRefresh = resolve;
    });

    (AuthService.refreshToken as jest.Mock).mockImplementation(() => refreshPromise);

    // Start two concurrent refresh attempts
    const refresh1 = act(async () => result.current.refreshToken());
    const refresh2 = act(async () => result.current.refreshToken());

    // Resolve the refresh promise
    resolveRefresh(mockResponse);

    // Wait for both attempts to complete
    await Promise.all([refresh1, refresh2]);

    // Verify that only one refresh request was made
    expect(AuthService.refreshToken).toHaveBeenCalledTimes(1);
    expect(result.current.token).toBe(mockResponse.token);
  });
}); 