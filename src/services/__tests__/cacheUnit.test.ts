import { 
  createTestOptimizer, 
  createTestCacheManager, 
  waitForCacheCleanup,
  generateLargeData,
  mockApiCall,
  createMockInvalidationHandler,
  createMockWarmingHandler
} from './cacheTestUtils';

describe('Cache System Unit Tests', () => {
  let optimizer: ReturnType<typeof createTestOptimizer>;
  let cacheManager: ReturnType<typeof createTestCacheManager>;

  beforeEach(() => {
    optimizer = createTestOptimizer();
    cacheManager = createTestCacheManager(optimizer);
  });

  describe('Cache Hit/Miss Tracking', () => {
    it('should track cache hits and misses correctly', async () => {
      // 초기 상태 확인
      const initialMetrics = optimizer.getMetrics();
      expect(initialMetrics.cacheHits).toBe(0);
      expect(initialMetrics.cacheMisses).toBe(0);

      // 캐시 미스 발생
      const result1 = await optimizer.withOptimization(
        'test-key',
        () => mockApiCall()
      );
      expect(result1).toBeDefined();

      // 캐시 히트 발생
      const result2 = await optimizer.withOptimization(
        'test-key',
        () => mockApiCall()
      );
      expect(result2).toBeDefined();

      // 메트릭스 확인
      const metrics = optimizer.getMetrics();
      expect(metrics.cacheHits).toBe(1);
      expect(metrics.cacheMisses).toBe(1);
    });

    it('should handle TTL expiration correctly', async () => {
      // 데이터 캐싱
      await optimizer.withOptimization(
        'test-key',
        () => mockApiCall()
      );

      // TTL 만료 대기
      await waitForCacheCleanup(2000);

      // 캐시 미스 발생 확인
      const result = await optimizer.withOptimization(
        'test-key',
        () => mockApiCall()
      );
      expect(result).toBeDefined();

      const metrics = optimizer.getMetrics();
      expect(metrics.cacheMisses).toBe(1);
    });
  });

  describe('Memory Management', () => {
    it('should handle memory overflow correctly', async () => {
      // 메모리 제한 설정
      cacheManager.setMemoryConfig({
        maxMemoryUsage: 1, // 1MB
        checkInterval: 1000,
        estimatedItemSize: 1
      });

      // 대용량 데이터 캐싱
      const largeData = generateLargeData(2); // 2KB 데이터
      await optimizer.withOptimization(
        'large-data',
        () => Promise.resolve(largeData)
      );

      // 메모리 정리 대기
      await waitForCacheCleanup();

      // 캐시 크기 확인
      const stats = cacheManager.getCacheStats();
      expect(stats.memoryUsage).toBeLessThanOrEqual(1);
    });

    it('should evict least used items when memory limit is reached', async () => {
      // 여러 항목 캐싱
      for (let i = 0; i < 20; i++) {
        await optimizer.withOptimization(
          `key-${i}`,
          () => mockApiCall()
        );
      }

      // 일부 항목만 접근
      for (let i = 0; i < 5; i++) {
        await optimizer.withOptimization(
          `key-${i}`,
          () => mockApiCall()
        );
      }

      // 메모리 정리 대기
      await waitForCacheCleanup();

      // 캐시 크기 확인
      const stats = cacheManager.getCacheStats();
      expect(stats.itemCount).toBeLessThanOrEqual(10); // maxSize 확인
    });
  });

  describe('Conditional Invalidation', () => {
    it('should trigger invalidation handler when condition is met', async () => {
      const mockHandler = createMockInvalidationHandler();

      // 무효화 패턴 추가
      cacheManager.addInvalidationPattern({
        pattern: 'test-.*',
        condition: (data) => data.status === 'completed',
        onInvalidate: mockHandler.handler
      });

      // 데이터 캐싱
      await optimizer.withOptimization(
        'test-1',
        () => Promise.resolve({ status: 'pending' })
      );

      // 조건 충족 데이터로 업데이트
      await optimizer.withOptimization(
        'test-1',
        () => Promise.resolve({ status: 'completed' })
      );

      // 핸들러 호출 확인
      expect(mockHandler.getCalls()).toContain('test-1');
    });

    it('should not trigger invalidation handler when condition is not met', async () => {
      const mockHandler = createMockInvalidationHandler();

      cacheManager.addInvalidationPattern({
        pattern: 'test-.*',
        condition: (data) => data.status === 'completed',
        onInvalidate: mockHandler.handler
      });

      // 조건 미충족 데이터 캐싱
      await optimizer.withOptimization(
        'test-1',
        () => Promise.resolve({ status: 'pending' })
      );

      // 핸들러 미호출 확인
      expect(mockHandler.getCalls()).not.toContain('test-1');
    });
  });

  describe('Cache Warming', () => {
    it('should warm cache according to configured patterns', async () => {
      const mockHandler = createMockWarmingHandler();

      // 워밍 설정
      cacheManager.setWarmingConfig('test-service', {
        patterns: ['test-pattern-1', 'test-pattern-2'],
        interval: 1000,
        priority: 5
      });

      // 워밍 실행 대기
      await waitForCacheCleanup(1500);

      // 워밍 상태 확인
      const stats = cacheManager.getCacheStats();
      expect(stats.warmingStatus.get('test-service')).toBe(true);
    });

    it('should retry failed warming attempts', async () => {
      let attemptCount = 0;
      const mockHandler = {
        handler: async () => {
          attemptCount++;
          if (attemptCount < 3) {
            throw new Error('Failed');
          }
          return { data: 'success' };
        }
      };

      cacheManager.setWarmingConfig('test-service', {
        patterns: ['test-pattern'],
        interval: 1000,
        priority: 5,
        retryCount: 3,
        retryDelay: 100
      });

      // 재시도 대기
      await waitForCacheCleanup(2000);

      expect(attemptCount).toBe(3);
    });
  });

  describe('Error Handling', () => {
    it('should handle API call failures gracefully', async () => {
      const errorHandler = jest.fn();
      
      try {
        await optimizer.withOptimization(
          'error-key',
          () => Promise.reject(new Error('API Error'))
        );
      } catch (error) {
        errorHandler();
      }

      expect(errorHandler).toHaveBeenCalled();
      const metrics = optimizer.getMetrics();
      expect(metrics.errorCount).toBe(1);
    });

    it('should maintain cache consistency after errors', async () => {
      // 성공적인 캐싱
      await optimizer.withOptimization(
        'test-key',
        () => Promise.resolve({ data: 'success' })
      );

      // 에러 발생
      try {
        await optimizer.withOptimization(
          'test-key',
          () => Promise.reject(new Error('API Error'))
        );
      } catch (error) {
        // 에러 처리
      }

      // 캐시 데이터 유지 확인
      const cached = optimizer.getCache('test-key');
      expect(cached).toBeDefined();
    });
  });
}); 