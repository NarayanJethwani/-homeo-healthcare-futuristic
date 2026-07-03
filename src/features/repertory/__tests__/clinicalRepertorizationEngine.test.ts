import assert from "assert";
import { CanonicalRubric } from "../engine/canonicalTypes";
import {
  benchmarkClinicalRepertorization,
  cloneSessionWithStrategy,
  compareRemedies,
  createClinicalRepertorizationSession,
  deserializeClinicalSession,
  explainClinicalRepertorization,
  repertorizeClinicalSession,
  ScoringStrategy,
  serializeClinicalSession,
} from "../repertorization/clinicalRepertorization";

function rubric(id: string, title: string, remedies: CanonicalRubric["remedies"], searchWeight = 1): CanonicalRubric {
  return {
    id,
    title,
    source: "jethwani",
    category: "unknown",
    clinicalSystem: "unknown",
    status: "active",
    searchWeight,
    synonyms: [],
    keywords: [],
    modalities: [],
    miasms: [],
    remedies,
    originalRecord: { id, title },
    warnings: [],
  };
}

const rubrics = [
  rubric("fear-death", "Fear of death", [
    { remedyId: "Acon", sourceRemedyId: "Acon", grade: 3, remedyName: "Aconite" },
    { remedyId: "Ars", sourceRemedyId: "Ars", grade: 2, remedyName: "Arsenicum" },
    { remedyId: "Nux-v", sourceRemedyId: "Nux-v", grade: 1, isEliminating: true },
  ], 2),
  rubric("restlessness", "Restlessness", [
    { remedyId: "Acon", sourceRemedyId: "Acon", grade: 2, remedyName: "Aconite" },
    { remedyId: "Ars", sourceRemedyId: "Ars", grade: 3, remedyName: "Arsenicum" },
  ], 1),
  rubric("thirst-small-sips", "Thirst for small sips", [
    { remedyId: "Ars", sourceRemedyId: "Ars", grade: 3, remedyName: "Arsenicum" },
    { remedyId: "Phos", sourceRemedyId: "Phos", grade: 2, remedyName: "Phosphorus" },
  ], 1),
];

const session = createClinicalRepertorizationSession({
  id: "phase4-test-session",
  rubrics,
  strategyId: "weighted_grades",
  symptomImportance: {
    "fear-death": 2,
    restlessness: 1,
    "thirst-small-sips": 1,
  },
  exclusions: {
    remedyIds: ["Phos"],
    reason: "Fixture exclusion",
  },
  createdAt: "2026-07-03T00:00:00.000Z",
});

assert.strictEqual(session.selectedRubrics.length, 3);
assert.strictEqual(session.exclusions.remedyIds[0], "Phos");
assert.strictEqual(session.selectedRubrics[0].rubricWeight, 2);

const weighted = repertorizeClinicalSession(session, [], "2026-07-03T00:00:00.000Z");
assert.strictEqual(weighted.strategyId, "weighted_grades");
assert.strictEqual(weighted.rankings[0].remedyId, "Acon");
assert.strictEqual(weighted.rankings.some((ranking) => ranking.remedyId === "Nux-v"), false);
assert.strictEqual(weighted.rankings.some((ranking) => ranking.remedyId === "Phos"), false);
assert.ok(weighted.rankings[0].contributions[0].percentageContribution > 0);
assert.ok(weighted.rankings[0].whyRanked.length > 0);

const kent = repertorizeClinicalSession(cloneSessionWithStrategy(session, "kent_style"));
assert.strictEqual(kent.rankings[0].remedyId, "Ars");

const sum = repertorizeClinicalSession(cloneSessionWithStrategy(session, "sum_of_grades"));
assert.strictEqual(sum.rankings[0].remedyId, "Ars");

const weightedImportance = repertorizeClinicalSession(cloneSessionWithStrategy(session, "weighted_symptom_importance"));
assert.strictEqual(weightedImportance.rankings[0].remedyId, "Acon");

const frequencyNormalized = repertorizeClinicalSession(cloneSessionWithStrategy(session, "frequency_normalized"));
assert.ok(frequencyNormalized.rankings.length >= 2);
assert.ok(frequencyNormalized.rankings[0].totalScore > 0);

const customStrategy: ScoringStrategy = {
  id: "custom_presence_only",
  label: "Custom presence only",
  description: "Fixture strategy for extension testing.",
  score: () => 1,
};
const custom = repertorizeClinicalSession(cloneSessionWithStrategy(session, "custom_presence_only"), [customStrategy]);
assert.strictEqual(custom.rankings[0].totalScore, 3);

const explanations = explainClinicalRepertorization(weighted);
assert.strictEqual(explanations[0].remedyId, weighted.rankings[0].remedyId);
assert.ok(explanations[0].summary.includes("ranked"));
assert.ok(explanations[0].contributingRubrics.length > 0);

const comparison = compareRemedies(weighted, ["Acon", "Ars"]);
assert.deepStrictEqual(comparison.sharedRubricIds.sort(), ["fear-death", "restlessness"].sort());
assert.ok(comparison.uniqueRubricIdsByRemedy.Ars.includes("thirst-small-sips"));
assert.ok(comparison.strongestRubricsByRemedy.Acon.length > 0);
assert.ok(comparison.clinicalDifferences.length >= 2);

const serialized = serializeClinicalSession(session);
const deserialized = deserializeClinicalSession(serialized);
assert.strictEqual(deserialized.id, session.id);
assert.strictEqual(deserialized.selectedRubrics.length, session.selectedRubrics.length);

const benchmark = benchmarkClinicalRepertorization("weighted_grades", [10, 50]);
assert.deepStrictEqual(benchmark.cases.map((benchmarkCase) => benchmarkCase.rubricCount), [10, 50]);
assert.ok(benchmark.cases.every((benchmarkCase) => benchmarkCase.rankingStable));

console.log("clinicalRepertorizationEngine.test.ts passed");
