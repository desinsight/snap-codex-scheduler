import { MongoClient } from 'mongodb';
import Redis from 'ioredis';
// MongoDB 보안 설정
const mongoOptions = {
    authSource: 'admin',
    authMechanism: 'SCRAM-SHA-256',
    ssl: process.env.NODE_ENV === 'production',
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    retryWrites: true,
    w: 'majority',
    readConcern: { level: 'majority' },
    writeConcern: { w: 'majority' }
};
export const mongoClient = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017', mongoOptions);
// Redis 보안 설정
const redisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    tls: process.env.NODE_ENV === 'production' ? {} : undefined,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    connectTimeout: 10000,
    lazyConnect: true
};
export const redisClient = new Redis(redisOptions);
// 연결 상태 모니터링
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});
mongoClient.on('serverHeartbeatFailed', (event) => {
    console.error('MongoDB heartbeat failed:', event);
});
// 정기적인 연결 상태 확인
setInterval(async () => {
    try {
        await mongoClient.db().admin().ping();
        await redisClient.ping();
    }
    catch (error) {
        console.error('Database health check failed:', error);
    }
}, 30000);
export const databaseConfig = {
    // 연결 풀 설정
    pool: {
        min: 5,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        acquireTimeoutMillis: 2000
    },
    // 쿼리 타임아웃 (ms)
    queryTimeout: 5000,
    // 슬로우 쿼리 로깅 임계값 (ms)
    slowQueryThreshold: 1000,
    // 쿼리 캐시 설정
    queryCache: {
        enabled: true,
        ttl: 300000, // 5분
        maxSize: 1000
    },
    // 인덱스 최적화 설정
    indexOptimization: {
        // 자동 인덱스 생성
        autoCreateIndexes: true,
        // 인덱스 사용 통계 수집
        collectIndexStats: true,
        // 인덱스 재구축 간격 (ms)
        rebuildInterval: 86400000 // 24시간
    },
    // 쿼리 실행 계획 캐시
    executionPlanCache: {
        enabled: true,
        size: 1000
    },
    // 배치 처리 설정
    batchProcessing: {
        // 배치 크기
        size: 1000,
        // 배치 간격 (ms)
        interval: 1000
    },
    // 쿼리 최적화 힌트
    queryHints: {
        // 인덱스 힌트 사용
        useIndexHints: true,
        // 조인 순서 힌트 사용
        useJoinOrderHints: true,
        // 병렬 쿼리 실행
        parallelExecution: true
    }
};
export default {
    mongoClient,
    redisClient
};
