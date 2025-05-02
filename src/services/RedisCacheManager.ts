import { Redis } from 'ioredis';
import { CacheConfig, CacheEntry, CacheStats } from '../types/cache';

export class RedisCacheManager {
  private static instance: RedisCacheManager;
  private redis: Redis;
  private config: CacheConfig;
  private stats: CacheStats;

  private constructor(config: Partial<CacheConfig> = {}) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0')
    });

    this.config = {
      maxSize: config.maxSize || 1000,
      maxAge: config.maxAge || 3600000, // 1시간
      updateAgeOnGet: config.updateAgeOnGet || false,
      evictionPolicy: config.evictionPolicy || 'lru'
    };

    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      maxSize: this.config.maxSize
    };

    this.initializeRedis();
  }

  public static getInstance(config?: Partial<CacheConfig>): RedisCacheManager {
    if (!RedisCacheManager.instance) {
      RedisCacheManager.instance = new RedisCacheManager(config);
    }
    return RedisCacheManager.instance;
  }

  private async initializeRedis(): Promise<void> {
    try {
      await this.redis.ping();
      console.log('Redis connection established');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      
      if (!data) {
        this.stats.misses++;
        return null;
      }

      const entry: CacheEntry = JSON.parse(data);
      
      if (this.isExpired(entry)) {
        await this.redis.del(key);
        this.stats.misses++;
        this.stats.evictions++;
        return null;
      }

      if (this.config.updateAgeOnGet) {
        entry.lastAccessed = Date.now();
        await this.redis.set(key, JSON.stringify(entry));
      }

      this.stats.hits++;
      return entry.value as T;
    } catch (error) {
      console.error('Error getting from Redis:', error);
      return null;
    }
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const entry: CacheEntry = {
        value,
        createdAt: Date.now(),
        lastAccessed: Date.now(),
        ttl: ttl || this.config.maxAge
      };

      await this.redis.set(key, JSON.stringify(entry));
      await this.redis.expire(key, Math.floor(entry.ttl / 1000));
      this.stats.size = await this.redis.dbsize();
    } catch (error) {
      console.error('Error setting in Redis:', error);
    }
  }

  public async delete(key: string): Promise<boolean> {
    try {
      const result = await this.redis.del(key);
      this.stats.size = await this.redis.dbsize();
      return result > 0;
    } catch (error) {
      console.error('Error deleting from Redis:', error);
      return false;
    }
  }

  public async clear(): Promise<void> {
    try {
      await this.redis.flushdb();
      this.stats.size = 0;
    } catch (error) {
      console.error('Error clearing Redis:', error);
    }
  }

  public async getStats(): Promise<CacheStats> {
    try {
      const size = await this.redis.dbsize();
      return {
        ...this.stats,
        size,
        hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
      };
    } catch (error) {
      console.error('Error getting Redis stats:', error);
      return this.stats;
    }
  }

  public async configure(config: Partial<CacheConfig>): Promise<void> {
    this.config = {
      ...this.config,
      ...config
    };
    this.stats.maxSize = this.config.maxSize;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.createdAt > entry.ttl;
  }

  public async close(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      console.error('Error closing Redis connection:', error);
    }
  }
} 