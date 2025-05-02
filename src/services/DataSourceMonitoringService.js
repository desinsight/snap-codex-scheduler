import { Subject, interval } from 'rxjs';
import { map, filter, bufferTime } from 'rxjs/operators';
export class DataSourceMonitoringService {
    static instance;
    healthStatuses = new Map();
    validationRules = new Map();
    metricsStream = new Subject();
    healthCheckInterval = 60000; // 1분
    validationErrors = new Subject();
    constructor() {
        this.startHealthChecks();
    }
    static getInstance() {
        if (!DataSourceMonitoringService.instance) {
            DataSourceMonitoringService.instance = new DataSourceMonitoringService();
        }
        return DataSourceMonitoringService.instance;
    }
    // 데이터 소스 검증 규칙 등록
    registerValidationRules(sourceId, rules) {
        this.validationRules.set(sourceId, rules);
    }
    // 데이터 검증 실행
    validateData(sourceId, data) {
        const rules = this.validationRules.get(sourceId);
        if (!rules)
            return true;
        const errors = [];
        rules.forEach(rule => {
            try {
                const isValid = rule.condition(data);
                if (!isValid) {
                    errors.push(rule.message);
                }
            }
            catch (error) {
                errors.push(`Validation error in rule ${rule.id}: ${error}`);
            }
        });
        if (errors.length > 0) {
            this.validationErrors.next({ sourceId, errors });
            return false;
        }
        return true;
    }
    // 데이터 소스 상태 업데이트
    updateHealthStatus(sourceId, status) {
        const currentStatus = this.healthStatuses.get(sourceId) || {
            id: sourceId,
            status: 'healthy',
            latency: 0,
            errorRate: 0,
            lastCheck: new Date()
        };
        this.healthStatuses.set(sourceId, {
            ...currentStatus,
            ...status,
            lastCheck: new Date()
        });
    }
    // 상태 체크 시작
    startHealthChecks() {
        interval(this.healthCheckInterval).subscribe(() => {
            this.healthStatuses.forEach((status, sourceId) => {
                this.checkDataSourceHealth(sourceId);
            });
        });
    }
    // 데이터 소스 상태 체크
    async checkDataSourceHealth(sourceId) {
        try {
            const start = Date.now();
            const response = await fetch(`/api/health/${sourceId}`);
            const latency = Date.now() - start;
            if (!response.ok) {
                throw new Error(`Health check failed: ${response.statusText}`);
            }
            this.updateHealthStatus(sourceId, {
                status: 'healthy',
                latency,
                errorRate: 0
            });
        }
        catch (error) {
            this.updateHealthStatus(sourceId, {
                status: 'failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // 메트릭 기록
    recordMetrics(sourceId, metrics) {
        const fullMetrics = {
            requestCount: 0,
            errorCount: 0,
            averageLatency: 0,
            dataVolume: 0,
            timestamp: new Date(),
            ...metrics
        };
        this.metricsStream.next(fullMetrics);
    }
    // 메트릭 구독
    subscribeToMetrics() {
        return this.metricsStream.asObservable();
    }
    // 검증 오류 구독
    subscribeToValidationErrors() {
        return this.validationErrors.asObservable();
    }
    // 집계된 메트릭 가져오기
    getAggregatedMetrics(sourceId, timeWindow) {
        return this.metricsStream.pipe(filter(metrics => metrics.timestamp.getTime() > Date.now() - timeWindow), bufferTime(timeWindow), map(metrics => this.aggregateMetrics(metrics)));
    }
    // 메트릭 집계
    aggregateMetrics(metrics) {
        if (metrics.length === 0) {
            return {
                requestCount: 0,
                errorCount: 0,
                averageLatency: 0,
                dataVolume: 0,
                timestamp: new Date()
            };
        }
        return {
            requestCount: metrics.reduce((sum, m) => sum + m.requestCount, 0),
            errorCount: metrics.reduce((sum, m) => sum + m.errorCount, 0),
            averageLatency: metrics.reduce((sum, m) => sum + m.averageLatency, 0) / metrics.length,
            dataVolume: metrics.reduce((sum, m) => sum + m.dataVolume, 0),
            timestamp: new Date()
        };
    }
    // 상태 알림 설정
    setHealthCheckInterval(interval) {
        this.healthCheckInterval = interval;
        this.startHealthChecks();
    }
    // 데이터 소스 상태 가져오기
    getHealthStatus(sourceId) {
        return this.healthStatuses.get(sourceId);
    }
    // 모든 데이터 소스 상태 가져오기
    getAllHealthStatuses() {
        return Array.from(this.healthStatuses.values());
    }
    // 리소스 정리
    dispose() {
        this.metricsStream.complete();
        this.validationErrors.complete();
    }
}
