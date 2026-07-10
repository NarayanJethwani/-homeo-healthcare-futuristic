// Reviewed lab context is informational and must not alter scoring or prescribing logic.

import { getReviewedLabsForPatient } from "./labRepository";
import { ReviewedLabResult } from "./types";

export interface ClinicalLabContext {
  patientId: string;
  results: ReviewedLabResult[];
  hasAbnormalResults: boolean;
}

/**
 * Returns read-only reviewed lab results for the patient to be shown in Clinical OS.
 * Excludes pending-review and rejected results.
 */
export async function getReviewedLabContextForClinicalOS(patientId: string): Promise<ClinicalLabContext> {
  const results = await getReviewedLabsForPatient(patientId);

  // Exclude pending-review and rejected results
  const filtered = results.filter(
    r => r.reviewStatus === "clinician-confirmed" || r.reviewStatus === "corrected"
  );

  const hasAbnormal = filtered.some(
    r => r.flag === "low" || r.flag === "high" || r.flag === "critical"
  );

  return {
    patientId,
    results: filtered,
    hasAbnormalResults: hasAbnormal
  };
}

/**
 * Returns read-only informational warning strings for any abnormal ranges.
 * Excludes pending-review and rejected results.
 */
export async function getReviewedLabWarnings(patientId: string): Promise<string[]> {
  const results = await getReviewedLabsForPatient(patientId);

  // Exclude pending-review and rejected results
  const filtered = results.filter(
    r => (r.reviewStatus === "clinician-confirmed" || r.reviewStatus === "corrected") &&
         (r.flag === "low" || r.flag === "high" || r.flag === "critical")
  );

  return filtered.map(r => {
    const valStr = `${r.value}${r.unit ? ` ${r.unit}` : ""}`;
    const rangeStr = r.referenceRange ? ` (Ref: ${r.referenceRange})` : "";
    return `Abnormal Lab: ${r.testName} is ${r.flag.toUpperCase()} at ${valStr}${rangeStr} - Clinician Reviewed`;
  });
}
