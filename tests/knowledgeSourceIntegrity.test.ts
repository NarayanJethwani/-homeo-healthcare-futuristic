import assert from "assert";
import { CITATIONS } from "../src/features/knowledge/content/citations";
import {
  buildKnowledgeSourceIntegrityReport,
  evaluateClaimCitationStaging,
} from "../src/features/knowledge/expansion/sourceIntegrity";
import { KEP1_SOURCES } from "../src/features/knowledge/expansion/kep1SourceDossiers";
import { PRIORITY_DISEASE_SOURCES } from "../src/features/knowledge/expansion/priorityDiseaseEvidence";

export function runKnowledgeSourceIntegrityTests(): void {
  const report = buildKnowledgeSourceIntegrityReport({
    citations: CITATIONS,
    sources: [...KEP1_SOURCES, ...PRIORITY_DISEASE_SOURCES],
    asOfDate: "2026-07-30",
  });

  assert.strictEqual(report.status, "staging-only");
  assert.strictEqual(report.invariants.publicationState, "unchanged");
  assert.strictEqual(report.invariants.ragState, "inactive");
  assert.strictEqual(report.summary.eligibleCitationRecords, 76);
  assert.strictEqual(report.summary.blockerCount, 3);
  assert.strictEqual(report.summary.reviewCount, 1);
  for (const citationId of [
    "CIT-0004",
    "CIT-0007",
    "CIT-0008",
    "CIT-0009",
    "CIT-0010",
    "CIT-0011",
  ]) {
    assert.ok(report.eligibleCitationIds.includes(citationId));
    assert.ok(!report.quarantinedCitationIds.includes(citationId));
  }
  assert.ok(report.eligibleCitationIds.includes("CIT-0017"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0018"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0012"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0013"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0019"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0020"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0021"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0014"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0015"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0016"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0023"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0024"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0025"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0026"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0027"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0028"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0029"));
  for (const citationId of [
    "CIT-0030",
    "CIT-0031",
    "CIT-0032",
    "CIT-0033",
    "CIT-0034",
    "CIT-0035",
    "CIT-0036",
  ]) {
    assert.ok(report.eligibleCitationIds.includes(citationId));
  }
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
    KEP1_SOURCES.length + PRIORITY_DISEASE_SOURCES.length
  );
  assert.ok(
    KEP1_SOURCES.every((source) =>
      report.eligibleCitationIds.includes(source.citationId)
    )
  );
  assert.ok(
    PRIORITY_DISEASE_SOURCES.every((source) =>
      report.eligibleCitationIds.includes(source.citationId)
    )
  );
  assert.deepStrictEqual(
    report.issues
      .filter((issue) => issue.severity === "blocker")
      .map((issue) => issue.recordId)
      .sort(),
    ["CIT-0001", "CIT-0002", "CIT-0003"]
  );

  const mismatched = buildKnowledgeSourceIntegrityReport({
    citations: [
      {
        ...CITATIONS.find((citation) => citation.id === "CIT-0017")!,
        canonicalUrl: "https://www.nice.org.uk/guidance/ng90",
      },
    ],
    sources: KEP1_SOURCES,
    asOfDate: "2026-07-30",
  });
  assert.ok(
    mismatched.issues.some(
      (issue) => issue.code === "nice-identifier-url-mismatch"
    )
  );
  assert.ok(mismatched.quarantinedCitationIds.includes("CIT-0017"));

  const unlinkedSource = buildKnowledgeSourceIntegrityReport({
    citations: CITATIONS,
    sources: [
      {
        ...KEP1_SOURCES[0],
        citationId: "CIT-MISSING",
      },
    ],
    asOfDate: "2026-07-30",
  });
  assert.ok(
    unlinkedSource.issues.some(
      (issue) => issue.code === "registered-source-citation-not-found"
    )
  );
  assert.ok(unlinkedSource.quarantinedSourceIds.includes(KEP1_SOURCES[0].id));

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

  for (const citationId of [
    "CIT-0004",
    "CIT-0007",
    "CIT-0008",
    "CIT-0009",
    "CIT-0010",
    "CIT-0011",
  ]) {
    const traditionalUse = evaluateClaimCitationStaging({
      claimId: `CLAIM-${citationId}-TRADITIONAL`,
      claimType: "traditional-use",
      citationIds: [citationId],
      citations: CITATIONS,
    });
    assert.strictEqual(traditionalUse.eligibleForStaging, true);
    assert.strictEqual(traditionalUse.boundaries.publicationState, "unchanged");
    assert.strictEqual(traditionalUse.boundaries.ragState, "inactive");

    const clinicalTreatment = evaluateClaimCitationStaging({
      claimId: `CLAIM-${citationId}-TREATMENT`,
      claimType: "treatment",
      citationIds: [citationId],
      citations: CITATIONS,
    });
    assert.strictEqual(clinicalTreatment.eligibleForStaging, false);
    assert.ok(
      clinicalTreatment.errors.includes(
        `CLAIM-${citationId}-TREATMENT:authoritative-clinical-source-required:treatment`
      )
    );
  }

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

  const productSafetyClaim = evaluateClaimCitationStaging({
    claimId: "CLAIM-HOMEOPATHY-PRODUCT-SAFETY",
    claimType: "safety",
    citationIds: ["CIT-0024"],
    citations: CITATIONS,
    requiredScopeTags: ["product-safety"],
  });
  assert.strictEqual(productSafetyClaim.eligibleForStaging, true);

  const cbcInterpretationClaim = evaluateClaimCitationStaging({
    claimId: "CLAIM-CBC-INTERPRETATION",
    claimType: "laboratory-interpretation",
    citationIds: ["CIT-0016"],
    citations: CITATIONS,
    requiredScopeTags: ["cbc"],
  });
  assert.strictEqual(cbcInterpretationClaim.eligibleForStaging, true);

  console.log(
    "✅ Knowledge expansion source identifiers, canonical URLs, internal-source boundaries, and staging-only invariants verified."
  );
}

if (require.main === module) {
  runKnowledgeSourceIntegrityTests();
}
