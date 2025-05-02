export const cacheConfig = {
    // 기본 TTL (ms)
    defaultTTL: 300000, // 5분
    // 최대 캐시 크기 (MB)
    maxSize: 1024,
    // 캐시 전략
    strategy: {
        // LRU (Least Recently Used) 캐시
        type: 'lru',
        // 캐시 항목 최대 수
        maxItems: 10000,
        // 캐시 항목 최소 수
        minItems: 1000
    },
    // 동적 TTL 설정
    dynamicTTL: {
        enabled: true,
        // 접근 빈도에 따른 TTL 조정
        accessBased: true,
        // 데이터 중요도에 따른 TTL 조정
        importanceBased: true,
        // TTL 조정 계수
        adjustmentFactor: 1.5
    },
    // 캐시 분할 설정
    partitioning: {
        enabled: true,
        // 분할 수
        partitions: 4,
        // 분할 기준
        criteria: ['type', 'importance', 'accessPattern']
    },
    // 프리페칭 설정
    prefetching: {
        enabled: true,
        // 예측 기반 프리페칭
        predictive: true,
        // 접근 패턴 기반 프리페칭
        patternBased: true,
        // 프리페칭 크기
        batchSize: 100
    },
    // 캐시 무효화 전략
    invalidation: {
        // 시간 기반 무효화
        timeBased: true,
        // 이벤트 기반 무효화
        eventBased: true,
        // 무효화 대기열 크기
        queueSize: 1000
    },
    // 모니터링 설정
    monitoring: {
        // 히트율 모니터링
        hitRate: true,
        // 미스율 모니터링
        missRate: true,
        // 메모리 사용량 모니터링
        memoryUsage: true,
        // 성능 메트릭 수집
        performanceMetrics: true
    }
};
