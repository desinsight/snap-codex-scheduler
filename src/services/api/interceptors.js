import axios from 'axios';
import { store } from '../../store';
import { logout, refreshToken } from '../../store/slices/authSlice';
import { getToken, updateToken } from '../../utils/token';
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        }
        else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
axiosInstance.interceptors.response.use(response => response, async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
        return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(token => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axiosInstance(originalRequest);
            })
                .catch(err => {
                return Promise.reject(err);
            });
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
            const response = await store.dispatch(refreshToken());
            const newToken = response.payload.token;
            updateToken(newToken);
            processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
        }
        catch (refreshError) {
            processQueue(error);
            store.dispatch(logout());
            return Promise.reject(refreshError);
        }
        finally {
            isRefreshing = false;
        }
    }
    return Promise.reject(error);
});
export default axiosInstance;
