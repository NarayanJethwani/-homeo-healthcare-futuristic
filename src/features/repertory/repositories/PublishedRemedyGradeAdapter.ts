import { PublishedCorpusRepository } from "./PublishedCorpusRepository";
import { RemedyGradeRepository } from "./RemedyGradeRepository";
import {
  CursorPageRequest,
  RetrievalResult
} from "./RepertoryRetrievalRepository";
import {
  RubricRemedyGradeView,
  RubricRemedyGradeId,
  RubricRemedyGrade,
  RepertoryRemedyRecord,
  RemedyRecordId,
  RemedyConceptId,
  GradeRecordState,
  EditorialStatus,
  GradeSourceProvenance,
  GradeExtractionProvenance,
  RemedyMappingProvenance
} from "../types/remedyTypes";
import {
  RepertoryAccessContext,
  RubricRecordId,
  RepertorySourceId,
  RepertoryEditionId,
  RubricConceptId
} from "../types/repertoryTypes";
import { resolveRemedyConceptByAbbreviation } from "../../remedy-registry/remedyConceptRegistry";
import { getGradingSystem } from "../grading/GradingSystemRegistry";

export class PublishedRemedyGradeAdapter implements RemedyGradeRepository {
  private mapSourceId(editionId: string): RepertorySourceId {
    if (editionId.startsWith("kent")) return "kent" as RepertorySourceId;
    if (editionId.startsWith("boericke")) return "boericke" as RepertorySourceId;
    return editionId.split("_")[0] as RepertorySourceId;
  }

