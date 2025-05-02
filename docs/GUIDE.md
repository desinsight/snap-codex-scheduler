# Cache System User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Basic Usage](#basic-usage)
3. [Advanced Features](#advanced-features)
4. [Best Practices](#best-practices)
5. [Troubleshooting](#troubleshooting)

## Getting Started

### Installation

```bash
npm install @your-org/cache-system
```

### Basic Setup

```typescript
import { ServiceOptimizer, AdvancedCacheManager } from '@your-org/cache-system';

// Create optimizer instance
const optimizer = new ServiceOptimizer({
  ttl: 1000 * 60 * 5,  // 5 minutes
  maxSize: 1000,
  enableMetrics: true
});

// Create cache manager
const cacheManager = new AdvancedCacheManager(optimizer);
```

## Basic Usage

### Caching API Calls

```typescript
// Simple caching
async function getUserData(userId: string) {
  return await optimizer.withOptimization(
    `user-${userId}`,
    () => api.fetchUser(userId)
  );
}

// With error handling
async function getProductData(productId: string) {
  try {
    return await optimizer.withOptimization(
      `product-${productId}`,
      () => api.fetchProduct(productId)
    );
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw error;
  }
}
```

### Cache Invalidation

```typescript
// Simple invalidation
optimizer.invalidateCache('user-1');

// Pattern-based invalidation
optimizer.invalidateCache('user-.*'); // Invalidates all user caches
```

### Checking Cache Status

```typescript
// Get cached data
const cachedUser = optimizer.getCache('user-1');

// Check metrics
const metrics = optimizer.getMetrics();
console.log('Cache hit rate:', metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses));
```

## Advanced Features

### Memory Management

```typescript
// Configure memory limits
cacheManager.setMemoryConfig({
  maxMemoryUsage: 100,    // 100MB
  checkInterval: 1000,    // Check every second
  estimatedItemSize: 1024 // Estimate 1KB per item
});

// Service-specific limits
cacheManager.setServiceConfig('userService', {
  maxSize: 1000 // Max 1000 items for user service
});
```

### Cache Warming

```typescript
// Configure cache warming
cacheManager.setWarmingConfig('productService', {
  patterns: ['product-featured-.*', 'product-trending-.*'],
  interval: 1000 * 60 * 15, // Warm every 15 minutes
  priority: 5,
  retryCount: 3,
  retryDelay: 1000
});
```

### Conditional Invalidation

```typescript
// Add invalidation pattern
cacheManager.addInvalidationPattern({
  pattern: 'task-.*',
  condition: (data) => data.status === 'completed',
  onInvalidate: (key) => {
    console.log(`Task completed, invalidating: ${key}`);
    // Additional cleanup logic
  }
});
```

### Batch Processing

```typescript
import { BatchProcessor } from '@your-org/cache-system';

const batchProcessor = new BatchProcessor({
  size: 100,
  interval: 1000,
  retryAttempts: 3
});

// Add operations to batch
batchProcessor.addToBatch({
  key: 'update-1',
  operation: () => updateData(),
  priority: 1
});

// Process batch manually
await batchProcessor.processBatch();
```

## Best Practices

### Key Generation

```typescript
// Good: Structured and clear keys
const userKey = `user:${userId}:profile`;
const productKey = `product:${productId}:details`;

// Bad: Unclear or unstructured keys
const badKey = `data_${Math.random()}`;
```

### Error Handling

```typescript
// Implement proper error handling
try {
  const data = await optimizer.withOptimization(
    key,
    async () => {
      const response = await api.fetch();
      if (!response.ok) {
        throw new Error('API Error');
      }
      return response.data;
    }
  );
} catch (error) {
  if (error instanceof CacheError) {
    // Handle cache-specific errors
    switch (error.code) {
      case CacheErrorCode.MEMORY_LIMIT_EXCEEDED:
        // Handle memory issues
        break;
      case CacheErrorCode.OPERATION_TIMEOUT:
        // Handle timeouts
        break;
    }
  }
  // Handle other errors
}
```

### Memory Management

```typescript
// Monitor memory usage
setInterval(() => {
  const stats = cacheManager.getCacheStats();
  if (stats.memoryUsage > stats.memoryLimit * 0.8) {
    console.warn('Memory usage approaching limit');
  }
}, 60000);
```

### Performance Monitoring

```typescript
// Set up monitoring
const eventListener = {
  onCacheHit: (key) => {
    metrics.increment('cache.hits');
  },
  onCacheMiss: (key) => {
    metrics.increment('cache.misses');
  },
  onCacheInvalidate: (key) => {
    metrics.increment('cache.invalidations');
  }
};

optimizer.addEventListener(eventListener);
```

## Troubleshooting

### Common Issues

1. **High Memory Usage**
```typescript
// Check memory stats
const stats = cacheManager.getCacheStats();
console.log('Memory Usage:', stats.currentUsage);
console.log('Peak Usage:', stats.peakUsage);
console.log('Evictions:', stats.evictionCount);

// Adjust memory config if needed
cacheManager.setMemoryConfig({
  maxMemoryUsage: stats.peakUsage * 1.2, // 20% buffer
  checkInterval: 500, // More frequent checks
  estimatedItemSize: stats.currentUsage / stats.itemCount
});
```

2. **Poor Cache Hit Rate**
```typescript
// Monitor hit rate
const metrics = optimizer.getMetrics();
const hitRate = metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses);

if (hitRate < 0.5) {
  // Adjust TTL
  optimizer.setConfig({
    ttl: optimizer.getConfig().ttl * 1.5 // Increase TTL by 50%
  });
  
  // Consider warming
  cacheManager.setWarmingConfig(service, {
    patterns: ['frequently-missed-.*'],
    interval: 1000 * 60 * 5 // 5 minutes
  });
}
```

3. **Concurrent Access Issues**
```typescript
// Implement locking mechanism
const lock = new AsyncLock();

async function safeUpdate(key: string, operation: () => Promise<void>) {
  await lock.acquire(key, async () => {
    await optimizer.withOptimization(key, operation);
  });
}
```

### Debugging

```typescript
// Enable debug logging
optimizer.setDebugLevel('verbose');

// Log cache operations
optimizer.addEventListener({
  onCacheHit: (key) => console.debug('Cache hit:', key),
  onCacheMiss: (key) => console.debug('Cache miss:', key),
  onCacheInvalidate: (key) => console.debug('Cache invalidated:', key)
});

// Monitor performance
setInterval(() => {
  const metrics = optimizer.getMetrics();
  console.table({
    hits: metrics.cacheHits,
    misses: metrics.cacheMisses,
    evictions: metrics.evictions,
    errors: metrics.errorCount
  });
}, 60000);
``` 