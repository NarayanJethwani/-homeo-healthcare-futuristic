import { EDITORIAL_RECORDS_REGISTRY, SYSTEM_SOURCES_REGISTRY } from './editorialRegistry';

export interface QualityValidationReport {
  isValid: boolean;
  issues: string[];
}

export class EditorialValidator {
  /**
   * Evaluates versioned records and legal metadata sources to flag QA infractions.
   */
  public static validateRegistry(): QualityValidationReport {
    const issues: string[] = [];
    const seenPearlIds = new Set<string>();
    const seenEvidenceIds = new Set<string>();

    for (const [remedyId, records] of Object.entries(EDITORIAL_RECORDS_REGISTRY)) {
      if (!records || records.length === 0) {
        issues.push(`Remedy [${remedyId}] contains no editorial history records.`);
        continue;
      }

      for (const rec of records) {
        // 1. Check source validity
        if (!rec.sourceId) {
          issues.push(`Record [${rec.id}] for remedy [${remedyId}] lacks a source ID.`);
        } else if (!SYSTEM_SOURCES_REGISTRY[rec.sourceId]) {
          issues.push(`Record [${rec.id}] references unknown source ID [${rec.sourceId}].`);
        }

        // 2. Duplicate checking
        for (const pearlId of rec.clinicalPearlsIds) {
          if (seenPearlIds.has(pearlId)) {
            issues.push(`Duplicate mapping: Clinical pearl [${pearlId}] is linked multiple times.`);
          }
          seenPearlIds.add(pearlId);
        }

        for (const evId of rec.evidenceItemsIds) {
          if (seenEvidenceIds.has(evId)) {
            issues.push(`Duplicate mapping: Evidence item [${evId}] is linked multiple times.`);
          }
          seenEvidenceIds.add(evId);
        }

        // 3. Status conflicts
        if (rec.currentStatus === 'Verified' && rec.approvals.length === 0) {
          issues.push(`Status conflict: Record [${rec.id}] is marked Verified but has no approvals list.`);
        }

        // 4. Incomplete metadata
        if (rec.revisionHistory.length === 0) {
          issues.push(`Incomplete metadata: Record [${rec.id}] has no revision history logs.`);
        } else {
          for (const rev of rec.revisionHistory) {
            if (!rev.version) {
              issues.push(`Record [${rec.id}] contains a revision missing its version code.`);
            }
            if (!rev.changeLog || rev.changeLog.trim() === '') {
              issues.push(`Record [${rec.id}] revision [${rev.version}] contains an empty change log.`);
            }
          }
        }
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}
