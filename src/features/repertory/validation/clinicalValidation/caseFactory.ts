import { CanonicalRubric } from "../../engine/canonicalTypes";
import {
  createClinicalRepertorizationSession,
  ClinicalRepertorizationSession,
} from "../../repertorization/clinicalRepertorization";
import { BenchmarkCaseRubric, ClinicalBenchmarkCase } from "./types";

function toCanonicalRubric(caseRubric: BenchmarkCaseRubric): CanonicalRubric {
  return {
    id: caseRubric.id,
    title: caseRubric.title,
    source: "jethwani",
    category: "unknown",
    clinicalSystem: "unknown",
    status: "active",
    searchWeight: caseRubric.rubricWeight,
    synonyms: [],
    keywords: [],
    modalities: [],
    miasms: [],
    remedies: caseRubric.remedies.map((remedy) => ({
      remedyId: remedy.remedyId,
      remedyName: remedy.remedyName,
      sourceRemedyId: remedy.remedyId,
      grade: remedy.grade,
      sourceGrade: remedy.sourceGrade,
      isEliminating: remedy.isEliminating,
    })),
    metadata: caseRubric.metadata,
    originalRecord: caseRubric,
    warnings: [],
  };
}

export function benchmarkCaseToSession(
  benchmarkCase: ClinicalBenchmarkCase,
  createdAt = new Date().toISOString(),
): ClinicalRepertorizationSession {
  const rubrics = benchmarkCase.selectedRubrics.map(toCanonicalRubric);
  const symptomImportance = Object.fromEntries(
    benchmarkCase.selectedRubrics.map((rubric) => [rubric.id, rubric.symptomImportance || 1]),
  );

  return createClinicalRepertorizationSession({
    id: benchmarkCase.id,
    rubrics,
    strategyId: benchmarkCase.strategyId || "weighted_grades",
    rubricWeights: benchmarkCase.rubricWeights,
    symptomImportance,
    exclusions: benchmarkCase.exclusions,
    metadata: {
      caseName: benchmarkCase.caseName,
      clinicalNotes: benchmarkCase.clinicalNotes,
      references: benchmarkCase.references,
      ...(benchmarkCase.metadata || {}),
    },
    createdAt,
  });
}
