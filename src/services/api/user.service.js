import axios from 'axios';
import { ServiceOptimizer } from '../utils/serviceUtils';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
// 캐시 설정
const cacheConfig = {
    users: {
        ttl: 5 * 60 * 1000, // 5분
        staleWhileRevalidate: true
    },
    user: {
        ttl: 2 * 60 * 1000, // 2분
        staleWhileRevalidate: true
    },
    profile: {
        ttl: 10 * 60 * 1000, // 10분
        staleWhileRevalidate: true
    }
};
// 서비스 최적화 인스턴스 생성
const optimizer = new ServiceOptimizer('UserService', cacheConfig);
export const UserService = {
    // 메트릭스 관련 메서드
    getMetrics: () => optimizer.getMetrics(),
    resetMetrics: () => optimizer.resetMetrics(),
    // User CRUD operations
    getUsers: async (forceRefresh = false) => {
        return optimizer.withOptimization('users-all', async () => {
            const response = await axios.get(`${API_URL}/users`);
            return response.data;
        }, { forceRefresh });
    },
    getUserById: async (userId, forceRefresh = false) => {
        return optimizer.withOptimization(`user-${userId}`, async () => {
            const response = await axios.get(`${API_URL}/users/${userId}`);
            return response.data;
        }, { forceRefresh });
    },
    createUser: async (user) => {
        return optimizer.withOptimization('user-create', async () => {
            const response = await axios.post(`${API_URL}/users`, user);
            return response.data;
        }, { invalidatePatterns: ['users-'] });
    },
    updateUser: async (userId, userData) => {
        return optimizer.withOptimization(`user-${userId}-update`, async () => {
            const response = await axios.put(`${API_URL}/users/${userId}`, userData);
            return response.data;
        }, {
            invalidatePatterns: [
                `user-${userId}`,
                'users-'
            ]
        });
    },
    deleteUser: async (userId) => {
        await optimizer.withOptimization(`user-${userId}-delete`, async () => {
            await axios.delete(`${API_URL}/users/${userId}`);
        }, {
            invalidatePatterns: [
                `user-${userId}`,
                'users-'
            ]
        });
    },
    // Profile operations
    getUserProfile: async (userId, forceRefresh = false) => {
        return optimizer.withOptimization(`profile-${userId}`, async () => {
            const response = await axios.get(`${API_URL}/users/${userId}/profile`);
            return response.data;
        }, { forceRefresh });
    },
    updateUserProfile: async (userId, profile) => {
        return optimizer.withOptimization(`profile-${userId}-update`, async () => {
            const response = await axios.put(`${API_URL}/users/${userId}/profile`, profile);
            return response.data;
        }, {
            invalidatePatterns: [
                `profile-${userId}`,
                `user-${userId}`
            ]
        });
    },
    // Authentication operations
    login: async (credentials) => {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        optimizer.invalidateCache('users-');
        return response.data;
    },
    logout: async () => {
        await axios.post(`${API_URL}/auth/logout`);
        optimizer.invalidateCache('users-');
    },
    // Password operations
    changePassword: async (userId, passwords) => {
        await axios.post(`${API_URL}/users/${userId}/change-password`, passwords);
        optimizer.invalidateCache(`user-${userId}`);
    },
    resetPassword: async (email) => {
        await axios.post(`${API_URL}/auth/reset-password`, { email });
    }
};