  async getRemediesForRubric(
    context: RepertoryAccessContext,
    rubricRecordId: RubricRecordId,
    page: CursorPageRequest
  ): Promise<RetrievalResult<RubricRemedyGradeView>> {
    const version = await PublishedCorpusRepository.getActiveVersion();
    const rubric = await PublishedCorpusRepository.getRubricById(rubricRecordId);
    if (!rubric) {
      return { items: [], hasNextPage: false, sourceVersion: version };
    }

    const editionId = (rubric.sourceId || "kent_1908") as RepertoryEditionId;
    const sourceId = this.mapSourceId(editionId);

    // Extract remedy entries
    const rawEntries = rubric.remedyEntries || [];
    const views: RubricRemedyGradeView[] = [];

    // Track duplicate and conflict detection
    const seenAbbrs = new Map<string, { grade: RubricRemedyGrade; viewIndex: number }[]>();

    for (let idx = 0; idx < rawEntries.length; idx++) {
      const entry = rawEntries[idx];
      const abbr = entry.sourceAbbreviation || entry.remedyId;
      const cleanAbbr = abbr.trim();
      const remedyRecordId = `rec_${editionId}_${cleanAbbr}` as RemedyRecordId;
      const gradeId = `grade_${rubricRecordId}_${cleanAbbr}_${idx}` as RubricRemedyGradeId;

      // Deterministic and context-aware remedy resolution
      const resolution = resolveRemedyConceptByAbbreviation(cleanAbbr, { sourceId, editionId });
      let conceptId = "unresolved" as RemedyConceptId;
      let mappingStatus: "verified" | "provisional" | "unresolved" | "conflicted" = "unresolved";
      let mappingConfidence: "verified" | "reviewed" | "probable" | "manual" | "unknown" = "unknown";
      let mappingMethod: "editorial_exact" | "edition_registry" | "manual_review" | "provisional_normalization" = "provisional_normalization";
      let conceptMatch: any = null;

      if (resolution.status === "resolved") {
        conceptMatch = resolution.concept;
        conceptId = resolution.concept.id;
        mappingStatus = "verified";
        mappingConfidence = "verified";
        mappingMethod = resolution.mapping.aliasType === "source_abbreviation" ? "edition_registry" : "editorial_exact";
      } else if (resolution.status === "ambiguous") {
        mappingStatus = "conflicted";
        mappingConfidence = "unknown";
        mappingMethod = "manual_review";
      }

      // Mapping Provenance
      const mappingProvenance: RemedyMappingProvenance = {
        mappingMethod,
        mappingRuleVersion: "1.0.0",
        mappedBy: "system-resolver",
        mappedAt: new Date().toISOString(),
        mappingNotes: resolution.status === "ambiguous" ? `Ambiguous matching candidates: ${resolution.candidates.map(c => c.canonicalName).join(", ")}` : undefined
      };

      const remedyRecord: RepertoryRemedyRecord = {
        id: remedyRecordId,
        conceptId,
        editionId,
        sourceAbbreviation: cleanAbbr,
        sourceDisplayName: conceptMatch?.canonicalName,
        mappingStatus,
        mappingConfidence,
        provenance: mappingProvenance
      };

      // Grading system normalization
      const gradingSystemId = entry.gradeSystemId || (sourceId === "kent" ? "kent_3_grade" : "boericke_3_grade");
      const gradingSystem = getGradingSystem(gradingSystemId);

      const originalGrade = String(entry.sourceGrade || "1");
      let normalizedGrade: number | undefined;
      let ruleId = "default";
      let ruleVersion = "1.0.0";
      let gradingInvalid = false;
      let gradingInvalidReason = "";

      if (gradingSystem) {
        const normResult = gradingSystem.normalize(originalGrade);
        if (normResult.status === "normalized") {
          normalizedGrade = normResult.normalizedGrade;
          ruleId = normResult.ruleId;
          ruleVersion = normResult.ruleVersion;
        } else {
          gradingInvalid = true;
          gradingInvalidReason = normResult.reason;
        }
      } else {
        gradingInvalid = true;
        gradingInvalidReason = `Grading system '${gradingSystemId}' not found in registry`;
      }

      // Decoupled provenances
      const sourceProvenance: GradeSourceProvenance = {
        sourceId,
        editionId,
        corpusVersion: version,
        printing: "First Edition",
        publicationYear: sourceId === "kent" ? 1908 : 1927,
        page: rubric.pageStart ? String(rubric.pageStart) : undefined,
        column: "1",
        paragraph: "1",
        sourceLocation: rubric.sourceCitation
      };

      const extractionProvenance: GradeExtractionProvenance = {
        extractionMethod: "verified_import",
        extractionVersion: "1.0.0",
        extractedAt: new Date().toISOString(),
        extractedBy: "clinical-auditor",
        ocrEngineVersion: "N/A"
      };

      // Duplicate and conflict state logic (NO auto-selection by maximum)
      let gradeState: GradeRecordState = "active";
      let hasConflict = false;
      let conflictDetails: string | undefined;

      if (gradingInvalid) {
        gradeState = "disputed";
        hasConflict = true;
        conflictDetails = gradingInvalidReason;
      }

      const prevList = seenAbbrs.get(cleanAbbr);
      if (prevList) {
        hasConflict = true;
        for (const prev of prevList) {
          if (prev.grade.originalGrade === originalGrade) {
            gradeState = "duplicate_exact";
            conflictDetails = `Exact duplicate record detected for abbreviation: ${cleanAbbr}`;
          } else {
            gradeState = "conflicted";
            conflictDetails = `Conflicting grades detected for ${cleanAbbr}: '${prev.grade.originalGrade}' vs '${originalGrade}'`;
            // Mark the previous item in the view list as conflicted as well
            views[prev.viewIndex].grade.gradeState = "conflicted";
            views[prev.viewIndex].hasConflict = true;
            views[prev.viewIndex].conflictDetails = conflictDetails;
          }
        }
      }

      const grade: RubricRemedyGrade = {
        id: gradeId,
        rubricRecordId,
        rubricConceptId: (rubric.canonicalConceptId || rubricRecordId) as RubricConceptId,
        remedyRecordId,
        remedyConceptId: conceptId,
        originalGrade,
        sourceGrade: originalGrade, // Deprecated compatibility field
        normalizedGrade,
        gradingSystemId,
        gradingSystemVersion: gradingSystem?.version || "1.0.0",
        gradeState,
        editorialStatuses: [gradeState === "conflicted" ? "conflicted" : "imported"],
        sourceProvenance,
        extractionProvenance,
        mappingProvenance
      };

      // Register this instance in our tracking map
      const currentTrack = { grade, viewIndex: views.length };
      if (prevList) {
        prevList.push(currentTrack);
      } else {
        seenAbbrs.set(cleanAbbr, [currentTrack]);
      }

      views.push({
        grade,
        remedyRecord,
        remedyConcept: conceptMatch || undefined,
        hasConflict,
        conflictDetails,
        presenceState: "recorded"
      });
    }

    // Pagination
    const limit = page.limit || 50;
    let offset = 0;
    if (page.position !== undefined) {
      offset = parseInt(String(page.position), 10) || 0;
    }

    const totalCount = views.length;
    const items = views.slice(offset, offset + limit);
    const hasNextPage = offset + limit < totalCount;

    return {
      items,
      hasNextPage,
      nextPosition: hasNextPage ? offset + limit : undefined,
      totalCount,
      sourceVersion: version
    };
  }

