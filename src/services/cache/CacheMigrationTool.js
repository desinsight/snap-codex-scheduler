import { RedisCacheManager } from './RedisCacheManager';
import { Logger } from '../../utils/logger';
export class CacheMigrationTool {
    source;
    target;
    logger;
    batchSize;
    migrationStatus;
    constructor(source, target, options = {}) {
        this.source = source;
        this.target = target;
        this.logger = new Logger('CacheMigration');
        this.batchSize = options.batchSize || 100;
        this.migrationStatus = {
            total: 0,
            processed: 0,
            errors: 0,
            startTime: Date.now(),
        };
    }
    async startMigration() {
        this.logger.info('Starting cache migration...');
        this.migrationStatus.startTime = Date.now();
        try {
            // Get total keys count
            const stats = await this.source.getStats();
            this.migrationStatus.total = stats.keys;
            // Process in batches
            for (let i = 0; i < this.migrationStatus.total; i += this.batchSize) {
                await this.processBatch(i, Math.min(i + this.batchSize, this.migrationStatus.total));
                this.logger.info(`Progress: ${this.migrationStatus.processed}/${this.migrationStatus.total}`);
            }
            this.logMigrationResults();
        }
        catch (error) {
            this.logger.error('Migration failed:', error);
            throw error;
        }
    }
    async processBatch(start, end) {
        try {
            // Get keys in batch
            const keys = await this.getKeysInRange(start, end);
            // Process each key
            for (const key of keys) {
                try {
                    const value = await this.source.get(key);
                    if (value) {
                        await this.target.set(key, value);
                    }
                    this.migrationStatus.processed++;
                }
                catch (error) {
                    this.migrationStatus.errors++;
                    this.logger.error(`Error migrating key ${key}:`, error);
                }
            }
        }
        catch (error) {
            this.logger.error('Batch processing failed:', error);
            throw error;
        }
    }
    async getKeysInRange(start, end) {
        // Implementation depends on the cache manager
        // For Redis, we can use SCAN command
        if (this.source instanceof RedisCacheManager) {
            const keys = [];
            let cursor = '0';
            do {
                const [nextCursor, batchKeys] = await this.source.scan(cursor);
                cursor = nextCursor;
                keys.push(...batchKeys);
            } while (cursor !== '0' && keys.length < end - start);
            return keys.slice(start, end);
        }
        // For other cache managers, implement appropriate key retrieval
        throw new Error('Key range retrieval not implemented for this cache manager');
    }
    logMigrationResults() {
        const duration = (Date.now() - this.migrationStatus.startTime) / 1000;
        this.logger.info('Migration completed:', {
            total: this.migrationStatus.total,
            processed: this.migrationStatus.processed,
            errors: this.migrationStatus.errors,
            duration: `${duration}s`,
            rate: `${(this.migrationStatus.processed / duration).toFixed(2)} keys/s`,
        });
    }
    getStatus() {
        return {
            ...this.migrationStatus,
            progress: (this.migrationStatus.processed / this.migrationStatus.total) * 100,
            duration: (Date.now() - this.migrationStatus.startTime) / 1000,
        };
    }
}
