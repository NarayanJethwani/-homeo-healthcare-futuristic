import { createHash } from "crypto";
import { KEP1_DOSSIERS } from "../expansion/kep1SourceDossiers";
import { RELATIONSHIP_REGISTRY } from "../graph/relationshipRegistry";
import { kep1AssignmentId } from "../acquisition/kep1AcquisitionService";
import type { KEP1AcquisitionRepository } from "../acquisition/kep1AcquisitionTypes";
import type { KEP1AcquisitionJobRepository } from "../acquisition/kep1AcquisitionJobTypes";
import type { KEP1PrivateOnboardingRepository } from "../onboarding/privateOnboardingTypes";
import type { CreateKEP1DraftRevisionInput } from "./kep1DraftingSchemas";
import type {
  KEP1DraftAuditEvent,
  KEP1DraftBundleRevision,
  KEP1DraftHead,
  KEP1DraftingRepository,
} from "./kep1DraftingTypes";

export interface KEP1DraftingActor {
  actorId: string;
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function draftId(entityId: string): string {
  return `KEP1-DRAFT-${entityId}`;
}

function revisionId(entityId: string, revisionNumber: number): string {
  return `${draftId(entityId)}-V${revisionNumber}`;
}

function assertUnique(values: string[], code: string) {
  if (new Set(values).size !== values.length) throw new Error(code);
}

function assertPassageReferences(
  referencedIds: string[],
  available: Set<string>
) {
  if (referencedIds.some((id) => !available.has(id))) {
    throw new Error("DRAFT_UNKNOWN_PASSAGE_REFERENCE");
  }
}

function validateClinicalBoundaries(input: CreateKEP1DraftRevisionInput) {
  assertUnique(
    input.passages.map((passage) => passage.passageId),
    "DRAFT_DUPLICATE_PASSAGE_ID"
  );
  assertUnique(
    input.claims.map((claim) => claim.claimId),
    "DRAFT_DUPLICATE_CLAIM_ID"
  );
  assertUnique(
    input.graphProposals.map((proposal) => proposal.proposalId),
    "DRAFT_DUPLICATE_GRAPH_PROPOSAL_ID"
  );
  const passageIds = new Set(input.passages.map((passage) => passage.passageId));
  for (const claim of input.claims) {
    assertUnique(claim.sourcePassageIds, "DRAFT_DUPLICATE_PASSAGE_REFERENCE");
    assertPassageReferences(claim.sourcePassageIds, passageIds);
    if (
      claim.claimType === "traditional-use" &&
      claim.evidenceStatus !== "traditional-description"
    ) {
      throw new Error("DRAFT_TRADITIONAL_USE_LABEL_REQUIRED");
    }
    if (
      claim.claimType !== "traditional-use" &&
      claim.evidenceStatus === "traditional-description"
    ) {
      throw new Error("DRAFT_TRADITIONAL_LABEL_MISAPPLIED");
    }
    if (
      input.evidenceProfile.evidenceLevel === "Traditional-Literature" &&
      [
        "diagnosis",
        "risk",
        "treatment",
        "safety",
        "emergency",
        "laboratory-interpretation",
      ].includes(claim.claimType) &&
      ["supported", "partially-supported"].includes(claim.evidenceStatus)
    ) {
      throw new Error("DRAFT_TRADITIONAL_SOURCE_CLINICAL_PROOF_FORBIDDEN");
    }
  }
  assertUnique(
    input.evidenceProfile.sourcePassageIds,
    "DRAFT_DUPLICATE_PASSAGE_REFERENCE"
  );
  assertPassageReferences(
    input.evidenceProfile.sourcePassageIds,
    passageIds
  );
  for (const proposal of input.graphProposals) {
    assertUnique(
      proposal.sourcePassageIds,
      "DRAFT_DUPLICATE_PASSAGE_REFERENCE"
    );
    assertPassageReferences(proposal.sourcePassageIds, passageIds);
    if (
      !Object.prototype.hasOwnProperty.call(
        RELATIONSHIP_REGISTRY,
        proposal.relationshipType
      )
    ) {
      throw new Error("DRAFT_UNKNOWN_RELATIONSHIP_TYPE");
    }
    if (proposal.targetEntityId === input.entityId) {
      throw new Error("DRAFT_SELF_RELATIONSHIP_FORBIDDEN");
    }
  }
}

function assertCurrentContributor(
  record: Awaited<ReturnType<KEP1PrivateOnboardingRepository["get"]>>,
  asOfDate: string
) {
  if (
    !record ||
    record.kind !== "contributor" ||
    record.status !== "eligible" ||
    record.identity.verificationStatus !== "verified" ||
    !record.eligibleRoles.includes("clinical-author")
  ) {
    throw new Error("DRAFT_ELIGIBLE_AUTHOR_REQUIRED");
  }
  if (
    !record.credentials.some(
      (credential) =>
        credential.verificationStatus === "verified" &&
        Boolean(credential.evidenceRef) &&
        Boolean(credential.verifiedAt) &&
        credential.verifiedAt! <= asOfDate &&
        (!credential.expiresAt || credential.expiresAt >= asOfDate)
    )
  ) {
    throw new Error("DRAFT_CURRENT_AUTHOR_CREDENTIAL_REQUIRED");
  }
  if (
    !record.attestations.conflictOfInterestDeclared ||
    !record.attestations.editorialIndependenceAccepted ||
    !record.attestations.aiAssistanceDisclosureAccepted ||
    !record.attestations.sourceUsePolicyAccepted
  ) {
    throw new Error("DRAFT_AUTHOR_ATTESTATIONS_REQUIRED");
  }
  return record;
}

export async function createKEP1DraftRevision(
  draftingRepository: KEP1DraftingRepository,
  acquisitionRepository: KEP1AcquisitionRepository,
  jobRepository: KEP1AcquisitionJobRepository,
  onboardingRepository: KEP1PrivateOnboardingRepository,
  input: CreateKEP1DraftRevisionInput,
  actor: KEP1DraftingActor,
  now: string
): Promise<KEP1DraftBundleRevision> {
  validateClinicalBoundaries(input);
  const dossier = KEP1_DOSSIERS.find((item) => item.entityId === input.entityId);
  if (!dossier || dossier.entityType !== input.entityType) {
    throw new Error("DRAFT_UNKNOWN_KEP1_ENTITY");
  }

  const assignmentId = kep1AssignmentId(input.entityId, "clinical-author");
  const assignment = await acquisitionRepository.getAssignment(assignmentId);
  if (
    !assignment ||
    assignment.status !== "approved" ||
    assignment.contributorId !== input.authorContributorId
  ) {
    throw new Error("DRAFT_APPROVED_AUTHOR_ASSIGNMENT_REQUIRED");
  }
  await assertCurrentContributor(
    await onboardingRepository.get(input.authorContributorId),
    now.slice(0, 10)
  );

  const artifact = await jobRepository.getArtifact(input.artifactId);
  if (!artifact) throw new Error("DRAFT_VERIFIED_ARTIFACT_REQUIRED");
  const job = await jobRepository.getJob(artifact.jobId);
  if (
    !job ||
    job.status !== "verified" ||
    job.artifactId !== artifact.artifactId ||
    !job.verificationId
  ) {
    throw new Error("DRAFT_VERIFIED_ARTIFACT_REQUIRED");
  }
  const verification = await jobRepository.getVerification(job.verificationId);
  if (
    !verification ||
    verification.artifactId !== artifact.artifactId ||
    verification.observedSha256 !== artifact.sha256 ||
    verification.observedByteLength !== artifact.byteLength
  ) {
    throw new Error("DRAFT_ARTIFACT_INTEGRITY_UNVERIFIED");
  }
  const rights = await acquisitionRepository.getSource(artifact.sourceId);
  if (
    !rights ||
    rights.decision !== "controlled-extraction-approved" ||
    rights.version !== job.rightsDecisionVersion
  ) {
    throw new Error("DRAFT_SOURCE_RIGHTS_DRIFT");
  }
  if (!dossier.sourceIds.includes(artifact.sourceId)) {
    throw new Error("DRAFT_SOURCE_NOT_REGISTERED_FOR_ENTITY");
  }

  const id = draftId(input.entityId);
  const currentHead = await draftingRepository.getHead(id);
  if (
    (currentHead === null && input.expectedRevisionNumber !== null) ||
    (currentHead !== null &&
      currentHead.currentRevisionNumber !== input.expectedRevisionNumber)
  ) {
    throw new Error("DRAFT_REVISION_CONFLICT");
  }
  const revisionNumber = (currentHead?.currentRevisionNumber || 0) + 1;
  const passages = input.passages.map((passage) => ({
    ...passage,
    contentSha256: sha256(passage.text),
  }));
  const claims = input.claims.map((claim) => ({
    ...claim,
    requiresClinicalReview: true as const,
  }));
  const evidenceProfile = {
    ...input.evidenceProfile,
    status: "draft" as const,
    reviewedBy: [] as [],
  };
  const graphProposals = input.graphProposals.map((proposal) => ({
    ...proposal,
    status: "proposed" as const,
    requiresClinicalReview: true as const,
  }));
  const canonicalDraft = JSON.stringify({
    entityId: input.entityId,
    entityType: input.entityType,
    title: input.title,
    summary: input.summary,
    artifactId: artifact.artifactId,
    artifactSha256: artifact.sha256,
    passages,
    claims,
    evidenceProfile,
    graphProposals,
  });
  const revision: KEP1DraftBundleRevision = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    draftId: id,
    revisionId: revisionId(input.entityId, revisionNumber),
    revisionNumber,
    entityId: input.entityId,
    entityType: input.entityType,
    title: input.title,
    summary: input.summary,
    status: "draft",
    jobId: job.jobId,
    artifactId: artifact.artifactId,
    artifactSha256: artifact.sha256,
    artifactByteLength: artifact.byteLength,
    verificationId: verification.verificationId,
    sourceId: artifact.sourceId,
    sourceVersion: artifact.sourceVersion,
    rightsDecisionVersion: job.rightsDecisionVersion,
    authorAssignmentId: assignment.assignmentId,
    authorAssignmentVersion: assignment.version,
    authorContributorId: assignment.contributorId,
    passages,
    claims,
    evidenceProfile,
    graphProposals,
    contentSha256: sha256(canonicalDraft),
    changeSummary: input.changeSummary,
    createdByActorId: actor.actorId,
    createdAt: now,
  };
  const head: KEP1DraftHead = {
    draftId: id,
    entityId: input.entityId,
    currentRevisionId: revision.revisionId,
    currentRevisionNumber: revisionNumber,
    updatedAt: now,
  };
  const event: KEP1DraftAuditEvent = {
    eventId: `KEP1-DRAFT-AUD-${input.entityId}-V${revisionNumber}`,
    programId: "KEP-1",
    entityId: input.entityId,
    draftId: id,
    revisionId: revision.revisionId,
    action: "DRAFT_REVISION_CREATED",
    actorId: actor.actorId,
    occurredAt: now,
    revisionNumber,
    contentSha256: revision.contentSha256,
  };
  await draftingRepository.createRevision(
    head,
    input.expectedRevisionNumber,
    revision,
    event
  );
  return revision;
}

