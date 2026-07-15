import * as crypto from "crypto";

export interface RedisClientAdapter {
  eval: (script: string, keys: string[], args: string[]) => Promise<any>;
  set: (key: string, value: string, mode: "PX", ttl: number, nx: "NX") => Promise<any>;
  get: (key: string) => Promise<string | null>;
  del: (key: string) => Promise<any>;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number; // wait time in seconds
}

/**
 * Atomic Redis rate limiter and concurrency controller.
 * Fallback to degraded local mode is handled if the redis client is null or queries fail.
 */
export class RedisRateLimiter {
  constructor(
    private readonly redis: RedisClientAdapter | null,
    private readonly clock: { now: () => Date }
  ) {}

  /**
   * Atomic check for IP, Actor (Practitioner/Patient ID), and Organization.
   * Limits:
   *  - IP: 15 / min, 500 / day
   *  - Actor: 30 / min, 1000 / day
   *  - Org: 100 / min, 5000 / day
   */
  async checkLimit(keyPrefix: string, identifier: string, limitMin: number, limitDay: number): Promise<RateLimitResult> {
    if (identifier === "IP_UNRESOLVABLE") {
      return { allowed: false, retryAfter: 60 }; // Fail closed immediately on unresolvable IP
    }

    if (!this.redis) {
      throw new Error("Redis client offline"); // Triggers fallback to bounded local limiter
    }

    const now = this.clock.now().getTime();
    const minuteWindow = Math.floor(now / 60000);
    const dayWindow = Math.floor(now / 86400000);

    const minKey = `rl:${keyPrefix}:${identifier}:m:${minuteWindow}`;
    const dayKey = `rl:${keyPrefix}:${identifier}:d:${dayWindow}`;

    const luaScript = `
      local minVal = redis.call('incr', KEYS[1])
      if minVal == 1 then
        redis.call('expire', KEYS[1], 60)
      end
      local dayVal = redis.call('incr', KEYS[2])
      if dayVal == 1 then
        redis.call('expire', KEYS[2], 86400)
      end
      return {minVal, dayVal}
    `;

    try {
      const res = await this.redis.eval(luaScript, [minKey, dayKey], []);
      const [currentMin, currentDay] = res as [number, number];

      if (currentMin > limitMin || currentDay > limitDay) {
        return { allowed: false, retryAfter: 60 };
      }
      return { allowed: true };
    } catch (err) {
      // Throw error to trigger degraded local path
      throw err;
    }
  }

  private static localLeases = new Map<string, { token: string; expiresAt: number }>();

  private static pruneExpiredLeases(now: number): void {
    for (const [key, lease] of RedisRateLimiter.localLeases.entries()) {
      if (now >= lease.expiresAt) {
        RedisRateLimiter.localLeases.delete(key);
      }
    }
  }

  /**
   * Acquires a concurrency lease (limit = 1 concurrent request per User ID).
   * Returns a unique token on success, or null if locked.
   */
  async acquireLease(userId: string): Promise<string | null> {
    const now = this.clock ? this.clock.now().getTime() : Date.now();
    RedisRateLimiter.pruneExpiredLeases(now);

    if (!this.redis) {
      const lease = RedisRateLimiter.localLeases.get(userId);
      if (lease && now < lease.expiresAt) {
        return null;
      }
      if (RedisRateLimiter.localLeases.size >= 1000) {
        console.warn("[RedisRateLimiter] Local fallback leases map full. Failing closed.");
        return null;
      }
      const token = crypto.randomBytes(16).toString("hex");
      RedisRateLimiter.localLeases.set(userId, { token, expiresAt: now + 60000 });
      return token;
    }
    const leaseKey = `lease:concurrency:${userId}`;
    const token = crypto.randomBytes(16).toString("hex");
    try {
      const res = await this.redis.set(leaseKey, token, "PX", 60000, "NX");
      if (res === "OK" || res === true || res === 1 || res === "1") {
        return token;
      }
      return null;
    } catch {
      // Fallback to degraded local lease on Redis errors
      const lease = RedisRateLimiter.localLeases.get(userId);
      if (lease && now < lease.expiresAt) {
        return null;
      }
      if (RedisRateLimiter.localLeases.size >= 1000) {
        console.warn("[RedisRateLimiter] Local fallback leases map full during fallback. Failing closed.");
        return null;
      }
      RedisRateLimiter.localLeases.set(userId, { token, expiresAt: now + 60000 });
      return token;
    }
  }



  /**
   * Releases a concurrency lease atomically using a token-safe Lua script.
   */
  async releaseLease(userId: string, token: string): Promise<boolean> {
    const now = this.clock ? this.clock.now().getTime() : Date.now();
    if (!this.redis) {
      const lease = RedisRateLimiter.localLeases.get(userId);
      if (lease && lease.token === token) {
        RedisRateLimiter.localLeases.delete(userId);
        return true;
      }
      return false;
    }
    const leaseKey = `lease:concurrency:${userId}`;
    const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    try {
      const res = await this.redis.eval(luaScript, [leaseKey], [token]);
      return res === 1 || res === "1" || res === true;
    } catch {
      // Fallback
      const lease = RedisRateLimiter.localLeases.get(userId);
      if (lease && lease.token === token) {
        RedisRateLimiter.localLeases.delete(userId);
        return true;
      }
      return false;
    }
  }
}
