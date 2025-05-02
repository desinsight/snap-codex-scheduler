import { OfflineStorage } from './offlineStorage';

export interface BatchOperation<T> {
  type: 'create' | 'update' | 'delete';
  data?: T;
  id?: string | number;
  timestamp: number;
}

export interface BatchConfig {
  // 배치 크기
  batchSize: number;
  // 배치 처리 간격 (ms)
  interval: number;
  // 최대 대기 시간 (ms)
  maxDelay: number;
  // 즉시 처리할 최소 항목 수
  minItems: number;
}

export class BatchProcessor<T> {
  private operations: Map<string, BatchOperation<T>>;
  private processing: boolean;
  private config: BatchConfig;
  private timer: NodeJS.Timeout | null;
  private offlineStorage: OfflineStorage;

  constructor(config: BatchConfig, offlineStorage: OfflineStorage) {
    this.operations = new Map();
    this.processing = false;
    this.config = config;
    this.timer = null;
    this.offlineStorage = offlineStorage;
  }

  // 배치 작업 추가
  addOperation(
    key: string,
    operation: BatchOperation<T>,
    immediate = false
  ): void {
    this.operations.set(key, operation);

    // 즉시 처리가 필요하거나 최소 항목 수를 초과한 경우
    if (immediate || this.operations.size >= this.config.minItems) {
      this.processBatch();
    } else {
      this.scheduleProcessing();
    }
  }

  // 처리 스케줄링
  private scheduleProcessing(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.processBatch();
    }, Math.min(this.config.interval, this.config.maxDelay));
  }

  // 배치 처리
  private async processBatch(): Promise<void> {
    if (this.processing || this.operations.size === 0) return;

    this.processing = true;
    const batchOperations = Array.from(this.operations.entries());
    this.operations.clear();

    try {
      // 배치 크기별로 처리
      for (let i = 0; i < batchOperations.length; i += this.config.batchSize) {
        const batch = batchOperations.slice(i, i + this.config.batchSize);
        await this.executeBatch(batch);
      }
    } finally {
      this.processing = false;

      // 새로운 작업이 있으면 계속 처리
      if (this.operations.size > 0) {
        this.scheduleProcessing();
      }
    }
  }

  // 배치 실행
  private async executeBatch(
    batch: Array<[string, BatchOperation<T>]>
  ): Promise<void> {
    const creates: T[] = [];
    const updates: Array<{ id: string | number; data: Partial<T> }> = [];
    const deletes: Array<string | number> = [];

    // 작업 분류
    batch.forEach(([_, operation]) => {
      switch (operation.type) {
        case 'create':
          if (operation.data) creates.push(operation.data);
          break;
        case 'update':
          if (operation.id && operation.data) {
            updates.push({ id: operation.id, data: operation.data });
          }
          break;
        case 'delete':
          if (operation.id) deletes.push(operation.id);
          break;
      }
    });

    // 오프라인 상태 처리
    if (!navigator.onLine) {
      await this.handleOfflineBatch(batch);
      return;
    }

    // 배치 요청 실행
    const promises: Promise<any>[] = [];

    if (creates.length > 0) {
      promises.push(this.executeBatchCreate(creates));
    }
    if (updates.length > 0) {
      promises.push(this.executeBatchUpdate(updates));
    }
    if (deletes.length > 0) {
      promises.push(this.executeBatchDelete(deletes));
    }

    await Promise.all(promises);
  }

  // 오프라인 배치 처리
  private async handleOfflineBatch(
    batch: Array<[string, BatchOperation<T>]>
  ): Promise<void> {
    for (const [key, operation] of batch) {
      switch (operation.type) {
        case 'create':
          if (operation.data) {
            const tempId = `temp-${Date.now()}-${Math.random()}`;
            await this.offlineStorage.save('pendingOperations', {
              ...operation,
              id: tempId,
              key
            });
          }
          break;
        case 'update':
        case 'delete':
          await this.offlineStorage.save('pendingOperations', {
            ...operation,
            key
          });
          break;
      }
    }
  }

  // 배치 생성 실행
  private async executeBatchCreate(items: T[]): Promise<void> {
    // 구현은 실제 API 엔드포인트에 따라 달라짐
    console.log('Batch Create:', items);
  }

  // 배치 업데이트 실행
  private async executeBatchUpdate(
    items: Array<{ id: string | number; data: Partial<T> }>
  ): Promise<void> {
    // 구현은 실제 API 엔드포인트에 따라 달라짐
    console.log('Batch Update:', items);
  }

  // 배치 삭제 실행
  private async executeBatchDelete(ids: Array<string | number>): Promise<void> {
    // 구현은 실제 API 엔드포인트에 따라 달라짐
    console.log('Batch Delete:', ids);
  }

  // 오프라인 작업 동기화
  async syncOfflineOperations(): Promise<void> {
    if (!navigator.onLine) return;

    const pendingOperations = await this.offlineStorage.getAll<BatchOperation<T> & { key: string }>('pendingOperations');
    
    // 타임스탬프 순으로 정렬
    pendingOperations.sort((a, b) => a.timestamp - b.timestamp);

    // 배치로 처리
    const batchEntries = pendingOperations.map(op => [op.key, op] as [string, BatchOperation<T>]);
    
    for (let i = 0; i < batchEntries.length; i += this.config.batchSize) {
      const batch = batchEntries.slice(i, i + this.config.batchSize);
      await this.executeBatch(batch);

      // 성공적으로 처리된 작업 삭제
      for (const [key] of batch) {
        await this.offlineStorage.delete('pendingOperations', key);
      }
    }
  }

  // 네트워크 상태 모니터링
  startNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      console.log('온라인 상태 복구: 배치 동기화 시작');
      this.syncOfflineOperations();
    });

    window.addEventListener('offline', () => {
      console.log('오프라인 상태 감지: 로컬 저장소 사용');
    });
  }
} 