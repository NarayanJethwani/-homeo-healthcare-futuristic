import { KEP1_DOSSIERS } from "./kep1SourceDossiers";
import type {
  KEP1ContributorAssignmentDecision,
  KEP1ContributorIntakeManifest,
  KEP1ContributorRecord,
  KEP1EditorialRole,
  KEP1ExpertiseDomain,
  KEP1SourceDossierManifest,
} from "./types";

const AS_OF_DATE = "2026-07-26";

const EDITORIAL_ROLES: KEP1EditorialRole[] = [
  "clinical-author",
  "independent-clinical-reviewer",
  "evidence-reviewer",
  "rights-reviewer",
];

const CLINICAL_EXPERTISE_BY_ENTITY: Record<string, KEP1ExpertiseDomain> = {
  D0001: "gastroenterology",
  D0002: "dermatology",
  S0001: "gastroenterology",
  S0002: "dermatology",
  R0001: "homeopathy-subject-matter",
  R0002: "homeopathy-subject-matter",
  L0001: "laboratory-medicine",
  L0002: "laboratory-medicine",
};

export interface KEP1ContributorIntakeResult {
  ready: boolean;
  errors: string[];
}

function assignmentKey(
  assignment: Pick<KEP1ContributorAssignmentDecision, "entityId" | "role">
): string {
  return `${assignment.entityId}:${assignment.role}`;
}

function isGovernedDate(value: string | null, asOfDate: string): boolean {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value) && value <= asOfDate);
}

function requiredExpertise(
  entityId: string,
  role: KEP1EditorialRole
): KEP1ExpertiseDomain {
  if (role === "evidence-reviewer") {
    return "evidence-methodology";
  }
  if (role === "rights-reviewer") {
    return "source-rights";
  }
  return CLINICAL_EXPERTISE_BY_ENTITY[entityId];
}

function validateAssignedContributor(
  contributor: KEP1ContributorRecord,
  assignment: KEP1ContributorAssignmentDecision,
  asOfDate: string
): string[] {
  const key = assignmentKey(assignment);
  const errors: string[] = [];

  if (contributor.status !== "eligible") {
    errors.push(`${key}:contributor-not-eligible`);
  }
  if (
    contributor.identity.verificationStatus !== "verified" ||
    !contributor.fullName.trim() ||
    !contributor.identity.value ||
    !isGovernedDate(contributor.identity.verifiedAt, asOfDate) ||
    !contributor.identity.verifiedBy
  ) {
    errors.push(`${key}:immutable-identity-not-verified`);
  }
  if (!contributor.eligibleRoles.includes(assignment.role)) {
    errors.push(`${key}:role-not-authorized`);
  }

  const expertise = requiredExpertise(assignment.entityId, assignment.role);
  if (!expertise || !contributor.expertiseDomains.includes(expertise)) {
    errors.push(`${key}:required-expertise-missing`);
  }

  const hasCurrentVerifiedCredential = contributor.credentials.some(
    (credential) =>
      credential.verificationStatus === "verified" &&
      Boolean(credential.credentialId) &&
      Boolean(credential.title) &&
      Boolean(credential.issuer) &&
      Boolean(credential.evidenceLocation) &&
      isGovernedDate(credential.verifiedAt, asOfDate) &&
      (!credential.expiresAt || credential.expiresAt >= asOfDate)
  );
  if (!hasCurrentVerifiedCredential) {
    errors.push(`${key}:verified-credential-evidence-required`);
  }

  if (!contributor.attestations.conflictOfInterestDeclared) {
    errors.push(`${key}:conflict-of-interest-declaration-required`);
  }
  if (!contributor.attestations.editorialIndependenceAccepted) {
    errors.push(`${key}:editorial-independence-attestation-required`);
  }
  if (!contributor.attestations.aiAssistanceDisclosureAccepted) {
    errors.push(`${key}:ai-assistance-disclosure-required`);
  }
  if (!contributor.attestations.sourceUsePolicyAccepted) {
    errors.push(`${key}:source-use-policy-attestation-required`);
  }

  return errors;
}

