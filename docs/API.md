# Cache System API Documentation

## Core Components

### ServiceOptimizer

The main class for handling cache optimization in services.

```typescript
class ServiceOptimizer {
  constructor(config: ServiceOptimizerConfig);
  
  // Core Methods
  async withOptimization<T>(
    key: string, 
    operation: () => Promise<T>
  ): Promise<T>;
  
  invalidateCache(pattern: string): void;
  getCache<T>(key: string): T | undefined;
  getMetrics(): CacheMetrics;
}
```

#### Configuration

```typescript
interface ServiceOptimizerConfig {
  ttl: number;              // Cache TTL in milliseconds
  maxSize: number;          // Maximum number of items in cache
  enableMetrics: boolean;   // Enable performance metrics collection
}
```

#### Usage Example

```typescript
const optimizer = new ServiceOptimizer({
  ttl: 1000 * 60 * 5,  // 5 minutes
  maxSize: 1000,
  enableMetrics: true
});

// Cache-wrapped API call
const data = await optimizer.withOptimization(
  'user-1',
  () => fetchUserData(1)
);
```

### AdvancedCacheManager

Provides advanced caching features like warming and invalidation.

```typescript
class AdvancedCacheManager {
  constructor(optimizer: ServiceOptimizer);
  
  // Configuration Methods
  setMemoryConfig(config: MemoryConfig): void;
  setServiceConfig(service: string, config: ServiceConfig): void;
  setWarmingConfig(service: string, config: WarmingConfig): void;
  
  // Pattern Management
  addInvalidationPattern(pattern: InvalidationPattern): void;
  
  // Monitoring
  getCacheStats(): CacheStats;
}
```

#### Configuration Types

```typescript
interface MemoryConfig {
  maxMemoryUsage: number;    // Maximum memory usage in MB
  checkInterval: number;     // Memory check interval in ms
  estimatedItemSize: number; // Estimated size per item in bytes
}

interface ServiceConfig {
  maxSize: number;          // Maximum items for service
}

interface WarmingConfig {
  patterns: string[];       // Cache warming patterns
  interval: number;         // Warming interval in ms
  priority: number;         // Warming priority (1-10)
  retryCount?: number;      // Number of retry attempts
  retryDelay?: number;      // Delay between retries in ms
}

interface InvalidationPattern {
  pattern: string;          // Regex pattern for keys
  condition: (data: any) => boolean;
  onInvalidate: (key: string) => void;
}
```

#### Usage Example

```typescript
const cacheManager = new AdvancedCacheManager(optimizer);

// Configure memory limits
cacheManager.setMemoryConfig({
  maxMemoryUsage: 100,    // 100MB
  checkInterval: 1000,    // 1 second
  estimatedItemSize: 1024 // 1KB per item
});

// Add invalidation pattern
cacheManager.addInvalidationPattern({
  pattern: 'task-.*',
  condition: (data) => data.status === 'completed',
  onInvalidate: (key) => {
    console.log(`Invalidated: ${key}`);
  }
});
```

### BatchProcessor

Handles batch operations for cache management.

```typescript
class BatchProcessor {
  constructor(config: BatchConfig);
  
  // Batch Operations
  addToBatch(operation: BatchOperation): void;
  processBatch(): Promise<void>;
  
  // Configuration
  setBatchSize(size: number): void;
  setProcessInterval(interval: number): void;
}
```

#### Configuration

```typescript
interface BatchConfig {
  size: number;           // Maximum batch size
  interval: number;       // Processing interval in ms
  retryAttempts: number; // Number of retry attempts
}

interface BatchOperation {
  key: string;
  operation: () => Promise<any>;
  priority: number;
}
```

#### Usage Example

```typescript
const batchProcessor = new BatchProcessor({
  size: 100,
  interval: 1000,
  retryAttempts: 3
});

// Add operation to batch
batchProcessor.addToBatch({
  key: 'update-1',
  operation: () => updateData(),
  priority: 1
});
```

## Events and Monitoring

### Cache Events

