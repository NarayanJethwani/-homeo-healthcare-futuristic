import { getAdminDb } from "../firebaseAdmin";

export interface SecurityAuditEvent {
  userId: string;
  userEmail: string;
  userRole: string;
  action: string;
  resource: string;
  status: "success" | "denied" | "escalation-warning";
  timestamp: string;
  details?: any;
}

// In-memory fallback repository for security audit logs
export const memorySecurityAuditLogs: SecurityAuditEvent[] = [];

/**
 * Logs a security event dynamically. Attempts Firestore write first,
 * falling back to memory and console output if offline or unconfigured.
 */
export async function logSecurityEvent(event: SecurityAuditEvent): Promise<boolean> {
  console.log(`[Security Audit Log] Action: ${event.action}, User: ${event.userEmail}, Status: ${event.status}`);
  
  // Save in-memory
  memorySecurityAuditLogs.push(event);

  try {
    const db = getAdminDb();
    if (db) {
      await db.collection("security_audit_logs").add({
        ...event,
        recordedAt: new Date().toISOString()
      });
      return true;
    }
  } catch (err: any) {
    console.warn("[Security Audit Log] Firestore write failed, falling back to memory:", err?.message || err);
  }
  return false;
}