export function buildKEP1ContributorIntakeManifest(): KEP1ContributorIntakeManifest {
  const assignments: KEP1ContributorAssignmentDecision[] =
    KEP1_DOSSIERS.flatMap((dossier) =>
      EDITORIAL_ROLES.map((role) => ({
        entityId: dossier.entityId,
        role,
        contributorId: null,
        status: "unassigned" as const,
        proposedBy: null,
        proposedAt: null,
        ownerApproval: {
          status: "pending" as const,
          approverId: null,
          decidedAt: null,
        },
      }))
    );

  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    asOfDate: AS_OF_DATE,
    status: "contributor-intake-required",
    contributors: [],
    programOwners: [],
    assignments,
    summary: {
      contributorCount: 0,
      eligibleContributorCount: 0,
      activeProgramOwnerCount: 0,
      assignmentCount: 32,
      approvedAssignmentCount: 0,
      pendingAssignmentCount: 32,
    },
    invariants: {
      automaticIdentityVerificationForbidden: true,
      automaticCredentialApprovalForbidden: true,
      automaticAssignmentApprovalForbidden: true,
      immutableContributorIdentityRequired: true,
      authorReviewerIdentitySeparationRequired: true,
      conflictDeclarationRequired: true,
      programOwnerApprovalRequired: true,
      publicationAndRagAuthorizationGranted: false,
    },
  };
}

