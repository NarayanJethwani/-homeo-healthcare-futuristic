import type { KmsKnowledgeEntity } from "@/features/knowledge-admin/types";
import { computeFastTrackEntityRevisionSha256 } from "./fastTrackDecisionService";
import type { ControlledReleaseRepository } from "./controlledReleaseTypes";
import type { ControlledReleaseExecutionActionInput } from "./controlledReleaseExecutionSchemas";
import type {
  ControlledPublicationOverride,
  ControlledReleaseExecutionActor,
  ControlledReleaseExecutionAuditEvent,
  ControlledReleaseExecutionCandidate,
  ControlledReleaseExecutionRecord,
  ControlledReleaseExecutionRepository,
  ControlledReleaseExecutionWorkspace,
} from "./controlledReleaseExecutionTypes";

const CANARY_OBSERVATION_MS = 24 * 60 * 60 * 1_000;
const OBSERVATION_GRACE_MS = 60 * 60 * 1_000;

export async function getControlledReleaseExecutionWorkspace(
  entities: readonly KmsKnowledgeEntity[],
  releaseRepository: ControlledReleaseRepository,
  executionRepository: ControlledReleaseExecutionRepository
): Promise<ControlledReleaseExecutionWorkspace> {
  const [releases, executions] = await Promise.all([
    releaseRepository.listReleases(),
    executionRepository.listExecutions(),
  ]);
  const latestReleaseByEntity = new Map<
    string,
    (typeof releases)[number]
  >();
  for (const release of releases) {
    if (!latestReleaseByEntity.has(release.entityId)) {
      latestReleaseByEntity.set(release.entityId, release);
    }
  }
  const latestExecutionByEntity = new Map<
    string,
    ControlledReleaseExecutionRecord
  >();
  for (const execution of executions) {
    if (!latestExecutionByEntity.has(execution.entityId)) {
      latestExecutionByEntity.set(execution.entityId, execution);
    }
  }

  const candidates: ControlledReleaseExecutionCandidate[] = [];
  for (const release of latestReleaseByEntity.values()) {
    const entity = entities.find(
      (candidate) => candidate.id === release.entityId
    );
    if (!entity) continue;
    const revision = computeFastTrackEntityRevisionSha256(entity);
    const currentExecution =
      latestExecutionByEntity.get(release.entityId) || null;
    const blockingReasons: string[] = [];
    if (release.outcome !== "release-authorized") {
      blockingReasons.push("release-authorization-not-active");
    }
    if (release.phase !== "canary") {
      blockingReasons.push("initial-actuator-is-canary-only");
    }
    if (
      !release.publicationReleaseAuthorized ||
      release.ragReleaseAuthorized
    ) {
      blockingReasons.push("publication-only-authorization-required");
    }
    if (entity.entityType !== "faq") {
      blockingReasons.push("faq-canary-required");
    }
    if (release.entityRevisionSha256 !== revision) {
      blockingReasons.push("authorized-revision-is-stale");
    }
    if (
      currentExecution?.outcome === "publication-canary-executed" &&
      currentExecution.releaseId === release.releaseId
    ) {
      blockingReasons.push("authorization-already-executed");
    }
    candidates.push({
      entityId: entity.id,
      title: entity.title?.en?.trim() || entity.id,
      entityRevisionSha256: revision,
      releaseId: release.releaseId,
      releaseOutcome: release.outcome,
      canExecute: blockingReasons.length === 0,
      blockingReasons,
      currentExecution,
    });
  }

  return {
    candidates,
    activeCanaryCount: [...latestExecutionByEntity.values()].filter(
      (execution) =>
        execution.outcome === "publication-canary-executed"
    ).length,
    executedCount: executions.filter(
      (execution) =>
        execution.outcome === "publication-canary-executed"
    ).length,
    rolledBackCount: executions.filter(
      (execution) =>
        execution.outcome === "publication-canary-rolled-back"
    ).length,
  };
}

