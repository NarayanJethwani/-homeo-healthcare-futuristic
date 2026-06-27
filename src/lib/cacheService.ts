export class LocalCache {
  private cache = new Map<string, { value: any; expiry: number }>();
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  set(key: string, value: any, ttlMs: number): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { value, expiry });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
    return this.cache.size;
  }
}

export const CACHE_TTLS = {
  FAQ: 24 * 60 * 60 * 1000,          // 24 hours
  ARTICLE: 7 * 24 * 60 * 60 * 1000,  // 7 days
  CLINIC: 30 * 24 * 60 * 60 * 1000,  // 30 days
  DEFAULT: 60 * 60 * 1000            // 1 hour
};

type RedisModule = {
  createClient: (options: { url: string }) => any;
};

const importOptionalRedis = new Function("specifier", "return import(specifier)") as (
  specifier: string,
) => Promise<RedisModule>;

class ResponseCacheService {
  private localCache = new LocalCache();
  private redisClient: any = null;
  private useRedis = false;

  constructor() {
    this.initRedis();
  }

  private async initRedis() {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        const { createClient } = await importOptionalRedis("redis");
        this.redisClient = createClient({ url: redisUrl });
        this.redisClient.on("error", (err: any) => console.error("Redis Client Error", err));
        await this.redisClient.connect();
        this.useRedis = true;
        console.log("Connected to Redis successfully for AI Router Caching.");
      } catch {
        console.warn("Redis URL is set, but redis library is unavailable or connection failed. Using local in-memory cache.");
      }
    }
  }

  async get(key: string): Promise<any | null> {
    if (this.useRedis && this.redisClient) {
      try {
        const val = await this.redisClient.get(key);
        return val ? JSON.parse(val) : null;
      } catch (err) {
        console.error("Failed to fetch from Redis, falling back to local memory:", err);
      }
    }
    return this.localCache.get(key);
  }

  async set(key: string, value: any, ttlMs: number): Promise<void> {
    if (this.useRedis && this.redisClient) {
      try {
        await this.redisClient.set(key, JSON.stringify(value), {
          PX: ttlMs
        });
        return;
      } catch (err) {
        console.error("Failed to write to Redis, falling back to local memory:", err);
      }
    }
    this.localCache.set(key, value, ttlMs);
  }

  async delete(key: string): Promise<void> {
    if (this.useRedis && this.redisClient) {
      try {
        await this.redisClient.del(key);
        return;
      } catch (err) {
        console.error("Failed to delete from Redis, falling back to local memory:", err);
      }
    }
    this.localCache.delete(key);
  }

  async clear(): Promise<void> {
    if (this.useRedis && this.redisClient) {
      try {
        await this.redisClient.flushAll();
        return;
      } catch (err) {
        console.error("Failed to flush Redis, falling back to local memory:", err);
      }
    }
    this.localCache.clear();
  }

  async getStats(): Promise<{ type: string; size: number }> {
    return {
      type: this.useRedis ? "Redis" : "In-Memory",
      size: this.useRedis ? -1 : this.localCache.size()
    };
  }
}

export const cacheService = new ResponseCacheService();
