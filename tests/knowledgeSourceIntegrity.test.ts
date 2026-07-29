import assert from "assert";
import { CITATIONS } from "../src/features/knowledge/content/citations";
import { buildKnowledgeSourceIntegrityReport } from "../src/features/knowledge/expansion/sourceIntegrity";
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
  assert.ok(report.eligibleCitationIds.includes("CIT-0017"));
  assert.ok(report.eligibleCitationIds.includes("CIT-0018"));
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

  console.log(
    "✅ Knowledge expansion source identifiers, canonical URLs, internal-source boundaries, and staging-only invariants verified."
  );
}

if (require.main === module) {
  runKnowledgeSourceIntegrityTests();
}
