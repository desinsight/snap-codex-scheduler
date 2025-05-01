export interface ServiceConfig {
  name: string;
  version: string;
  port: number;
  healthCheck: {
    path: string;
    interval: number;
  };
  dependencies: string[];
  environment: {
    [key: string]: string;
  };
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  lastCheck: string;
  errors: string[];
}

export interface ServiceMetrics {
  requestCount: number;
  errorCount: number;
  averageLatency: number;
  activeConnections: number;
  resourceUsage: {
    memory: number;
    cpu: number;
    disk: number;
  };
}

export interface ServiceDiscovery {
  services: {
    [name: string]: {
      instances: ServiceInstance[];
      lastUpdated: string;
    };
  };
}

export interface ServiceInstance {
  id: string;
  host: string;
  port: number;
  status: 'up' | 'down';
  lastHeartbeat: string;
  metadata: {
    [key: string]: string;
  };
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeout: number;
}

export interface LoadBalancerConfig {
  strategy: 'round-robin' | 'least-connections' | 'random';
  healthCheck: {
    path: string;
    interval: number;
  };
}

export interface ServiceCommunication {
  protocol: 'http' | 'grpc' | 'websocket';
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface ServiceMonitoring {
  metrics: {
    collectionInterval: number;
    retentionPeriod: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'text';
  };
  tracing: {
    enabled: boolean;
    samplingRate: number;
  };
} 