const ipLimiterMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_LOCAL_REQUESTS = 5; // Local burst rate limit for degraded mode
const MAX_MAP_SIZE = 1000;

/**
 * Bounded In-Memory Local Rate Limiter for degraded/fallback mode.
 * Enforces strict map size capping to prevent OOM and computes Retry-After seconds.
 */
export class IPRateLimiter {
  static pruneCursorIndex = 0;

  static isRateLimited(
    ip: string,
    clock: { now: () => Date } = { now: () => new Date() },
    limit: number = MAX_LOCAL_REQUESTS
  ): { limited: boolean; retryAfter?: number } {
    if (ip === "IP_UNRESOLVABLE") {
      return { limited: true, retryAfter: 60 };
    }

    const now = clock.now().getTime();

    // Capacity limit check prior to inserting a new key
    if (ipLimiterMap.size >= MAX_MAP_SIZE && !ipLimiterMap.has(ip)) {
      // Bounded rotating prune: check a maximum of 50 entries to avoid full map scanning DoS
      const keys = Array.from(ipLimiterMap.keys());
      const total = keys.length;
      const pruneLimit = 50;
      let checked = 0;
      const start = IPRateLimiter.pruneCursorIndex;

      for (let i = 0; i < total && checked < pruneLimit; i++) {
        const index = (start + i) % total;
        const key = keys[index];
        checked++;
        const timestamps = ipLimiterMap.get(key) || [];
        const active = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
        if (active.length === 0) {
          ipLimiterMap.delete(key);
        } else {
          ipLimiterMap.set(key, active);
        }
      }

      IPRateLimiter.pruneCursorIndex = (start + checked) % (total || 1);

      // Fail-closed if still at capacity and new IP is requested
      if (ipLimiterMap.size >= MAX_MAP_SIZE && !ipLimiterMap.has(ip)) {
        return { limited: true, retryAfter: 60 };
      }
    }

    const timestamps = ipLimiterMap.get(ip) || [];
    const activeTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

    if (activeTimestamps.length >= limit) {
      const oldestActive = activeTimestamps[0];
      const elapsed = now - oldestActive;
      const retryAfter = Math.max(1, Math.ceil((RATE_LIMIT_WINDOW_MS - elapsed) / 1000));
      return { limited: true, retryAfter };
    }

    activeTimestamps.push(now);
    ipLimiterMap.set(ip, activeTimestamps);
    return { limited: false };
  }

  static resetForIp(ip: string) {
    ipLimiterMap.delete(ip);
  }

  static resetAll() {
    ipLimiterMap.clear();
    IPRateLimiter.pruneCursorIndex = 0;
  }
}
