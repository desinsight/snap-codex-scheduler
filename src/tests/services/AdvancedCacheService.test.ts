import { AdvancedCacheService } from '../../services/AdvancedCacheService';
import { RedisCacheManager } from '../../services/RedisCacheManager';
import { mockRedisClient, mockCacheMetrics, mockCacheStats, createMockCacheConfig } from '../../utils/testUtils';

jest.mock('../../services/RedisCacheManager');

describe('AdvancedCacheService', () => {
  let cacheService: AdvancedCacheService;
  let cacheManager: jest.Mocked<RedisCacheManager>;

  beforeEach(() => {
    cacheManager = new RedisCacheManager() as jest.Mocked<RedisCacheManager>;
    cacheService = AdvancedCacheService.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return cached value when key exists', async () => {
      const key = 'test-key';
      const value = { data: 'test' };
      
      cacheManager.get.mockResolvedValue(value);

      const result = await cacheService.get(key);

      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(value);
    });

    it('should return null when key does not exist', async () => {
      const key = 'non-existent-key';
      
      cacheManager.get.mockResolvedValue(null);

      const result = await cacheService.get(key);

      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set value in cache with default TTL', async () => {
      const key = 'test-key';
      const value = { data: 'test' };

      await cacheService.set(key, value);

      expect(cacheManager.set).toHaveBeenCalledWith(key, value, undefined);
    });

    it('should set value in cache with custom TTL', async () => {
      const key = 'test-key';
      const value = { data: 'test' };
      const ttl = 5000;

      await cacheService.set(key, value, ttl);

      expect(cacheManager.set).toHaveBeenCalledWith(key, value, ttl);
    });
  });

  describe('delete', () => {
    it('should delete value from cache', async () => {
      const key = 'test-key';

      cacheManager.delete.mockResolvedValue(true);

      const result = await cacheService.delete(key);

      expect(cacheManager.delete).toHaveBeenCalledWith(key);
      expect(result).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all values from cache', async () => {
      await cacheService.clear();

      expect(cacheManager.clear).toHaveBeenCalled();
    });
  });

  describe('getMetrics', () => {
    it('should return metrics for specified time range', async () => {
      const timeRange = '24h';
      const metrics = [mockCacheMetrics];

      cacheManager.getStats.mockResolvedValue(mockCacheStats);

      const result = await cacheService.getMetrics(timeRange);

      expect(result).toEqual(metrics);
    });

    it('should return empty array when no metrics exist', async () => {
      const timeRange = '24h';

      cacheManager.getStats.mockResolvedValue(mockCacheStats);

      const result = await cacheService.getMetrics(timeRange);

      expect(result).toEqual([]);
    });
  });

  describe('configure', () => {
    it('should update cache configuration', async () => {
      const config = createMockCacheConfig({ maxSize: 2000 });

      await cacheService.configure(config);

      expect(cacheManager.configure).toHaveBeenCalledWith(config);
    });
  });

  describe('close', () => {
    it('should close Redis connection', async () => {
      await cacheService.close();

      expect(cacheManager.close).toHaveBeenCalled();
    });
  });
}); 