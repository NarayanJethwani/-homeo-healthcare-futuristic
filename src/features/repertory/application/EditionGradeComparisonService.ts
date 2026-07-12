import {
  RepertoryAccessContext,
  RubricRecordId,
  RepertoryEditionId
} from "../types/repertoryTypes";
import { PublishedRemedyGradeAdapter } from "../repositories/PublishedRemedyGradeAdapter";
import { RubricRemedyGradeView, EditionPresenceState } from "../types/remedyTypes";

export interface RemedyComparisonResult {
  remedyAbbreviation: string;
  remedyConceptId: string;
  remedyName?: string;
  presenceA: EditionPresenceState;
  presenceB: EditionPresenceState;
  originalGradeA?: string;
  originalGradeB?: string;
  normalizedGradeA?: number;
  normalizedGradeB?: number;
  observations: string[];
}

export class EditionGradeComparisonService {
  private adapter = new PublishedRemedyGradeAdapter();

  async compareRubricGrades(
    context: RepertoryAccessContext,
    rubricIdA: RubricRecordId,
    rubricIdB: RubricRecordId
  ): Promise<RemedyComparisonResult[]> {
    // Retrieve remedies for both rubric records
    const resA = await this.adapter.getRemediesForRubric(context, rubricIdA, { limit: 1000 });
    const resB = await this.adapter.getRemediesForRubric(context, rubricIdB, { limit: 1000 });

    const mapA = new Map<string, RubricRemedyGradeView>();
    const mapB = new Map<string, RubricRemedyGradeView>();

    for (const item of resA.items) {
      mapA.set(item.remedyRecord.sourceAbbreviation.toLowerCase(), item);
    }
    for (const item of resB.items) {
      mapB.set(item.remedyRecord.sourceAbbreviation.toLowerCase(), item);
    }

    // Collect all unique remedy abbreviations
    const allAbbrs = new Set<string>([
      ...mapA.keys(),
      ...mapB.keys()
    ]);

    const results: RemedyComparisonResult[] = [];

    for (const abbr of allAbbrs) {
      const viewA = mapA.get(abbr);
      const viewB = mapB.get(abbr);

      const presenceA: EditionPresenceState = viewA ? "recorded" : "not_recorded_in_verified_corpus";
      const presenceB: EditionPresenceState = viewB ? "recorded" : "not_recorded_in_verified_corpus";

      const originalGradeA = viewA?.grade.originalGrade;
      const originalGradeB = viewB?.grade.originalGrade;

      const normalizedGradeA = viewA?.grade.normalizedGrade;
      const normalizedGradeB = viewB?.grade.normalizedGrade;

      const remedyConceptId = viewA?.remedyRecord.conceptId || viewB?.remedyRecord.conceptId || "unresolved";
      const remedyName = viewA?.remedyRecord.sourceDisplayName || viewB?.remedyRecord.sourceDisplayName;

      const observations: string[] = [];

      if (viewA && !viewB) {
        observations.push("Present in Kent; Absent in Boericke");
      } else if (!viewA && viewB) {
        observations.push("Absent in Kent; Present in Boericke");
      } else if (viewA && viewB) {
        if (normalizedGradeA !== undefined && normalizedGradeB !== undefined) {
          if (normalizedGradeB > normalizedGradeA) {
            observations.push("Grade increased");
          } else if (normalizedGradeB < normalizedGradeA) {
            observations.push("Grade decreased");
          } else {
            observations.push("Grade identical");
          }
        } else {
          observations.push("Varying original notations with missing normalized values");
        }
      }

      results.push({
        remedyAbbreviation: viewA?.remedyRecord.sourceAbbreviation || viewB?.remedyRecord.sourceAbbreviation || abbr,
        remedyConceptId,
        remedyName,
        presenceA,
        presenceB,
        originalGradeA,
        originalGradeB,
        normalizedGradeA,
        normalizedGradeB,
        observations
      });
    }

    // Alphabetical sort by abbreviation for clinical neutrality
    return results.sort((a, b) => a.remedyAbbreviation.localeCompare(b.remedyAbbreviation));
  }
}
