import assert from "assert";
import { CITATIONS } from "../src/features/knowledge/content/citations";
import {
  buildKnowledgeSourceIntegrityReport,
  evaluateClaimCitationStaging,
} from "../src/features/knowledge/expansion/sourceIntegrity";
import { KEP1_SOURCES } from "../src/features/knowledge/expansion/kep1SourceDossiers";

export function runKnowledgeSourceIntegrityTests(): void {
  const report = buildKnowledgeSourceIntegrityReport({
    citations: CITATIONS,
    sources: KEP1_SOURCES,
    asOfDate: "2026-07-29",
  });

  assert.strictEqual(report.status, "staging-only");
  assert.strictEqual(report.invariants.publicationState, "unchanged");
  assert.strictEqual(report.invariants.ragState, "inactive");
  assert.strictEqual(report.summary.eligibleCitationRecords, 9);
  assert.strictEqual(report.summary.blockerCount, 7);
  assert.strictEqual(report.summary.reviewCount, 10);
  assert.ok(report.eligibleCitationIds.includes("CIT-0017"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0018"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0012"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0013"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0019"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0020"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0021"));
  assert.ok(report.quarantinedCitationIds.includes("CIT-0001"));
  assert.ok(report.quarantinedCitationIds.includes("CIT-0002"));
  assert.ok(report.quarantinedCitationIds.includes("CIT-0003"));
  assert.ok(report.quarantinedCitationIds.includes("CIT-0022"));
  assert.ok(
    report.issues.some(
      (issue) =>
        issue.recordId === "CIT-0022" &&
        issue.code === "internal-source-context-only"
    )
  );
  assert.strictEqual(
    report.summary.eligibleRegisteredSources,
    KEP1_SOURCES.length
  );

  const mismatched = buildKnowledgeSourceIntegrityReport({
    citations: [
      {
        ...CITATIONS.find((citation) => citation.id === "CIT-0017")!,
        canonicalUrl: "https://www.nice.org.uk/guidance/ng90",
      },
    ],
    sources: KEP1_SOURCES,
    asOfDate: "2026-07-29",
  });
  assert.ok(
    mismatched.issues.some(
      (issue) => issue.code === "nice-identifier-url-mismatch"
    )
  );
  assert.ok(mismatched.quarantinedCitationIds.includes("CIT-0017"));

  const clinicalClaim = evaluateClaimCitationStaging({
    claimId: "CLAIM-ASTHMA-DIAGNOSIS",
    claimType: "diagnosis",
    citationIds: ["CIT-0020"],
    citations: CITATIONS,
    requiredScopeTags: ["asthma"],
  });
  assert.strictEqual(clinicalClaim.eligibleForStaging, true);
  assert.strictEqual(clinicalClaim.boundaries.publicationState, "unchanged");
  assert.strictEqual(clinicalClaim.boundaries.ragState, "inactive");

  const disputedClaim = evaluateClaimCitationStaging({
    claimId: "CLAIM-GERD-TREATMENT",
    claimType: "treatment",
    citationIds: ["CIT-0001"],
    citations: CITATIONS,
  });
  assert.strictEqual(disputedClaim.eligibleForStaging, false);
  assert.ok(
    disputedClaim.errors.includes(
      "CLAIM-GERD-TREATMENT:citation-not-verified:CIT-0001:disputed"
    )
  );

  const traditionalClaim = evaluateClaimCitationStaging({
    claimId: "CLAIM-KENT-TRADITIONAL",
    claimType: "traditional-use",
    citationIds: ["CIT-0005"],
    citations: CITATIONS,
  });
  assert.strictEqual(traditionalClaim.eligibleForStaging, true);

  const unsafeTraditionalTreatment = evaluateClaimCitationStaging({
    claimId: "CLAIM-KENT-TREATMENT",
    claimType: "treatment",
    citationIds: ["CIT-0005"],
    citations: CITATIONS,
  });
  assert.strictEqual(unsafeTraditionalTreatment.eligibleForStaging, false);
  assert.ok(
    unsafeTraditionalTreatment.errors.includes(
      "CLAIM-KENT-TREATMENT:authoritative-clinical-source-required:treatment"
    )
  );

  const wrongConditionScope = evaluateClaimCitationStaging({
    claimId: "CLAIM-HYPERTHYROID-DIAGNOSIS",
    claimType: "diagnosis",
    citationIds: ["CIT-0012"],
    citations: CITATIONS,
    requiredScopeTags: ["hyperthyroidism"],
  });
  assert.strictEqual(wrongConditionScope.eligibleForStaging, false);
  assert.ok(
    wrongConditionScope.errors.includes(
      "CLAIM-HYPERTHYROID-DIAGNOSIS:citation-scope-mismatch"
    )
  );

  console.log(
    "✅ Knowledge expansion source identifiers, canonical URLs, internal-source boundaries, and staging-only invariants verified."
  );
}

if (require.main === module) {
  runKnowledgeSourceIntegrityTests();
}