  async getGradeById(
    context: RepertoryAccessContext,
    gradeId: RubricRemedyGradeId
  ): Promise<RubricRemedyGradeView | null> {
    // Extract rubric ID and abbreviation from gradeId (format: grade_${rubricId}_${remedyAbbr}_${idx})
    const parts = gradeId.split("_");
    if (parts.length < 4) return null;

    const rubricId = parts.slice(1, parts.length - 2).join("_") as RubricRecordId;
    const res = await this.getRemediesForRubric(context, rubricId, { limit: 1000 });
    const match = res.items.find(v => v.grade.id === gradeId);
    return match || null;
  }

  async getRemedyRecord(
    context: RepertoryAccessContext,
    remedyRecordId: RemedyRecordId
  ): Promise<RepertoryRemedyRecord | null> {
    // Format: rec_${editionId}_${abbr}
    const parts = remedyRecordId.split("_");
    if (parts.length < 3) return null;

    const abbr = parts[parts.length - 1];
    const editionId = parts.slice(1, parts.length - 1).join("_") as RepertoryEditionId;
    const sourceId = this.mapSourceId(editionId);

    const resolution = resolveRemedyConceptByAbbreviation(abbr, { sourceId, editionId });
    let conceptId = "unresolved" as RemedyConceptId;
    let mappingStatus: "verified" | "provisional" | "unresolved" | "conflicted" = "unresolved";
    let mappingConfidence: "verified" | "reviewed" | "probable" | "manual" | "unknown" = "unknown";
    let mappingMethod: "editorial_exact" | "edition_registry" | "manual_review" | "provisional_normalization" = "provisional_normalization";
    let conceptMatch: any = null;

    if (resolution.status === "resolved") {
      conceptMatch = resolution.concept;
      conceptId = resolution.concept.id;
      mappingStatus = "verified";
      mappingConfidence = "verified";
      mappingMethod = resolution.mapping.aliasType === "source_abbreviation" ? "edition_registry" : "editorial_exact";
    } else if (resolution.status === "ambiguous") {
      mappingStatus = "conflicted";
      mappingConfidence = "unknown";
      mappingMethod = "manual_review";
    }

    const mappingProvenance: RemedyMappingProvenance = {
      mappingMethod,
      mappingRuleVersion: "1.0.0",
      mappedBy: "system-resolver",
      mappedAt: new Date().toISOString()
    };

    return {
      id: remedyRecordId,
      conceptId,
      editionId,
      sourceAbbreviation: abbr,
      sourceDisplayName: conceptMatch?.canonicalName,
      mappingStatus,
      mappingConfidence,
      provenance: mappingProvenance
    };
  }
}
