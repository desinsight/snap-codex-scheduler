import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAuth } from './useAuth';
import authReducer from '../store/slices/authSlice';
import { AuthService } from '../services/api/auth.service';
<<<<<<< HEAD
=======
import { isTokenValid, getToken, clearTokens } from '../utils/token';
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221

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

describe('useAuth', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('should handle successful login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

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

    await act(async () => {
      await result.current.login(mockCredentials);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockResponse.user);
    expect(result.current.token).toBe(mockResponse.token);
<<<<<<< HEAD
=======
    expect(result.current.error).toBeNull();
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
  });

  it('should handle successful registration', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

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

    await act(async () => {
      await result.current.register(mockCredentials);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockResponse.user);
    expect(result.current.token).toBe(mockResponse.token);
    expect(result.current.error).toBeNull();
  });

  it('should handle logout', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // 먼저 로그인 상태 설정
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    };

    store.dispatch({ type: 'auth/setUser', payload: mockUser });
    store.dispatch({ type: 'auth/setToken', payload: 'test-token' });

    await act(async () => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
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
<<<<<<< HEAD
      } catch {
=======
      } catch (error) {
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
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
<<<<<<< HEAD
    let resolveRefresh: (value: typeof mockResponse) => void;
    const refreshPromise = new Promise<typeof mockResponse>((resolve) => {
=======
    let resolveRefresh: (value: any) => void;
    const refreshPromise = new Promise((resolve) => {
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
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