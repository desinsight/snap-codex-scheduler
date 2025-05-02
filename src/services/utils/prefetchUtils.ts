import { ServiceOptimizer } from './serviceUtils';

export interface PrefetchConfig {
  // 프리페치 우선순위
  priority: 'high' | 'medium' | 'low';
  // 프리페치 조건
  condition?: () => boolean;
  // 프리페치 데이터 만료 시간
  expireTime?: number;
}

export class PrefetchManager {
  private static instance: PrefetchManager;
  private prefetchQueue: Map<string, PrefetchConfig>;
  private processing: boolean;
  private optimizer: ServiceOptimizer<any>;

  private constructor(optimizer: ServiceOptimizer<any>) {
    this.prefetchQueue = new Map();
    this.processing = false;
    this.optimizer = optimizer;
  }

  static getInstance(optimizer: ServiceOptimizer<any>): PrefetchManager {
    if (!PrefetchManager.instance) {
      PrefetchManager.instance = new PrefetchManager(optimizer);
    }
    return PrefetchManager.instance;
  }

  // 프리페치 요청 추가
  addToPrefetchQueue(
    key: string,
    fetchFn: () => Promise<any>,
    config: PrefetchConfig
  ): void {
    this.prefetchQueue.set(key, {
      ...config,
      fetchFn
    });

    if (!this.processing) {
      this.processPrefetchQueue();
    }
  }

  // 프리페치 큐 처리
  private async processPrefetchQueue(): Promise<void> {
    if (this.processing || this.prefetchQueue.size === 0) return;

    this.processing = true;
    const priorities = ['high', 'medium', 'low'];

    try {
      for (const priority of priorities) {
        const entries = Array.from(this.prefetchQueue.entries())
          .filter(([_, config]) => config.priority === priority);

        // 네트워크 상태 확인
        if (!navigator.onLine) {
          console.log('오프라인 상태: 프리페치 중단');
          break;
        }

        // 우선순위별 동시 실행
        await Promise.all(
          entries.map(async ([key, config]) => {
            if (config.condition && !config.condition()) {
              return;
            }

            try {
              await this.optimizer.withOptimization(
                key,
                config.fetchFn,
                { forceRefresh: true }
              );
              this.prefetchQueue.delete(key);
            } catch (error) {
              console.error(`프리페치 실패: ${key}`, error);
            }
          })
        );
      }
    } finally {
      this.processing = false;
      
      // 남은 항목이 있으면 계속 처리
      if (this.prefetchQueue.size > 0) {
        setTimeout(() => this.processPrefetchQueue(), 1000);
      }
    }
  }

  // 프리페치 데이터 만료 체크
  private checkExpiration(key: string, expireTime: number): boolean {
    const cachedData = this.optimizer.getCache(key);
    if (!cachedData) return true;

    const now = Date.now();
    return now - cachedData.timestamp > expireTime;
  }

  // 네트워크 상태 모니터링
  startNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      console.log('온라인 상태 복구: 프리페치 재시작');
      this.processPrefetchQueue();
    });

    window.addEventListener('offline', () => {
      console.log('오프라인 상태 감지: 프리페치 일시 중단');
    });
  }
} 