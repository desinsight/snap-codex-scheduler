import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import LRU from 'lru-cache';
export class PerformanceService {
    static instance;
    cache;
    renderQueue = new Map();
    rafCallbacks = new Map();
    metrics = [];
    constructor() {
        this.cache = new LRU({
            max: 1000,
            maxAge: 1000 * 60 * 60 // 1시간
        });
        this.loadInitialData();
    }
    static getInstance() {
        if (!PerformanceService.instance) {
            PerformanceService.instance = new PerformanceService();
        }
        return PerformanceService.instance;
    }
    // 캐시 설정
    configureCaching(config) {
        this.cache = new LRU({
            max: config.maxSize || 1000,
            maxAge: config.maxAge || 1000 * 60 * 60,
            updateAgeOnGet: config.updateAgeOnGet || false
        });
    }
    // 데이터 캐싱
    cacheData(key, data, ttl) {
        this.cache.set(key, data, ttl);
    }
    // 캐시된 데이터 조회
    getCachedData(key) {
        return this.cache.get(key);
    }
    // 가상 스크롤링 계산
    calculateVirtualScroll(config, scrollTop) {
        const { itemHeight, overscan = 3, containerHeight, totalItems } = config;
        // 시작 인덱스 계산
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        // 화면에 표시될 아이템 수 계산
        const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 * overscan;
        // 종료 인덱스 계산
        const endIndex = Math.min(startIndex + visibleCount, totalItems);
        return {
            startIndex,
            endIndex,
            visibleItems: [], // 실제 구현에서는 데이터 슬라이스를 여기에 포함
            totalHeight: totalItems * itemHeight,
            offsetY: startIndex * itemHeight
        };
    }
    // 렌더링 최적화
    scheduleRender(componentId, callback) {
        // 이전 렌더링 취소
        if (this.rafCallbacks.has(componentId)) {
            cancelAnimationFrame(this.rafCallbacks.get(componentId));
        }
        // 새로운 렌더링 스케줄링
        const rafId = requestAnimationFrame(() => {
            callback();
            this.rafCallbacks.delete(componentId);
        });
        this.rafCallbacks.set(componentId, rafId);
    }
    // 렌더링 큐 관리
    getRenderQueue(componentId) {
        if (!this.renderQueue.has(componentId)) {
            this.renderQueue.set(componentId, new Subject());
        }
        return this.renderQueue.get(componentId).pipe(debounceTime(16), // 약 60fps
        distinctUntilChanged());
    }
    // 렌더링 요청
    requestRender(componentId) {
        if (this.renderQueue.has(componentId)) {
            this.renderQueue.get(componentId).next();
        }
    }
    // 메모리 사용량 모니터링
    getMemoryUsage() {
        const memory = performance.memory || {};
        return {
            totalJSHeapSize: memory.totalJSHeapSize || 0,
            usedJSHeapSize: memory.usedJSHeapSize || 0,
            jsHeapSizeLimit: memory.jsHeapSizeLimit || 0
        };
    }
    // 성능 메트릭 수집
    measurePerformance(metricName, callback) {
        const start = performance.now();
        callback();
        const end = performance.now();
        const duration = end - start;
        // 성능 메트릭 저장 또는 보고
        this.logPerformanceMetric(metricName, duration);
        return duration;
    }
    // 성능 메트릭 로깅
    logPerformanceMetric(metricName, duration) {
        console.log(`Performance metric - ${metricName}: ${duration}ms`);
        // 실제 구현에서는 메트릭을 분석 시스템에 보내거나 저장할 수 있습니다
    }
    // 캐시 정리
    clearCache(key) {
        if (key) {
            this.cache.delete(key);
        }
        else {
            this.cache.clear();
        }
    }
    // 리소스 정리
    dispose() {
        this.clearCache();
        this.rafCallbacks.forEach(rafId => cancelAnimationFrame(rafId));
        this.rafCallbacks.clear();
        this.renderQueue.clear();
    }
    async loadInitialData() {
        try {
            const response = await fetch('/api/performance-metrics');
            if (!response.ok) {
                throw new Error('Failed to load performance metrics');
            }
            this.metrics = await response.json();
        }
        catch (error) {
            console.error('Error loading performance metrics:', error);
            this.metrics = [];
        }
    }
    async getMetrics(timeRange) {
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
                cpu: {
                    usage: currentMetrics.cpu.usage,
                    trend: currentMetrics.cpu.usage > previousMetrics.cpu.usage ? 'up' : 'down',
                    change: Math.abs(currentMetrics.cpu.usage - previousMetrics.cpu.usage)
                },
                memory: {
                    usage: currentMetrics.memory.usage,
                    trend: currentMetrics.memory.usage > previousMetrics.memory.usage ? 'up' : 'down',
                    change: Math.abs(currentMetrics.memory.usage - previousMetrics.memory.usage)
                },
                latency: {
                    average: currentMetrics.latency.average,
                    trend: currentMetrics.latency.average > previousMetrics.latency.average ? 'up' : 'down',
                    change: Math.abs(currentMetrics.latency.average - previousMetrics.latency.average)
                },
                errorRate: {
                    rate: currentMetrics.errorRate.rate,
                    trend: currentMetrics.errorRate.rate > previousMetrics.errorRate.rate ? 'up' : 'down',
                    change: Math.abs(currentMetrics.errorRate.rate - previousMetrics.errorRate.rate)
                },
                timestamp: currentMetrics.timestamp
            };
        }
        catch (error) {
            console.error('Error getting performance metrics:', error);
            throw error;
        }
    }
    async addMetrics(metrics) {
        try {
            this.metrics.push(metrics);
            const response = await fetch('/api/performance-metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(metrics)
            });
            if (!response.ok) {
                throw new Error('Failed to add performance metrics');
            }
        }
        catch (error) {
            console.error('Error adding performance metrics:', error);
            throw error;
        }
    }
    getTimeRangeInMs(timeRange) {
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
