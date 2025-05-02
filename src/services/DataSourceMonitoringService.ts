import { Subject, Observable, interval } from 'rxjs';
import { map, filter, bufferTime } from 'rxjs/operators';
import { DataSourceConfig } from './DataSourceService';

export interface HealthStatus {
  id: string;
  status: 'healthy' | 'degraded' | 'failed';
  latency: number;
  errorRate: number;
  lastCheck: Date;
  message?: string;
}

export interface ValidationRule {
  id: string;
  type: 'schema' | 'range' | 'format' | 'custom';
  field?: string;
  condition: (data: any) => boolean;
  message: string;
}

export interface MonitoringMetrics {
  requestCount: number;
  errorCount: number;
  averageLatency: number;
  dataVolume: number;
  timestamp: Date;
}

export class DataSourceMonitoringService {
  private static instance: DataSourceMonitoringService;
  private healthStatuses: Map<string, HealthStatus> = new Map();
  private validationRules: Map<string, ValidationRule[]> = new Map();
  private metricsStream: Subject<MonitoringMetrics> = new Subject();
  private healthCheckInterval: number = 60000; // 1분
  private validationErrors: Subject<{ sourceId: string; errors: string[] }> = new Subject();

  private constructor() {
    this.startHealthChecks();
  }

  static getInstance(): DataSourceMonitoringService {
    if (!DataSourceMonitoringService.instance) {
      DataSourceMonitoringService.instance = new DataSourceMonitoringService();
    }
    return DataSourceMonitoringService.instance;
  }

  // 데이터 소스 검증 규칙 등록
  registerValidationRules(sourceId: string, rules: ValidationRule[]) {
    this.validationRules.set(sourceId, rules);
  }

  // 데이터 검증 실행
  validateData(sourceId: string, data: any): boolean {
    const rules = this.validationRules.get(sourceId);
    if (!rules) return true;

    const errors: string[] = [];

    rules.forEach(rule => {
      try {
        const isValid = rule.condition(data);
        if (!isValid) {
          errors.push(rule.message);
        }
      } catch (error) {
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
  updateHealthStatus(sourceId: string, status: Partial<HealthStatus>) {
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
  private startHealthChecks() {
    interval(this.healthCheckInterval).subscribe(() => {
      this.healthStatuses.forEach((status, sourceId) => {
        this.checkDataSourceHealth(sourceId);
      });
    });
  }

  // 데이터 소스 상태 체크
  private async checkDataSourceHealth(sourceId: string) {
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
    } catch (error) {
      this.updateHealthStatus(sourceId, {
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 메트릭 기록
  recordMetrics(sourceId: string, metrics: Partial<MonitoringMetrics>) {
    const fullMetrics: MonitoringMetrics = {
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
  subscribeToMetrics(): Observable<MonitoringMetrics> {
    return this.metricsStream.asObservable();
  }

  // 검증 오류 구독
  subscribeToValidationErrors(): Observable<{ sourceId: string; errors: string[] }> {
    return this.validationErrors.asObservable();
  }

  // 집계된 메트릭 가져오기
  getAggregatedMetrics(sourceId: string, timeWindow: number): Observable<MonitoringMetrics> {
    return this.metricsStream.pipe(
      filter(metrics => metrics.timestamp.getTime() > Date.now() - timeWindow),
      bufferTime(timeWindow),
      map(metrics => this.aggregateMetrics(metrics))
    );
  }

  // 메트릭 집계
  private aggregateMetrics(metrics: MonitoringMetrics[]): MonitoringMetrics {
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
  setHealthCheckInterval(interval: number) {
    this.healthCheckInterval = interval;
    this.startHealthChecks();
  }

  // 데이터 소스 상태 가져오기
  getHealthStatus(sourceId: string): HealthStatus | undefined {
    return this.healthStatuses.get(sourceId);
  }

  // 모든 데이터 소스 상태 가져오기
  getAllHealthStatuses(): HealthStatus[] {
    return Array.from(this.healthStatuses.values());
  }

  // 리소스 정리
  dispose() {
    this.metricsStream.complete();
    this.validationErrors.complete();
  }
} 