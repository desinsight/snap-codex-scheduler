export class BatchProcessor {
    operations;
    processing;
    config;
    timer;
    offlineStorage;
    constructor(config, offlineStorage) {
        this.operations = new Map();
        this.processing = false;
        this.config = config;
        this.timer = null;
        this.offlineStorage = offlineStorage;
    }
    // 배치 작업 추가
    addOperation(key, operation, immediate = false) {
        this.operations.set(key, operation);
        // 즉시 처리가 필요하거나 최소 항목 수를 초과한 경우
        if (immediate || this.operations.size >= this.config.minItems) {
            this.processBatch();
        }
        else {
            this.scheduleProcessing();
        }
    }
    // 처리 스케줄링
    scheduleProcessing() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.processBatch();
        }, Math.min(this.config.interval, this.config.maxDelay));
    }
    // 배치 처리
    async processBatch() {
        if (this.processing || this.operations.size === 0)
            return;
        this.processing = true;
        const batchOperations = Array.from(this.operations.entries());
        this.operations.clear();
        try {
            // 배치 크기별로 처리
            for (let i = 0; i < batchOperations.length; i += this.config.batchSize) {
                const batch = batchOperations.slice(i, i + this.config.batchSize);
                await this.executeBatch(batch);
            }
        }
        finally {
            this.processing = false;
            // 새로운 작업이 있으면 계속 처리
            if (this.operations.size > 0) {
                this.scheduleProcessing();
            }
        }
    }
    // 배치 실행
    async executeBatch(batch) {
        const creates = [];
        const updates = [];
        const deletes = [];
        // 작업 분류
        batch.forEach(([_, operation]) => {
            switch (operation.type) {
                case 'create':
                    if (operation.data)
                        creates.push(operation.data);
                    break;
                case 'update':
                    if (operation.id && operation.data) {
                        updates.push({ id: operation.id, data: operation.data });
                    }
                    break;
                case 'delete':
                    if (operation.id)
                        deletes.push(operation.id);
                    break;
            }
        });
        // 오프라인 상태 처리
        if (!navigator.onLine) {
            await this.handleOfflineBatch(batch);
            return;
        }
        // 배치 요청 실행
        const promises = [];
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
    async handleOfflineBatch(batch) {
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
    async executeBatchCreate(items) {
        // 구현은 실제 API 엔드포인트에 따라 달라짐
        console.log('Batch Create:', items);
    }
    // 배치 업데이트 실행
    async executeBatchUpdate(items) {
        // 구현은 실제 API 엔드포인트에 따라 달라짐
        console.log('Batch Update:', items);
    }
    // 배치 삭제 실행
    async executeBatchDelete(ids) {
        // 구현은 실제 API 엔드포인트에 따라 달라짐
        console.log('Batch Delete:', ids);
    }
    // 오프라인 작업 동기화
    async syncOfflineOperations() {
        if (!navigator.onLine)
            return;
        const pendingOperations = await this.offlineStorage.getAll('pendingOperations');
        // 타임스탬프 순으로 정렬
        pendingOperations.sort((a, b) => a.timestamp - b.timestamp);
        // 배치로 처리
        const batchEntries = pendingOperations.map(op => [op.key, op]);
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
    startNetworkMonitoring() {
        window.addEventListener('online', () => {
            console.log('온라인 상태 복구: 배치 동기화 시작');
            this.syncOfflineOperations();
        });
        window.addEventListener('offline', () => {
            console.log('오프라인 상태 감지: 로컬 저장소 사용');
        });
    }
}