```typescript
interface CacheEventListener {
  onCacheHit(key: string): void;
  onCacheMiss(key: string): void;
  onCacheInvalidate(key: string): void;
}
```

### Performance Metrics

```typescript
interface CacheMetrics {
  cacheHits: number;
  cacheMisses: number;
  evictions: number;
  errorCount: number;
  concurrentRequests: number;
  warmingErrors: number;
}
```

### Memory Monitoring

```typescript
interface MemoryStats {
  currentUsage: number;
  peakUsage: number;
  evictionCount: number;
}
```

## Error Handling

The cache system uses a robust error handling mechanism:

```typescript
class CacheError extends Error {
  constructor(
    message: string,
    public code: CacheErrorCode,
    public details?: any
  );
}

enum CacheErrorCode {
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
  INVALID_CONFIGURATION = 'INVALID_CONFIGURATION',
  OPERATION_TIMEOUT = 'OPERATION_TIMEOUT',
  WARMING_FAILED = 'WARMING_FAILED'
}
```

## Type Definitions

Complete type definitions for the cache system:

```typescript
// Export all type definitions
export {
  ServiceOptimizerConfig,
  MemoryConfig,
  ServiceConfig,
  WarmingConfig,
  InvalidationPattern,
  BatchConfig,
  BatchOperation,
  CacheEventListener,
  CacheMetrics,
  MemoryStats,
  CacheError,
  CacheErrorCode
};
```

## Authentication

### POST /api/auth/login
Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

### POST /api/auth/refresh
Refreshes an expired JWT token.

**Request Body:**
```json
{
  "token": "string"
}
```

**Response:**
```json
{
  "token": "string"
}
```

## Cache Management

### GET /api/cache/metrics
Retrieves cache metrics for a specified time range.

**Query Parameters:**
- `timeRange`: "24h" | "7d" | "30d" (default: "24h")

**Response:**
```json
{
  "metrics": [
    {
      "hitRate": {
        "rate": "number",
        "trend": "up" | "down" | "stable",
        "change": "number"
      },
      "latency": {
        "average": "number",
        "trend": "up" | "down" | "stable",
        "change": "number"
      },
      "memory": {
        "usage": "number",
        "trend": "up" | "down" | "stable",
        "change": "number"
      },
      "items": {
        "count": "number",
        "trend": "up" | "down" | "stable",
        "change": "number"
      },
      "timestamp": "string"
    }
  ]
}
```

### POST /api/cache/configure
Updates cache configuration.

**Request Body:**
```json
{
  "maxSize": "number",
  "maxAge": "number",
  "updateAgeOnGet": "boolean",
  "evictionPolicy": "lru" | "fifo" | "random"
}
```

**Response:**
```json
{
  "success": "boolean",
  "message": "string"
}
```

### DELETE /api/cache/clear
Clears all cache entries.

**Response:**
```json
{
  "success": "boolean",
  "message": "string"
}
```

## Performance Monitoring

### GET /api/performance/metrics
Retrieves performance metrics for a specified time range.

**Query Parameters:**
- `timeRange`: "24h" | "7d" | "30d" (default: "24h")

**Response:**
```json
{
  "metrics": [
    {
      "cpu": {
        "usage": "number",
        "trend": "up" | "down" | "stable",
        "change": "number"
      },
      "memory": {
        "usage": "number",
        "trend": "up" | "down" | "stable",
        "change": "number"
      },
      "responseTime": {
        "average": "number",
        "trend": "up" | "down" | "stable",
        "change": "number"
      },
      "errorRate": {
        "rate": "number",
        "trend": "up" | "down" | "stable",
        "change": "number"
      },
      "timestamp": "string"
    }
  ]
}
```

## Error Responses

All API endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "error": "string"
}
```

### 403 Forbidden
```json
{
  "error": "string"
}
```

### 500 Internal Server Error
```json
{
  "error": "string"
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication endpoints: 5 requests per minute
- Cache management endpoints: 10 requests per minute
- Performance monitoring endpoints: 20 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum number of requests allowed
- `X-RateLimit-Remaining`: Number of requests remaining
- `X-RateLimit-Reset`: Time when the rate limit will reset 