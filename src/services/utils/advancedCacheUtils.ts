import { ServiceOptimizer } from './serviceUtils';
import { performance } from 'perf_hooks';

export interface CacheWarmingConfig {
  // 캐시 워밍을 위한 URL 패턴
  patterns: string[];
  // 워밍 간격 (ms)
  interval: number;
  // 워밍 우선순위 (1-10)
  priority: number;
  retryCount?: number; // 재시도 횟수
  retryDelay?: number; // 재시도 간격
}

export interface MemoryOptimizationConfig {
  // 최대 메모리 사용량 (MB)
  maxMemoryUsage: number;
  // 메모리 사용량 체크 간격 (ms)
  checkInterval: number;
  // 캐시 항목당 예상 메모리 사용량 (KB)
  estimatedItemSize: number;
}

export interface CacheInvalidationPattern {
  // 무효화 패턴
  pattern: string | RegExp;
  // 무효화 조건
  condition: (data: any) => boolean;
  // 무효화 후 처리
  onInvalidate: (key: string) => void;
  retryOnInvalidate?: boolean; // 무효화 시 재호출 여부
}

export class AdvancedCacheManager {
  private static instance: AdvancedCacheManager;
  private warmingConfigs: Map<string, CacheWarmingConfig>;
  private memoryConfig: MemoryOptimizationConfig;
  private invalidationPatterns: CacheInvalidationPattern[];
  private optimizer: ServiceOptimizer<any>;
  private warmingIntervals: Map<string, NodeJS.Timeout>;
  private retryQueue: Map<string, { count: number; lastAttempt: number }>;

  private constructor(optimizer: ServiceOptimizer<any>) {
    this.optimizer = optimizer;
    this.warmingConfigs = new Map();
    this.invalidationPatterns = [];
    this.warmingIntervals = new Map();
    this.retryQueue = new Map();
    this.memoryConfig = {
      maxMemoryUsage: 100, // 100MB
      checkInterval: 30000, // 30초
      estimatedItemSize: 10 // 10KB
    };
  }

  static getInstance(optimizer: ServiceOptimizer<any>): AdvancedCacheManager {
    if (!AdvancedCacheManager.instance) {
      AdvancedCacheManager.instance = new AdvancedCacheManager(optimizer);
    }
    return AdvancedCacheManager.instance;
  }

  // 캐시 워밍 설정
  setWarmingConfig(serviceName: string, config: CacheWarmingConfig): void {
    this.warmingConfigs.set(serviceName, {
      ...config,
      retryCount: config.retryCount ?? 3,
      retryDelay: config.retryDelay ?? 5000
    });
    this.startWarming(serviceName);
  }

  // 캐시 워밍 시작
  private startWarming(serviceName: string): void {
    const config = this.warmingConfigs.get(serviceName);
    if (!config) return;

    // 기존 인터벌 제거
    const existingInterval = this.warmingIntervals.get(serviceName);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // 새로운 인터벌 설정
    const interval = setInterval(() => {
      this.warmCache(serviceName);
    }, config.interval);

    this.warmingIntervals.set(serviceName, interval);
  }

  // 캐시 워밍 실행
  private async warmCache(serviceName: string): Promise<void> {
    const config = this.warmingConfigs.get(serviceName);
    if (!config) return;

    for (const pattern of config.patterns) {
      try {
        await this.optimizer.withOptimization(
          pattern,
          async () => {
            // 실제 API 호출은 서비스에서 구현
            return null;
          },
          { forceRefresh: true }
        );
        // 성공 시 재시도 큐에서 제거
        this.retryQueue.delete(pattern);
      } catch (error) {
        console.error(`Cache warming failed for ${pattern}:`, error);
        this.handleWarmingError(pattern, config);
      }
    }
  }

  // 워밍 에러 처리
  private handleWarmingError(pattern: string, config: CacheWarmingConfig): void {
    const retryInfo = this.retryQueue.get(pattern) || { count: 0, lastAttempt: 0 };
    const now = Date.now();

    if (retryInfo.count < config.retryCount! && 
        now - retryInfo.lastAttempt >= config.retryDelay!) {
      retryInfo.count++;
      retryInfo.lastAttempt = now;
      this.retryQueue.set(pattern, retryInfo);

      // 재시도
      setTimeout(() => {
        this.warmCache(config.patterns[0]);
      }, config.retryDelay);
    }
  }

  // 메모리 최적화 설정
  setMemoryConfig(config: MemoryOptimizationConfig): void {
    this.memoryConfig = config;
    this.startMemoryMonitoring();
  }

  // 메모리 모니터링 시작
  private startMemoryMonitoring(): void {
    setInterval(() => {
      this.optimizeMemoryUsage();
    }, this.memoryConfig.checkInterval);
  }

  // 메모리 사용량 최적화
  private optimizeMemoryUsage(): void {
    const currentUsage = this.estimateMemoryUsage();
    if (currentUsage > this.memoryConfig.maxMemoryUsage) {
      this.evictLeastUsedItems();
    }
  }

  // 메모리 사용량 추정
  private estimateMemoryUsage(): number {
    return this.optimizer.getMetrics().memoryUsage;
  }

  // 사용 빈도가 낮은 항목 제거
  private evictLeastUsedItems(): void {
    const items = this.optimizer.getCacheItems();
    items.sort((a, b) => a.lastAccessed - b.lastAccessed);
    
    const itemsToRemove = Math.ceil(items.length * 0.2); // 20% 제거
    for (let i = 0; i < itemsToRemove; i++) {
      this.optimizer.invalidateCache(items[i].key);
    }
  }

  // 캐시 무효화 패턴 추가
  addInvalidationPattern(pattern: CacheInvalidationPattern): void {
    this.invalidationPatterns.push({
      ...pattern,
      retryOnInvalidate: pattern.retryOnInvalidate ?? true
    });
  }

  // 캐시 무효화 실행
  async invalidateCache(key: string, data: any): Promise<void> {
    for (const invalidationPattern of this.invalidationPatterns) {
      const regex = typeof invalidationPattern.pattern === 'string' 
        ? new RegExp(invalidationPattern.pattern)
        : invalidationPattern.pattern;

      if (regex.test(key) && invalidationPattern.condition(data)) {
        this.optimizer.invalidateCache(key);
        invalidationPattern.onInvalidate(key);

        // 무효화 후 재호출
        if (invalidationPattern.retryOnInvalidate) {
          try {
            await this.optimizer.withOptimization(
              key,
              async () => {
                // 실제 API 호출은 서비스에서 구현
                return null;
              },
              { forceRefresh: true }
            );
          } catch (error) {
            console.error(`Cache refresh failed for ${key}:`, error);
          }
        }
      }
    }
  }

  // 캐시 상태 모니터링
  getCacheStats(): {
    itemCount: number;
    memoryUsage: number;
    warmingStatus: Map<string, boolean>;
    retryQueueSize: number;
  } {
    return {
      itemCount: this.optimizer.getCacheSize(),
      memoryUsage: this.estimateMemoryUsage(),
      warmingStatus: new Map(
        Array.from(this.warmingConfigs.keys()).map(service => [
          service,
          this.warmingIntervals.has(service)
        ])
      ),
      retryQueueSize: this.retryQueue.size
    };
  }
} 