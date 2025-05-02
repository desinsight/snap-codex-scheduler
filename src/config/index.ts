export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    timeout: 10000,
    retryAttempts: 3,
  },
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
  },
  notification: {
    defaultIcon: '/notification-icon.png',
  },
}; 