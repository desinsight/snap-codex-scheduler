class CacheService {
    static instance;
    cache;
    maxSize;
    cleanupInterval;
    constructor() {
        this.cache = new Map();
        this.maxSize = 1000; // 최대 캐시 항목 수
        this.cleanupInterval = 60000; // 1분마다 정리
        this.startCleanup();
    }
    static getInstance() {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }
    startCleanup() {
        setInterval(() => {
            this.cleanup();
        }, this.cleanupInterval);
    }
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > item.ttl) {
                this.cache.delete(key);
            }
        }
        // 캐시 크기가 최대치를 초과하면 오래된 항목부터 삭제
        if (this.cache.size > this.maxSize) {
            const entries = Array.from(this.cache.entries());
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            const itemsToRemove = entries.slice(0, entries.length - this.maxSize);
            itemsToRemove.forEach(([key]) => this.cache.delete(key));
        }
    }
    set(key, data, ttl = 300000) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl,
        });
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item)
            return null;
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    size() {
        return this.cache.size;
    }
}
export const cacheService = CacheService.getInstance();
