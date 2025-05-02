import { CacheMetrics } from '../types/cache';

export class DistributedCacheService {
  private static instance: DistributedCacheService;
  private metrics: CacheMetrics[] = [];

  private constructor() {
    this.loadInitialData();
  }

  public static getInstance(): DistributedCacheService {
    if (!DistributedCacheService.instance) {
      DistributedCacheService.instance = new DistributedCacheService();
    }
    return DistributedCacheService.instance;
  }

  private async loadInitialData(): Promise<void> {
    try {
      const response = await fetch('/api/cache-metrics');
      if (!response.ok) {
        throw new Error('Failed to load cache metrics');
      }
      this.metrics = await response.json();
    } catch (error) {
      console.error('Error loading cache metrics:', error);
      this.metrics = [];
    }
  }

  public async getMetrics(timeRange: '24h' | '7d' | '30d'): Promise<CacheMetrics> {
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - this.getTimeRangeInMs(timeRange));
      
      const filteredMetrics = this.metrics.filter(metric => {
        const metricTime = new Date(metric.timestamp);
        return metricTime >= startTime && metricTime <= now;
      });

      if (filteredMetrics.length === 0) {
        throw new Error('No metrics found for the specified time range');
      }

      const currentMetrics = filteredMetrics[filteredMetrics.length - 1];
      const previousMetrics = filteredMetrics[0];

      return {
        hitRate: {
          rate: currentMetrics.hitRate.rate,
          trend: currentMetrics.hitRate.rate > previousMetrics.hitRate.rate ? 'up' : 'down',
          change: Math.abs(currentMetrics.hitRate.rate - previousMetrics.hitRate.rate)
        },
        latency: {
          average: currentMetrics.latency.average,
          trend: currentMetrics.latency.average > previousMetrics.latency.average ? 'up' : 'down',
          change: Math.abs(currentMetrics.latency.average - previousMetrics.latency.average)
        },
        memory: {
          usage: currentMetrics.memory.usage,
          trend: currentMetrics.memory.usage > previousMetrics.memory.usage ? 'up' : 'down',
          change: Math.abs(currentMetrics.memory.usage - previousMetrics.memory.usage)
        },
        items: {
          count: currentMetrics.items.count,
          trend: currentMetrics.items.count > previousMetrics.items.count ? 'up' : 'down',
          change: Math.abs(currentMetrics.items.count - previousMetrics.items.count)
        },
        timestamp: currentMetrics.timestamp
      };
    } catch (error) {
      console.error('Error getting cache metrics:', error);
      throw error;
    }
  }

  public async addMetrics(metrics: CacheMetrics): Promise<void> {
    try {
      this.metrics.push(metrics);
      const response = await fetch('/api/cache-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metrics)
      });

      if (!response.ok) {
        throw new Error('Failed to add cache metrics');
      }
    } catch (error) {
      console.error('Error adding cache metrics:', error);
      throw error;
    }
  }

  private getTimeRangeInMs(timeRange: '24h' | '7d' | '30d'): number {
    switch (timeRange) {
      case '24h':
        return 24 * 60 * 60 * 1000;
      case '7d':
        return 7 * 24 * 60 * 60 * 1000;
      case '30d':
        return 30 * 24 * 60 * 60 * 1000;
      default:
        return 24 * 60 * 60 * 1000;
    }
  }
} 