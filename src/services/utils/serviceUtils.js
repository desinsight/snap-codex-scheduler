import { performance } from 'perf_hooks';
export class ServiceOptimizer {
    cache;
    metrics;
    cacheConfig;
    serviceName;
    cleanupInterval;
    constructor(serviceName, cacheConfig) {
        this.serviceName = serviceName;
        this.cache = new Map();
        this.cacheConfig = cacheConfig;
        this.cleanupInterval = null;
        this.metrics = {
            requestCount: 0,
            cacheHits: 0,
            cacheMisses: 0,
            averageResponseTime: 0,
            errorCount: 0,
            lastUpdated: Date.now(),
            memoryUsage: 0
        };
        this.startCleanup();
    }
    // 캐시 정리 시작
    startCleanup() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.cleanupInterval = setInterval(() => {
            this.cleanupCache();
        }, 60000); // 1분마다 실행
    }
    // 캐시 정리
    cleanupCache() {
        const now = Date.now();
        let totalSize = 0;
        for (const [key, item] of this.cache.entries()) {
            const config = this.cacheConfig[key.split('-')[0]];
            // TTL 체크
            if (now - item.timestamp > config.ttl) {
                this.cache.delete(key);
                continue;
            }
            // 메모리 사용량 계산
            totalSize += item.size;
            // 최대 크기 체크
            if (config.maxSize && this.cache.size > config.maxSize) {
                this.evictLeastUsedItems();
            }
        }
        this.metrics.memoryUsage = totalSize;
    }
    // 사용 빈도가 낮은 항목 제거
    evictLeastUsedItems() {
        const items = Array.from(this.cache.entries())
            .sort((a, b) => {
            // 접근 횟수와 마지막 접근 시간을 고려하여 정렬
            const scoreA = a[1].accessCount * (Date.now() - a[1].lastAccessed);
            const scoreB = b[1].accessCount * (Date.now() - b[1].lastAccessed);
            return scoreA - scoreB;
        });
        // 20% 항목 제거
        const itemsToRemove = Math.ceil(items.length * 0.2);
        for (let i = 0; i < itemsToRemove; i++) {
            this.cache.delete(items[i][0]);
        }
    }
    // 캐시 관리
    getCache(key) {
        const cached = this.cache.get(key);
        if (!cached) {
            this.metrics.cacheMisses++;
            return null;
        }
        const config = this.cacheConfig[key.split('-')[0]];
        if (Date.now() - cached.timestamp > config.ttl) {
            this.cache.delete(key);
            this.metrics.cacheMisses++;
            return null;
        }
        // 접근 정보 업데이트
        cached.lastAccessed = Date.now();
        cached.accessCount++;
        this.metrics.cacheHits++;
        return cached.data;
    }
    setCache(key, data) {
        // 데이터 크기 추정 (KB)
        const size = Math.ceil(JSON.stringify(data).length / 1024);
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            lastAccessed: Date.now(),
            accessCount: 0,
            size
        });
        // 메모리 사용량 업데이트
        this.metrics.memoryUsage += size;
    }
    invalidateCache(pattern) {
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                const item = this.cache.get(key);
                if (item) {
                    this.metrics.memoryUsage -= item.size;
                }
                this.cache.delete(key);
            }
        }
    }
    // 캐시 크기 및 항목 정보
    getCacheSize() {
        return this.cache.size;
    }
    getCacheItems() {
        return Array.from(this.cache.entries()).map(([key, item]) => ({
            key,
            lastAccessed: item.lastAccessed,
            accessCount: item.accessCount,
            size: item.size
        }));
    }
    // 성능 모니터링
    startOperation() {
        this.metrics.requestCount++;
        this.metrics.lastUpdated = Date.now();
        return performance.now();
    }
    endOperation(start) {
        const duration = performance.now() - start;
        this.metrics.averageResponseTime =
            (this.metrics.averageResponseTime * (this.metrics.requestCount - 1) + duration)
                / this.metrics.requestCount;
        return duration;
    }
    recordError() {
        this.metrics.errorCount++;
    }
    getMetrics() {
        return { ...this.metrics };
    }
    resetMetrics() {
        this.metrics = {
            requestCount: 0,
            cacheHits: 0,
            cacheMisses: 0,
            averageResponseTime: 0,
            errorCount: 0,
            lastUpdated: Date.now(),
            memoryUsage: 0
        };
    }
    // 서비스 래퍼
    async withOptimization(key, operation, options = {}) {
        const start = this.startOperation();
        try {
            if (!options.forceRefresh) {
                const cached = this.getCache(key);
                if (cached) {
                    const config = this.cacheConfig[key.split('-')[0]];
                    if (config.staleWhileRevalidate) {
                        this.withOptimization(key, operation, { forceRefresh: true })
                            .catch(console.error);
                    }
                    return cached;
                }
            }
            const result = await operation();
            this.setCache(key, result);
            if (options.invalidatePatterns) {
                options.invalidatePatterns.forEach(pattern => this.invalidateCache(pattern));
            }
            return result;
        }
        catch (error) {
            this.recordError();
            throw error;
        }
        finally {
            this.endOperation(start);
        }
    }
}
