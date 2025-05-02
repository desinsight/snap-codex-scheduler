import { RedisCacheManager } from './RedisCacheManager';
export class AdvancedCacheService {
    static instance;
    cacheManager;
    metrics = [];
    config;
    constructor(config = {}) {
        this.config = {
            maxSize: config.maxSize || 1000,
            maxAge: config.maxAge || 3600000, // 1시간
            updateAgeOnGet: config.updateAgeOnGet || false,
            evictionPolicy: config.evictionPolicy || 'lru'
        };
        this.cacheManager = RedisCacheManager.getInstance(this.config);
        this.initializeMetrics();
    }
    static getInstance(config) {
        if (!AdvancedCacheService.instance) {
            AdvancedCacheService.instance = new AdvancedCacheService(config);
        }
        return AdvancedCacheService.instance;
    }
    async initializeMetrics() {
        try {
            const stats = await this.cacheManager.getStats();
            this.metrics.push(this.createMetricsFromStats(stats));
        }
        catch (error) {
            console.error('Error initializing metrics:', error);
        }
    }
    createMetricsFromStats(stats) {
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
    calculateTrend(current, previous) {
        if (previous === undefined)
            return 'stable';
        if (current > previous)
            return 'up';
        if (current < previous)
            return 'down';
        return 'stable';
    }
    calculateChange(current, previous) {
        if (previous === undefined)
            return 0;
        return ((current - previous) / previous) * 100;
    }
    async get(key) {
        return this.cacheManager.get(key);
    }
    async set(key, value, ttl) {
        await this.cacheManager.set(key, value, ttl);
        await this.updateMetrics();
    }
    async delete(key) {
        const result = await this.cacheManager.delete(key);
        await this.updateMetrics();
        return result;
    }
    async clear() {
        await this.cacheManager.clear();
        await this.updateMetrics();
    }
    async getMetrics(timeRange = '24h') {
        const now = Date.now();
        const rangeMs = this.getTimeRangeInMs(timeRange);
        return this.metrics.filter(metric => {
            const metricTime = new Date(metric.timestamp).getTime();
            return now - metricTime <= rangeMs;
        });
    }
    getTimeRangeInMs(timeRange) {
        switch (timeRange) {
            case '24h':
                return 24 * 60 * 60 * 1000;
            case '7d':
                return 7 * 24 * 60 * 60 * 1000;
            case '30d':
                return 30 * 24 * 60 * 60 * 1000;
        }
    }
    async updateMetrics() {
        try {
            const stats = await this.cacheManager.getStats();
            this.metrics.push(this.createMetricsFromStats(stats));
            // 오래된 메트릭 제거
            const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
            this.metrics = this.metrics.filter(metric => new Date(metric.timestamp).getTime() > oneMonthAgo);
        }
        catch (error) {
            console.error('Error updating metrics:', error);
        }
    }
    async configure(config) {
        this.config = {
            ...this.config,
            ...config
        };
        await this.cacheManager.configure(this.config);
    }
    async close() {
        await this.cacheManager.close();
    }
}
