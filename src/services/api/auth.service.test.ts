import axios from 'axios';
import { AuthService as authService } from './auth.service';
import { mockUser, mockAuthResponse, mockErrorResponse, mockAxios } from '../../utils/testUtils';

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
    it('should register successfully with valid data', async () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };
      mockedAxios.post.mockResolvedValueOnce({ data: mockAuthResponse });

      const result = await authService.register(userData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/register', userData);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle registration failure with existing email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };
      mockedAxios.post.mockRejectedValueOnce(mockErrorResponse);

      await expect(authService.register(userData)).rejects.toEqual(mockErrorResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/register', userData);
    });

    it('should handle network errors during registration', async () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };
      const networkError = new Error('Network Error');
      mockedAxios.post.mockRejectedValueOnce(networkError);

      await expect(authService.register(userData)).rejects.toThrow('Network Error');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

      const result = await authService.logout();

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/logout');
      expect(result).toEqual({ success: true });
    });

    it('should handle logout failure', async () => {
      mockedAxios.post.mockRejectedValueOnce(mockErrorResponse);

      await expect(authService.logout()).rejects.toEqual(mockErrorResponse);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshToken = 'refresh-token';
      mockedAxios.post.mockResolvedValueOnce({ data: { accessToken: 'new-access-token' } });

      const result = await authService.refreshToken(refreshToken);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/refresh', { refreshToken });
      expect(result).toEqual({ accessToken: 'new-access-token' });
    });

    it('should handle refresh token failure', async () => {
      const refreshToken = 'invalid-token';
      mockedAxios.post.mockRejectedValueOnce(mockErrorResponse);

      await expect(authService.refreshToken(refreshToken)).rejects.toEqual(mockErrorResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockUser });

      const result = await authService.getCurrentUser();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/auth/me');
      expect(result).toEqual(mockUser);
    });

    it('should handle get current user failure', async () => {
      mockedAxios.get.mockRejectedValueOnce(mockErrorResponse);

      await expect(authService.getCurrentUser()).rejects.toEqual(mockErrorResponse);
    });
  });
});
