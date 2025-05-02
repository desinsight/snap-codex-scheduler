import { AdvancedCacheManager } from '../utils/advancedCacheUtils';
import { ServiceOptimizer } from '../utils/serviceUtils';

describe('AdvancedCacheManager', () => {
  let optimizer: ServiceOptimizer<any>;
  let cacheManager: AdvancedCacheManager;

  beforeEach(() => {
    optimizer = new ServiceOptimizer('test', {
      test: { ttl: 1000, staleWhileRevalidate: true }
    });
    cacheManager = AdvancedCacheManager.getInstance(optimizer);
  });

  it('should implement singleton pattern', () => {
    const instance1 = AdvancedCacheManager.getInstance(optimizer);
    const instance2 = AdvancedCacheManager.getInstance(optimizer);
    expect(instance1).toBe(instance2);
  });

  it('should set and get warming config', () => {
    const config = {
      patterns: ['test-pattern'],
      interval: 1000,
      priority: 5
    };

    cacheManager.setWarmingConfig('test-service', config);
    const stats = cacheManager.getCacheStats();
    expect(stats.warmingStatus.get('test-service')).toBe(true);
  });

  it('should handle memory optimization', () => {
    const config = {
      maxMemoryUsage: 1, // 1MB
      checkInterval: 1000,
      estimatedItemSize: 1 // 1KB
    };

    cacheManager.setMemoryConfig(config);

    // 캐시 항목 추가
    for (let i = 0; i < 2000; i++) {
      optimizer.setCache(`key${i}`, { data: 'test' });
    }

    // 메모리 최적화 후 캐시 크기 확인
    const stats = cacheManager.getCacheStats();
    expect(stats.memoryUsage).toBeLessThanOrEqual(config.maxMemoryUsage);
  });

  it('should handle cache invalidation patterns', () => {
    let invalidated = false;
    
    cacheManager.addInvalidationPattern({
      pattern: 'test-.*',
      condition: (data) => data.status === 'expired',
      onInvalidate: (key) => {
        invalidated = true;
      }
    });

    optimizer.setCache('test-1', { status: 'expired' });
    cacheManager.invalidateCache('test-1', { status: 'expired' });

    expect(invalidated).toBe(true);
  });

  it('should provide cache statistics', () => {
    optimizer.setCache('test-1', { data: 'test' });
    optimizer.setCache('test-2', { data: 'test' });

    const stats = cacheManager.getCacheStats();
    expect(stats.itemCount).toBe(2);
    expect(stats.memoryUsage).toBeGreaterThan(0);
  });

  it('should handle multiple warming configurations', () => {
    const config1 = {
      patterns: ['service1-.*'],
      interval: 1000,
      priority: 5
    };

    const config2 = {
      patterns: ['service2-.*'],
      interval: 2000,
      priority: 3
    };

    cacheManager.setWarmingConfig('service1', config1);
    cacheManager.setWarmingConfig('service2', config2);

    const stats = cacheManager.getCacheStats();
    expect(stats.warmingStatus.get('service1')).toBe(true);
    expect(stats.warmingStatus.get('service2')).toBe(true);
  });

  it('should handle memory optimization with different item sizes', () => {
    const config = {
      maxMemoryUsage: 2, // 2MB
      checkInterval: 1000,
      estimatedItemSize: 2 // 2KB
    };

    cacheManager.setMemoryConfig(config);

    // 다양한 크기의 캐시 항목 추가
    for (let i = 0; i < 1000; i++) {
      optimizer.setCache(`key${i}`, { data: 'test'.repeat(i % 10) });
    }

    const stats = cacheManager.getCacheStats();
    expect(stats.memoryUsage).toBeLessThanOrEqual(config.maxMemoryUsage);
  });
}); 