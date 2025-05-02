import { performance } from 'perf_hooks';

// 캐시 설정 타입
export interface CacheConfig {
  ttl: number;
  staleWhileRevalidate: boolean;
  maxSize?: number; // 최대 캐시 항목 수
  cleanupInterval?: number; // 정리 간격
}

// 성능 메트릭 타입
export interface ServiceMetrics {
  requestCount: number;
  cacheHits: number;
  cacheMisses: number;
  averageResponseTime: number;
  errorCount: number;
  lastUpdated: number;
  memoryUsage: number;
}

// 캐시 아이템 타입
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  lastAccessed: number;
  accessCount: number;
  size: number; // 메모리 사용량 (KB)
}

export class ServiceOptimizer<T> {
  private cache: Map<string, CacheItem<T>>;
  private metrics: ServiceMetrics;
  private cacheConfig: Record<string, CacheConfig>;
  private serviceName: string;
  private cleanupInterval: NodeJS.Timeout | null;

  constructor(serviceName: string, cacheConfig: Record<string, CacheConfig>) {
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
  private startCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      this.cleanupCache();
    }, 60000); // 1분마다 실행
  }

  // 캐시 정리
  private cleanupCache(): void {
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
  private evictLeastUsedItems(): void {
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
  getCache(key: string): T | null {
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

  setCache(key: string, data: T): void {
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

  invalidateCache(pattern: string | RegExp): void {
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
  getCacheSize(): number {
    return this.cache.size;
  }

  getCacheItems(): Array<{ 
    key: string; 
    lastAccessed: number; 
    accessCount: number;
    size: number;
  }> {
    return Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      lastAccessed: item.lastAccessed,
      accessCount: item.accessCount,
      size: item.size
    }));
  }

  // 성능 모니터링
  startOperation(): number {
    this.metrics.requestCount++;
    this.metrics.lastUpdated = Date.now();
    return performance.now();
  }

  endOperation(start: number): number {
    const duration = performance.now() - start;
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.requestCount - 1) + duration) 
      / this.metrics.requestCount;
    return duration;
  }

  recordError(): void {
    this.metrics.errorCount++;
  }

  getMetrics(): ServiceMetrics {
    return { ...this.metrics };
  }

  resetMetrics(): void {
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
  async withOptimization<R>(
    key: string,
    operation: () => Promise<R>,
    options: {
      forceRefresh?: boolean;
      invalidatePatterns?: (string | RegExp)[];
    } = {}
  ): Promise<R> {
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
          return cached as R;
        }
      }

      const result = await operation();
      this.setCache(key, result as unknown as T);
      
      if (options.invalidatePatterns) {
        options.invalidatePatterns.forEach(pattern => 
          this.invalidateCache(pattern)
        );
      }

      return result;
    } catch (error) {
      this.recordError();
      throw error;
    } finally {
      this.endOperation(start);
    }
  }
} 