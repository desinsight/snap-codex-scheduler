import axios from 'axios';
import { getToken, getRefreshToken, isTokenValid } from '../../utils/token';
import { AuthService } from './auth.service';
import { store } from '../../store';

const setupInterceptors = () => {
  // 요청 인터셉터
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 토큰 만료 에러 처리
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // 리프레시 토큰으로 새로운 액세스 토큰 발급
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await AuthService.refreshToken();
          const { token, expiresIn } = response;

          // 새로운 토큰으로 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // 리프레시 토큰도 만료된 경우 로그아웃
          store.dispatch({ type: 'auth/logout' });
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupInterceptors; 