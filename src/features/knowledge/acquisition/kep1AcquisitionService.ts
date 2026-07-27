import {
  buildKEP1SourceDossierManifest,
  KEP1_DOSSIERS,
  KEP1_SOURCES,
} from "../expansion/kep1SourceDossiers";
import type {
  KEP1EditorialRole,
  KEP1ExpertiseDomain,
} from "../expansion/types";
import { serializePrivateOnboardingRecord } from "../onboarding/privateOnboardingService";
import type {
  KEP1PrivateOnboardingRecord,
  KEP1PrivateOnboardingRepository,
} from "../onboarding/privateOnboardingTypes";
import type {
  DecideKEP1AssignmentInput,
  DecideKEP1SourceInput,
  ProposeKEP1AssignmentInput,
} from "./kep1AcquisitionSchemas";
import type {
  KEP1AcquisitionAuditEvent,
  KEP1AcquisitionRepository,
  KEP1AssignmentDecisionRecord,
  KEP1SourceAcquisitionRecord,
} from "./kep1AcquisitionTypes";

export interface KEP1AcquisitionActor {
  actorId: string;
}

const CLINICAL_EXPERTISE: Record<string, KEP1ExpertiseDomain> = {
  D0001: "gastroenterology",
  S0001: "gastroenterology",
  D0002: "dermatology",
  S0002: "dermatology",
  R0001: "homeopathy-subject-matter",
  R0002: "homeopathy-subject-matter",
  L0001: "laboratory-medicine",
  L0002: "laboratory-medicine",
};

export function kep1AssignmentId(
  entityId: string,
  role: KEP1EditorialRole
): string {
  return `${entityId}:${role}`;
}

function requiredExpertise(
  entityId: string,
  role: KEP1EditorialRole
): KEP1ExpertiseDomain {
  if (role === "evidence-reviewer") return "evidence-methodology";
  if (role === "rights-reviewer") return "source-rights";
  const expertise = CLINICAL_EXPERTISE[entityId];
  if (!expertise) throw new Error("ACQUISITION_UNKNOWN_ENTITY");
  return expertise;
}

function event(
  type: KEP1AcquisitionAuditEvent["entityType"],
  entityId: string,
  action: KEP1AcquisitionAuditEvent["action"],
  actorId: string,
  now: string,
  version: number
): KEP1AcquisitionAuditEvent {
  return {
    eventId: `KEP1-ACQ-${type}-${entityId.replace(/:/g, "-")}-${version}-${action}`,
    programId: "KEP-1",
    entityType: type,
    entityId,
    action,
    actorId,
    occurredAt: now,
    version,
  };
}

function hasCurrentCredential(
  contributor: KEP1PrivateOnboardingRecord,
  asOfDate: string
): boolean {
  return contributor.credentials.some(
    (credential) =>
      credential.verificationStatus === "verified" &&
      Boolean(credential.evidenceRef) &&
      Boolean(credential.verifiedAt) &&
      credential.verifiedAt! <= asOfDate &&
      (!credential.expiresAt || credential.expiresAt >= asOfDate)
  );
}

function assertEligibleContributor(
  contributor: KEP1PrivateOnboardingRecord | null,
  entityId: string,
  role: KEP1EditorialRole,
  asOfDate: string
): asserts contributor is KEP1PrivateOnboardingRecord {
  if (
    !contributor ||
    contributor.kind !== "contributor" ||
    contributor.status !== "eligible" ||
    contributor.identity.verificationStatus !== "verified"
  ) {
    throw new Error("ACQUISITION_ELIGIBLE_CONTRIBUTOR_REQUIRED");
  }
  if (!contributor.eligibleRoles.includes(role)) {
    throw new Error("ACQUISITION_CONTRIBUTOR_ROLE_NOT_ELIGIBLE");
  }
  if (!contributor.expertiseDomains.includes(requiredExpertise(entityId, role))) {
    throw new Error("ACQUISITION_CONTRIBUTOR_EXPERTISE_REQUIRED");
  }
  if (!hasCurrentCredential(contributor, asOfDate)) {
    throw new Error("ACQUISITION_CURRENT_CREDENTIAL_REQUIRED");
  }
  if (
    !contributor.attestations.conflictOfInterestDeclared ||
    !contributor.attestations.editorialIndependenceAccepted ||
    !contributor.attestations.aiAssistanceDisclosureAccepted ||
    !contributor.attestations.sourceUsePolicyAccepted
  ) {
    throw new Error("ACQUISITION_CONTRIBUTOR_ATTESTATIONS_REQUIRED");
  }
}

