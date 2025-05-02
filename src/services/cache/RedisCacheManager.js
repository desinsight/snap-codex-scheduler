import Redis from 'ioredis';
export class RedisCacheManager {
    redis;
    cluster = null;
    isClusterMode;
    constructor(config) {
        this.isClusterMode = config.isCluster || false;
        if (this.isClusterMode && config.nodes) {
            this.cluster = new Redis.Cluster(config.nodes, {
                redisOptions: {
                    password: config.password,
                },
            });
        }
        else {
            this.redis = new Redis({
                host: config.host,
                port: config.port,
                password: config.password,
            });
        }
    }
    async get(key) {
        const client = this.isClusterMode ? this.cluster : this.redis;
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    }
    async set(key, value, ttl) {
        const client = this.isClusterMode ? this.cluster : this.redis;
        const serialized = JSON.stringify(value);
        if (ttl) {
            await client.setex(key, ttl, serialized);
        }
        else {
            await client.set(key, serialized);
        }
    }
    async delete(key) {
        const client = this.isClusterMode ? this.cluster : this.redis;
        await client.del(key);
    }
    async clear() {
        const client = this.isClusterMode ? this.cluster : this.redis;
        await client.flushall();
    }
    async getStats() {
        const client = this.isClusterMode ? this.cluster : this.redis;
        const [keys, memory] = await Promise.all([
            client.dbsize(),
            client.info('memory').then(info => {
                const usedMemory = info.match(/used_memory:(\d+)/)?.[1];
                return usedMemory ? parseInt(usedMemory) : 0;
            }),
        ]);
        return {
            keys,
            memory,
            hits: 0, // Redis INFO에서 hits/misses 정보를 가져올 수 있음
            misses: 0,
        };
    }
    async disconnect() {
        if (this.isClusterMode && this.cluster) {
            await this.cluster.quit();
        }
        else {
            await this.redis.quit();
        }
    }
}
