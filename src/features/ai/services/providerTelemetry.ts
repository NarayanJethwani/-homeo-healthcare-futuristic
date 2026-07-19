export interface ProviderTelemetryDTO {
  schemaVersion: "1.0.0";
  scope: "instance-local";
  resettable: true;
  readiness: {
    ollama: "Unknown" | "Healthy" | "Degraded" | "Offline";
  };
  providerAttempts: {
    total: number;
    success: number;
    failed: number;
  };
  failuresByCategory: {
    provider_timeout: number;
    provider_rate_limited: number;
    provider_auth: number;
    provider_policy: number;
    provider_unavailable: number;
    unknown: number;
  };
  latencyBuckets: {
    under_1s: number;
    "1_to_3s": number;
    "3_to_5s": number;
    "5_to_10s": number;
    over_10s: number;
  };
  embeddings: {
    operations: number;
    failures: number;
  };
  cache: {
    hits: number;
    misses: number;
  };
}

export type TelemetryFailureCategory =
  | "provider_timeout"
  | "provider_rate_limited"
  | "provider_auth"
  | "provider_policy"
  | "provider_unavailable"
  | "unknown";

export class ProviderTelemetryService {
  private ollamaReadiness: "Unknown" | "Healthy" | "Degraded" | "Offline" = "Unknown";
  private totalAttempts = 0;
  private successAttempts = 0;
  private failedAttempts = 0;

  private provider_timeout = 0;
  private provider_rate_limited = 0;
  private provider_auth = 0;
  private provider_policy = 0;
  private provider_unavailable = 0;
  private unknown = 0;

  private under_1s = 0;
  private bucket_1_to_3s = 0;
  private bucket_3_to_5s = 0;
  private bucket_5_to_10s = 0;
  private over_10s = 0;

  private embeddingOperations = 0;
  private embeddingFailures = 0;

  private cacheHits = 0;
  private cacheMisses = 0;

  private saturateIncrement(val: number): number {
    return val >= Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : val + 1;
  }

  reset(): void {
    try {
      this.ollamaReadiness = "Unknown";
      this.totalAttempts = 0;
      this.successAttempts = 0;
      this.failedAttempts = 0;

      this.provider_timeout = 0;
      this.provider_rate_limited = 0;
      this.provider_auth = 0;
      this.provider_policy = 0;
      this.provider_unavailable = 0;
      this.unknown = 0;

      this.under_1s = 0;
      this.bucket_1_to_3s = 0;
      this.bucket_3_to_5s = 0;
      this.bucket_5_to_10s = 0;
      this.over_10s = 0;

      this.embeddingOperations = 0;
      this.embeddingFailures = 0;

      this.cacheHits = 0;
      this.cacheMisses = 0;
    } catch {
      // Safe no-throw
    }
  }

  recordCacheOutcome(outcome: "hit" | "miss"): void {
    try {
      if (outcome === "hit") {
        this.cacheHits = this.saturateIncrement(this.cacheHits);
      } else {
        this.cacheMisses = this.saturateIncrement(this.cacheMisses);
      }
    } catch {
      // Safe no-throw
    }
  }

  recordEmbeddingOutcome(outcome: "success" | "failed"): void {
    try {
      this.embeddingOperations = this.saturateIncrement(this.embeddingOperations);
      if (outcome === "failed") {
        this.embeddingFailures = this.saturateIncrement(this.embeddingFailures);
      }
    } catch {
      // Safe no-throw
    }
  }

  recordReadiness(state: "Unknown" | "Healthy" | "Degraded" | "Offline"): void {
    try {
      this.ollamaReadiness = state;
    } catch {
      // Safe no-throw
    }
  }

  recordProviderAttempt(
    outcome: "success" | "failed",
    latencyMs: number,
    failureCategory?: TelemetryFailureCategory
  ): void {
    try {
      // 1. Increment attempts total
      this.totalAttempts = this.saturateIncrement(this.totalAttempts);

      if (outcome === "success") {
        this.successAttempts = this.saturateIncrement(this.successAttempts);
      } else {
        this.failedAttempts = this.saturateIncrement(this.failedAttempts);

        const category = failureCategory || "unknown";
        switch (category) {
          case "provider_timeout":
            this.provider_timeout = this.saturateIncrement(this.provider_timeout);
            break;
          case "provider_rate_limited":
            this.provider_rate_limited = this.saturateIncrement(this.provider_rate_limited);
            break;
          case "provider_auth":
            this.provider_auth = this.saturateIncrement(this.provider_auth);
            break;
          case "provider_policy":
            this.provider_policy = this.saturateIncrement(this.provider_policy);
            break;
          case "provider_unavailable":
            this.provider_unavailable = this.saturateIncrement(this.provider_unavailable);
            break;
          case "unknown":
          default:
            this.unknown = this.saturateIncrement(this.unknown);
            break;
        }
      }

      // 2. Latency bucketing (only if valid)
      if (typeof latencyMs === "number" && isFinite(latencyMs) && latencyMs >= 0) {
        if (latencyMs < 1000) {
          this.under_1s = this.saturateIncrement(this.under_1s);
        } else if (latencyMs < 3000) {
          this.bucket_1_to_3s = this.saturateIncrement(this.bucket_1_to_3s);
        } else if (latencyMs < 5000) {
          this.bucket_3_to_5s = this.saturateIncrement(this.bucket_3_to_5s);
        } else if (latencyMs < 10000) {
          this.bucket_5_to_10s = this.saturateIncrement(this.bucket_5_to_10s);
        } else {
          this.over_10s = this.saturateIncrement(this.over_10s);
        }
      }
    } catch {
      // Safe no-throw
    }
  }

  getMetricsDTO(): ProviderTelemetryDTO {
    // Return a fresh strict DTO built property-by-property to prevent consumer mutations from affecting internal state
    return {
      schemaVersion: "1.0.0",
      scope: "instance-local",
      resettable: true,
      readiness: {
        ollama: this.ollamaReadiness
      },
      providerAttempts: {
        total: this.totalAttempts,
        success: this.successAttempts,
        failed: this.failedAttempts
      },
      failuresByCategory: {
        provider_timeout: this.provider_timeout,
        provider_rate_limited: this.provider_rate_limited,
        provider_auth: this.provider_auth,
        provider_policy: this.provider_policy,
        provider_unavailable: this.provider_unavailable,
        unknown: this.unknown
      },
      latencyBuckets: {
        under_1s: this.under_1s,
        "1_to_3s": this.bucket_1_to_3s,
        "3_to_5s": this.bucket_3_to_5s,
        "5_to_10s": this.bucket_5_to_10s,
        over_10s: this.over_10s
      },
      embeddings: {
        operations: this.embeddingOperations,
        failures: this.embeddingFailures
      },
      cache: {
        hits: this.cacheHits,
        misses: this.cacheMisses
      }
    };
  }
}

export const providerTelemetryService = new ProviderTelemetryService();
