import Redis from 'ioredis';
import { CacheManager } from './CacheManager';
import { CacheConfig, CacheItem } from '../../types/cache';

export class RedisCacheManager implements CacheManager {
  private redis: Redis;
  private cluster: Redis.Cluster | null = null;
  private isClusterMode: boolean;

  constructor(config: {
    host: string;
    port: number;
    password?: string;
    isCluster?: boolean;
    nodes?: Array<{ host: string; port: number }>;
  }) {
    this.isClusterMode = config.isCluster || false;
    
    if (this.isClusterMode && config.nodes) {
      this.cluster = new Redis.Cluster(config.nodes, {
        redisOptions: {
          password: config.password,
        },
      });
    } else {
      this.redis = new Redis({
        host: config.host,
        port: config.port,
        password: config.password,
      });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const client = this.isClusterMode ? this.cluster! : this.redis;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const client = this.isClusterMode ? this.cluster! : this.redis;
    const serialized = JSON.stringify(value);
    
    if (ttl) {
      await client.setex(key, ttl, serialized);
    } else {
      await client.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    const client = this.isClusterMode ? this.cluster! : this.redis;
    await client.del(key);
  }

  async clear(): Promise<void> {
    const client = this.isClusterMode ? this.cluster! : this.redis;
    await client.flushall();
  }

  async getStats(): Promise<{
    keys: number;
    memory: number;
    hits: number;
    misses: number;
  }> {
    const client = this.isClusterMode ? this.cluster! : this.redis;
    const [keys, memory] = await Promise.all([
      client.dbsize(),
      client.info('memory').then(info => {
        const usedMemory = info.match(/used_memory:(\d+)/)?.[1];
        return usedMemory ? parseInt(usedMemory) : 0;
      }),
    ]);

    return {
      keys,
      memory,
      hits: 0, // Redis INFO에서 hits/misses 정보를 가져올 수 있음
      misses: 0,
    };
  }

  async disconnect(): Promise<void> {
    if (this.isClusterMode && this.cluster) {
      await this.cluster.quit();
    } else {
      await this.redis.quit();
    }
  }
} 