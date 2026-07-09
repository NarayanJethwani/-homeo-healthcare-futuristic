"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const clinicalRubricIntelligence_1 = require("../intelligence/clinicalRubricIntelligence");
function rubric(partial) {
    return {
        source: "jethwani",
        category: "unknown",
        clinicalSystem: "unknown",
        status: "active",
        synonyms: [],
        keywords: [],
        modalities: [],
        miasms: [],
        remedies: [],
        originalRecord: partial,
        warnings: [],
        ...partial,
    };
}
const rubrics = [
    rubric({
        id: "generalities",
        title: "Generalities",
        metadata: { path: "Generalities" },
    }),
    rubric({
        id: "food",
        title: "Food",
        parentRubricId: "generalities",
        metadata: { path: "Generalities > Food" },
    }),
    rubric({
        id: "desire",
        title: "Desire",
        parentRubricId: "food",
        metadata: { path: "Generalities > Food > Desire" },
    }),
    rubric({
        id: "sweets",
        title: "Sweets",
        parentRubricId: "desire",
        sourceCategory: "Generalities",
        clinicalSystem: "generalities",
        keywords: ["craving", "sweets"],
        synonyms: ["desire sugar"],
        clinicalConditions: ["Food cravings"],
        modalities: ["ameliorated by sweet food"],
        miasms: ["Psora"],
        metadata: {
            path: "Generalities > Food > Desire > Sweets",
            crossReferenceIds: ["chocolate"],
        },
    }),
    rubric({
        id: "salt",
        title: "Salt",
        parentRubricId: "desire",
        sourceCategory: "Generalities",
        clinicalSystem: "generalities",
        keywords: ["craving", "salt"],
        clinicalConditions: ["Food cravings"],
        miasms: ["Psora"],
        metadata: { path: "Generalities > Food > Desire > Salt" },
    }),
    rubric({
        id: "chocolate",
        title: "Chocolate",
        parentRubricId: "desire",
        sourceCategory: "Generalities",
        clinicalSystem: "generalities",
        keywords: ["craving", "chocolate"],
        clinicalConditions: ["Food cravings"],
        relatedSymptoms: ["sweets"],
        metadata: { path: "Generalities > Food > Desire > Chocolate" },
    }),
    rubric({
        id: "aversion-sweets",
        title: "Sweets",
        parentRubricId: "food",
        sourceCategory: "Generalities",
        clinicalSystem: "generalities",
        keywords: ["aversion", "sweets"],
        metadata: { path: "Generalities > Food > Aversion > Sweets" },
    }),
];
const path = (0, clinicalRubricIntelligence_1.parseRubricPath)("Generalities → Food → Desire → Sweets");
assert_1.default.strictEqual(path.length, 4);
assert_1.default.strictEqual(path[3].normalizedLabel, "sweets");
const breadcrumb = (0, clinicalRubricIntelligence_1.buildRubricBreadcrumb)(rubrics[3]);
assert_1.default.strictEqual(breadcrumb.displayPath, "Generalities → Food → Desire → Sweets");
const index = (0, clinicalRubricIntelligence_1.buildRubricHierarchyIndex)(rubrics, "2026-07-03T00:00:00.000Z");
assert_1.default.strictEqual(index.nodesById.size, rubrics.length);
assert_1.default.deepStrictEqual(index.rootIds, ["generalities"]);
assert_1.default.strictEqual(index.nodesById.get("generalities")?.kind, "root");
assert_1.default.strictEqual(index.nodesById.get("desire")?.kind, "parent");
assert_1.default.strictEqual(index.nodesById.get("sweets")?.kind, "sibling");
assert_1.default.strictEqual((0, clinicalRubricIntelligence_1.getBreadcrumb)(index, "sweets")?.displayPath, "Generalities → Food → Desire → Sweets");
assert_1.default.strictEqual((0, clinicalRubricIntelligence_1.getParentNode)(index, "sweets")?.rubricId, "desire");
assert_1.default.deepStrictEqual((0, clinicalRubricIntelligence_1.getChildNodes)(index, "desire").map((node) => node.rubricId), ["sweets", "salt", "chocolate"]);
assert_1.default.deepStrictEqual((0, clinicalRubricIntelligence_1.getSiblingNodes)(index, "sweets").map((node) => node.rubricId), ["salt", "chocolate"]);
assert_1.default.deepStrictEqual((0, clinicalRubricIntelligence_1.getRootNodes)(index).map((node) => node.rubricId), ["generalities"]);
const foundByPath = (0, clinicalRubricIntelligence_1.findByPath)(index, "generalities/food/desire/sweets");
assert_1.default.strictEqual(foundByPath?.rubricId, "sweets");
const nearby = (0, clinicalRubricIntelligence_1.suggestNearbyRubrics)(index, "sweets");
assert_1.default.ok(nearby.some((suggestion) => suggestion.relationship === "parent" && suggestion.rubric.id === "desire"));
assert_1.default.ok(nearby.some((suggestion) => suggestion.relationship === "sibling" && suggestion.rubric.id === "salt"));
assert_1.default.ok(nearby.some((suggestion) => suggestion.reason === "Explicit cross-reference" && suggestion.rubric.id === "chocolate"));
const related = (0, clinicalRubricIntelligence_1.findRelatedRubrics)(index, "sweets");
assert_1.default.strictEqual(related[0].rubric.id, "chocolate");
assert_1.default.ok(related[0].reasons.some((reason) => reason.type === "cross_reference"));
assert_1.default.ok(related.some((result) => result.rubric.id === "salt" && result.reasons.some((reason) => reason.type === "sibling")));
const expanded = (0, clinicalRubricIntelligence_1.expandRubricSynonymsUsingHierarchy)(index, "sweets");
assert_1.default.ok(expanded.includes("desire"));
assert_1.default.ok(expanded.includes("craving"));
const hierarchySearchIds = (0, clinicalRubricIntelligence_1.searchRelatedByHierarchyTokens)(index, rubrics, "desire sweets");
assert_1.default.ok(hierarchySearchIds.includes("sweets"));
assert_1.default.ok(hierarchySearchIds.includes("desire"));
console.log("clinicalRubricIntelligence.test.ts passed");
