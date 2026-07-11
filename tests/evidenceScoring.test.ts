import assert from "assert";
import { 
  calculateCitationCompleteness, 
  calculateRetrievalPriority,
  RETRIEVAL_PRIORITY_WEIGHTS_V1,
  parseCanonicalEvidenceStrength,
  parseCanonicalSourceQuality,
  parseCanonicalReviewExpiryPolicy
} from "../src/features/knowledge/retrieval/evidenceScoringService";

async function runEvidenceScoringTests() {
  console.log("🚀 Running core Evidence Scoring formula tests...");
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (e: any) {
      console.error(`❌ ${name}`);
      console.error(e.stack || e);
      failed++;
    }
  }

  test("ScoringService - calculateCitationCompleteness validation logic", () => {
    const refs1 = [
      "Hahnemann S. Organon of Medicine. 6th ed.",
      "Kent JT. Lectures on Homoeopathic Philosophy.",
      "Allen HC. Keynotes and Characteristics."
    ];
    const res1 = calculateCitationCompleteness(refs1);
    assert.strictEqual(res1.totalReferences, 3);
    assert.strictEqual(res1.structurallyCompleteReferences, 3);
    assert.strictEqual(res1.completenessScore, 100);

    const refs2 = [
      "Hahnemann S. Organon of Medicine. 6th ed.",
      "Hahnemann S. Organon of Medicine. 6th ed.", // duplicate
      "", // empty
      "Short", // length 5
      "  Spaces only   "
    ];
    const res2 = calculateCitationCompleteness(refs2);
    assert.strictEqual(res2.totalReferences, 5);
    assert.strictEqual(res2.duplicateReferences, 1);
    assert.strictEqual(res2.structurallyCompleteReferences, 3);
    assert.ok(res2.completenessScore < 100);
  });

  test("ScoringService - calculateRetrievalPriority weights check and formulas", () => {
    const totalWeights = 
      RETRIEVAL_PRIORITY_WEIGHTS_V1.evidenceStrength +
      RETRIEVAL_PRIORITY_WEIGHTS_V1.sourceQuality +
      RETRIEVAL_PRIORITY_WEIGHTS_V1.clinicalConfidence +
      RETRIEVAL_PRIORITY_WEIGHTS_V1.editorialConfidence +
      RETRIEVAL_PRIORITY_WEIGHTS_V1.citationCompleteness +
      RETRIEVAL_PRIORITY_WEIGHTS_V1.reviewFreshness +
      RETRIEVAL_PRIORITY_WEIGHTS_V1.sourceTypeAdjustment;
    assert.ok(Math.abs(totalWeights - 1.0) < 1e-9, "Weights must sum to exactly 1.0");

    const result = calculateRetrievalPriority({
      evidenceProfile: {
        evidenceStrength: "high",
        sourceQuality: "peer-reviewed",
        clinicalConfidence: 90,
        editorialConfidence: 85,
        reviewIntervalDays: 365,
        reviewGracePeriodDays: 90,
        reviewExpiryPolicy: "ranking-penalty",
        rationale: "Supported by RCTs.",
        classicalSource: true,
        modernSource: true,
        citationCompleteness: 100,
        assessedBy: "Dr. Narayan Jethwani",
        assessedAt: "2026-07-11T00:00:00.000Z"
      },
      reviewState: "current",
      citationCount: 3,
      validCitationCount: 3
    });

    assert.ok(result.score >= 0 && result.score <= 100);
    assert.strictEqual(result.methodologyVersion, "evidence-retrieval-v1");
    assert.ok(result.score >= 80, "Expected a high priority score for high-quality evidence");
  });

  test("Canonical Enums - verify all canonical values are parsed and scored correctly", () => {
    // 1. EvidenceStrength
    const strengths = ["very-low", "low", "moderate", "high", "very-high"] as const;
    for (const str of strengths) {
      assert.strictEqual(parseCanonicalEvidenceStrength(str), str);
    }
    // Legacy aliases
    assert.strictEqual(parseCanonicalEvidenceStrength("uncertain"), "very-low");
    assert.strictEqual(parseCanonicalEvidenceStrength("strong"), "high");
    assert.strictEqual(parseCanonicalEvidenceStrength("supporting"), "moderate");
    assert.strictEqual(parseCanonicalEvidenceStrength("hypothetical"), "very-low");
    assert.strictEqual(parseCanonicalEvidenceStrength("level-a"), "very-high");

    // Invalid strength
    assert.throws(() => parseCanonicalEvidenceStrength("invalid-strength"));

    // 2. SourceQuality
    const qualities = ["unverified", "secondary", "primary", "peer-reviewed", "authoritative"] as const;
    for (const qual of qualities) {
      assert.strictEqual(parseCanonicalSourceQuality(qual), qual);
    }
    // Legacy aliases
    assert.strictEqual(parseCanonicalSourceQuality("anecdotal"), "unverified");

    // Invalid quality
    assert.throws(() => parseCanonicalSourceQuality("invalid-quality"));

    // 3. ReviewExpiryPolicy
    const policies = ["flag-only", "ranking-penalty", "exclude-from-ai", "exclude-from-all-search"] as const;
    for (const pol of policies) {
      assert.strictEqual(parseCanonicalReviewExpiryPolicy(pol), pol);
    }
    // Legacy aliases
    assert.strictEqual(parseCanonicalReviewExpiryPolicy("editorial-flag-only"), "flag-only");

    // Invalid policy
    assert.throws(() => parseCanonicalReviewExpiryPolicy("invalid-policy"));
  });

  if (failed > 0) {
    process.exit(1);
  }
}

runEvidenceScoringTests().catch(e => {
  console.error(e);
  process.exit(1);
});
