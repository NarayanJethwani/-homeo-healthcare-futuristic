import { EDITORIAL_RECORDS_REGISTRY, SYSTEM_SOURCES_REGISTRY } from './editorialRegistry';
import { JETHWANI_EVIDENCE_REGISTRY } from '../knowledge/evidenceRegistry';

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

    // 1. Audit Editorial records
    for (const [remedyId, records] of Object.entries(EDITORIAL_RECORDS_REGISTRY)) {
      if (!records || records.length === 0) {
        issues.push(`Remedy [${remedyId}] contains no editorial history records.`);
        continue;
      }

      for (const rec of records) {
        // Check source validity
        if (!rec.sourceId) {
          issues.push(`Record [${rec.id}] for remedy [${remedyId}] lacks a source ID.`);
        } else if (!SYSTEM_SOURCES_REGISTRY[rec.sourceId]) {
          issues.push(`Record [${rec.id}] references unknown source ID [${rec.sourceId}].`);
        }

        // Duplicate checking
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

        // Status conflicts
        if (rec.currentStatus === 'Verified' && rec.approvals.length === 0) {
          issues.push(`Status conflict: Record [${rec.id}] is marked Verified but has no approvals list.`);
        }

        // Incomplete metadata
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

    // 2. Audit Evidence registry for confidence policies and relationship integrity
    for (const [remedyId, record] of Object.entries(JETHWANI_EVIDENCE_REGISTRY)) {
      // Low confidence check
      for (const item of record.evidenceItems) {
        if (item.confidence < 80) {
          issues.push(`Low confidence alert: Evidence [${item.id}] for remedy [${remedyId}] has confidence ${item.confidence}% (policy requires >= 80%).`);
        }
      }

      // Relationship conflicts check
      const complementary = new Set<string>();
      const antagonistic = new Set<string>();

      for (const rel of record.remedyRelations) {
        const parts = rel.split(' ');
        const targetId = parts[0];

        // Self-relationship check
        if (targetId === remedyId) {
          issues.push(`Conflicting relationship: Remedy [${remedyId}] cannot have relationship with itself.`);
        }

        if (rel.toLowerCase().includes('complementary')) {
          complementary.add(targetId);
        } else if (rel.toLowerCase().includes('antidote') || rel.toLowerCase().includes('inimical')) {
          antagonistic.add(targetId);
        }
      }

      // Intersection check (remedy complementary and antidote at the same time)
      for (const target of complementary) {
        if (antagonistic.has(target)) {
          issues.push(`Relationship conflict: Remedy [${remedyId}] cannot be both complementary and antagonistic to [${target}].`);
        }
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}
