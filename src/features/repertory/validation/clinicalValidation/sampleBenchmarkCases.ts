import { ClinicalBenchmarkCase } from "./types";

export const SAMPLE_CLINICAL_BENCHMARK_CASES: ClinicalBenchmarkCase[] = [
  {
    id: "acute-panic-fear-death",
    caseName: "Acute panic with fear of death and restlessness",
    selectedRubrics: [
      {
        id: "fear-death",
        title: "Fear of death",
        rubricWeight: 2,
        symptomImportance: 2,
        remedies: [
          { remedyId: "Acon", remedyName: "Aconite", grade: 3 },
          { remedyId: "Ars", remedyName: "Arsenicum", grade: 2 },
        ],
      },
      {
        id: "sudden-onset",
        title: "Sudden onset",
        rubricWeight: 1.5,
        symptomImportance: 1,
        remedies: [
          { remedyId: "Acon", remedyName: "Aconite", grade: 3 },
          { remedyId: "Bell", remedyName: "Belladonna", grade: 2 },
        ],
      },
      {
        id: "restlessness",
        title: "Restlessness",
        rubricWeight: 1,
        symptomImportance: 1,
        remedies: [
          { remedyId: "Acon", remedyName: "Aconite", grade: 2 },
          { remedyId: "Ars", remedyName: "Arsenicum", grade: 3 },
        ],
      },
    ],
    expectedTopRemedies: [{ remedyId: "Acon", minRank: 1, maxRank: 1 }],
    expectedRankingTolerance: 0,
    clinicalNotes: "Synthetic validation case for acute panic pattern. Not a prescribing recommendation.",
    references: [{ source: "Internal validation fixture", note: "Phase 5 starter case" }],
    strategyId: "weighted_symptom_importance",
  },
  {
    id: "small-sips-anxiety-restlessness",
    caseName: "Anxiety with restlessness and thirst for small sips",
    selectedRubrics: [
      {
        id: "restlessness",
        title: "Restlessness",
        rubricWeight: 1,
        symptomImportance: 1,
        remedies: [
          { remedyId: "Acon", remedyName: "Aconite", grade: 2 },
          { remedyId: "Ars", remedyName: "Arsenicum", grade: 3 },
        ],
      },
      {
        id: "thirst-small-sips",
        title: "Thirst for small sips",
        rubricWeight: 2,
        symptomImportance: 1.5,
        remedies: [
          { remedyId: "Ars", remedyName: "Arsenicum", grade: 3 },
          { remedyId: "Phos", remedyName: "Phosphorus", grade: 2 },
        ],
      },
      {
        id: "anxiety-health",
        title: "Anxiety about health",
        rubricWeight: 1,
        symptomImportance: 1,
        remedies: [
          { remedyId: "Ars", remedyName: "Arsenicum", grade: 3 },
          { remedyId: "Calc", remedyName: "Calcarea carbonica", grade: 2 },
        ],
      },
    ],
    expectedTopRemedies: [{ remedyId: "Ars", minRank: 1, maxRank: 1 }],
    expectedRankingTolerance: 0,
    clinicalNotes: "Synthetic validation case for anxious restlessness with small-sip thirst. Not a prescribing recommendation.",
    references: [{ source: "Internal validation fixture", note: "Phase 5 starter case" }],
    strategyId: "weighted_symptom_importance",
  },
];
