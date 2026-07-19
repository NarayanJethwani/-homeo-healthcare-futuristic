import { ApprovedProviderConfig } from "./approvedProviders";

export class ProviderPolicy {
  static classifyError(error: any): "provider_policy" | "provider_auth" | "provider_timeout" | "provider_rate_limited" | "provider_unavailable" | "unknown" {
    if (!error) return "unknown";
    const msg = typeof error === "string" ? error.toLowerCase() : (error.message || String(error)).toLowerCase();

    // 1. Safety refusal checks (prevent provider shopping)
    if (
      msg.includes("safety") ||
      msg.includes("blocked") ||
      msg.includes("refusal") ||
      msg.includes("candidate was blocked") ||
      msg.includes("violates policy")
    ) {
      return "provider_policy";
    }

    // 2. Authentication/credential errors
    if (
      msg.includes("api key") ||
      msg.includes("invalid key") ||
      msg.includes("unauthorized") ||
      msg.includes("401") ||
      msg.includes("403")
    ) {
      return "provider_auth";
    }

    // 3. Rate limiting/quota errors
    if (
      msg.includes("429") ||
      msg.includes("quota") ||
      msg.includes("too many requests")
    ) {
      return "provider_rate_limited";
    }

    // 4. Timeout/deadline exceeded
    if (
      msg.includes("timeout") ||
      msg.includes("deadline exceeded") ||
      error.name === "AbortError" ||
      error.message === "Timeout"
    ) {
      return "provider_timeout";
    }

    // 5. Server/Network availability
    if (
      msg.includes("500") ||
      msg.includes("503") ||
      msg.includes("network error") ||
      msg.includes("service unavailable") ||
      msg.includes("failed to fetch")
    ) {
      return "provider_unavailable";
    }

    return "unknown";
  }

  /**
   * Determine if an error is eligible for fallback based on error class.
   * Operational errors (timeouts, 429 quota, transient server errors) are eligible.
   * Safety refusals and authentication failures are NOT eligible.
   */
  static isOperationalError(error: any): boolean {
    const category = this.classifyError(error);
    return (
      category === "provider_timeout" ||
      category === "provider_rate_limited" ||
      category === "provider_unavailable"
    );
  }

  /**
   * Safe check incorporating error category, data classification class, and next candidate properties.
   */
  static shouldFallback(
    errorCategory: string,
    dataClass: "phi" | "non-phi",
    nextCandidate: ApprovedProviderConfig | null
  ): boolean {
    const operational = this.isOperationalError(errorCategory);
    if (!operational) return false;

    if (dataClass === "phi") {
      // Fallback is only allowed if the next candidate is active, approved, and zero-retention
      return (
        !!nextCandidate &&
        nextCandidate.phiApproved &&
        nextCandidate.dataRetention === "zero-retention" &&
        nextCandidate.status === "active"
      );
    }
    
    return true;
  }
}
