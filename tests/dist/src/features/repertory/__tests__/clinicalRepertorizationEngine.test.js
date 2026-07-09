"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const clinicalRepertorization_1 = require("../repertorization/clinicalRepertorization");
function rubric(id, title, remedies, searchWeight = 1) {
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
const session = (0, clinicalRepertorization_1.createClinicalRepertorizationSession)({
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
assert_1.default.strictEqual(session.selectedRubrics.length, 3);
assert_1.default.strictEqual(session.exclusions.remedyIds[0], "Phos");
assert_1.default.strictEqual(session.selectedRubrics[0].rubricWeight, 2);
const weighted = (0, clinicalRepertorization_1.repertorizeClinicalSession)(session, [], "2026-07-03T00:00:00.000Z");
assert_1.default.strictEqual(weighted.strategyId, "weighted_grades");
assert_1.default.strictEqual(weighted.rankings[0].remedyId, "Acon");
assert_1.default.strictEqual(weighted.rankings.some((ranking) => ranking.remedyId === "Nux-v"), false);
assert_1.default.strictEqual(weighted.rankings.some((ranking) => ranking.remedyId === "Phos"), false);
assert_1.default.ok(weighted.rankings[0].contributions[0].percentageContribution > 0);
assert_1.default.ok(weighted.rankings[0].whyRanked.length > 0);
const kent = (0, clinicalRepertorization_1.repertorizeClinicalSession)((0, clinicalRepertorization_1.cloneSessionWithStrategy)(session, "kent_style"));
assert_1.default.strictEqual(kent.rankings[0].remedyId, "Ars");
const sum = (0, clinicalRepertorization_1.repertorizeClinicalSession)((0, clinicalRepertorization_1.cloneSessionWithStrategy)(session, "sum_of_grades"));
assert_1.default.strictEqual(sum.rankings[0].remedyId, "Ars");
const weightedImportance = (0, clinicalRepertorization_1.repertorizeClinicalSession)((0, clinicalRepertorization_1.cloneSessionWithStrategy)(session, "weighted_symptom_importance"));
assert_1.default.strictEqual(weightedImportance.rankings[0].remedyId, "Acon");
const frequencyNormalized = (0, clinicalRepertorization_1.repertorizeClinicalSession)((0, clinicalRepertorization_1.cloneSessionWithStrategy)(session, "frequency_normalized"));
assert_1.default.ok(frequencyNormalized.rankings.length >= 2);
assert_1.default.ok(frequencyNormalized.rankings[0].totalScore > 0);
const customStrategy = {
    id: "custom_presence_only",
    label: "Custom presence only",
    description: "Fixture strategy for extension testing.",
    score: () => 1,
};
const custom = (0, clinicalRepertorization_1.repertorizeClinicalSession)((0, clinicalRepertorization_1.cloneSessionWithStrategy)(session, "custom_presence_only"), [customStrategy]);
assert_1.default.strictEqual(custom.rankings[0].totalScore, 3);
const explanations = (0, clinicalRepertorization_1.explainClinicalRepertorization)(weighted);
assert_1.default.strictEqual(explanations[0].remedyId, weighted.rankings[0].remedyId);
assert_1.default.ok(explanations[0].summary.includes("ranked"));
assert_1.default.ok(explanations[0].contributingRubrics.length > 0);
const comparison = (0, clinicalRepertorization_1.compareRemedies)(weighted, ["Acon", "Ars"]);
assert_1.default.deepStrictEqual(comparison.sharedRubricIds.sort(), ["fear-death", "restlessness"].sort());
assert_1.default.ok(comparison.uniqueRubricIdsByRemedy.Ars.includes("thirst-small-sips"));
assert_1.default.ok(comparison.strongestRubricsByRemedy.Acon.length > 0);
assert_1.default.ok(comparison.clinicalDifferences.length >= 2);
const serialized = (0, clinicalRepertorization_1.serializeClinicalSession)(session);
const deserialized = (0, clinicalRepertorization_1.deserializeClinicalSession)(serialized);
assert_1.default.strictEqual(deserialized.id, session.id);
assert_1.default.strictEqual(deserialized.selectedRubrics.length, session.selectedRubrics.length);
const benchmark = (0, clinicalRepertorization_1.benchmarkClinicalRepertorization)("weighted_grades", [10, 50]);
assert_1.default.deepStrictEqual(benchmark.cases.map((benchmarkCase) => benchmarkCase.rubricCount), [10, 50]);
assert_1.default.ok(benchmark.cases.every((benchmarkCase) => benchmarkCase.rankingStable));
console.log("clinicalRepertorizationEngine.test.ts passed");