export async function getKEP1DraftingWorkspace(
  draftingRepository: KEP1DraftingRepository,
  acquisitionRepository: KEP1AcquisitionRepository,
  jobRepository: KEP1AcquisitionJobRepository
) {
  const [heads, revisions, assignments, jobs, artifacts] = await Promise.all([
    draftingRepository.listHeads(),
    draftingRepository.listRevisions(),
    acquisitionRepository.listAssignments(),
    jobRepository.listJobs(),
    jobRepository.listArtifacts(),
  ]);
  const currentRevisions = heads
    .map((head) =>
      revisions.find(
        (revision) => revision.revisionId === head.currentRevisionId
      )
    )
    .filter((revision): revision is KEP1DraftBundleRevision => Boolean(revision))
    .map((revision) => ({
      revisionId: revision.revisionId,
      revisionNumber: revision.revisionNumber,
      entityId: revision.entityId,
      entityType: revision.entityType,
      title: revision.title,
      summary: revision.summary,
      status: revision.status,
      artifactId: revision.artifactId,
      sourceId: revision.sourceId,
      contentSha256: revision.contentSha256,
      passageCount: revision.passages.length,
      claimCount: revision.claims.length,
      graphProposalCount: revision.graphProposals.length,
      evidenceStatus: revision.evidenceProfile.status,
      createdAt: revision.createdAt,
    }));
  const verifiedArtifacts = artifacts
    .filter((artifact) =>
      jobs.some(
        (job) =>
          job.status === "verified" &&
          job.artifactId === artifact.artifactId &&
          Boolean(job.verificationId)
      )
    )
    .map((artifact) => ({
      artifactId: artifact.artifactId,
      sourceId: artifact.sourceId,
      sourceVersion: artifact.sourceVersion,
      sha256: artifact.sha256,
      byteLength: artifact.byteLength,
      mediaType: artifact.mediaType,
    }));

  return {
    programId: "KEP-1" as const,
    dossiers: KEP1_DOSSIERS.map((dossier) => ({
      entityId: dossier.entityId,
      entityType: dossier.entityType,
      title: dossier.title,
      sourceIds: dossier.sourceIds,
      approvedAuthorContributorId:
        assignments.find(
          (assignment) =>
            assignment.entityId === dossier.entityId &&
            assignment.role === "clinical-author" &&
            assignment.status === "approved"
        )?.contributorId || null,
      currentRevisionNumber:
        heads.find((head) => head.entityId === dossier.entityId)
          ?.currentRevisionNumber || null,
    })),
    verifiedArtifacts,
    drafts: currentRevisions,
    summary: {
      verifiedArtifactCount: verifiedArtifacts.length,
      draftEntityCount: heads.length,
      revisionCount: revisions.length,
      draftClaimCount: revisions.reduce(
        (count, revision) => count + revision.claims.length,
        0
      ),
      proposedGraphRelationshipCount: revisions.reduce(
        (count, revision) => count + revision.graphProposals.length,
        0
      ),
    },
    authority: {
      clinicalApprovalGranted: false,
      evidenceApprovalGranted: false,
      graphApprovalGranted: false,
      publicationAuthorityGranted: false,
      publicIndexAuthorityGranted: false,
      productionRagAuthorityGranted: false,
    },
  };
}