export function evaluateKEP1ContributorIntake(
  manifest: KEP1ContributorIntakeManifest
): KEP1ContributorIntakeResult {
  const errors: string[] = [];
  const expectedKeys = new Set(
    KEP1_DOSSIERS.flatMap((dossier) =>
      EDITORIAL_ROLES.map((role) => `${dossier.entityId}:${role}`)
    )
  );
  const contributorIds = new Set(
    manifest.contributors.map((contributor) => contributor.contributorId)
  );
  const ownerIds = new Set(
    manifest.programOwners.map((owner) => owner.approverId)
  );
  const identityKeys = [
    ...manifest.contributors.map(
      (contributor) =>
        `${contributor.identity.scheme}:${contributor.identity.value}`
    ),
    ...manifest.programOwners.map(
      (owner) => `${owner.identity.scheme}:${owner.identity.value}`
    ),
  ];
  const assignmentKeys = manifest.assignments.map(assignmentKey);

  if (contributorIds.size !== manifest.contributors.length) {
    errors.push("duplicate-contributor-id");
  }
  if (ownerIds.size !== manifest.programOwners.length) {
    errors.push("duplicate-program-owner-id");
  }
  if (new Set(identityKeys).size !== identityKeys.length) {
    errors.push("duplicate-immutable-identity");
  }
  if (
    assignmentKeys.length !== expectedKeys.size ||
    new Set(assignmentKeys).size !== expectedKeys.size ||
    assignmentKeys.some((key) => !expectedKeys.has(key))
  ) {
    errors.push("exactly-one-assignment-per-entity-role-required");
  }

  for (const assignment of manifest.assignments) {
    const key = assignmentKey(assignment);
    if (
      !assignment.contributorId ||
      assignment.status !== "approved" ||
      !assignment.proposedBy ||
      !assignment.proposedAt
    ) {
      errors.push(`${key}:assignment-incomplete`);
      continue;
    }

    const contributor = manifest.contributors.find(
      (candidate) => candidate.contributorId === assignment.contributorId
    );
    if (!contributor) {
      errors.push(`${key}:unknown-contributor`);
      continue;
    }
    errors.push(
      ...validateAssignedContributor(
        contributor,
        assignment,
        manifest.asOfDate
      )
    );

    const owner = manifest.programOwners.find(
      (candidate) =>
        candidate.approverId === assignment.ownerApproval.approverId
    );
    const proposer = manifest.programOwners.find(
      (candidate) => candidate.approverId === assignment.proposedBy
    );
    if (
      !proposer ||
      proposer.status !== "active" ||
      proposer.identity.verificationStatus !== "verified"
    ) {
      errors.push(`${key}:verified-proposer-required`);
    }
    if (
      assignment.ownerApproval.status !== "approved" ||
      !isGovernedDate(
        assignment.ownerApproval.decidedAt,
        manifest.asOfDate
      ) ||
      !isGovernedDate(assignment.proposedAt, manifest.asOfDate) ||
      assignment.ownerApproval.decidedAt! < assignment.proposedAt! ||
      !owner ||
      owner.status !== "active" ||
      owner.identity.verificationStatus !== "verified" ||
      !owner.fullName.trim() ||
      !owner.identity.value ||
      !isGovernedDate(owner.identity.verifiedAt, manifest.asOfDate) ||
      !owner.identity.verifiedBy
    ) {
      errors.push(`${key}:verified-program-owner-approval-required`);
    } else if (owner.approverId === contributor.contributorId) {
      errors.push(`${key}:self-approval-forbidden`);
    }
  }

  for (const dossier of KEP1_DOSSIERS) {
    const author = manifest.assignments.find(
      (assignment) =>
        assignment.entityId === dossier.entityId &&
        assignment.role === "clinical-author"
    );
    const reviewer = manifest.assignments.find(
      (assignment) =>
        assignment.entityId === dossier.entityId &&
        assignment.role === "independent-clinical-reviewer"
    );
    if (
      author?.contributorId &&
      reviewer?.contributorId &&
      author.contributorId === reviewer.contributorId
    ) {
      errors.push(`${dossier.entityId}:author-reviewer-conflict`);
    }
  }

  const approvedAssignmentCount = manifest.assignments.filter(
    (assignment) => assignment.status === "approved"
  ).length;
  if (
    (approvedAssignmentCount === expectedKeys.size &&
      manifest.status !== "assignments-approved") ||
    (approvedAssignmentCount !== expectedKeys.size &&
      manifest.status !== "contributor-intake-required")
  ) {
    errors.push("contributor-intake-status-mismatch");
  }
  if (
    manifest.summary.contributorCount !== manifest.contributors.length ||
    manifest.summary.eligibleContributorCount !==
      manifest.contributors.filter(
        (contributor) => contributor.status === "eligible"
      ).length ||
    manifest.summary.activeProgramOwnerCount !==
      manifest.programOwners.filter((owner) => owner.status === "active")
        .length ||
    manifest.summary.assignmentCount !== manifest.assignments.length ||
    manifest.summary.approvedAssignmentCount !== approvedAssignmentCount ||
    manifest.summary.pendingAssignmentCount !==
      manifest.assignments.filter(
        (assignment) => assignment.status !== "approved"
      ).length
  ) {
    errors.push("contributor-intake-summary-mismatch");
  }

  if (manifest.invariants.publicationAndRagAuthorizationGranted !== false) {
    errors.push("contributor-intake-cannot-authorize-publication-or-rag");
  }

  return { ready: errors.length === 0, errors };
}

export function applyApprovedKEP1Assignments(
  sourceManifest: KEP1SourceDossierManifest,
  intakeManifest: KEP1ContributorIntakeManifest
): KEP1SourceDossierManifest {
  const result = evaluateKEP1ContributorIntake(intakeManifest);
  if (!result.ready) {
    throw new Error(
      `KEP-1 contributor intake is not ready: ${result.errors.join(",")}`
    );
  }

  const nextManifest: KEP1SourceDossierManifest = JSON.parse(
    JSON.stringify(sourceManifest)
  ) as KEP1SourceDossierManifest;
  for (const dossier of nextManifest.dossiers) {
    for (const assignment of dossier.assignments) {
      const decision = intakeManifest.assignments.find(
        (candidate) =>
          candidate.entityId === dossier.entityId &&
          candidate.role === assignment.role
      );
      if (!decision?.contributorId) {
        throw new Error(
          `Approved assignment missing for ${dossier.entityId}:${assignment.role}`
        );
      }
      assignment.contributorId = decision.contributorId;
      assignment.status = "assigned";
    }
  }
  nextManifest.summary.assignedRoles = 32;
  nextManifest.summary.unassignedRoles = 0;
  return nextManifest;
}
