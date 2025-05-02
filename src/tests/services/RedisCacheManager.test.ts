import { Redis } from 'ioredis';
import { RedisCacheManager } from '../../services/RedisCacheManager';
import { mockRedisClient, mockCacheStats, createMockCacheConfig } from '../../utils/testUtils';

jest.mock('ioredis');

describe('RedisCacheManager', () => {
  let cacheManager: RedisCacheManager;
  let redis: jest.Mocked<Redis>;

  beforeEach(() => {
    redis = new Redis() as jest.Mocked<Redis>;
    cacheManager = RedisCacheManager.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return cached value when key exists and not expired', async () => {
      const key = 'test-key';
      const value = { data: 'test' };
      const entry = {
        value,
        createdAt: Date.now(),
        lastAccessed: Date.now(),
        ttl: 3600000
      };

      redis.get.mockResolvedValue(JSON.stringify(entry));

      const result = await cacheManager.get(key);

      expect(redis.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(value);
    });

    it('should return null when key does not exist', async () => {
      const key = 'non-existent-key';

      redis.get.mockResolvedValue(null);

      const result = await cacheManager.get(key);

      expect(redis.get).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });

    it('should return null when entry is expired', async () => {
      const key = 'expired-key';
      const entry = {
        value: { data: 'test' },
        createdAt: Date.now() - 4000000,
        lastAccessed: Date.now() - 4000000,
        ttl: 3600000
      };

      redis.get.mockResolvedValue(JSON.stringify(entry));

      const result = await cacheManager.get(key);

      expect(redis.get).toHaveBeenCalledWith(key);
      expect(redis.del).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set value in cache with TTL', async () => {
      const key = 'test-key';
      const value = { data: 'test' };
      const ttl = 5000;

      await cacheManager.set(key, value, ttl);

      expect(redis.set).toHaveBeenCalled();
      expect(redis.expire).toHaveBeenCalledWith(key, Math.floor(ttl / 1000));
    });

    it('should set value in cache with default TTL', async () => {
      const key = 'test-key';
      const value = { data: 'test' };

      await cacheManager.set(key, value);

      expect(redis.set).toHaveBeenCalled();
      expect(redis.expire).toHaveBeenCalledWith(key, 3600);
    });
  });

  describe('delete', () => {
    it('should delete value from cache', async () => {
      const key = 'test-key';

      redis.del.mockResolvedValue(1);

      const result = await cacheManager.delete(key);

      expect(redis.del).toHaveBeenCalledWith(key);
      expect(result).toBe(true);
    });

    it('should return false when key does not exist', async () => {
      const key = 'non-existent-key';

      redis.del.mockResolvedValue(0);

      const result = await cacheManager.delete(key);

      expect(redis.del).toHaveBeenCalledWith(key);
      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all values from cache', async () => {
      await cacheManager.clear();

      expect(redis.flushdb).toHaveBeenCalled();
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', async () => {
      redis.dbsize.mockResolvedValue(500);

      const result = await cacheManager.getStats();

      expect(redis.dbsize).toHaveBeenCalled();
      expect(result).toEqual(mockCacheStats);
    });
  });

  describe('configure', () => {
    it('should update cache configuration', async () => {
      const config = createMockCacheConfig({ maxSize: 2000 });

      await cacheManager.configure(config);

      expect(cacheManager['config']).toEqual(config);
    });
  });

  describe('close', () => {
    it('should close Redis connection', async () => {
      await cacheManager.close();

      expect(redis.quit).toHaveBeenCalled();
    });
  });
}); 