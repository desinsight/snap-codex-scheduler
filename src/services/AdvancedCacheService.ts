import { Observable, Subject, from } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import LRU from 'lru-cache';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  tags?: string[];
}

export interface CacheConfig {
  maxSize: number;
  maxAge: number;
  updateAgeOnGet: boolean;
  prefetchThreshold: number;
}

export interface PrefetchRule {
  pattern: RegExp | string;
  relatedKeys: string[];
  condition?: (data: any) => boolean;
}

export class AdvancedCacheService {
  private static instance: AdvancedCacheService;
  private cache: LRU<string, CacheEntry<any>>;
  private prefetchRules: PrefetchRule[] = [];
  private prefetchQueue: Set<string> = new Set();
  private fetchCallbacks: Map<string, (key: string) => Promise<any>> = new Map();
  private cacheHits: Subject<string> = new Subject();
  private cacheMisses: Subject<string> = new Subject();

  private constructor(config: CacheConfig) {
    this.cache = new LRU({
      max: config.maxSize,
      maxAge: config.maxAge,
      updateAgeOnGet: config.updateAgeOnGet
    });

    // 캐시 히트/미스 모니터링
    this.monitorCachePerformance();
  }

  static getInstance(config?: CacheConfig): AdvancedCacheService {
    if (!AdvancedCacheService.instance) {
      AdvancedCacheService.instance = new AdvancedCacheService(config || {
        maxSize: 1000,
        maxAge: 1000 * 60 * 60,
        updateAgeOnGet: true,
        prefetchThreshold: 0.8
      });
    }
    return AdvancedCacheService.instance;
  }

  // 데이터 저장
  set<T>(key: string, data: T, options?: { tags?: string[]; maxAge?: number }): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + (options?.maxAge || this.cache.maxAge || 0),
      tags: options?.tags
    };

    this.cache.set(key, entry);
    this.checkPrefetchRules(key, data);
  }

  // 데이터 조회
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key) as CacheEntry<T>;
    
    if (entry) {
      this.cacheHits.next(key);
      if (Date.now() > entry.expiresAt) {
        this.cache.delete(key);
        this.cacheMisses.next(key);
        return undefined;
      }
      return entry.data;
    }

    this.cacheMisses.next(key);
    return undefined;
  }

  // 프리페치 규칙 등록
  registerPrefetchRule(rule: PrefetchRule) {
    this.prefetchRules.push(rule);
  }

  // 데이터 가져오기 콜백 등록
  registerFetchCallback(pattern: RegExp | string, callback: (key: string) => Promise<any>) {
    this.fetchCallbacks.set(pattern.toString(), callback);
  }

  // 프리페치 실행
  private async prefetch(keys: string[]) {
    const uniqueKeys = Array.from(new Set(keys));
    const fetchPromises = uniqueKeys
      .filter(key => !this.cache.has(key) && !this.prefetchQueue.has(key))
      .map(key => this.fetchData(key));

    await Promise.all(fetchPromises);
  }

  // 데이터 가져오기
  private async fetchData(key: string): Promise<void> {
    this.prefetchQueue.add(key);

    try {
      const callback = this.findFetchCallback(key);
      if (!callback) {
        console.warn(`No fetch callback found for key: ${key}`);
        return;
      }

      const data = await callback(key);
      this.set(key, data);
    } catch (error) {
      console.error(`Failed to fetch data for key: ${key}`, error);
    } finally {
      this.prefetchQueue.delete(key);
    }
  }

  // 적절한 fetch 콜백 찾기
  private findFetchCallback(key: string): ((key: string) => Promise<any>) | undefined {
    for (const [pattern, callback] of this.fetchCallbacks.entries()) {
      if (new RegExp(pattern).test(key)) {
        return callback;
      }
    }
    return undefined;
  }

  // 프리페치 규칙 확인
  private checkPrefetchRules(key: string, data: any) {
    this.prefetchRules.forEach(rule => {
      if (
        (rule.pattern instanceof RegExp && rule.pattern.test(key)) ||
        (typeof rule.pattern === 'string' && key.includes(rule.pattern))
      ) {
        if (!rule.condition || rule.condition(data)) {
          this.prefetch(rule.relatedKeys);
        }
      }
    });
  }

  // 태그로 캐시 항목 삭제
  invalidateByTag(tag: string): void {
    this.cache.forEach((entry, key) => {
      if (entry.tags?.includes(tag)) {
        this.cache.delete(key);
      }
    });
  }

  // 패턴으로 캐시 항목 삭제
  invalidateByPattern(pattern: RegExp): void {
    this.cache.forEach((_, key) => {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    });
  }

  // 캐시 성능 모니터링
  private monitorCachePerformance() {
    const hitCount = new Map<string, number>();
    const missCount = new Map<string, number>();

    this.cacheHits.subscribe(key => {
      hitCount.set(key, (hitCount.get(key) || 0) + 1);
    });

    this.cacheMisses.subscribe(key => {
      missCount.set(key, (missCount.get(key) || 0) + 1);
    });

    // 주기적으로 성능 메트릭 계산
    setInterval(() => {
      const metrics = this.calculateCacheMetrics(hitCount, missCount);
      console.log('Cache Performance Metrics:', metrics);
    }, 60000); // 1분마다
  }

  // 캐시 성능 메트릭 계산
  private calculateCacheMetrics(hitCount: Map<string, number>, missCount: Map<string, number>) {
    const totalHits = Array.from(hitCount.values()).reduce((sum, count) => sum + count, 0);
    const totalMisses = Array.from(missCount.values()).reduce((sum, count) => sum + count, 0);
    const total = totalHits + totalMisses;

    return {
      hitRate: total > 0 ? totalHits / total : 0,
      missRate: total > 0 ? totalMisses / total : 0,
      totalRequests: total,
      cacheSize: this.cache.size,
      maxSize: this.cache.max
    };
  }

  // 캐시 상태 가져오기
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.cache.max,
      keys: Array.from(this.cache.keys()),
      prefetchQueueSize: this.prefetchQueue.size
    };
  }

  // 캐시 초기화
  clear(): void {
    this.cache.clear();
    this.prefetchQueue.clear();
  }

  // 특정 키의 캐시 삭제
  delete(key: string): void {
    this.cache.delete(key);
  }
} 