export async function proposeKEP1Assignment(
  repository: KEP1AcquisitionRepository,
  onboardingRepository: KEP1PrivateOnboardingRepository,
  input: ProposeKEP1AssignmentInput,
  actor: KEP1AcquisitionActor,
  now: string
): Promise<KEP1AssignmentDecisionRecord> {
  const dossier = KEP1_DOSSIERS.find((item) => item.entityId === input.entityId);
  if (!dossier) throw new Error("ACQUISITION_UNKNOWN_ENTITY");
  if (!dossier.assignments.some((item) => item.role === input.role)) {
    throw new Error("ACQUISITION_UNKNOWN_ASSIGNMENT");
  }
  const assignmentId = kep1AssignmentId(input.entityId, input.role);
  const current = await repository.getAssignment(assignmentId);
  if (
    (current === null && input.expectedVersion !== null) ||
    (current !== null && current.version !== input.expectedVersion)
  ) {
    throw new Error("ACQUISITION_VERSION_CONFLICT");
  }
  if (current && current.status !== "rejected") {
    throw new Error("ACQUISITION_ASSIGNMENT_ALREADY_EXISTS");
  }
  const contributor = await onboardingRepository.get(input.contributorId);
  assertEligibleContributor(
    contributor,
    input.entityId,
    input.role,
    now.slice(0, 10)
  );

  const record: KEP1AssignmentDecisionRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    assignmentId,
    entityId: input.entityId,
    role: input.role,
    contributorId: input.contributorId,
    status: "proposed",
    proposedByActorId: actor.actorId,
    proposedAt: now,
    decidedByActorId: null,
    decidedAt: null,
    programOwnerRecordId: null,
    decisionEvidenceRef: null,
    version: (current?.version || 0) + 1,
  };
  await repository.saveAssignment(
    record,
    current?.version || null,
    event(
      "assignment",
      assignmentId,
      "ASSIGNMENT_PROPOSED",
      actor.actorId,
      now,
      record.version
    )
  );
  return record;
}

