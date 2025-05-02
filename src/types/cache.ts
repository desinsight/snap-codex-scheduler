export interface CacheConfig {
  maxSize: number;
  maxAge: number;
  updateAgeOnGet: boolean;
  evictionPolicy: 'lru' | 'fifo' | 'random';
}

export interface CacheEntry {
  value: any;
  createdAt: number;
  lastAccessed: number;
  ttl: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  maxSize: number;
  hitRate?: number;
}

export interface CacheMetrics {
  hitRate: {
    rate: number;
    trend: 'up' | 'down' | 'stable';
    change: number;
  };
  latency: {
    average: number;
    trend: 'up' | 'down' | 'stable';
    change: number;
  };
  memory: {
    usage: number;
    trend: 'up' | 'down' | 'stable';
    change: number;
  };
  items: {
    count: number;
    trend: 'up' | 'down' | 'stable';
    change: number;
  };
  timestamp: string;
} 