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

const REDACTED_KEYS = [
  "password", "token", "cookie", "authorization", "apikey", "api_key", "secret",
  "credential", "session", "signature", "privatekey", "accesstoken", "refreshtoken", "idtoken",
  "patient", "patientname", "name", "dob", "dateofbirth", "ssn", "phone", "email",
  "address", "caseid", "casenumber", "chartid", "complaint", "symptom", "symptoms",
  "diagnosis", "prescription", "notes", "clinicalnote"
];

function shouldRedactKey(key: string): boolean {
  const normalizedKey = key.toLowerCase();
  return REDACTED_KEYS.some(k => normalizedKey.includes(k));
}

function sanitizeStringValue(val: string): string {
  let str = val;

  // 1. JWT/obvious token pattern
  str = str.replace(/eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g, "[REDACTED]");
  
  // 2. Email pattern
  str = str.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED]");
  
  // 3. Phone pattern
  str = str.replace(/(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g, "[REDACTED]");
  
  // 4. SSN-like values
  str = str.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED]");
  
  // 5. DOB patterns (YYYY-MM-DD, MM/DD/YYYY, etc.)
  str = str.replace(/\b(?:\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b/g, "[REDACTED]");
  
  // 6. Case/chart ID patterns
  str = str.replace(/\b[A-Za-z]{2,4}-\d{3,6}\b/g, "[REDACTED]");

  // 7. Cookie-like or key=value strings
  if (str.includes("=") && str.includes(";")) {
    str = "[REDACTED]";
  }

  // 8. Truncate long strings
  if (str.length > 200) {
    str = str.slice(0, 100) + "... [TRUNCATED]";
  }

  return str;
}

/**
 * Recursively sanitizes any audit payload, stripping credential keys, PHI keys, and matching patterns.
 */
export function sanitizeAuditPayload(input: unknown): unknown {
  try {
    if (input === null || input === undefined) {
      return input;
    }

    if (typeof input === "string") {
      return sanitizeStringValue(input);
    }

    if (typeof input === "number" || typeof input === "boolean") {
      return input;
    }

    if (Array.isArray(input)) {
      return input.map(item => sanitizeAuditPayload(item));
    }

    if (typeof input === "object") {
      const obj = input as Record<string, unknown>;
      const sanitized: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(obj)) {
        if (shouldRedactKey(key)) {
          sanitized[key] = "[REDACTED]";
        } else {
          sanitized[key] = sanitizeAuditPayload(value);
        }
      }
      return sanitized;
    }

    // Drop unsafe/unrecognized types (like functions, symbols)
    return undefined;
  } catch {
    return "[MALFORMED_PAYLOAD]";
  }
}

/**
 * Flatten audit data into flat key-value pairs suitable for simple log systems,
 * dropping nested values that cannot be safely flattened.
 */
export function sanitizeAuditMetadata(input: unknown): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};
  
  try {
    const sanitized = sanitizeAuditPayload(input);
    
    function flatten(obj: unknown, prefix = "") {
      if (obj === null || obj === undefined) return;
      
      if (typeof obj !== "object") {
        const key = prefix || "value";
        if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
          result[key] = obj;
        }
        return;
      }
      
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          flatten(item, prefix ? `${prefix}_${index}` : `${index}`);
        });
        return;
      }
      
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        const nextKey = prefix ? `${prefix}_${key}` : key;
        if (value === null || value === undefined) {
          continue;
        }
        if (typeof value === "object") {
          flatten(value, nextKey);
        } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          result[nextKey] = value;
        }
      }
    }

    flatten(sanitized);
  } catch {
    result["error"] = "Sanitization failed";
  }
  
  return result;
}

/**
 * Logs a security event dynamically. Attempts Firestore write first,
 * falling back to memory and console output if offline or unconfigured.
 */
export async function logSecurityEvent(event: SecurityAuditEvent): Promise<boolean> {
  try {
    const sanitizedDetails = event.details ? sanitizeAuditPayload(event.details) : undefined;
    const sanitizedResource = typeof event.resource === "string" ? sanitizeStringValue(event.resource) : event.resource;
    const sanitizedAction = typeof event.action === "string" ? sanitizeStringValue(event.action) : event.action;

    const sanitizedEvent: SecurityAuditEvent = {
      ...event,
      action: sanitizedAction,
      resource: sanitizedResource,
      details: sanitizedDetails
    };

    console.log(`[Security Audit Log] Action: ${sanitizedEvent.action}, User: ${sanitizedEvent.userEmail}, Status: ${sanitizedEvent.status}`);
    
    // Save in-memory
    memorySecurityAuditLogs.push(sanitizedEvent);

    try {
      const db = getAdminDb();
      if (db) {
        await db.collection("security_audit_logs").add({
          ...sanitizedEvent,
          recordedAt: new Date().toISOString()
        });
        return true;
      }
    } catch (err: any) {
      console.warn("[Security Audit Log] Firestore write failed, falling back to memory:", err?.message || err);
    }
  } catch (err: any) {
    console.error("[Security Audit Log] Critical formatting failure during logging:", err);
  }
  return false;
}
