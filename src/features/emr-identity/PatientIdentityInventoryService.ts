import { reconcilePatientIdentitiesDryRun } from "./PatientIdentityReconciliationService";
import {
  PatientIdentityCandidate,
  PatientIdentityInventoryReport,
  PatientLinkedRecordReference,
  PatientPortalLinkReference,
} from "./types";

export interface PatientIdentityInventorySnapshot {
  patients: PatientIdentityCandidate[];
  portalLinks: PatientPortalLinkReference[];
  linkedRecords: PatientLinkedRecordReference[];
  truncatedCollections?: string[];
}

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

/**
 * Summarizes identity integrity without returning demographics or clinical
 * values. The report contains only counts and reconciliation issue keys.
 */
export function buildPatientIdentityInventoryReport(
  snapshot: PatientIdentityInventorySnapshot,
  generatedAt = new Date().toISOString(),
): PatientIdentityInventoryReport {
  const patientIds = new Set(snapshot.patients.map(patient => patient.sourcePatientId));
  const linkedRecordCountsByCollection: Record<string, number> = {};
  const orphanedRecordCountsByCollection: Record<string, number> = {};
  let orphanedLinkedRecordCount = 0;

  for (const record of snapshot.linkedRecords) {
    increment(linkedRecordCountsByCollection, record.collection);
    if (!record.patientId || !patientIds.has(record.patientId)) {
      orphanedLinkedRecordCount += 1;
      increment(orphanedRecordCountsByCollection, record.collection);
    }
  }

  const invalidPortalLinkCount = snapshot.portalLinks.filter(link =>
    !link.patientId || !patientIds.has(link.patientId)
  ).length;

  return {
    mode: "read-only-inventory",
    generatedAt,
    patientCount: snapshot.patients.length,
    portalLinkCount: snapshot.portalLinks.length,
    invalidPortalLinkCount,
    linkedRecordCount: snapshot.linkedRecords.length,
    orphanedLinkedRecordCount,
    linkedRecordCountsByCollection,
    orphanedRecordCountsByCollection,
    truncatedCollections: [...new Set(snapshot.truncatedCollections ?? [])].sort(),
    reconciliation: reconcilePatientIdentitiesDryRun(snapshot.patients, generatedAt),
    writeCount: 0,
  };
}
