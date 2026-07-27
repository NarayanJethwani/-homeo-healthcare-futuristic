import assert from "assert";
import fs from "fs";
import path from "path";
import { buildKEP1ContributorIntakeManifest } from "../src/features/knowledge/expansion/kep1ContributorIntake";
import { buildKEP1OnboardingOperationsReport } from "../src/features/knowledge/expansion/kep1OnboardingOperations";
import type {
  KEP1ContributorRecord,
  KEP1EditorialRole,
  KEP1ExpertiseDomain,
} from "../src/features/knowledge/expansion/types";

function contributor(
  contributorId: string,
  role: KEP1EditorialRole,
  expertiseDomain: KEP1ExpertiseDomain
): KEP1ContributorRecord {
  return {
    contributorId,
    fullName: `Private ${contributorId}`,
    status: "eligible",
    identity: {
      scheme: "staff-id",
      value: `PRIVATE-${contributorId}`,
      verificationStatus: "verified",
      verifiedAt: "2026-07-26",
      verifiedBy: "PRIVATE-IDENTITY-AUDITOR",
    },
    eligibleRoles: [role],
    expertiseDomains: [expertiseDomain],
    credentials: [
      {
        credentialId: `PRIVATE-CREDENTIAL-${contributorId}`,
        title: "Verified qualification",
        issuer: "Private credential authority",
        verificationStatus: "verified",
        evidenceLocation: `private/evidence/${contributorId}`,
        verifiedAt: "2026-07-26",
        expiresAt: null,
      },
    ],
    attestations: {
      conflictOfInterestDeclared: true,
      editorialIndependenceAccepted: true,
      aiAssistanceDisclosureAccepted: true,
      sourceUsePolicyAccepted: true,
    },
  };
}

export function runKnowledgeKEP1OnboardingOperationsTests(): void {
  const intake = buildKEP1ContributorIntakeManifest();
  const initial = buildKEP1OnboardingOperationsReport(intake);
  const committed = JSON.parse(
    fs.readFileSync(
      path.resolve(
        __dirname,
        "../reports/knowledge-kep1-onboarding-operations.json"
      ),
      "utf8"
    )
  );

  assert.deepStrictEqual(committed, initial);
  assert.strictEqual(initial.status, "roster-incomplete");
  assert.strictEqual(initial.seats.length, 11);
  assert.strictEqual(initial.summary.coveredOperatingSeats, 0);
  assert.strictEqual(initial.summary.unfilledOperatingSeats, 11);
  assert.strictEqual(initial.summary.qualifiedAssignmentSlotsCovered, 0);
  assert.strictEqual(initial.summary.intakeGateReady, false);
  assert.strictEqual(initial.nextHumanActions.length, 11);
  assert.strictEqual(
    initial.invariants.onboardingReportGrantsDraftingAuthority,
    false
  );
  assert.strictEqual(initial.invariants.publicationAuthorityGranted, false);
  assert.strictEqual(initial.invariants.productionRagAuthorityGranted, false);

  const privateEvidenceMarker = "private/evidence/";
  assert.ok(!JSON.stringify(initial).includes(privateEvidenceMarker));
  assert.ok(!JSON.stringify(initial).includes("fullName"));
  assert.ok(!JSON.stringify(initial).includes("identity.value"));

  const evidenceOnly = buildKEP1ContributorIntakeManifest();
  evidenceOnly.contributors = [
    contributor(
      "EVIDENCE-REVIEWER",
      "evidence-reviewer",
      "evidence-methodology"
    ),
  ];
  const evidenceReport =
    buildKEP1OnboardingOperationsReport(evidenceOnly);
  assert.strictEqual(evidenceReport.summary.coveredOperatingSeats, 1);
  assert.strictEqual(
    evidenceReport.summary.qualifiedAssignmentSlotsCovered,
    8
  );
  assert.strictEqual(evidenceReport.status, "roster-incomplete");

  const expired = buildKEP1ContributorIntakeManifest();
  const expiredContributor = contributor(
    "EXPIRED-EVIDENCE-REVIEWER",
    "evidence-reviewer",
    "evidence-methodology"
  );
  expiredContributor.credentials[0].expiresAt = "2026-07-25";
  expired.contributors = [expiredContributor];
  assert.strictEqual(
    buildKEP1OnboardingOperationsReport(expired).summary.coveredOperatingSeats,
    0
  );

  const onePersonTwoSeats = buildKEP1ContributorIntakeManifest();
  const multiRole = contributor(
    "MULTI-ROLE",
    "clinical-author",
    "gastroenterology"
  );
  multiRole.eligibleRoles.push("independent-clinical-reviewer");
  onePersonTwoSeats.contributors = [multiRole];
  const distinctSeatReport =
    buildKEP1OnboardingOperationsReport(onePersonTwoSeats);
  assert.strictEqual(distinctSeatReport.summary.coveredOperatingSeats, 1);
  assert.strictEqual(
    distinctSeatReport.seats.filter(
      (seat) =>
        seat.expertiseDomain === "gastroenterology" &&
        seat.status === "covered"
    ).length,
    1
  );

  console.log(
    "✅ KEP-1 privacy-safe onboarding coverage, distinct-seat capacity, credential currency, human action, and zero-authority boundaries verified."
  );
}

if (require.main === module) {
  runKnowledgeKEP1OnboardingOperationsTests();
}
