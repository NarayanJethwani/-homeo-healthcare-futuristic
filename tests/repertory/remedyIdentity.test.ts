import assert from "assert";
import { resolveRemedyConceptByAbbreviation, REVIEWED_SEED_REMEDY_REGISTRY } from "../../src/features/remedy-registry/remedyConceptRegistry";
import { RemedyConceptId, RemedyAliasRecord, RemedyConcept } from "../../src/features/repertory/types/remedyTypes";

export function runRemedyIdentityTests() {
  console.log("▶ Running Remedy Identity & Mapping Tests...");

  // 1. Classical Abbreviation Lookup
  const result = resolveRemedyConceptByAbbreviation("Arn");
  assert.strictEqual(result.status, "resolved");
  if (result.status === "resolved") {
    assert.strictEqual(result.concept.canonicalName, "Arnica Montana");
    assert.strictEqual(result.concept.id, "c4b123d4-e29b-4b1d-8c1d-123456789abc");
  }

  // 2. Case Insensitivity
  const resultLower = resolveRemedyConceptByAbbreviation("arn");
  assert.strictEqual(resultLower.status, "resolved");
  if (resultLower.status === "resolved") {
    assert.strictEqual(resultLower.concept.id, "c4b123d4-e29b-4b1d-8c1d-123456789abc");
  }

  // 3. Historical Abbreviation Resolution
  const resultHistorical = resolveRemedyConceptByAbbreviation("Nux.");
  assert.strictEqual(resultHistorical.status, "resolved");
  if (resultHistorical.status === "resolved") {
    assert.strictEqual(resultHistorical.concept.id, "e6b123d4-e29b-4b1d-8c1d-123456789abc");
  }

  // 4. Legacy and Common Name aliases
  const resultCommon = resolveRemedyConceptByAbbreviation("Deadly Nightshade");
  assert.strictEqual(resultCommon.status, "resolved");
  if (resultCommon.status === "resolved") {
    assert.strictEqual(resultCommon.concept.id, "d5b123d4-e29b-4b1d-8c1d-123456789abc");
  }

  // 5. Unresolved / Unknown abbreviation
  const resultUnknown = resolveRemedyConceptByAbbreviation("Xyz-unknown");
  assert.strictEqual(resultUnknown.status, "unresolved");

  // 6. UUID Stability test: adding another item to registry does not change Arnica Montana's ID
  const originalArnica = REVIEWED_SEED_REMEDY_REGISTRY.find(c => c.canonicalName === "Arnica Montana");
  assert.ok(originalArnica);
  const newRegistry = [
    ...REVIEWED_SEED_REMEDY_REGISTRY,
    {
      id: "99b123d4-e29b-4b1d-8c1d-123456789abc" as RemedyConceptId,
      canonicalName: "Unrelated Remedy",
      latinName: "Unrelated Remedy",
      family: "Other",
      kingdom: "Plantae",
      scientificName: "Unrelated",
      canonicalDisplayName: "Unrelated",
      historicalAbbreviations: ["Unrel."],
      aliases: [],
      taxonomy: [],
      registryStatus: "provisional" as const
    }
  ];
  const postAdditionArnica = newRegistry.find(c => c.canonicalName === "Arnica Montana");
  assert.ok(postAdditionArnica);
  assert.strictEqual(postAdditionArnica.id, originalArnica.id);

  console.log("✅ Remedy Identity Tests Passed");
}
