import { RedisCacheManager } from './RedisCacheManager';
import { CacheConfig, CacheEntry, CacheStats, CacheMetrics } from '../types/cache';

export class AdvancedCacheService {
  private static instance: AdvancedCacheService;
  private cacheManager: RedisCacheManager;
  private metrics: CacheMetrics[] = [];
  private config: CacheConfig;

  private constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: config.maxSize || 1000,
      maxAge: config.maxAge || 3600000, // 1시간
      updateAgeOnGet: config.updateAgeOnGet || false,
      evictionPolicy: config.evictionPolicy || 'lru'
    };

    this.cacheManager = RedisCacheManager.getInstance(this.config);
    this.initializeMetrics();
  }

  public static getInstance(config?: Partial<CacheConfig>): AdvancedCacheService {
    if (!AdvancedCacheService.instance) {
      AdvancedCacheService.instance = new AdvancedCacheService(config);
    }
    return AdvancedCacheService.instance;
  }

  private async initializeMetrics(): Promise<void> {
    try {
      const stats = await this.cacheManager.getStats();
      this.metrics.push(this.createMetricsFromStats(stats));
    } catch (error) {
      console.error('Error initializing metrics:', error);
    }
  }

  private createMetricsFromStats(stats: CacheStats): CacheMetrics {
    const previousMetrics = this.metrics[this.metrics.length - 1];
    const timestamp = new Date().toISOString();

    return {
      hitRate: {
        rate: stats.hitRate || 0,
        trend: this.calculateTrend(stats.hitRate, previousMetrics?.hitRate.rate),
        change: this.calculateChange(stats.hitRate, previousMetrics?.hitRate.rate)
      },
      latency: {
        average: 0, // 실제 구현에서는 Redis의 latency를 측정
        trend: 'stable',
        change: 0
      },
      memory: {
        usage: (stats.size / stats.maxSize) * 100,
        trend: this.calculateTrend(stats.size, previousMetrics?.items.count),
        change: this.calculateChange(stats.size, previousMetrics?.items.count)
      },
      items: {
        count: stats.size,
        trend: this.calculateTrend(stats.size, previousMetrics?.items.count),
        change: this.calculateChange(stats.size, previousMetrics?.items.count)
      },
      timestamp
    };
  }

  private calculateTrend(current: number, previous?: number): 'up' | 'down' | 'stable' {
    if (previous === undefined) return 'stable';
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  }

  private calculateChange(current: number, previous?: number): number {
    if (previous === undefined) return 0;
    return ((current - previous) / previous) * 100;
  }

  public async get<T>(key: string): Promise<T | null> {
    return this.cacheManager.get<T>(key);
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
    await this.updateMetrics();
  }

  public async delete(key: string): Promise<boolean> {
    const result = await this.cacheManager.delete(key);
    await this.updateMetrics();
    return result;
  }

  public async clear(): Promise<void> {
    await this.cacheManager.clear();
    await this.updateMetrics();
  }

  public async getMetrics(timeRange: '24h' | '7d' | '30d' = '24h'): Promise<CacheMetrics[]> {
    const now = Date.now();
    const rangeMs = this.getTimeRangeInMs(timeRange);
    
    return this.metrics.filter(metric => {
      const metricTime = new Date(metric.timestamp).getTime();
      return now - metricTime <= rangeMs;
    });
  }

  private getTimeRangeInMs(timeRange: '24h' | '7d' | '30d'): number {
    switch (timeRange) {
      case '24h':
        return 24 * 60 * 60 * 1000;
      case '7d':
        return 7 * 24 * 60 * 60 * 1000;
      case '30d':
        return 30 * 24 * 60 * 60 * 1000;
    }
  }

  private async updateMetrics(): Promise<void> {
    try {
      const stats = await this.cacheManager.getStats();
      this.metrics.push(this.createMetricsFromStats(stats));
      
      // 오래된 메트릭 제거
      const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      this.metrics = this.metrics.filter(metric => 
        new Date(metric.timestamp).getTime() > oneMonthAgo
      );
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  }

  public async configure(config: Partial<CacheConfig>): Promise<void> {
    this.config = {
      ...this.config,
      ...config
    };
    await this.cacheManager.configure(this.config);
  }

  public async close(): Promise<void> {
    await this.cacheManager.close();
  }
} 