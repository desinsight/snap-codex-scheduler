// Environment variables
const getEnvVar = (key, defaultValue = '') => {
    if (process.env.NODE_ENV === 'test') {
        return process.env[key] || defaultValue;
    }
    if (typeof window !== 'undefined') {
        try {
            // For Vite environment
            const viteEnv = window.__VITE_ENV__ || {};
            return viteEnv[key] || defaultValue;
        }
        catch {
            return defaultValue;
        }
    }
    return defaultValue;
};
// API Configuration
export const API_URL = getEnvVar('VITE_API_URL', 'http://localhost:3000/api');
export const API_BASE_URL = getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api');
// Feature Flags
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';
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
