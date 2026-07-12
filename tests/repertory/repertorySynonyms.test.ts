import assert from "assert";
import { SynonymService } from "../../src/features/repertory/search/SynonymService";

export function runSynonymTests() {
  console.log("▶ Running Repertory Synonym Tests...");
  const service = new SynonymService();

  // Test expandTerm
  const exp = service.expandTerm("vertigo");
  assert.strictEqual(exp.normalizedTerm, "vertigo");
  assert.ok(exp.plainLanguageAliases.includes("dizziness"), "Should include dizziness as plain language alias");

  // Test expandQuery
  const queryResult = service.expandQuery("pain stomach");
  assert.ok(queryResult.expandedTerms.includes("pain"));
  assert.ok(queryResult.expandedTerms.includes("stomach"));
  assert.ok(queryResult.expandedTerms.includes("ache"), "Should expand pain to ache");
  assert.ok(queryResult.expandedTerms.includes("abdomen"), "Should expand stomach to abdomen");

  // Verify weight boosts
  const weightExact = service.getRelationshipWeight("exact_synonym");
  const weightRelated = service.getRelationshipWeight("related_term");
  assert.ok(weightExact > weightRelated, "Exact synonyms must have higher weight boosts than related terms");

  console.log("✅ Repertory Synonym Tests Passed");
}
