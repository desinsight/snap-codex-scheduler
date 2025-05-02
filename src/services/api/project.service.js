import axios from 'axios';
import { ServiceOptimizer } from '../utils/serviceUtils';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
// 캐시 설정
const cacheConfig = {
    projects: {
        ttl: 5 * 60 * 1000, // 5분
        staleWhileRevalidate: true
    },
    project: {
        ttl: 2 * 60 * 1000, // 2분
        staleWhileRevalidate: true
    },
    stats: {
        ttl: 1 * 60 * 1000, // 1분
        staleWhileRevalidate: true
    }
};
// 서비스 최적화 인스턴스 생성
const optimizer = new ServiceOptimizer('ProjectService', cacheConfig);
export const ProjectService = {
    // 메트릭스 관련 메서드
    getMetrics: () => optimizer.getMetrics(),
    resetMetrics: () => optimizer.resetMetrics(),
    // Project CRUD operations
    getProjects: async (forceRefresh = false) => {
        return optimizer.withOptimization('projects-all', async () => {
            const response = await axios.get(`${API_URL}/projects`);
            return response.data;
        }, { forceRefresh });
    },
    getProjectById: async (projectId, forceRefresh = false) => {
        return optimizer.withOptimization(`project-${projectId}`, async () => {
            const response = await axios.get(`${API_URL}/projects/${projectId}`);
            return response.data;
        }, { forceRefresh });
    },
    createProject: async (project) => {
        return optimizer.withOptimization('project-create', async () => {
            const response = await axios.post(`${API_URL}/projects`, project);
            return response.data;
        }, { invalidatePatterns: ['projects-'] });
    },
    updateProject: async (projectId, projectData) => {
        return optimizer.withOptimization(`project-${projectId}-update`, async () => {
            const response = await axios.put(`${API_URL}/projects/${projectId}`, projectData);
            return response.data;
        }, {
            invalidatePatterns: [
                `project-${projectId}`,
                'projects-',
                `stats-${projectId}`
            ]
        });
    },
    deleteProject: async (projectId) => {
        await optimizer.withOptimization(`project-${projectId}-delete`, async () => {
            await axios.delete(`${API_URL}/projects/${projectId}`);
        }, {
            invalidatePatterns: [
                `project-${projectId}`,
                'projects-',
                `stats-${projectId}`
            ]
        });
    },
    // Project statistics
    getProjectStats: async (projectId, forceRefresh = false) => {
        return optimizer.withOptimization(`stats-${projectId}`, async () => {
            const response = await axios.get(`${API_URL}/projects/${projectId}/stats`);
            return response.data;
        }, { forceRefresh });
    },
    // Project members
    addMember: async (projectId, userId, role) => {
        await optimizer.withOptimization(`project-${projectId}-member-add`, async () => {
            await axios.post(`${API_URL}/projects/${projectId}/members`, { userId, role });
        }, {
            invalidatePatterns: [
                `project-${projectId}`,
                'projects-',
                `stats-${projectId}`
            ]
        });
    },
    removeMember: async (projectId, userId) => {
        await optimizer.withOptimization(`project-${projectId}-member-remove`, async () => {
            await axios.delete(`${API_URL}/projects/${projectId}/members/${userId}`);
        }, {
            invalidatePatterns: [
                `project-${projectId}`,
                'projects-',
                `stats-${projectId}`
            ]
        });
    },
    // Project settings
    updateSettings: async (projectId, settings) => {
        await optimizer.withOptimization(`project-${projectId}-settings`, async () => {
            await axios.put(`${API_URL}/projects/${projectId}/settings`, settings);
        }, {
            invalidatePatterns: [
                `project-${projectId}`,
                'projects-'
            ]
        });
    },
    // Project exports
    exportProject: async (projectId, format) => {
        const response = await axios.get(`${API_URL}/projects/${projectId}/export/${format}`, {
            responseType: 'blob'
        });
        return response.data;
    }
};
