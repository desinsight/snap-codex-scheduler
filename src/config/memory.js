export const memoryConfig = {
    // 메모리 사용량 제한 (MB)
    maxMemoryUsage: 1024,
    // 가비지 컬렉션 임계값
    gcThreshold: 0.8,
    // 메모리 누수 감지 간격 (ms)
    leakDetectionInterval: 60000,
    // 힙 메모리 제한 (MB)
    heapSizeLimit: 512,
    // 메모리 사용량 모니터링 간격 (ms)
    monitoringInterval: 5000,
    // 메모리 사용량 경고 임계값 (%)
    warningThreshold: 70,
    // 메모리 사용량 위험 임계값 (%)
    dangerThreshold: 85,
    // 메모리 사용량 긴급 조치 임계값 (%)
    emergencyThreshold: 95,
    // 메모리 사용량 감소 조치
    reductionStrategies: {
        // 캐시 크기 감소
        reduceCacheSize: true,
        // 불필요한 데이터 정리
        cleanupUnusedData: true,
        // 메모리 누수 감지
        detectMemoryLeaks: true,
        // 가비지 컬렉션 강제 실행
        forceGarbageCollection: true
    }
};
