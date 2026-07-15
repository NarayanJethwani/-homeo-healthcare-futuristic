import { logSecurityEvent } from "@/lib/security/auditLogger";
import { centralKeyedHmac } from "../config/serverConfig";

export type AIAuditErrorCode =
  | "CORS_BLOCKED"
  | "RATE_LIMITED"
  | "PROMPT_INJECTION"
  | "CRISIS_TRIGGERED"
  | "UNAUTHORIZED"
  | "BAD_REQUEST"
  | "INTERNAL_ERROR"
  | "PROVIDER_FAILURE"
  | "SUCCESS"
  | "OUTPUT_BLOCKED"
  | "LEASE_ERROR"
  | "TIMEOUT"
  | "ORPHANED_PROVIDER"
  | "none";

export type AIAuditMetadata = {
  eventType: string;
  correlationId: string;
  actorId?: string;
  organizationId?: string;
  provider?: string;
  decision: "success" | "denied";
  errorCode?: AIAuditErrorCode;
  latencyBucket?: string;
};

export class AIAuditLogger {
  static async logEvent(metadata: AIAuditMetadata) {
    const actorHash = centralKeyedHmac(metadata.actorId, "actor");
    const organizationHash = centralKeyedHmac(metadata.organizationId, "organization");

    const eventDetails = {
      eventType: metadata.eventType,
      correlationId: metadata.correlationId,
      actorHash,
      organizationHash,
      provider: metadata.provider || "none",
      decision: metadata.decision,
      errorCode: metadata.errorCode || "none",
      latencyBucket: metadata.latencyBucket || "none"
    };

    try {
      await logSecurityEvent({
        userId: actorHash,
        userEmail: "sanitized@homeo.healthcare",
        userRole: "sanitized",
        action: `ai_router_${metadata.eventType}`,
        resource: "/api/consult-ai",
        status: metadata.decision === "success" ? "success" : "denied",
        timestamp: new Date().toISOString(),
        details: eventDetails
      });
    } catch (err) {
      console.error(
        JSON.stringify({
          logLevel: "error",
          message: "AI Router Security audit logging failed.",
          fallbackEvent: eventDetails
        })
      );
    }
  }
}
