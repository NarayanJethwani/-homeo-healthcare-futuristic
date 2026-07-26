import crypto from "crypto";
import { GovernanceAuditEvent } from "../types/governanceTypes";

export interface HashChainedGovernanceAuditEvent extends GovernanceAuditEvent {
  previousEventHash: string;
  eventHash: string;
}

/**
 * Process-local append-only Audit Log Store (Foundation model)
 * Note: Process-local in-memory array. Restart durability and tamper-resistance require persistent DB storage in Phase 2.1.
 */
const AUDIT_LOG: HashChainedGovernanceAuditEvent[] = [];

/**
 * Computes a SHA-256 hash for an audit event chained to the previous event hash.
 */
function computeEventHash(event: GovernanceAuditEvent, previousEventHash: string): string {
  const payload = JSON.stringify({
    id: event.id,
    entityId: event.entityId,
    revisionId: event.revisionId,
    actorId: event.actorId,
    action: event.action,
    previousState: event.previousState,
    newState: event.newState,
    reason: event.reason,
    createdAt: event.createdAt,
    previousEventHash,
  });
  return crypto.createHash("sha256").update(payload).digest("hex");
}

/**
 * Records an append-only governance audit event with SHA-256 hash-chaining.
 */
export function recordGovernanceAuditEvent(
  event: GovernanceAuditEvent
): HashChainedGovernanceAuditEvent {
  const previousEventHash =
    AUDIT_LOG.length > 0 ? AUDIT_LOG[AUDIT_LOG.length - 1].eventHash : "GENESIS-AUDIT-HASH-000000";

  const createdAt = event.createdAt || new Date().toISOString();

  const tempEvent: GovernanceAuditEvent = {
    ...event,
    createdAt,
  };

  const eventHash = computeEventHash(tempEvent, previousEventHash);

  const hashChainedEvent: HashChainedGovernanceAuditEvent = {
    ...tempEvent,
    previousEventHash,
    eventHash,
  };

  AUDIT_LOG.push(hashChainedEvent);
  return hashChainedEvent;
}

/**
 * Retrieves all recorded governance audit events for a specific entity.
 */
export function getAuditEventsForEntity(entityId: string): HashChainedGovernanceAuditEvent[] {
  return AUDIT_LOG.filter((e) => e.entityId === entityId);
}

/**
 * Returns the complete append-only audit log.
 */
export function getFullAuditTrail(): HashChainedGovernanceAuditEvent[] {
  return [...AUDIT_LOG];
}

/**
 * Validates the cryptographic integrity of the process-local hash chain.
 */
export function verifyAuditTrailIntegrity(): { isChainValid: boolean; brokenIndex?: number } {
  let expectedPreviousHash = "GENESIS-AUDIT-HASH-000000";

  for (let i = 0; i < AUDIT_LOG.length; i++) {
    const entry = AUDIT_LOG[i];
    if (entry.previousEventHash !== expectedPreviousHash) {
      return { isChainValid: false, brokenIndex: i };
    }

    const recomputedHash = computeEventHash(entry, entry.previousEventHash);
    if (entry.eventHash !== recomputedHash) {
      return { isChainValid: false, brokenIndex: i };
    }

    expectedPreviousHash = entry.eventHash;
  }

  return { isChainValid: true };
}
