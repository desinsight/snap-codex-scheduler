export const metricsConfig = {
    // 메트릭 수집 간격 (ms)
    collectionInterval: 10000,
    // 메트릭 저장소
    storage: {
        // Prometheus 설정
        prometheus: {
            enabled: true,
            port: 9090,
            path: '/metrics'
        },
        // Datadog 설정
        datadog: {
            enabled: true,
            apiKey: process.env.DATADOG_API_KEY,
            appKey: process.env.DATADOG_APP_KEY
        }
    },
    // 애플리케이션 메트릭
    application: {
        // HTTP 메트릭
        http: {
            enabled: true,
            metrics: [
                'request_duration',
                'request_size',
                'response_size',
                'status_codes',
                'error_rate'
            ]
        },
        // 프로세스 메트릭
        process: {
            enabled: true,
            metrics: [
                'cpu_usage',
                'memory_usage',
                'heap_size',
                'event_loop_lag',
                'active_handles'
            ]
        },
        // 비즈니스 메트릭
        business: {
            enabled: true,
            metrics: [
                'active_users',
                'request_volume',
                'cache_hit_rate',
                'cache_miss_rate',
                'average_response_time'
            ]
        }
    },
    // 시스템 메트릭
    system: {
        // CPU 메트릭
        cpu: {
            enabled: true,
            metrics: [
                'usage',
                'load',
                'temperature'
            ]
        },
        // 메모리 메트릭
        memory: {
            enabled: true,
            metrics: [
                'total',
                'used',
                'free',
                'cached',
                'buffers'
            ]
        },
        // 디스크 메트릭
        disk: {
            enabled: true,
            metrics: [
                'total',
                'used',
                'free',
                'read_bytes',
                'write_bytes'
            ]
        },
        // 네트워크 메트릭
        network: {
            enabled: true,
            metrics: [
                'bytes_in',
                'bytes_out',
                'packets_in',
                'packets_out',
                'errors'
            ]
        }
    },
    // 캐시 메트릭
    cache: {
        // Redis 메트릭
        redis: {
            enabled: true,
            metrics: [
                'used_memory',
                'connected_clients',
                'commands_processed',
                'keyspace_hits',
                'keyspace_misses'
            ]
        },
        // 메모리 캐시 메트릭
        memory: {
            enabled: true,
            metrics: [
                'size',
                'items',
                'hit_rate',
                'miss_rate',
                'evictions'
            ]
        }
    },
    // 데이터베이스 메트릭
    database: {
        // MongoDB 메트릭
        mongodb: {
            enabled: true,
            metrics: [
                'connections',
                'operations',
                'latency',
                'queue_size',
                'index_size'
            ]
        },
        // 쿼리 메트릭
        queries: {
            enabled: true,
            metrics: [
                'execution_time',
                'rows_affected',
                'cache_hits',
                'cache_misses',
                'deadlocks'
            ]
        }
    },
    // 메트릭 집계
    aggregation: {
        // 시간 기반 집계
        time: {
            enabled: true,
            intervals: ['1m', '5m', '15m', '1h', '1d']
        },
        // 공간 기반 집계
        space: {
            enabled: true,
            dimensions: ['host', 'service', 'environment']
        }
    }
};
