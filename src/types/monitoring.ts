export interface CacheNode {
  id: string;
  status: 'active' | 'error' | 'syncing';
  metrics: {
    keys: number;
    memory: number;
    hits: number;
    misses: number;
  };
}

export interface MigrationStatus {
  progress: number;
  total: number;
  processed: number;
  errors: number;
  duration: number;
}

export interface CacheMetrics {
  timestamp: string;
  totalKeys: number;
  totalMemory: number;
  hitRate: number;
  missRate: number;
  latency: number;
  errorRate: number;
}

export interface SystemStatus {
  cpuUsage: number;
  memoryUsage: number;
  networkIO: {
    bytesIn: number;
    bytesOut: number;
  };
  lastUpdate: string;
}

export interface ThresholdConfig {
  cpu: number;
  memory: number;
  errorRate: number;
  latency: number;
}

export type TimeRange = '5m' | '15m' | '1h' | '6h' | '24h';
export type RefreshInterval = 1000 | 5000 | 10000 | 30000; 