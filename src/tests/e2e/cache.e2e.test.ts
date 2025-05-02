import { AdvancedCacheService } from '../../services/AdvancedCacheService';
import { RedisCacheManager } from '../../services/RedisCacheManager';
import { createMockCacheConfig } from '../../utils/testUtils';

describe('Cache E2E Tests', () => {
  let cacheService: AdvancedCacheService;
  let cacheManager: RedisCacheManager;

  beforeAll(async () => {
    cacheService = AdvancedCacheService.getInstance();
    cacheManager = RedisCacheManager.getInstance();
  });

  afterAll(async () => {
    await cacheService.close();
  });

  describe('Cache Operations', () => {
    it('should store and retrieve data correctly', async () => {
      const key = 'e2e-test-key';
      const value = { data: 'e2e-test-value' };

      await cacheService.set(key, value);
      const retrievedValue = await cacheService.get(key);

      expect(retrievedValue).toEqual(value);
    });

    it('should handle TTL correctly', async () => {
      const key = 'ttl-test-key';
      const value = { data: 'ttl-test-value' };
      const ttl = 1000; // 1초

      await cacheService.set(key, value, ttl);
      const initialValue = await cacheService.get(key);
      expect(initialValue).toEqual(value);

      await new Promise(resolve => setTimeout(resolve, ttl + 100));
      const expiredValue = await cacheService.get(key);
      expect(expiredValue).toBeNull();
    });

    it('should handle concurrent operations correctly', async () => {
      const operations = 100;
      const promises: Promise<void>[] = [];

      for (let i = 0; i < operations; i++) {
        const key = `concurrent-key-${i}`;
        const value = { data: `concurrent-value-${i}` };
        promises.push(cacheService.set(key, value));
      }

      await Promise.all(promises);

      for (let i = 0; i < operations; i++) {
        const key = `concurrent-key-${i}`;
        const value = { data: `concurrent-value-${i}` };
        const retrievedValue = await cacheService.get(key);
        expect(retrievedValue).toEqual(value);
      }
    });
  });

  describe('Cache Configuration', () => {
    it('should apply configuration changes correctly', async () => {
      const newConfig = createMockCacheConfig({
        maxSize: 2000,
        maxAge: 7200000, // 2시간
        updateAgeOnGet: true
      });

      await cacheService.configure(newConfig);
      const metrics = await cacheService.getMetrics();
      const latestMetrics = metrics[metrics.length - 1];

      expect(latestMetrics.memory.maxSize).toBe(newConfig.maxSize);
    });
  });

  describe('Cache Metrics', () => {
    it('should track and report metrics correctly', async () => {
      // 초기 메트릭 확인
      const initialMetrics = await cacheService.getMetrics();
      const initialCount = initialMetrics.length;

      // 일부 작업 수행
      for (let i = 0; i < 10; i++) {
        await cacheService.set(`metric-test-key-${i}`, { data: `metric-test-value-${i}` });
        await cacheService.get(`metric-test-key-${i}`);
      }

      // 새로운 메트릭 확인
      const updatedMetrics = await cacheService.getMetrics();
      expect(updatedMetrics.length).toBeGreaterThan(initialCount);

      const latestMetrics = updatedMetrics[updatedMetrics.length - 1];
      expect(latestMetrics.hitRate.rate).toBeGreaterThan(0);
      expect(latestMetrics.items.count).toBeGreaterThan(0);
    });

    it('should maintain metrics history for different time ranges', async () => {
      const timeRanges = ['24h', '7d', '30d'] as const;

      for (const range of timeRanges) {
        const metrics = await cacheService.getMetrics(range);
        expect(metrics.length).toBeGreaterThan(0);

        const latestMetric = metrics[metrics.length - 1];
        expect(latestMetric.timestamp).toBeDefined();
        expect(latestMetric.hitRate).toBeDefined();
        expect(latestMetric.memory).toBeDefined();
        expect(latestMetric.items).toBeDefined();
      }
    });
  });

  describe('Cache Recovery', () => {
    it('should recover from Redis connection loss', async () => {
      // Redis 연결 끊기 시뮬레이션
      await cacheManager.close();

      // 새로운 연결 시도
      const newCacheService = AdvancedCacheService.getInstance();
      const key = 'recovery-test-key';
      const value = { data: 'recovery-test-value' };

      await newCacheService.set(key, value);
      const retrievedValue = await newCacheService.get(key);

      expect(retrievedValue).toEqual(value);
    });
  });

  describe('Cache Cleanup', () => {
    it('should clean up expired entries', async () => {
      const keys = Array.from({ length: 10 }, (_, i) => `cleanup-test-key-${i}`);
      const ttl = 1000; // 1초

      // 만료될 항목들 추가
      for (const key of keys) {
        await cacheService.set(key, { data: `cleanup-test-value-${key}` }, ttl);
      }

      // 만료 대기
      await new Promise(resolve => setTimeout(resolve, ttl + 100));

      // 만료된 항목들 확인
      for (const key of keys) {
        const value = await cacheService.get(key);
        expect(value).toBeNull();
      }

      const metrics = await cacheService.getMetrics();
      const latestMetrics = metrics[metrics.length - 1];
      expect(latestMetrics.items.count).toBeLessThan(keys.length);
    });
  });
}); 