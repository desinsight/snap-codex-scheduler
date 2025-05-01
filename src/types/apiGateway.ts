export interface RouteConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  target: string;
  timeout: number;
  retryAttempts: number;
  rateLimit?: {
    requests: number;
    interval: number; // in seconds
  };
  authentication?: {
    type: 'jwt' | 'apiKey' | 'oauth2';
    required: boolean;
  };
  cors?: {
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
  };
}

export interface GatewayConfig {
  routes: RouteConfig[];
  globalRateLimit?: {
    requests: number;
    interval: number;
  };
  defaultTimeout: number;
  defaultRetryAttempts: number;
  healthCheck: {
    path: string;
    interval: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'text';
  };
}

export interface GatewayStats {
  totalRequests: number;
  activeConnections: number;
  averageResponseTime: number;
  errorRate: number;
  routes: {
    [path: string]: {
      requests: number;
      errors: number;
      averageLatency: number;
    };
  };
}

export interface GatewayResponse {
  status: number;
  headers: Record<string, string>;
  body: any;
  latency: number;
}

export interface GatewayError {
  code: string;
  message: string;
  status: number;
  details?: any;
} 