export async function recordControlledReleaseExecution(
  entities: readonly KmsKnowledgeEntity[],
  releaseRepository: ControlledReleaseRepository,
  executionRepository: ControlledReleaseExecutionRepository,
  input: ControlledReleaseExecutionActionInput,
  actor: ControlledReleaseExecutionActor,
  now: string
): Promise<ControlledReleaseExecutionRecord> {
  if (
    !actor.canExecutePublication ||
    !actor.canBypassSafetyWithdrawal
  ) {
    throw new Error("CONTROLLED_EXECUTION_FORBIDDEN");
  }
  const entity = entities.find(
    (candidate) => candidate.id === input.entityId
  );
  if (!entity) {
    throw new Error("CONTROLLED_EXECUTION_ENTITY_NOT_FOUND");
  }
  const revision = computeFastTrackEntityRevisionSha256(entity);
  if (revision !== input.expectedRevisionSha256) {
    throw new Error("CONTROLLED_EXECUTION_REVISION_HASH_MISMATCH");
  }
  const releaseHead = await releaseRepository.getHead(entity.id);
  if (releaseHead?.releaseId !== input.expectedReleaseId) {
    throw new Error("CONTROLLED_EXECUTION_RELEASE_HEAD_CONFLICT");
  }
  const release = await releaseRepository.getRelease(
    input.expectedReleaseId
  );
  if (
    !release ||
    release.entityId !== entity.id ||
    release.entityRevisionSha256 !== revision
  ) {
    throw new Error("CONTROLLED_EXECUTION_RELEASE_STALE");
  }
  const executionHead = await executionRepository.getHead(entity.id);
  if (
    (executionHead?.executionId || null) !==
    input.expectedPreviousExecutionId
  ) {
    throw new Error("CONTROLLED_EXECUTION_HEAD_CONFLICT");
  }

  const executionId = `KCE:${input.requestId}`;
  const existing =
    await executionRepository.getExecution(executionId);
  if (existing) {
    if (
      existing.entityId === entity.id &&
      existing.actorId === actor.actorId &&
      existing.releaseId === release.releaseId
    ) {
      return existing;
    }
    throw new Error("CONTROLLED_EXECUTION_IMMUTABLE_CONFLICT");
  }

  let outcome: ControlledReleaseExecutionRecord["outcome"];
  let publicationApplied: boolean;
  let observationEligibleAt: string | null = null;
  let automaticRollbackAt: string | null = null;

  if (input.action === "execute-publication-canary") {
    if (
      release.outcome !== "release-authorized" ||
      release.phase !== "canary" ||
      !release.publicationReleaseAuthorized ||
      release.ragReleaseAuthorized ||
      entity.entityType !== "faq"
    ) {
      throw new Error("CONTROLLED_EXECUTION_CANARY_POLICY_FAILED");
    }
    if (
      executionHead?.outcome === "publication-canary-executed" &&
      executionHead.releaseId === release.releaseId
    ) {
      throw new Error("CONTROLLED_EXECUTION_ALREADY_ACTIVE");
    }
    const executedAt = Date.parse(now);
    if (!Number.isFinite(executedAt)) {
      throw new Error("CONTROLLED_EXECUTION_INVALID_TIME");
    }
    outcome = "publication-canary-executed";
    publicationApplied = true;
    observationEligibleAt = new Date(
      executedAt + CANARY_OBSERVATION_MS
    ).toISOString();
    automaticRollbackAt = new Date(
      executedAt + CANARY_OBSERVATION_MS + OBSERVATION_GRACE_MS
    ).toISOString();
  } else {
    if (
      !executionHead ||
      executionHead.outcome !== "publication-canary-executed" ||
      executionHead.releaseId !== release.releaseId
    ) {
      throw new Error("CONTROLLED_EXECUTION_ACTIVE_CANARY_REQUIRED");
    }
    outcome = "publication-canary-rolled-back";
    publicationApplied = false;
  }

  const execution: ControlledReleaseExecutionRecord = {
    schemaVersion: "1.0.0",
    executionId,
    releaseId: release.releaseId,
    entityId: entity.id,
    entityRevisionSha256: revision,
    outcome,
    publicationApplied,
    ragApplied: false,
    actorId: actor.actorId,
    actorName: actor.actorName,
    actorRole: actor.actorRole,
    rationale: input.rationale,
    executedAt: now,
    observationEligibleAt,
    automaticRollbackAt,
    supersedesExecutionId: executionHead?.executionId || null,
  };
  const auditEvent: ControlledReleaseExecutionAuditEvent = {
    schemaVersion: "1.0.0",
    eventId: `KCE-AUD:${input.requestId}`,
    executionId,
    releaseId: release.releaseId,
    entityId: entity.id,
    entityRevisionSha256: revision,
    outcome,
    actorId: actor.actorId,
    occurredAt: now,
    previousExecutionId: executionHead?.executionId || null,
  };
  await executionRepository.createExecution(
    execution,
    auditEvent,
    input.expectedPreviousExecutionId
  );
  return execution;
}

export async function getActiveControlledPublicationOverride(
  entity: KmsKnowledgeEntity,
  releaseRepository: ControlledReleaseRepository,
  executionRepository: ControlledReleaseExecutionRepository,
  now: string
): Promise<ControlledPublicationOverride | null> {
  const executionHead = await executionRepository.getHead(entity.id);
  if (
    !executionHead ||
    executionHead.outcome !== "publication-canary-executed"
  ) {
    return null;
  }
  const execution = await executionRepository.getExecution(
    executionHead.executionId
  );
  const releaseHead = await releaseRepository.getHead(entity.id);
  const release = releaseHead
    ? await releaseRepository.getRelease(releaseHead.releaseId)
    : null;
  const revision = computeFastTrackEntityRevisionSha256(entity);
  if (
    !execution ||
    !release ||
    releaseHead?.releaseId !== execution.releaseId ||
    execution.entityRevisionSha256 !== revision ||
    release.entityRevisionSha256 !== revision ||
    release.outcome !== "release-authorized" ||
    release.phase !== "canary" ||
    !release.publicationReleaseAuthorized ||
    release.ragReleaseAuthorized ||
    !execution.publicationApplied ||
    execution.ragApplied
  ) {
    return null;
  }
  const expiresAt = Date.parse(execution.automaticRollbackAt || "");
  const currentTime = Date.parse(now);
  if (
    !Number.isFinite(expiresAt) ||
    !Number.isFinite(currentTime) ||
    currentTime >= expiresAt
  ) {
    return null;
  }
  return {
    entityId: entity.id,
    entityRevisionSha256: revision,
    releaseId: release.releaseId,
    executionId: execution.executionId,
    publicationApplied: true,
    ragApplied: false,
  };
}