export async function decideKEP1Assignment(
  repository: KEP1AcquisitionRepository,
  onboardingRepository: KEP1PrivateOnboardingRepository,
  input: DecideKEP1AssignmentInput,
  actor: KEP1AcquisitionActor,
  now: string
): Promise<KEP1AssignmentDecisionRecord> {
  const current = await repository.getAssignment(input.assignmentId);
  if (!current) throw new Error("ACQUISITION_ASSIGNMENT_NOT_FOUND");
  if (current.version !== input.expectedVersion) {
    throw new Error("ACQUISITION_VERSION_CONFLICT");
  }
  if (current.status !== "proposed") {
    throw new Error("ACQUISITION_ASSIGNMENT_NOT_PROPOSED");
  }
  if (current.proposedByActorId === actor.actorId) {
    throw new Error("ACQUISITION_MAKER_CHECKER_SEPARATION_REQUIRED");
  }
  const owner = await onboardingRepository.get(input.programOwnerRecordId);
  if (
    !owner ||
    owner.kind !== "program-owner" ||
    owner.status !== "eligible" ||
    owner.identity.verificationStatus !== "verified"
  ) {
    throw new Error("ACQUISITION_VERIFIED_PROGRAM_OWNER_REQUIRED");
  }
  if (owner.recordId === current.contributorId) {
    throw new Error("ACQUISITION_SELF_APPROVAL_FORBIDDEN");
  }

  if (input.decision === "approve") {
    const contributor = await onboardingRepository.get(current.contributorId);
    assertEligibleContributor(
      contributor,
      current.entityId,
      current.role,
      now.slice(0, 10)
    );
    const assignments = await repository.listAssignments();
    const conflictRole =
      current.role === "clinical-author"
        ? "independent-clinical-reviewer"
        : current.role === "independent-clinical-reviewer"
          ? "clinical-author"
          : null;
    const conflict = conflictRole
      ? assignments.find(
          (candidate) =>
            candidate.entityId === current.entityId &&
            candidate.role === conflictRole &&
            candidate.status === "approved"
        )
      : null;
    if (conflict?.contributorId === current.contributorId) {
      throw new Error("ACQUISITION_AUTHOR_REVIEWER_CONFLICT");
    }
  }

  const next: KEP1AssignmentDecisionRecord = {
    ...current,
    status: input.decision === "approve" ? "approved" : "rejected",
    decidedByActorId: actor.actorId,
    decidedAt: now,
    programOwnerRecordId: owner.recordId,
    decisionEvidenceRef: input.decisionEvidenceRef,
    version: current.version + 1,
  };
  const action =
    input.decision === "approve"
      ? "ASSIGNMENT_APPROVED"
      : "ASSIGNMENT_REJECTED";
  await repository.saveAssignment(
    next,
    current.version,
    event("assignment", current.assignmentId, action, actor.actorId, now, next.version)
  );
  return next;
}

export async function decideKEP1SourceRights(
  repository: KEP1AcquisitionRepository,
  onboardingRepository: KEP1PrivateOnboardingRepository,
  input: DecideKEP1SourceInput,
  actor: KEP1AcquisitionActor,
  now: string
): Promise<KEP1SourceAcquisitionRecord> {
  const source = KEP1_SOURCES.find((item) => item.id === input.sourceId);
  if (!source) throw new Error("ACQUISITION_UNKNOWN_SOURCE");
  const current = await repository.getSource(input.sourceId);
  if (
    (current === null && input.expectedVersion !== null) ||
    (current !== null && current.version !== input.expectedVersion)
  ) {
    throw new Error("ACQUISITION_VERSION_CONFLICT");
  }
  const assignments = await repository.listAssignments();
  if (
    assignments.length !== 32 ||
    assignments.some((assignment) => assignment.status !== "approved")
  ) {
    throw new Error("ACQUISITION_ALL_ASSIGNMENTS_REQUIRED");
  }
  const linkedEntityIds = KEP1_DOSSIERS.filter((dossier) =>
    dossier.sourceIds.includes(input.sourceId)
  ).map((dossier) => dossier.entityId);
  const approvedRightsReviewers = assignments.filter(
    (assignment) =>
      linkedEntityIds.includes(assignment.entityId) &&
      assignment.role === "rights-reviewer" &&
      assignment.status === "approved"
  );
  if (
    approvedRightsReviewers.length !== linkedEntityIds.length ||
    !approvedRightsReviewers.some(
      (assignment) =>
        assignment.contributorId === input.rightsReviewerContributorId
    )
  ) {
    throw new Error("ACQUISITION_ASSIGNED_RIGHTS_REVIEWER_REQUIRED");
  }
  const reviewer = await onboardingRepository.get(
    input.rightsReviewerContributorId
  );
  assertEligibleContributor(
    reviewer,
    linkedEntityIds[0],
    "rights-reviewer",
    now.slice(0, 10)
  );

  if (
    source.usePolicy === "citation-only" &&
    input.decision === "controlled-extraction-approved"
  ) {
    throw new Error("ACQUISITION_CITATION_ONLY_EXTRACTION_FORBIDDEN");
  }
  if (
    input.decision === "controlled-extraction-approved" &&
    (source.licence.status !== "public-domain" ||
      !source.licence.permitsExtraction ||
      !source.licence.permitsDerivedData)
  ) {
    throw new Error("ACQUISITION_EXTRACTION_RIGHTS_NOT_VERIFIED");
  }
  if (
    source.usePolicy === "governed-extraction" &&
    input.decision === "citation-only-confirmed"
  ) {
    throw new Error("ACQUISITION_DECISION_POLICY_MISMATCH");
  }

  const next: KEP1SourceAcquisitionRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    sourceId: input.sourceId,
    decision: input.decision,
    rightsReviewerContributorId: input.rightsReviewerContributorId,
    rightsEvidenceRef: input.rightsEvidenceRef,
    decidedByActorId: actor.actorId,
    decidedAt: now,
    version: (current?.version || 0) + 1,
  };
  await repository.saveSource(
    next,
    current?.version || null,
    event("source", input.sourceId, "SOURCE_RIGHTS_RECORDED", actor.actorId, now, next.version)
  );
  return next;
}

