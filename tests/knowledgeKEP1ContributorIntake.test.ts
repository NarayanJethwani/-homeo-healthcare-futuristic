import assert from "assert";
import fs from "fs";
import path from "path";
import { evaluateKEP1AssignmentReadiness } from "../src/features/knowledge/expansion/kep1AssignmentGate";
import {
  applyApprovedKEP1Assignments,
  buildKEP1ContributorIntakeManifest,
  evaluateKEP1ContributorIntake,
} from "../src/features/knowledge/expansion/kep1ContributorIntake";
import { buildKEP1SourceDossierManifest } from "../src/features/knowledge/expansion/kep1SourceDossiers";
import type {
  KEP1ContributorIntakeManifest,
  KEP1ContributorRecord,
  KEP1EditorialRole,
  KEP1ExpertiseDomain,
} from "../src/features/knowledge/expansion/types";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function contributor(
  contributorId: string,
  role: KEP1EditorialRole,
  expertise: KEP1ExpertiseDomain
): KEP1ContributorRecord {
  return {
    contributorId,
    fullName: `Verified ${contributorId}`,
    status: "eligible",
    identity: {
      scheme: "staff-id",
      value: contributorId,
      verificationStatus: "verified",
      verifiedAt: "2026-07-26",
      verifiedBy: "IDENTITY-AUDITOR-001",
    },
    eligibleRoles: [role],
    expertiseDomains: [expertise],
    credentials: [
      {
        credentialId: `CREDENTIAL-${contributorId}`,
        title: "Role-appropriate verified qualification",
        issuer: "Test credential authority",
        verificationStatus: "verified",
        evidenceLocation: `governance/credentials/${contributorId}`,
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

function buildApprovedIntake(): KEP1ContributorIntakeManifest {
  const manifest = buildKEP1ContributorIntakeManifest();
  const clinicalAssignments: Record<
    string,
    { author: string; reviewer: string; expertise: KEP1ExpertiseDomain }
  > = {
    D0001: {
      author: "CONTRIB-GASTRO-AUTHOR",
      reviewer: "CONTRIB-GASTRO-REVIEWER",
      expertise: "gastroenterology",
    },
    S0001: {
      author: "CONTRIB-GASTRO-AUTHOR",
      reviewer: "CONTRIB-GASTRO-REVIEWER",
      expertise: "gastroenterology",
    },
    D0002: {
      author: "CONTRIB-DERM-AUTHOR",
      reviewer: "CONTRIB-DERM-REVIEWER",
      expertise: "dermatology",
    },
    S0002: {
      author: "CONTRIB-DERM-AUTHOR",
      reviewer: "CONTRIB-DERM-REVIEWER",
      expertise: "dermatology",
    },
    L0001: {
      author: "CONTRIB-LAB-AUTHOR",
      reviewer: "CONTRIB-LAB-REVIEWER",
      expertise: "laboratory-medicine",
    },
    L0002: {
      author: "CONTRIB-LAB-AUTHOR",
      reviewer: "CONTRIB-LAB-REVIEWER",
      expertise: "laboratory-medicine",
    },
    R0001: {
      author: "CONTRIB-HOMEO-AUTHOR",
      reviewer: "CONTRIB-HOMEO-REVIEWER",
      expertise: "homeopathy-subject-matter",
    },
    R0002: {
      author: "CONTRIB-HOMEO-AUTHOR",
      reviewer: "CONTRIB-HOMEO-REVIEWER",
      expertise: "homeopathy-subject-matter",
    },
  };

  const contributorMap = new Map<string, KEP1ContributorRecord>();
  for (const assignment of Object.values(clinicalAssignments)) {
    contributorMap.set(
      assignment.author,
      contributor(
        assignment.author,
        "clinical-author",
        assignment.expertise
      )
    );
    contributorMap.set(
      assignment.reviewer,
      contributor(
        assignment.reviewer,
        "independent-clinical-reviewer",
        assignment.expertise
      )
    );
  }
  contributorMap.set(
    "CONTRIB-EVIDENCE-REVIEWER",
    contributor(
      "CONTRIB-EVIDENCE-REVIEWER",
      "evidence-reviewer",
      "evidence-methodology"
    )
  );
  contributorMap.set(
    "CONTRIB-RIGHTS-REVIEWER",
    contributor(
      "CONTRIB-RIGHTS-REVIEWER",
      "rights-reviewer",
      "source-rights"
    )
  );
  manifest.contributors = [...contributorMap.values()];
  manifest.programOwners = [
    {
      approverId: "PROGRAM-OWNER-001",
      fullName: "Verified Program Owner",
      status: "active",
      identity: {
        scheme: "staff-id",
        value: "PROGRAM-OWNER-001",
        verificationStatus: "verified",
        verifiedAt: "2026-07-26",
        verifiedBy: "IDENTITY-AUDITOR-001",
      },
    },
  ];

  for (const assignment of manifest.assignments) {
    const clinical = clinicalAssignments[assignment.entityId];
    assignment.contributorId =
      assignment.role === "clinical-author"
        ? clinical.author
        : assignment.role === "independent-clinical-reviewer"
          ? clinical.reviewer
          : assignment.role === "evidence-reviewer"
            ? "CONTRIB-EVIDENCE-REVIEWER"
            : "CONTRIB-RIGHTS-REVIEWER";
    assignment.status = "approved";
    assignment.proposedBy = "PROGRAM-OWNER-001";
    assignment.proposedAt = "2026-07-26";
    assignment.ownerApproval = {
      status: "approved",
      approverId: "PROGRAM-OWNER-001",
      decidedAt: "2026-07-26",
    };
  }

  manifest.status = "assignments-approved";
  manifest.summary = {
    contributorCount: manifest.contributors.length,
    eligibleContributorCount: manifest.contributors.length,
    activeProgramOwnerCount: 1,
    assignmentCount: 32,
    approvedAssignmentCount: 32,
    pendingAssignmentCount: 0,
  };
  return manifest;
}

export function runKnowledgeKEP1ContributorIntakeTests(): void {
  const initial = buildKEP1ContributorIntakeManifest();
  const committed = JSON.parse(
    fs.readFileSync(
      path.resolve(
        __dirname,
        "../reports/knowledge-kep1-contributor-intake.json"
      ),
      "utf8"
    )
  ) as KEP1ContributorIntakeManifest;
  assert.deepStrictEqual(committed, initial);
  assert.strictEqual(initial.contributors.length, 0);
  assert.strictEqual(initial.programOwners.length, 0);
  assert.strictEqual(initial.assignments.length, 32);
  assert.strictEqual(initial.summary.approvedAssignmentCount, 0);
  assert.strictEqual(
    evaluateKEP1ContributorIntake(initial).errors.filter((error) =>
      error.endsWith(":assignment-incomplete")
    ).length,
    32
  );

  const approved = buildApprovedIntake();
  assert.deepStrictEqual(evaluateKEP1ContributorIntake(approved), {
    ready: true,
    errors: [],
  });

  const sourceManifest = buildKEP1SourceDossierManifest();
  const assignedSourceManifest = applyApprovedKEP1Assignments(
    sourceManifest,
    approved
  );
  assert.deepStrictEqual(
    evaluateKEP1AssignmentReadiness(assignedSourceManifest, approved),
    { ready: true, errors: [] }
  );
  assert.ok(
    evaluateKEP1AssignmentReadiness(assignedSourceManifest).errors.includes(
      "verified-contributor-intake-required"
    )
  );

  const conflicted = clone(approved);
  const author = conflicted.assignments.find(
    (assignment) =>
      assignment.entityId === "D0001" &&
      assignment.role === "clinical-author"
  );
  const reviewer = conflicted.assignments.find(
    (assignment) =>
      assignment.entityId === "D0001" &&
      assignment.role === "independent-clinical-reviewer"
  );
  assert.ok(author?.contributorId);
  assert.ok(reviewer);
  reviewer.contributorId = author.contributorId;
  assert.ok(
    evaluateKEP1ContributorIntake(conflicted).errors.includes(
      "D0001:author-reviewer-conflict"
    )
  );

  const uncredentialed = clone(approved);
  uncredentialed.contributors[0].credentials[0].verificationStatus = "pending";
  assert.ok(
    evaluateKEP1ContributorIntake(uncredentialed).errors.some((error) =>
      error.endsWith(":verified-credential-evidence-required")
    )
  );

  const wrongExpertise = clone(approved);
  wrongExpertise.contributors[0].expertiseDomains = ["dermatology"];
  assert.ok(
    evaluateKEP1ContributorIntake(wrongExpertise).errors.some((error) =>
      error.endsWith(":required-expertise-missing")
    )
  );

  const selfApproved = clone(approved);
  selfApproved.programOwners[0].approverId =
    selfApproved.assignments[0].contributorId!;
  selfApproved.programOwners[0].identity.value =
    selfApproved.programOwners[0].approverId;
  for (const assignment of selfApproved.assignments) {
    assignment.ownerApproval.approverId =
      selfApproved.programOwners[0].approverId;
  }
  assert.ok(
    evaluateKEP1ContributorIntake(selfApproved).errors.some((error) =>
      error.endsWith(":self-approval-forbidden")
    )
  );

  const duplicateIdentity = clone(approved);
  duplicateIdentity.contributors[1].identity =
    clone(duplicateIdentity.contributors[0].identity);
  assert.ok(
    evaluateKEP1ContributorIntake(duplicateIdentity).errors.includes(
      "duplicate-immutable-identity"
    )
  );

  const futureApproval = clone(approved);
  futureApproval.assignments[0].ownerApproval.decidedAt = "2026-07-27";
  assert.ok(
    evaluateKEP1ContributorIntake(futureApproval).errors.some((error) =>
      error.endsWith(":verified-program-owner-approval-required")
    )
  );

  const summaryMismatch = clone(approved);
  summaryMismatch.summary.approvedAssignmentCount = 0;
  assert.ok(
    evaluateKEP1ContributorIntake(summaryMismatch).errors.includes(
      "contributor-intake-summary-mismatch"
    )
  );

  console.log(
    "✅ KEP-1 contributor identity, credential, expertise, conflict, independence, owner approval, assignment synchronization, and zero-publication/RAG boundaries verified."
  );
}

if (require.main === module) {
  runKnowledgeKEP1ContributorIntakeTests();
}
