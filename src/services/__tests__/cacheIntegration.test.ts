import { 
  createTestOptimizer, 
  createTestCacheManager, 
  waitForCacheCleanup,
  generateLargeData,
  mockApiCall
} from './cacheTestUtils';

describe('Cache System Integration Tests', () => {
  let optimizer: ReturnType<typeof createTestOptimizer>;
  let cacheManager: ReturnType<typeof createTestCacheManager>;

  beforeEach(() => {
    optimizer = createTestOptimizer();
    cacheManager = createTestCacheManager(optimizer);
  });

  describe('Service Integration', () => {
    it('should maintain cache consistency across multiple services', async () => {
      // TaskService 캐시
      await optimizer.withOptimization(
        'task-1',
        () => Promise.resolve({ id: 'task-1', status: 'pending' })
      );

      // UserService 캐시
      await optimizer.withOptimization(
        'user-1',
        () => Promise.resolve({ id: 'user-1', name: 'Test User' })
      );

      // 캐시 상태 확인
      const taskCache = optimizer.getCache('task-1');
      const userCache = optimizer.getCache('user-1');

      expect(taskCache).toBeDefined();
      expect(userCache).toBeDefined();
      expect(taskCache.data.status).toBe('pending');
      expect(userCache.data.name).toBe('Test User');
    });

    it('should handle concurrent cache access correctly', async () => {
      const promises = [];
      
      // 동시에 여러 캐시 요청
      for (let i = 0; i < 10; i++) {
        promises.push(
          optimizer.withOptimization(
            `concurrent-${i}`,
            () => mockApiCall()
          )
        );
      }

      await Promise.all(promises);

      // 캐시 상태 확인
      const metrics = optimizer.getMetrics();
      expect(metrics.cacheMisses).toBe(10);
      expect(metrics.concurrentRequests).toBe(10);
    });
  });

  describe('Memory Management Integration', () => {
    it('should handle memory pressure across multiple services', async () => {
      // 메모리 제한 설정
      cacheManager.setMemoryConfig({
        maxMemoryUsage: 2, // 2MB
        checkInterval: 1000,
        estimatedItemSize: 1
      });

      // 여러 서비스에서 대용량 데이터 캐싱
      const services = ['task', 'user', 'project'];
      for (const service of services) {
        for (let i = 0; i < 5; i++) {
          await optimizer.withOptimization(
            `${service}-${i}`,
            () => Promise.resolve(generateLargeData(1)) // 1KB 데이터
          );
        }
      }

      // 메모리 정리 대기
      await waitForCacheCleanup();

      // 캐시 크기 확인
      const stats = cacheManager.getCacheStats();
      expect(stats.memoryUsage).toBeLessThanOrEqual(2);
    });

    it('should maintain service-specific cache limits', async () => {
      // 서비스별 캐시 제한 설정
      cacheManager.setServiceConfig('task', { maxSize: 5 });
      cacheManager.setServiceConfig('user', { maxSize: 3 });

      // TaskService 캐시
      for (let i = 0; i < 10; i++) {
        await optimizer.withOptimization(
          `task-${i}`,
          () => mockApiCall()
        );
      }

      // UserService 캐시
      for (let i = 0; i < 5; i++) {
        await optimizer.withOptimization(
          `user-${i}`,
          () => mockApiCall()
        );
      }

      // 캐시 크기 확인
      const stats = cacheManager.getCacheStats();
      expect(stats.serviceStats.get('task')?.itemCount).toBeLessThanOrEqual(5);
      expect(stats.serviceStats.get('user')?.itemCount).toBeLessThanOrEqual(3);
    });
  });

  describe('Cache Warming Integration', () => {
    it('should warm cache for multiple services simultaneously', async () => {
      // 여러 서비스에 대한 워밍 설정
      const services = ['task', 'user', 'project'];
      for (const service of services) {
        cacheManager.setWarmingConfig(service, {
          patterns: [`${service}-.*`],
          interval: 1000,
          priority: 5
        });
      }

      // 워밍 실행 대기
      await waitForCacheCleanup(1500);

      // 워밍 상태 확인
      const stats = cacheManager.getCacheStats();
      for (const service of services) {
        expect(stats.warmingStatus.get(service)).toBe(true);
      }
    });

    it('should handle warming failures gracefully', async () => {
      // 실패하는 워밍 설정
      cacheManager.setWarmingConfig('failing-service', {
        patterns: ['fail-.*'],
        interval: 1000,
        priority: 5,
        retryCount: 2,
        retryDelay: 100
      });

      // 워밍 실행 대기
      await waitForCacheCleanup(2000);

      // 에러 메트릭스 확인
      const metrics = optimizer.getMetrics();
      expect(metrics.warmingErrors).toBeGreaterThan(0);
    });
  });

  describe('Cache Invalidation Integration', () => {
    it('should handle complex invalidation patterns', async () => {
      // 복잡한 무효화 패턴 설정
      cacheManager.addInvalidationPattern({
        pattern: 'task-.*',
        condition: (data) => data.status === 'completed',
        onInvalidate: (key) => {
          // 연관된 사용자 캐시도 무효화
          const userId = key.split('-')[1];
          optimizer.invalidateCache(`user-${userId}`);
        }
      });

      // 데이터 캐싱
      await optimizer.withOptimization(
        'task-1',
        () => Promise.resolve({ id: 'task-1', status: 'pending' })
      );
      await optimizer.withOptimization(
        'user-1',
        () => Promise.resolve({ id: 'user-1', name: 'Test User' })
      );

      // 조건 충족 데이터로 업데이트
      await optimizer.withOptimization(
        'task-1',
        () => Promise.resolve({ id: 'task-1', status: 'completed' })
      );

      // 캐시 무효화 확인
      const taskCache = optimizer.getCache('task-1');
      const userCache = optimizer.getCache('user-1');
      expect(taskCache).toBeUndefined();
      expect(userCache).toBeUndefined();
    });

    it('should handle cascading cache invalidations', async () => {
      // 계단식 무효화 패턴 설정
      cacheManager.addInvalidationPattern({
        pattern: 'project-.*',
        condition: (data) => data.status === 'archived',
        onInvalidate: (key) => {
          // 프로젝트의 모든 태스크 무효화
          const projectId = key.split('-')[1];
          optimizer.invalidateCache(`task-${projectId}-.*`);
        }
      });

      // 데이터 캐싱
      await optimizer.withOptimization(
        'project-1',
        () => Promise.resolve({ id: 'project-1', status: 'active' })
      );
      for (let i = 0; i < 3; i++) {
        await optimizer.withOptimization(
          `task-1-${i}`,
          () => Promise.resolve({ id: `task-1-${i}`, status: 'pending' })
        );
      }

      // 프로젝트 상태 업데이트
      await optimizer.withOptimization(
        'project-1',
        () => Promise.resolve({ id: 'project-1', status: 'archived' })
      );

      // 캐시 무효화 확인
      const projectCache = optimizer.getCache('project-1');
      expect(projectCache).toBeUndefined();
      for (let i = 0; i < 3; i++) {
        const taskCache = optimizer.getCache(`task-1-${i}`);
        expect(taskCache).toBeUndefined();
      }
    });
  });
}); 