export async function getKEP1AcquisitionWorkspace(
  repository: KEP1AcquisitionRepository,
  onboardingRepository: KEP1PrivateOnboardingRepository
) {
  const [assignmentRecords, sourceRecords, onboardingRecords] =
    await Promise.all([
      repository.listAssignments(),
      repository.listSources(),
      onboardingRepository.list(),
    ]);
  const sourceManifest = buildKEP1SourceDossierManifest();
  const assignments = sourceManifest.dossiers.flatMap((dossier) =>
    dossier.assignments.map((assignment) => {
      const record = assignmentRecords.find(
        (candidate) =>
          candidate.assignmentId ===
          kep1AssignmentId(dossier.entityId, assignment.role)
      );
      return {
        assignmentId: kep1AssignmentId(dossier.entityId, assignment.role),
        entityId: dossier.entityId,
        entityTitle: dossier.title,
        role: assignment.role,
        contributorId: record?.contributorId || null,
        status: record?.status || "unassigned",
        version: record?.version || 0,
      };
    })
  );
  const sources = sourceManifest.sources.map((source) => {
    const record = sourceRecords.find(
      (candidate) => candidate.sourceId === source.id
    );
    return {
      sourceId: source.id,
      title: source.title,
      usePolicy: source.usePolicy,
      licenceStatus: source.licence.status,
      linkedEntityIds: sourceManifest.dossiers
        .filter((dossier) => dossier.sourceIds.includes(source.id))
        .map((dossier) => dossier.entityId),
      decision: record?.decision || "pending",
      rightsReviewerContributorId:
        record?.rightsReviewerContributorId || null,
      version: record?.version || 0,
    };
  });
  const approvedAssignmentCount = assignments.filter(
    (assignment) => assignment.status === "approved"
  ).length;
  const controlledExtractionSources = sources.filter(
    (source) => source.decision === "controlled-extraction-approved"
  ).length;

  return {
    programId: "KEP-1" as const,
    onboardingRecords: onboardingRecords.map(serializePrivateOnboardingRecord),
    assignments,
    sources,
    summary: {
      eligibleContributors: onboardingRecords.filter(
        (record) => record.kind === "contributor" && record.status === "eligible"
      ).length,
      activeProgramOwners: onboardingRecords.filter(
        (record) => record.kind === "program-owner" && record.status === "eligible"
      ).length,
      approvedAssignmentCount,
      assignmentCount: 32,
      sourceDecisionCount: sourceRecords.length,
      sourceCount: sourceManifest.sources.length,
      controlledExtractionSources,
    },
    authority: {
      acquisitionDecisionGateOpen: approvedAssignmentCount === 32,
      controlledExtractionQueueGranted: controlledExtractionSources > 0,
      draftingAuthorityGranted: false,
      publicationAuthorityGranted: false,
      productionRagAuthorityGranted: false,
    },
  };
}
