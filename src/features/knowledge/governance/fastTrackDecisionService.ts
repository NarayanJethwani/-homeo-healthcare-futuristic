import type { KmsKnowledgeEntity } from "@/features/knowledge-admin/types";
import { CITATIONS } from "../content/citations";
import { computeContentHash } from "./services/contentRevisionService";
import {
  assessKnowledgeEntityForFastTrack,
  buildFastTrackSummary,
} from "./fastTrackPolicy";
import { getAuthorityLedDecisionRequirement } from "./authorityLedExpansionPolicy";
import type { RecordFastTrackDecisionInput } from "./fastTrackDecisionSchemas";
import type {
  FastTrackDecisionActor,
  FastTrackDecisionAuditEvent,
  FastTrackDecisionRecord,
  FastTrackDecisionRepository,
  FastTrackDecisionWorkspace,
} from "./fastTrackDecisionTypes";

export const SAFETY_RESOLUTION_CONFIRMATION =
  "I ACCEPT ACCOUNTABILITY FOR THIS SAFETY RESOLUTION";

function sameMembers(actual: string[], expected: string[]): boolean {
  return (
    new Set(actual).size === actual.length &&
    actual.length === expected.length &&
    actual.every((value) => expected.includes(value))
  );
}

function entityReferences(entity: KmsKnowledgeEntity): string[] {
  return Array.isArray(entity.content?.references)
    ? entity.content.references.filter(
        (reference: unknown): reference is string =>
          typeof reference === "string"
      )
    : [];
}

export function computeFastTrackEntityRevisionSha256(
  entity: KmsKnowledgeEntity
): string {
  return computeContentHash({
    id: entity.id,
    slug: entity.slug,
    entityType: entity.entityType,
    title: entity.title,
    summary: entity.summary,
    content: entity.content,
    editorialStatus: entity.editorialStatus,
    reviewStatus: entity.reviewStatus,
    evidenceLevel: entity.evidenceLevel,
    version: entity.versionInfo?.version || entity.version,
    versionUpdatedAt: entity.versionInfo?.updated,
    versionReviewedAt: entity.versionInfo?.reviewed,
    authorIdentity: entity.author?.name,
    reviewerId:
      typeof entity.reviewer === "string"
        ? entity.reviewer
        : entity.reviewer?.id || entity.reviewer?.name,
  });
}

export async function getFastTrackDecisionWorkspace(
  entities: readonly KmsKnowledgeEntity[],
  repository: FastTrackDecisionRepository
): Promise<FastTrackDecisionWorkspace> {
  const [summary, decisions] = await Promise.all([
    Promise.resolve(buildFastTrackSummary(entities)),
    repository.listDecisions(),
  ]);
  const latestByEntity = new Map<string, FastTrackDecisionRecord>();
  for (const decision of decisions) {
    if (!latestByEntity.has(decision.entityId)) {
      latestByEntity.set(decision.entityId, decision);
    }
  }

  const assessments = summary.assessments.map((assessment) => {
    const entity = entities.find((candidate) => candidate.id === assessment.entityId);
    if (!entity) throw new Error("FAST_TRACK_ENTITY_NOT_FOUND");
    const entityRevisionSha256 =
      computeFastTrackEntityRevisionSha256(entity);
    const latest = latestByEntity.get(entity.id) || null;
    const currentDecision =
      latest?.entityRevisionSha256 === entityRevisionSha256 ? latest : null;
    const isException = assessment.lane !== "background-monitoring";
    return {
      ...assessment,
      authorityRequirement:
        getAuthorityLedDecisionRequirement(assessment),
      entityRevisionSha256,
      availableCitationIds: entityReferences(entity),
      currentDecision,
      latestDecisionId: latest?.decisionId || null,
      decisionRequired: isException && !currentDecision,
    };
  });

  return {
    summary,
    assessments,
    openDecisionCount: assessments.filter(
      (assessment) => assessment.decisionRequired
    ).length,
    decidedCount: assessments.filter(
      (assessment) =>
        assessment.lane !== "background-monitoring" &&
        Boolean(assessment.currentDecision)
    ).length,
    activeSafetyControlCount: assessments.filter(
      (assessment) => assessment.lane === "blocked"
    ).length,
  };
}

