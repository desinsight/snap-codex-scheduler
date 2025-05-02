import { ServiceOptimizer } from '../serviceUtils';
import { AdvancedCacheManager } from '../advancedCacheUtils';

// 테스트용 ServiceOptimizer 인스턴스 생성
export const createTestOptimizer = () => {
  return new ServiceOptimizer({
    ttl: 1000,
    maxSize: 10,
    enableMetrics: true
  });
};

// 테스트용 AdvancedCacheManager 인스턴스 생성
export const createTestCacheManager = (optimizer: ServiceOptimizer) => {
  return new AdvancedCacheManager(optimizer);
};

// 캐시 정리 대기
export const waitForCacheCleanup = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 대용량 데이터 생성
export const generateLargeData = (sizeInKB: number) => {
  const data: Record<string, any> = {};
  const size = sizeInKB * 1024;
  let currentSize = 0;

  while (currentSize < size) {
    const key = `key-${currentSize}`;
    const value = `value-${currentSize}`.repeat(10);
    data[key] = value;
    currentSize += key.length + value.length;
  }

  return data;
};

// API 호출 모의
export const mockApiCall = async (delay: number = 100) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return { data: 'mock response' };
};

// 무효화 핸들러 모의
export const createMockInvalidationHandler = () => {
  const calls: string[] = [];
  
  return {
    handler: (key: string) => {
      calls.push(key);
    },
    getCalls: () => calls
  };
};

// 워밍 핸들러 모의
export const createMockWarmingHandler = () => {
  return {
    handler: async (pattern: string) => {
      await mockApiCall();
      return { data: `warmed-${pattern}` };
    }
  };
};

// 테스트용 메트릭스 수집기
export class TestMetricsCollector {
  private metrics: Record<string, number> = {};

  increment(metric: string) {
    this.metrics[metric] = (this.metrics[metric] || 0) + 1;
  }

  get(metric: string) {
    return this.metrics[metric] || 0;
  }

  reset() {
    this.metrics = {};
  }
}

// 테스트용 캐시 이벤트 리스너
export class TestCacheEventListener {
  private events: string[] = [];

  onCacheHit(key: string) {
    this.events.push(`hit:${key}`);
  }

  onCacheMiss(key: string) {
    this.events.push(`miss:${key}`);
  }

  onCacheInvalidate(key: string) {
    this.events.push(`invalidate:${key}`);
  }

  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
  }
}

// 테스트용 메모리 모니터
export class TestMemoryMonitor {
  private usage: number = 0;

  getCurrentUsage() {
    return this.usage;
  }

  simulateMemoryIncrease(bytes: number) {
    this.usage += bytes;
  }

  simulateMemoryDecrease(bytes: number) {
    this.usage = Math.max(0, this.usage - bytes);
  }

  reset() {
    this.usage = 0;
  }
}

// 테스트용 네트워크 상태 모니터
export class TestNetworkMonitor {
  private isOnline: boolean = true;

  isNetworkAvailable() {
    return this.isOnline;
  }

  simulateOffline() {
    this.isOnline = false;
  }

  simulateOnline() {
    this.isOnline = true;
  }
}

// 테스트용 캐시 스토리지
export class TestCacheStorage {
  private storage: Map<string, any> = new Map();

  get(key: string) {
    return this.storage.get(key);
  }

  set(key: string, value: any) {
    this.storage.set(key, value);
  }

  delete(key: string) {
    this.storage.delete(key);
  }

  clear() {
    this.storage.clear();
  }

  size() {
    return this.storage.size;
  }
} 