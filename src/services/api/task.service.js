import axios from 'axios';
import { TaskStatus } from '../../types/task';
import { ServiceOptimizer } from '../utils/serviceUtils';
import { PrefetchManager } from '../utils/prefetchUtils';
import { OfflineStorage } from '../utils/offlineStorage';
import { BatchProcessor } from '../utils/batchUtils';
import { AdvancedCacheManager } from '../utils/advancedCacheUtils';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
// 캐시 설정
const cacheConfig = {
    tasks: {
        ttl: 5 * 60 * 1000, // 5분
        staleWhileRevalidate: true
    },
    task: {
        ttl: 2 * 60 * 1000, // 2분
        staleWhileRevalidate: true
    }
};
// 오프라인 스토리지 설정
const offlineConfig = {
    dbName: 'TaskOfflineDB',
    version: 1,
    stores: {
        tasks: {
            keyPath: 'taskId',
            indexes: [
                { name: 'projectId', keyPath: 'projectId' },
                { name: 'status', keyPath: 'status' }
            ]
        },
        notes: {
            keyPath: 'noteId',
            indexes: [
                { name: 'taskId', keyPath: 'taskId' }
            ]
        },
        syncQueue: {
            keyPath: 'id'
        },
        pendingOperations: {
            keyPath: 'key',
            indexes: [
                { name: 'timestamp', keyPath: 'timestamp' }
            ]
        }
    }
};
// 배치 처리 설정
const batchConfig = {
    batchSize: 50,
    interval: 1000,
    maxDelay: 5000,
    minItems: 10
};
// 서비스 인스턴스 생성
const optimizer = new ServiceOptimizer('TaskService', cacheConfig);
const prefetchManager = PrefetchManager.getInstance(optimizer);
const offlineStorage = OfflineStorage.getInstance(offlineConfig);
const batchProcessor = new BatchProcessor(batchConfig, offlineStorage);
const cacheManager = AdvancedCacheManager.getInstance(optimizer);
// 캐시 워밍 설정
cacheManager.setWarmingConfig('TaskService', {
    patterns: [
        'tasks-all',
        'tasks-in_progress',
        'tasks-completed'
    ],
    interval: 5 * 60 * 1000, // 5분
    priority: 5
});
// 메모리 최적화 설정
cacheManager.setMemoryConfig({
    maxMemoryUsage: 50, // 50MB
    checkInterval: 30 * 1000, // 30초
    estimatedItemSize: 5 // 5KB
});
// 캐시 무효화 패턴 추가
cacheManager.addInvalidationPattern({
    pattern: 'task-.*',
    condition: (data) => data.status === TaskStatus.COMPLETED,
    onInvalidate: (key) => {
        console.log(`Task ${key} completed, invalidating cache`);
    }
});
// 오프라인 스토리지 초기화
offlineStorage.initialize().catch(console.error);
const metrics = {
    requestCount: 0,
    cacheHits: 0,
    averageResponseTime: 0,
    errorCount: 0
};
// 성능 모니터링 유틸리티
const performanceUtils = {
    startTime: () => performance.now(),
    endTime: (start) => {
        const end = performance.now();
        const duration = end - start;
        metrics.averageResponseTime =
            (metrics.averageResponseTime * metrics.requestCount + duration)
                / (metrics.requestCount + 1);
        return duration;
    },
    recordError: () => {
        metrics.errorCount++;
    },
    getMetrics: () => ({ ...metrics }),
    resetMetrics: () => {
        metrics.requestCount = 0;
        metrics.cacheHits = 0;
        metrics.averageResponseTime = 0;
        metrics.errorCount = 0;
    }
};
// 배치 API 엔드포인트 구현
const batchApi = {
    createTasks: async (tasks) => {
        const response = await axios.post(`${API_URL}/tasks/batch`, tasks);
        return response.data;
    },
    updateTasks: async (updates) => {
        const response = await axios.put(`${API_URL}/tasks/batch`, updates);
        return response.data;
    },
    deleteTasks: async (ids) => {
        await axios.delete(`${API_URL}/tasks/batch`, { data: { ids } });
    }
};
// BatchProcessor 구현 확장
Object.assign(BatchProcessor.prototype, {
    async executeBatchCreate(tasks) {
        const createdTasks = await batchApi.createTasks(tasks);
        await Promise.all(createdTasks.map(task => offlineStorage.save('tasks', task)));
        optimizer.invalidateCache('tasks-');
    },
    async executeBatchUpdate(updates) {
        const updatedTasks = await batchApi.updateTasks(updates);
        await Promise.all(updatedTasks.map(task => offlineStorage.save('tasks', task)));
        updates.forEach(({ id }) => {
            optimizer.invalidateCache(`task-${id}`);
        });
        optimizer.invalidateCache('tasks-');
    },
    async executeBatchDelete(ids) {
        await batchApi.deleteTasks(ids);
        await Promise.all(ids.map(id => offlineStorage.delete('tasks', id)));
        ids.forEach(id => {
            optimizer.invalidateCache(`task-${id}`);
        });
        optimizer.invalidateCache('tasks-');
    }
});
export const TaskService = {
    // 캐시 관리
    getCacheStats: () => cacheManager.getCacheStats(),
    // 성능 모니터링 메서드
    getMetrics: () => performanceUtils.getMetrics(),
    resetMetrics: () => performanceUtils.resetMetrics(),
    // Task CRUD operations with batch support
    getTasks: async (projectId, forceRefresh = false) => {
        try {
            const response = await optimizer.withOptimization(`tasks-${projectId || 'all'}`, async () => {
                const response = await axios.get(`${API_URL}/tasks`, { params: { projectId } });
                await Promise.all(response.data.map(task => offlineStorage.save('tasks', task)));
                return response.data;
            }, { forceRefresh });
            response.forEach(task => {
                if (task.status === TaskStatus.IN_PROGRESS) {
                    prefetchManager.addToPrefetchQueue(`task-${task.id}`, () => TaskService.getTaskById(task.id), { priority: 'high' });
                }
            });
            return response;
        }
        catch (error) {
            if (!navigator.onLine) {
                return offlineStorage.getAll('tasks');
            }
            throw error;
        }
    },
    createTasks: async (tasks) => {
        tasks.forEach(task => {
            batchProcessor.addOperation(`create-${Date.now()}-${Math.random()}`, {
                type: 'create',
                data: task,
                timestamp: Date.now()
            });
        });
    },
    updateTasks: async (updates) => {
        updates.forEach(({ id, data }) => {
            batchProcessor.addOperation(`update-${id}`, {
                type: 'update',
                id,
                data,
                timestamp: Date.now()
            });
        });
    },
    deleteTasks: async (taskIds) => {
        taskIds.forEach(taskId => {
            batchProcessor.addOperation(`delete-${taskId}`, {
                type: 'delete',
                id: taskId,
                timestamp: Date.now()
            });
        });
    },
    // 기존 단일 작업 메서드들은 배치 작업으로 변환
    createTask: async (task) => {
        await TaskService.createTasks([task]);
    },
    updateTask: async (taskId, taskData) => {
        await TaskService.updateTasks([{ id: taskId, data: taskData }]);
    },
    deleteTask: async (taskId) => {
        await TaskService.deleteTasks([taskId]);
    },
    // 상태 업데이트 배치 처리
    updateTaskStatuses: async (updates) => {
        await TaskService.updateTasks(updates.map(({ taskId, status, note }) => ({
            id: taskId,
            data: { status, note }
        })));
    },
    // 네트워크 상태 모니터링 및 동기화
    startNetworkMonitoring() {
        batchProcessor.startNetworkMonitoring();
        prefetchManager.startNetworkMonitoring();
    },
    async getTaskById(taskId) {
        const response = await axios.get(`${API_URL}/tasks/${taskId}`);
        return response.data;
    },
    async addTaskNote(taskId, note) {
        const response = await axios.post(`${API_URL}/tasks/${taskId}/notes`, { content: note });
        return response.data;
    },
    async getTaskNotes(taskId) {
        const response = await axios.get(`${API_URL}/tasks/${taskId}/notes`);
        return response.data;
    },
    static async updateTaskStatuses(updates) {
        try {
            const response = await axios.patch(`${API_URL}/tasks/status`, { updates });
            return response.data;
        }
        catch (error) {
            throw handleApiError(error);
        }
    }
};