export async function recordFastTrackDecision(
  repository: FastTrackDecisionRepository,
  entity: KmsKnowledgeEntity,
  input: RecordFastTrackDecisionInput,
  actor: FastTrackDecisionActor,
  now: string
): Promise<FastTrackDecisionRecord> {
  if (entity.id !== input.entityId) {
    throw new Error("FAST_TRACK_ENTITY_NOT_FOUND");
  }
  const assessment = assessKnowledgeEntityForFastTrack(entity);
  if (assessment.lane === "background-monitoring") {
    throw new Error("FAST_TRACK_EXCEPTION_REQUIRED");
  }
  const entityRevisionSha256 =
    computeFastTrackEntityRevisionSha256(entity);
  if (entityRevisionSha256 !== input.expectedRevisionSha256) {
    throw new Error("FAST_TRACK_REVISION_HASH_MISMATCH");
  }

  const decisionId = `FTD:${input.requestId}`;
  const existingDecision = await repository.getDecision(decisionId);
  if (existingDecision) {
    if (
      existingDecision.entityId === entity.id &&
      existingDecision.entityRevisionSha256 === entityRevisionSha256 &&
      existingDecision.outcome === input.outcome &&
      existingDecision.actorId === actor.actorId
    ) {
      return existingDecision;
    }
    throw new Error("FAST_TRACK_DECISION_IMMUTABLE_CONFLICT");
  }

  const head = await repository.getHead(entity.id);
  if ((head?.decisionId || null) !== input.expectedPreviousDecisionId) {
    throw new Error("FAST_TRACK_DECISION_HEAD_CONFLICT");
  }

  const expectedFlagCodes = assessment.flags.map((flag) => flag.code);
  if (!sameMembers(input.reviewedFlagCodes, expectedFlagCodes)) {
    throw new Error("FAST_TRACK_FLAG_COVERAGE_INCOMPLETE");
  }

  const registeredCitationIds = new Set(CITATIONS.map((citation) => citation.id));
  const references = entityReferences(entity);
  if (
    !input.citationIds.every(
      (citationId) =>
        references.includes(citationId) &&
        registeredCitationIds.has(citationId)
    )
  ) {
    throw new Error("FAST_TRACK_CITATION_NOT_LINKED");
  }

  const humanReviewOutcomes = new Set([
    "approved-reviewed",
    "correction-requested",
  ]);
  const safetyOutcomes = new Set([
    "safety-block-maintained",
    "safety-resolution-recorded",
  ]);
  if (
    (assessment.lane === "human-review" &&
      !humanReviewOutcomes.has(input.outcome)) ||
    (assessment.lane === "blocked" && !safetyOutcomes.has(input.outcome))
  ) {
    throw new Error("FAST_TRACK_OUTCOME_LANE_MISMATCH");
  }

  if (
    (input.outcome === "approved-reviewed" ||
      input.outcome === "safety-resolution-recorded") &&
    input.citationIds.length === 0
  ) {
    throw new Error("FAST_TRACK_CITATION_REQUIRED");
  }

  if (input.outcome === "safety-resolution-recorded") {
    if (!actor.canResolveSafetyWithdrawal) {
      throw new Error("FAST_TRACK_SAFETY_RESOLUTION_FORBIDDEN");
    }
    if (
      !input.attestations.safetyCauseResolved ||
      input.safetyConfirmation !== SAFETY_RESOLUTION_CONFIRMATION
    ) {
      throw new Error("FAST_TRACK_SAFETY_CONFIRMATION_REQUIRED");
    }
  } else if (input.attestations.safetyCauseResolved) {
    throw new Error("FAST_TRACK_SAFETY_ATTESTATION_INVALID");
  }

  const decision: FastTrackDecisionRecord = {
    schemaVersion: "1.0.0",
    decisionId,
    entityId: entity.id,
    entityRevisionSha256,
    outcome: input.outcome,
    reviewedFlagCodes: [...input.reviewedFlagCodes].sort(),
    citationIds: [...input.citationIds].sort(),
    rationale: input.rationale,
    attestations: { ...input.attestations },
    actorId: actor.actorId,
    actorName: actor.actorName,
    actorRole: actor.actorRole,
    recordedAt: now,
    supersedesDecisionId: head?.decisionId || null,
    publicationAuthorityGranted: false,
    ragAuthorityGranted: false,
  };
  const auditEvent: FastTrackDecisionAuditEvent = {
    schemaVersion: "1.0.0",
    eventId: `FTD-AUD:${input.requestId}`,
    decisionId,
    entityId: entity.id,
    entityRevisionSha256,
    outcome: input.outcome,
    actorId: actor.actorId,
    occurredAt: now,
    previousDecisionId: head?.decisionId || null,
  };

  await repository.createDecision(
    decision,
    auditEvent,
    input.expectedPreviousDecisionId
  );
  return decision;
}
