import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import LRU from 'lru-cache';

export interface CacheConfig {
  maxSize?: number;
  maxAge?: number;
  updateAgeOnGet?: boolean;
}

export interface VirtualScrollConfig {
  itemHeight: number;
  overscan?: number;
  containerHeight: number;
  totalItems: number;
}

export interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  visibleItems: any[];
  totalHeight: number;
  offsetY: number;
}

export class PerformanceService {
  private static instance: PerformanceService;
  private cache: LRU<string, any>;
  private renderQueue: Map<string, Subject<void>> = new Map();
  private rafCallbacks: Map<string, number> = new Map();

  private constructor() {
    this.cache = new LRU({
      max: 1000,
      maxAge: 1000 * 60 * 60 // 1시간
    });
  }

  static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  // 캐시 설정
  configureCaching(config: CacheConfig) {
    this.cache = new LRU({
      max: config.maxSize || 1000,
      maxAge: config.maxAge || 1000 * 60 * 60,
      updateAgeOnGet: config.updateAgeOnGet || false
    });
  }

  // 데이터 캐싱
  cacheData(key: string, data: any, ttl?: number): void {
    this.cache.set(key, data, ttl);
  }

  // 캐시된 데이터 조회
  getCachedData(key: string): any {
    return this.cache.get(key);
  }

  // 가상 스크롤링 계산
  calculateVirtualScroll(
    config: VirtualScrollConfig,
    scrollTop: number
  ): VirtualScrollResult {
    const { itemHeight, overscan = 3, containerHeight, totalItems } = config;

    // 시작 인덱스 계산
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );

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
  scheduleRender(componentId: string, callback: () => void): void {
    // 이전 렌더링 취소
    if (this.rafCallbacks.has(componentId)) {
      cancelAnimationFrame(this.rafCallbacks.get(componentId)!);
    }

    // 새로운 렌더링 스케줄링
    const rafId = requestAnimationFrame(() => {
      callback();
      this.rafCallbacks.delete(componentId);
    });

    this.rafCallbacks.set(componentId, rafId);
  }

  // 렌더링 큐 관리
  getRenderQueue(componentId: string): Observable<void> {
    if (!this.renderQueue.has(componentId)) {
      this.renderQueue.set(componentId, new Subject<void>());
    }

    return this.renderQueue.get(componentId)!.pipe(
      debounceTime(16), // 약 60fps
      distinctUntilChanged()
    );
  }

  // 렌더링 요청
  requestRender(componentId: string): void {
    if (this.renderQueue.has(componentId)) {
      this.renderQueue.get(componentId)!.next();
    }
  }

  // 메모리 사용량 모니터링
  getMemoryUsage(): MemoryInfo {
    const memory = (performance as any).memory || {};
    return {
      totalJSHeapSize: memory.totalJSHeapSize || 0,
      usedJSHeapSize: memory.usedJSHeapSize || 0,
      jsHeapSizeLimit: memory.jsHeapSizeLimit || 0
    };
  }

  // 성능 메트릭 수집
  measurePerformance(metricName: string, callback: () => void): number {
    const start = performance.now();
    callback();
    const end = performance.now();
    const duration = end - start;

    // 성능 메트릭 저장 또는 보고
    this.logPerformanceMetric(metricName, duration);

    return duration;
  }

  // 성능 메트릭 로깅
  private logPerformanceMetric(metricName: string, duration: number): void {
    console.log(`Performance metric - ${metricName}: ${duration}ms`);
    // 실제 구현에서는 메트릭을 분석 시스템에 보내거나 저장할 수 있습니다
  }

  // 캐시 정리
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // 리소스 정리
  dispose(): void {
    this.clearCache();
    this.rafCallbacks.forEach(rafId => cancelAnimationFrame(rafId));
    this.rafCallbacks.clear();
    this.renderQueue.clear();
  }
}

interface MemoryInfo {
  totalJSHeapSize: number;
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
} 