import { AdvancedCacheService } from '../../services/AdvancedCacheService';
import { RedisCacheManager } from '../../services/RedisCacheManager';
import { createMockCacheConfig } from '../../utils/testUtils';

describe('Cache Performance Tests', () => {
  let cacheService: AdvancedCacheService;
  let cacheManager: RedisCacheManager;
  const testData = Array.from({ length: 1000 }, (_, i) => ({
    key: `test-key-${i}`,
    value: { data: `test-value-${i}` }
  }));

  beforeAll(() => {
    cacheService = AdvancedCacheService.getInstance();
    cacheManager = RedisCacheManager.getInstance();
  });

  afterAll(async () => {
    await cacheService.close();
  });

  describe('Read Performance', () => {
    it('should handle high concurrent read requests', async () => {
      const concurrentRequests = 100;
      const readPromises = Array.from({ length: concurrentRequests }, async () => {
        const start = process.hrtime();
        await cacheService.get('test-key-0');
        const [seconds, nanoseconds] = process.hrtime(start);
        return seconds * 1000 + nanoseconds / 1000000;
      });

      const latencies = await Promise.all(readPromises);
      const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;

      expect(averageLatency).toBeLessThan(10); // 10ms 이하
    });

    it('should maintain consistent read performance under load', async () => {
      const iterations = 1000;
      const latencies: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = process.hrtime();
        await cacheService.get(`test-key-${i % 1000}`);
        const [seconds, nanoseconds] = process.hrtime(start);
        latencies.push(seconds * 1000 + nanoseconds / 1000000);
      }

      const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      const maxLatency = Math.max(...latencies);

      expect(averageLatency).toBeLessThan(5); // 5ms 이하
      expect(maxLatency).toBeLessThan(20); // 20ms 이하
    });
  });

  describe('Write Performance', () => {
    it('should handle high concurrent write requests', async () => {
      const concurrentRequests = 100;
      const writePromises = Array.from({ length: concurrentRequests }, async (_, i) => {
        const start = process.hrtime();
        await cacheService.set(`write-key-${i}`, { data: `write-value-${i}` });
        const [seconds, nanoseconds] = process.hrtime(start);
        return seconds * 1000 + nanoseconds / 1000000;
      });

      const latencies = await Promise.all(writePromises);
      const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;

      expect(averageLatency).toBeLessThan(15); // 15ms 이하
    });

    it('should maintain consistent write performance under load', async () => {
      const iterations = 1000;
      const latencies: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = process.hrtime();
        await cacheService.set(`write-key-${i}`, { data: `write-value-${i}` });
        const [seconds, nanoseconds] = process.hrtime(start);
        latencies.push(seconds * 1000 + nanoseconds / 1000000);
      }

      const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      const maxLatency = Math.max(...latencies);

      expect(averageLatency).toBeLessThan(10); // 10ms 이하
      expect(maxLatency).toBeLessThan(30); // 30ms 이하
    });
  });

  describe('Memory Usage', () => {
    it('should maintain stable memory usage under load', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const iterations = 10000;

      for (let i = 0; i < iterations; i++) {
        await cacheService.set(`memory-key-${i}`, { data: `memory-value-${i}` });
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB 이하
    });
  });

  describe('Cache Hit Rate', () => {
    it('should maintain high hit rate for frequently accessed items', async () => {
      const iterations = 1000;
      const hotKeys = testData.slice(0, 10);

      // Warm up cache
      for (const item of hotKeys) {
        await cacheService.set(item.key, item.value);
      }

      // Access hot keys repeatedly
      for (let i = 0; i < iterations; i++) {
        const key = hotKeys[i % hotKeys.length].key;
        await cacheService.get(key);
      }

      const metrics = await cacheService.getMetrics();
      const latestMetrics = metrics[metrics.length - 1];

      expect(latestMetrics.hitRate.rate).toBeGreaterThan(0.9); // 90% 이상
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle mixed read/write operations correctly', async () => {
      const operations = 1000;
      const promises: Promise<void>[] = [];

      for (let i = 0; i < operations; i++) {
        if (i % 2 === 0) {
          promises.push(cacheService.set(`mixed-key-${i}`, { data: `mixed-value-${i}` }));
        } else {
          promises.push(cacheService.get(`mixed-key-${i - 1}`));
        }
      }

      await Promise.all(promises);
      const metrics = await cacheService.getMetrics();
      const latestMetrics = metrics[metrics.length - 1];

      expect(latestMetrics.items.count).toBeGreaterThan(0);
    });
  });
}); 