const ipLimiterMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_LOCAL_REQUESTS = 5; // Local burst rate limit for degraded mode
const MAX_MAP_SIZE = 1000;

/**
 * Bounded In-Memory Local Rate Limiter for degraded/fallback mode.
 * Enforces strict map size capping to prevent OOM and computes Retry-After seconds.
 */
export class IPRateLimiter {
  static isRateLimited(
    ip: string, 
    clock: { now: () => Date } = { now: () => new Date() },
    limit: number = MAX_LOCAL_REQUESTS
  ): { limited: boolean; retryAfter?: number } {
    if (ip === "IP_UNRESOLVABLE") {
      return { limited: true, retryAfter: 60 };
    }

    const now = clock.now().getTime();

    // Auto-prune memory leak guard
    if (ipLimiterMap.size > MAX_MAP_SIZE) {
      for (const [key, timestamps] of ipLimiterMap.entries()) {
        const active = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
        if (active.length === 0) {
          ipLimiterMap.delete(key);
        } else {
          ipLimiterMap.set(key, active);
        }
      }

      // If still exceeding size limit, refuse new entries (fail closed)
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
}
