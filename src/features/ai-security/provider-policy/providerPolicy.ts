import { ApprovedProviderConfig } from "./approvedProviders";

export class ProviderPolicy {
  /**
   * Determine if an error is eligible for fallback based on error class.
   * Operational errors (timeouts, 429 quota, transient server errors) are eligible.
   * Safety refusals and authentication failures are NOT eligible.
   */
  static isOperationalError(error: any): boolean {
    if (!error) return false;
    const msg = typeof error === "string" ? error.toLowerCase() : (error.message || String(error)).toLowerCase();

    // 1. Safety refusal checks (prevent provider shopping)
    if (
      msg.includes("safety") ||
      msg.includes("blocked") ||
      msg.includes("refusal") ||
      msg.includes("candidate was blocked") ||
      msg.includes("violates policy")
    ) {
      return false;
    }

    // 2. Authentication/credential errors
    if (
      msg.includes("api key") ||
      msg.includes("invalid key") ||
      msg.includes("unauthorized") ||
      msg.includes("401") ||
      msg.includes("403")
    ) {
      return false;
    }

    // 3. Operational errors qualify
    if (
      msg.includes("429") ||
      msg.includes("quota") ||
      msg.includes("too many requests") ||
      msg.includes("500") ||
      msg.includes("503") ||
      msg.includes("timeout") ||
      msg.includes("deadline exceeded") ||
      msg.includes("network error") ||
      msg.includes("service unavailable")
    ) {
      return true;
    }

    return false;
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
