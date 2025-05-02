import { 
  createTestOptimizer, 
  createTestCacheManager, 
  waitForCacheCleanup,
  generateLargeData,
  mockApiCall,
  TestMetricsCollector,
  TestCacheEventListener,
  TestMemoryMonitor
} from './cacheTestUtils';

describe('Cache System Performance Tests', () => {
  let optimizer: ReturnType<typeof createTestOptimizer>;
  let cacheManager: ReturnType<typeof createTestCacheManager>;
  let metricsCollector: TestMetricsCollector;
  let eventListener: TestCacheEventListener;
  let memoryMonitor: TestMemoryMonitor;

  beforeEach(() => {
    optimizer = createTestOptimizer();
    cacheManager = createTestCacheManager(optimizer);
    metricsCollector = new TestMetricsCollector();
    eventListener = new TestCacheEventListener();
    memoryMonitor = new TestMemoryMonitor();
  });

  describe('Cache Hit Rate Performance', () => {
    it('should maintain high hit rate with repeated access', async () => {
      const totalRequests = 1000;
      const uniqueKeys = 100;
      
      // 캐시 데이터 준비
      for (let i = 0; i < uniqueKeys; i++) {
        await optimizer.withOptimization(
          `key-${i}`,
          () => mockApiCall()
        );
      }

      // 반복 접근 테스트
      const startTime = performance.now();
      for (let i = 0; i < totalRequests; i++) {
        const key = `key-${i % uniqueKeys}`;
        await optimizer.withOptimization(
          key,
          () => mockApiCall()
        );
      }
      const endTime = performance.now();

      // 성능 메트릭스 확인
      const metrics = optimizer.getMetrics();
      const hitRate = metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses);
      const avgResponseTime = (endTime - startTime) / totalRequests;

      expect(hitRate).toBeGreaterThan(0.9); // 90% 이상의 히트율
      expect(avgResponseTime).toBeLessThan(10); // 평균 응답 시간 10ms 미만
    });

    it('should handle cache thrashing gracefully', async () => {
      const totalRequests = 1000;
      const cacheSize = 100;
      
      // 캐시 크기 설정
      cacheManager.setMemoryConfig({
        maxMemoryUsage: 1,
        checkInterval: 1000,
        estimatedItemSize: 1
      });

      // 캐시 스래싱 시뮬레이션
      const startTime = performance.now();
      for (let i = 0; i < totalRequests; i++) {
        const key = `key-${i % (cacheSize * 2)}`; // 캐시 크기의 2배로 키 생성
        await optimizer.withOptimization(
          key,
          () => mockApiCall()
        );
      }
      const endTime = performance.now();

      // 성능 메트릭스 확인
      const metrics = optimizer.getMetrics();
      const avgResponseTime = (endTime - startTime) / totalRequests;
      const evictionRate = metrics.evictions / totalRequests;

      expect(avgResponseTime).toBeLessThan(20); // 평균 응답 시간 20ms 미만
      expect(evictionRate).toBeLessThan(0.5); // 50% 미만의 제거율
    });
  });

  describe('Memory Usage Performance', () => {
    it('should maintain stable memory usage under load', async () => {
      const totalRequests = 1000;
      const dataSize = 10; // KB
      
      // 메모리 사용량 모니터링 시작
      memoryMonitor.reset();
      
      // 대용량 데이터 캐싱
      for (let i = 0; i < totalRequests; i++) {
        const data = generateLargeData(dataSize);
        await optimizer.withOptimization(
          `large-${i}`,
          () => Promise.resolve(data)
        );
        
        // 메모리 사용량 추적
        memoryMonitor.simulateMemoryIncrease(dataSize * 1024);
      }

      // 메모리 정리 대기
      await waitForCacheCleanup();

      // 메모리 사용량 확인
      const finalUsage = memoryMonitor.getCurrentUsage();
      const expectedMaxUsage = dataSize * 1024 * 100; // 예상 최대 사용량 (100개 항목)

      expect(finalUsage).toBeLessThan(expectedMaxUsage);
    });

    it('should handle memory pressure efficiently', async () => {
      const totalRequests = 1000;
      const dataSize = 100; // KB
      
      // 메모리 제한 설정
      cacheManager.setMemoryConfig({
        maxMemoryUsage: 1, // 1MB
        checkInterval: 1000,
        estimatedItemSize: dataSize
      });

      // 메모리 압박 시뮬레이션
      const startTime = performance.now();
      for (let i = 0; i < totalRequests; i++) {
        const data = generateLargeData(dataSize);
        await optimizer.withOptimization(
          `pressure-${i}`,
          () => Promise.resolve(data)
        );
      }
      const endTime = performance.now();

      // 성능 메트릭스 확인
      const metrics = optimizer.getMetrics();
      const avgResponseTime = (endTime - startTime) / totalRequests;
      const evictionRate = metrics.evictions / totalRequests;

      expect(avgResponseTime).toBeLessThan(50); // 평균 응답 시간 50ms 미만
      expect(evictionRate).toBeGreaterThan(0.5); // 50% 이상의 제거율
    });
  });

  describe('Concurrency Performance', () => {
    it('should handle concurrent requests efficiently', async () => {
      const concurrentRequests = 100;
      const totalRequests = 1000;
      
      // 동시 요청 처리 테스트
      const startTime = performance.now();
      const batches = Math.ceil(totalRequests / concurrentRequests);
      
      for (let batch = 0; batch < batches; batch++) {
        const requests = [];
        for (let i = 0; i < concurrentRequests; i++) {
          const key = `concurrent-${batch}-${i}`;
          requests.push(
            optimizer.withOptimization(
              key,
              () => mockApiCall()
            )
          );
        }
        await Promise.all(requests);
      }
      const endTime = performance.now();

      // 성능 메트릭스 확인
      const metrics = optimizer.getMetrics();
      const avgResponseTime = (endTime - startTime) / totalRequests;
      const maxConcurrent = metrics.concurrentRequests;

      expect(avgResponseTime).toBeLessThan(20); // 평균 응답 시간 20ms 미만
      expect(maxConcurrent).toBeLessThanOrEqual(concurrentRequests);
    });

    it('should maintain consistency under concurrent access', async () => {
      const concurrentRequests = 50;
      const key = 'shared-key';
      const initialValue = { count: 0 };
      
      // 초기 값 설정
      await optimizer.withOptimization(
        key,
        () => Promise.resolve(initialValue)
      );

      // 동시 업데이트 테스트
      const updates = Array(concurrentRequests).fill(0).map(async (_, i) => {
        await optimizer.withOptimization(
          key,
          async (current) => {
            const updated = { ...current, count: current.count + 1 };
            await mockApiCall(10); // 경쟁 상태 시뮬레이션
            return updated;
          }
        );
      });

      await Promise.all(updates);

      // 최종 값 확인
      const final = await optimizer.withOptimization(
        key,
        () => Promise.resolve(initialValue)
      );

      expect(final.count).toBe(concurrentRequests);
    });
  });

  describe('Cache Warming Performance', () => {
    it('should warm cache efficiently', async () => {
      const patterns = 100;
      const warmingConfig = {
        patterns: Array(patterns).fill(0).map((_, i) => `pattern-${i}`),
        interval: 1000,
        priority: 5
      };

      // 워밍 설정
      cacheManager.setWarmingConfig('test-service', warmingConfig);

      // 워밍 성능 측정
      const startTime = performance.now();
      await waitForCacheCleanup(2000);
      const endTime = performance.now();

      // 성능 메트릭스 확인
      const metrics = optimizer.getMetrics();
      const warmingTime = endTime - startTime;
      const avgWarmingTime = warmingTime / patterns;

      expect(avgWarmingTime).toBeLessThan(50); // 패턴당 평균 워밍 시간 50ms 미만
      expect(metrics.warmingErrors).toBe(0);
    });

    it('should handle warming failures gracefully', async () => {
      const patterns = 50;
      const warmingConfig = {
        patterns: Array(patterns).fill(0).map((_, i) => `fail-pattern-${i}`),
        interval: 1000,
        priority: 5,
        retryCount: 3,
        retryDelay: 100
      };

      // 실패하는 워밍 설정
      cacheManager.setWarmingConfig('failing-service', warmingConfig);

      // 워밍 성능 측정
      const startTime = performance.now();
      await waitForCacheCleanup(2000);
      const endTime = performance.now();

      // 성능 메트릭스 확인
      const metrics = optimizer.getMetrics();
      const warmingTime = endTime - startTime;
      const avgWarmingTime = warmingTime / patterns;

      expect(avgWarmingTime).toBeLessThan(100); // 패턴당 평균 워밍 시간 100ms 미만
      expect(metrics.warmingErrors).toBeGreaterThan(0);
    });
  });
}); 