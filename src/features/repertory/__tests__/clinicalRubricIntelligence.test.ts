import assert from "assert";
import { CanonicalRubric } from "../engine/canonicalTypes";
import {
  buildRubricBreadcrumb,
  buildRubricHierarchyIndex,
  expandRubricSynonymsUsingHierarchy,
  findByPath,
  findRelatedRubrics,
  getBreadcrumb,
  getChildNodes,
  getParentNode,
  getRootNodes,
  getSiblingNodes,
  parseRubricPath,
  searchRelatedByHierarchyTokens,
  suggestNearbyRubrics,
} from "../intelligence/clinicalRubricIntelligence";

function rubric(partial: Partial<CanonicalRubric> & Pick<CanonicalRubric, "id" | "title">): CanonicalRubric {
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

const rubrics: CanonicalRubric[] = [
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

const path = parseRubricPath("Generalities → Food → Desire → Sweets");
assert.strictEqual(path.length, 4);
assert.strictEqual(path[3].normalizedLabel, "sweets");

const breadcrumb = buildRubricBreadcrumb(rubrics[3]);
assert.strictEqual(breadcrumb.displayPath, "Generalities → Food → Desire → Sweets");

const index = buildRubricHierarchyIndex(rubrics, "2026-07-03T00:00:00.000Z");
assert.strictEqual(index.nodesById.size, rubrics.length);
assert.deepStrictEqual(index.rootIds, ["generalities"]);
assert.strictEqual(index.nodesById.get("generalities")?.kind, "root");
assert.strictEqual(index.nodesById.get("desire")?.kind, "parent");
assert.strictEqual(index.nodesById.get("sweets")?.kind, "sibling");

assert.strictEqual(getBreadcrumb(index, "sweets")?.displayPath, "Generalities → Food → Desire → Sweets");
assert.strictEqual(getParentNode(index, "sweets")?.rubricId, "desire");
assert.deepStrictEqual(getChildNodes(index, "desire").map((node) => node.rubricId), ["sweets", "salt", "chocolate"]);
assert.deepStrictEqual(getSiblingNodes(index, "sweets").map((node) => node.rubricId), ["salt", "chocolate"]);
assert.deepStrictEqual(getRootNodes(index).map((node) => node.rubricId), ["generalities"]);

const foundByPath = findByPath(index, "generalities/food/desire/sweets");
assert.strictEqual(foundByPath?.rubricId, "sweets");

const nearby = suggestNearbyRubrics(index, "sweets");
assert.ok(nearby.some((suggestion) => suggestion.relationship === "parent" && suggestion.rubric.id === "desire"));
assert.ok(nearby.some((suggestion) => suggestion.relationship === "sibling" && suggestion.rubric.id === "salt"));
assert.ok(nearby.some((suggestion) => suggestion.reason === "Explicit cross-reference" && suggestion.rubric.id === "chocolate"));

const related = findRelatedRubrics(index, "sweets");
assert.strictEqual(related[0].rubric.id, "chocolate");
assert.ok(related[0].reasons.some((reason) => reason.type === "cross_reference"));
assert.ok(related.some((result) => result.rubric.id === "salt" && result.reasons.some((reason) => reason.type === "sibling")));

const expanded = expandRubricSynonymsUsingHierarchy(index, "sweets");
assert.ok(expanded.includes("desire"));
assert.ok(expanded.includes("craving"));

const hierarchySearchIds = searchRelatedByHierarchyTokens(index, rubrics, "desire sweets");
assert.ok(hierarchySearchIds.includes("sweets"));
assert.ok(hierarchySearchIds.includes("desire"));

console.log("clinicalRubricIntelligence.test.ts passed");
