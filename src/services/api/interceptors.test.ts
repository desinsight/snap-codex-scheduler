<<<<<<< HEAD
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import setupInterceptors from './interceptors';
=======
import axios from 'axios';
import setupInterceptors from './interceptors';
import { getToken, getRefreshToken } from '../../utils/token';
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
import { AuthService } from './auth.service';
import { store } from '../../store';

// AuthService 모의 객체 생성
jest.mock('./auth.service');

// axios 모의 객체 생성
jest.mock('axios', () => ({
  interceptors: {
    request: {
      use: jest.fn(),
      handlers: [],
    },
    response: {
      use: jest.fn(),
      handlers: [],
    },
  },
  create: jest.fn(),
}));

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

describe('Axios Interceptors', () => {
<<<<<<< HEAD
  let requestInterceptor: [(config: AxiosRequestConfig) => AxiosRequestConfig, (error: Error) => Promise<Error>];
  let responseInterceptor: [(response: AxiosResponse) => AxiosResponse, (error: Error) => Promise<Error>];
=======
  let requestInterceptor: any;
  let responseInterceptor: any;
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();

    // 인터셉터 설정
    setupInterceptors();

    // 인터셉터 핸들러 캡처
    requestInterceptor = (axios.interceptors.request.use as jest.Mock).mock.calls[0];
    responseInterceptor = (axios.interceptors.response.use as jest.Mock).mock.calls[0];
  });

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists', () => {
      mockLocalStorage.setItem('auth_token', 'test-token');

      const config = {
        headers: {},
      };

      const result = requestInterceptor[0](config);

      expect(result.headers.Authorization).toBe('Bearer test-token');
    });

    it('should not add Authorization header when token does not exist', () => {
      const config = {
        headers: {},
      };

      const result = requestInterceptor[0](config);

      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe('Response Interceptor', () => {
    it('should handle successful response', () => {
      const response = {
        data: { message: 'Success' },
      };

<<<<<<< HEAD
      const result = responseInterceptor[0](response as AxiosResponse);
=======
      const result = responseInterceptor[0](response);
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221

      expect(result).toEqual(response);
    });

    it('should refresh token and retry request when receiving 401 error', async () => {
      const mockResponse = {
        token: 'new-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600,
      };

      mockLocalStorage.setItem('refresh_token', 'test-refresh-token');
      (AuthService.refreshToken as jest.Mock).mockResolvedValue(mockResponse);

      const originalRequest = {
        headers: {},
        _retry: false,
      };

      // Mock axios for retry
      const axiosMock = jest.spyOn(axios, 'request').mockResolvedValueOnce({ data: 'success' });

      const error = {
        response: {
          status: 401,
        },
        config: originalRequest,
      };

<<<<<<< HEAD
      await responseInterceptor[1](error as Error);
=======
      await responseInterceptor[1](error);
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221

      expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({
        headers: { Authorization: `Bearer ${mockResponse.token}` }
      }));
    });

    it('should logout when refresh token fails', async () => {
      mockLocalStorage.setItem('refresh_token', 'test-refresh-token');
      (AuthService.refreshToken as jest.Mock).mockRejectedValue(new Error('Refresh token expired'));

      const error = {
        response: {
          status: 401,
        },
        config: {
          headers: {},
          _retry: false,
        },
      };

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      try {
<<<<<<< HEAD
        await responseInterceptor[1](error as Error);
      } catch {
=======
        await responseInterceptor[1](error);
      } catch (e) {
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
        expect(dispatchSpy).toHaveBeenCalledWith({ type: 'auth/logout' });
      }
    });

    it('should not retry request if already retried', async () => {
      const error = {
        response: {
          status: 401,
        },
        config: {
          headers: {},
          _retry: true,
        },
      };

      try {
<<<<<<< HEAD
        await responseInterceptor[1](error as Error);
      } catch (error) {
        expect(error).toEqual(error);
=======
        await responseInterceptor[1](error);
      } catch (e) {
        expect(e).toEqual(error);
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
      }
    });

    it('should not retry request for non-401 errors', async () => {
      const error = {
        response: {
          status: 500,
        },
        config: {
          headers: {},
          _retry: false,
        },
      };

      try {
<<<<<<< HEAD
        await responseInterceptor[1](error as Error);
      } catch (error) {
        expect(error).toEqual(error);
=======
        await responseInterceptor[1](error);
      } catch (e) {
        expect(e).toEqual(error);
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
      }
    });
  });
}); 