import axios from 'axios';
import { Project, ProjectStats } from '../../types/models';
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
const optimizer = new ServiceOptimizer<Project | Project[] | ProjectStats>('ProjectService', cacheConfig);

export const ProjectService = {
  // 메트릭스 관련 메서드
  getMetrics: () => optimizer.getMetrics(),
  resetMetrics: () => optimizer.resetMetrics(),

  // Project CRUD operations
  getProjects: async (forceRefresh = false): Promise<Project[]> => {
    return optimizer.withOptimization<Project[]>(
      'projects-all',
      async () => {
        const response = await axios.get(`${API_URL}/projects`);
        return response.data;
      },
      { forceRefresh }
    );
  },

  getProjectById: async (projectId: string, forceRefresh = false): Promise<Project> => {
    return optimizer.withOptimization<Project>(
      `project-${projectId}`,
      async () => {
        const response = await axios.get(`${API_URL}/projects/${projectId}`);
        return response.data;
      },
      { forceRefresh }
    );
  },

  createProject: async (project: Omit<Project, 'projectId'>): Promise<Project> => {
    return optimizer.withOptimization<Project>(
      'project-create',
      async () => {
        const response = await axios.post(`${API_URL}/projects`, project);
        return response.data;
      },
      { invalidatePatterns: ['projects-'] }
    );
  },

  updateProject: async (projectId: string, projectData: Partial<Project>): Promise<Project> => {
    return optimizer.withOptimization<Project>(
      `project-${projectId}-update`,
      async () => {
        const response = await axios.put(`${API_URL}/projects/${projectId}`, projectData);
        return response.data;
      },
      {
        invalidatePatterns: [
          `project-${projectId}`,
          'projects-',
          `stats-${projectId}`
        ]
      }
    );
  },

  deleteProject: async (projectId: string): Promise<void> => {
    await optimizer.withOptimization<void>(
      `project-${projectId}-delete`,
      async () => {
        await axios.delete(`${API_URL}/projects/${projectId}`);
      },
      {
        invalidatePatterns: [
          `project-${projectId}`,
          'projects-',
          `stats-${projectId}`
        ]
      }
    );
  },

  // Project statistics
  getProjectStats: async (projectId: string, forceRefresh = false): Promise<ProjectStats> => {
    return optimizer.withOptimization<ProjectStats>(
      `stats-${projectId}`,
      async () => {
        const response = await axios.get(`${API_URL}/projects/${projectId}/stats`);
        return response.data;
      },
      { forceRefresh }
    );
  },

  // Project members
  addMember: async (projectId: string, userId: string, role: string): Promise<void> => {
    await optimizer.withOptimization<void>(
      `project-${projectId}-member-add`,
      async () => {
        await axios.post(`${API_URL}/projects/${projectId}/members`, { userId, role });
      },
      {
        invalidatePatterns: [
          `project-${projectId}`,
          'projects-',
          `stats-${projectId}`
        ]
      }
    );
  },

  removeMember: async (projectId: string, userId: string): Promise<void> => {
    await optimizer.withOptimization<void>(
      `project-${projectId}-member-remove`,
      async () => {
        await axios.delete(`${API_URL}/projects/${projectId}/members/${userId}`);
      },
      {
        invalidatePatterns: [
          `project-${projectId}`,
          'projects-',
          `stats-${projectId}`
        ]
      }
    );
  },

  // Project settings
  updateSettings: async (projectId: string, settings: any): Promise<void> => {
    await optimizer.withOptimization<void>(
      `project-${projectId}-settings`,
      async () => {
        await axios.put(`${API_URL}/projects/${projectId}/settings`, settings);
      },
      {
        invalidatePatterns: [
          `project-${projectId}`,
          'projects-'
        ]
      }
    );
  },

  // Project exports
  exportProject: async (projectId: string, format: 'pdf' | 'excel'): Promise<Blob> => {
    const response = await axios.get(`${API_URL}/projects/${projectId}/export/${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}; 