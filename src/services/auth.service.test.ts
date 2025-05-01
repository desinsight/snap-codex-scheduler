import axios from 'axios';
import { AuthService as authService } from './api/auth.service';
import { mockUser, mockAuthResponse, mockErrorResponse, mockAxios } from '../utils/testUtils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(mockedAxios, mockAxios);
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      mockedAxios.post.mockResolvedValueOnce({ data: mockAuthResponse });

      const result = await authService.login(credentials);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', credentials);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle login failure with invalid credentials', async () => {
      const credentials = { email: 'test@example.com', password: 'wrong' };
      mockedAxios.post.mockRejectedValueOnce(mockErrorResponse);

      await expect(authService.login(credentials)).rejects.toEqual(mockErrorResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', credentials);
    });

    it('should handle network errors during login', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const networkError = new Error('Network Error');
      mockedAxios.post.mockRejectedValueOnce(networkError);

      await expect(authService.login(credentials)).rejects.toThrow('Network Error');
    });
  });

  describe('register', () => {
    it('should successfully register with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'StrongPassword123!',
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: mockAuthResponse,
      });

      const result = await authService.register(userData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/register', userData);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle registration failure with existing email', async () => {
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'StrongPassword123!',
      };

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          ...mockErrorResponse,
          status: 409,
          data: {
            message: '이미 사용 중인 이메일입니다',
          },
        },
      });

      await expect(authService.register(userData)).rejects.toEqual({
        response: {
          ...mockErrorResponse,
          status: 409,
          data: {
            message: '이미 사용 중인 이메일입니다',
          },
        },
      });
    });

    it('should handle network errors during registration', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'StrongPassword123!',
      };

      mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

      await expect(authService.register(userData)).rejects.toThrow('Network Error');
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { message: 'Logged out successfully' },
      });

      const result = await authService.logout();

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/logout');
      expect(result).toEqual({ message: 'Logged out successfully' });
    });

    it('should handle logout failure', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: mockErrorResponse,
      });

      await expect(authService.logout()).rejects.toEqual({
        response: mockErrorResponse,
      });
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh token', async () => {
      const refreshToken = 'test-refresh-token';

      mockedAxios.post.mockResolvedValueOnce({
        data: {
          token: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      });

      const result = await authService.refreshToken(refreshToken);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/refresh', {
        refreshToken,
      });
      expect(result).toEqual({
        token: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
    });

    it('should handle refresh token failure', async () => {
      const refreshToken = 'invalid-refresh-token';

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          ...mockErrorResponse,
          status: 401,
          data: {
            message: 'Invalid refresh token',
          },
        },
      });

      await expect(authService.refreshToken(refreshToken)).rejects.toEqual({
        response: {
          ...mockErrorResponse,
          status: 401,
          data: {
            message: 'Invalid refresh token',
          },
        },
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should successfully get current user', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: mockUser,
      });

      const result = await authService.getCurrentUser();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/auth/me');
      expect(result).toEqual(mockUser);
    });

    it('should handle get current user failure', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          ...mockErrorResponse,
          status: 401,
          data: {
            message: 'Unauthorized',
          },
        },
      });

      await expect(authService.getCurrentUser()).rejects.toEqual({
        response: {
          ...mockErrorResponse,
          status: 401,
          data: {
            message: 'Unauthorized',
          },
        },
      });
    });
  });
});
