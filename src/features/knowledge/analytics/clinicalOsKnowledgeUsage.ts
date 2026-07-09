/**
 * Safe Telemetry Adapter for tracking Knowledge Platform usage inside practitioner-facing Clinical OS.
 * Enforces strict HIPAA privacy compliance:
 * - NO Patient IDs
 * - NO Case/Timeline IDs
 * - NO Prescription texts or dosage specifications
 * - NO Clinical notes or symptom free-text details
 * - NO Practitioner identifying info
 * - ONLY entity-level aggregate metadata counts (e.g. sulphur page viewed, acid-reflux linked)
 */

export interface ClinicalOsUsageEvent {
  entityId: string;
  entityType: "remedy" | "disease" | "symptom" | "lab-test";
  action: "hover" | "click" | "context-lookup";
  timestamp: string; // ISO string
}

const memoryUsageStore: ClinicalOsUsageEvent[] = [];

/**
 * Tracks an aggregate usage event safely, stripping any case or patient contexts.
 * Returns true if logged successfully, false if ignored.
 */
export function trackClinicalOsKnowledgeUsage(event: Omit<ClinicalOsUsageEvent, "timestamp">): boolean {
  try {
    const safeEvent: ClinicalOsUsageEvent = {
      entityId: event.entityId.toLowerCase().trim(),
      entityType: event.entityType,
      action: event.action,
      timestamp: new Date().toISOString()
    };

    // Store in-memory aggregate log
    memoryUsageStore.push(safeEvent);
    if (memoryUsageStore.length > 1000) {
      memoryUsageStore.shift();
    }

    // TODO: Write aggregate increment to Firestore collection 'clinical_os_usage_counts'
    // db.collection('clinical_os_usage_counts').doc(safeEvent.entityId).set({
    //   entityId: safeEvent.entityId,
    //   entityType: safeEvent.entityType,
    //   views: admin.firestore.FieldValue.increment(1)
    // }, { merge: true })

    console.log(`[Clinical OS Telemetry] Aggregate logged: ${safeEvent.action} on ${safeEvent.entityType} (${safeEvent.entityId})`);
    return true;
  } catch (err) {
    console.error("Clinical OS Telemetry: failed to track usage safely:", err);
    return false;
  }
}

/**
 * Retrieves aggregate view/action counts for a specific entity ID.
 */
export function getEntityOsUsageCounts(entityId: string): { views: number; hovers: number } {
  const normalized = entityId.toLowerCase().trim();
  const events = memoryUsageStore.filter(e => e.entityId === normalized);
  return {
    views: events.filter(e => e.action === "click" || e.action === "context-lookup").length,
    hovers: events.filter(e => e.action === "hover").length
  };
}

/**
 * Clears the in-memory usage telemetry buffer safely.
 */
export function clearClinicalOsUsageCache(): void {
  memoryUsageStore.length = 0;
}
