import type { KmsKnowledgeEntity } from "@/features/knowledge-admin/types";
import {
  assessKnowledgeEntityForFastTrack,
} from "./fastTrackPolicy";
import {
  computeFastTrackEntityRevisionSha256,
} from "./fastTrackDecisionService";
import type { FastTrackDecisionRepository } from "./fastTrackDecisionTypes";
import type { ControlledReleaseActionInput } from "./controlledReleaseSchemas";
import type {
  ControlledReleaseActor,
  ControlledReleaseAuditEvent,
  ControlledReleaseCandidate,
  ControlledReleaseRecord,
  ControlledReleaseRepository,
  ControlledReleaseWorkspace,
} from "./controlledReleaseTypes";
import type { ControlledReleaseExecutionRepository } from "./controlledReleaseExecutionTypes";

function canaryRank(candidate: ControlledReleaseCandidate): number {
  const rank: Record<string, number> = {
    faq: 0,
    "lab-test": 1,
    symptom: 2,
    disease: 3,
    remedy: 4,
  };
  return rank[candidate.entityType] ?? 5;
}

function candidateFor(
  entity: KmsKnowledgeEntity,
  safetyDecisionId: string,
  decisionRevisionSha256: string,
  currentRelease: ControlledReleaseRecord | null
): ControlledReleaseCandidate {
  const assessment = assessKnowledgeEntityForFastTrack(entity);
  const entityRevisionSha256 =
    computeFastTrackEntityRevisionSha256(entity);
  const blockingReasons: string[] = [];
  if (entityRevisionSha256 !== decisionRevisionSha256) {
    blockingReasons.push("article-revision-changed-after-safety-resolution");
  }
  if (assessment.lane !== "blocked") {
    blockingReasons.push("active-safety-control-not-found");
  }
  if (!assessment.citationComplete) {
    blockingReasons.push("citation-preflight-failed");
  }
  const unresolvedCriticalFlags = assessment.flags.filter(
    (flag) =>
      flag.severity === "critical" &&
      flag.code !== "SAFETY_WITHDRAWAL_ACTIVE"
  );
  if (unresolvedCriticalFlags.length > 0) {
    blockingReasons.push("critical-content-signal-remains");
  }

  return {
    entityId: entity.id,
    title: entity.title?.en?.trim() || entity.id,
    entityType: entity.entityType,
    entityRevisionSha256,
    safetyDecisionId,
    citationIds: Array.isArray(entity.content?.references)
      ? entity.content.references.filter(
          (value: unknown): value is string => typeof value === "string"
        )
      : [],
    preflightPassed: blockingReasons.length === 0,
    blockingReasons,
    recommendedCanary: false,
    currentRelease,
    executionApplied: false,
    currentExecutionId: null,
    observationEligibleAt: null,
    observationWindowComplete: false,
  };
}

export async function getControlledReleaseWorkspace(
  entities: readonly KmsKnowledgeEntity[],
  decisionRepository: FastTrackDecisionRepository,
  releaseRepository: ControlledReleaseRepository,
  executionRepository?: ControlledReleaseExecutionRepository,
  now = new Date().toISOString()
): Promise<ControlledReleaseWorkspace> {
  const [decisions, releases, executions] = await Promise.all([
    decisionRepository.listDecisions(),
    releaseRepository.listReleases(),
    executionRepository
      ? executionRepository.listExecutions()
      : Promise.resolve([]),
  ]);
  const latestReleaseByEntity = new Map<string, ControlledReleaseRecord>();
  for (const release of releases) {
    if (!latestReleaseByEntity.has(release.entityId)) {
      latestReleaseByEntity.set(release.entityId, release);
    }
  }
  const latestSafetyDecisionByEntity = new Map<
    string,
    (typeof decisions)[number]
  >();
  for (const decision of decisions) {
    if (
      decision.outcome === "safety-resolution-recorded" &&
      !latestSafetyDecisionByEntity.has(decision.entityId)
    ) {
      latestSafetyDecisionByEntity.set(decision.entityId, decision);
    }
  }
  const candidates = [...latestSafetyDecisionByEntity.values()]
    .map((decision) => {
      const entity = entities.find(
        (candidate) => candidate.id === decision.entityId
      );
      if (!entity) return null;
      const currentRelease =
        latestReleaseByEntity.get(decision.entityId) || null;
      return candidateFor(
        entity,
        decision.decisionId,
        decision.entityRevisionSha256,
        currentRelease?.entityRevisionSha256 ===
          computeFastTrackEntityRevisionSha256(entity) &&
          currentRelease.safetyDecisionId === decision.decisionId
          ? currentRelease
          : null
      );
    })
    .filter(
      (candidate): candidate is ControlledReleaseCandidate =>
        candidate !== null
    )
    .sort(
      (left, right) =>
        canaryRank(left) - canaryRank(right) ||
        left.title.localeCompare(right.title)
    );

  const latestExecutionByEntity = new Map<
    string,
    (typeof executions)[number]
  >();
  for (const execution of executions) {
    if (!latestExecutionByEntity.has(execution.entityId)) {
      latestExecutionByEntity.set(execution.entityId, execution);
    }
  }
  for (const candidate of candidates) {
    const execution = latestExecutionByEntity.get(candidate.entityId);
    if (
      execution?.outcome === "publication-canary-executed" &&
      execution.releaseId === candidate.currentRelease?.releaseId
    ) {
      candidate.executionApplied = true;
      candidate.currentExecutionId = execution.executionId;
      candidate.observationEligibleAt =
        execution.observationEligibleAt;
      candidate.observationWindowComplete = Boolean(
        execution.observationEligibleAt &&
          Date.parse(now) >=
            Date.parse(execution.observationEligibleAt)
      );
    }
  }

  const currentReleases = [...latestReleaseByEntity.values()];
  const canaryPassed = currentReleases.some(
    (release) =>
      release.phase === "canary" &&
      release.outcome === "canary-observation-passed"
  );
  const canaryRecord = currentReleases.find(
    (release) =>
      release.phase === "canary" &&
      release.outcome !== "release-rolled-back"
  );
  if (!canaryPassed) {
    const recommended = candidates.find(
      (candidate) =>
        candidate.preflightPassed &&
        candidate.entityType === "faq" &&
        (!candidate.currentRelease ||
          candidate.currentRelease.outcome === "release-rolled-back")
    );
    if (recommended) recommended.recommendedCanary = true;
  }

  return {
    candidates,
    canaryPassed,
    canaryEntityId: canaryRecord?.entityId || null,
    authorizedCount: currentReleases.filter(
      (release) =>
        release.outcome === "release-authorized" ||
        release.outcome === "canary-observation-passed"
    ).length,
    rolledBackCount: currentReleases.filter(
      (release) => release.outcome === "release-rolled-back"
    ).length,
    executionAppliedCount: candidates.filter(
      (candidate) => candidate.executionApplied
    ).length,
  };
}

function exactAttestations(
  input: ControlledReleaseActionInput
): ControlledReleaseRecord["attestations"] {
  return { ...input.attestations };
}

export async function recordControlledReleaseAction(
  entities: readonly KmsKnowledgeEntity[],
  decisionRepository: FastTrackDecisionRepository,
  releaseRepository: ControlledReleaseRepository,
  input: ControlledReleaseActionInput,
  actor: ControlledReleaseActor,
  now: string,
  executionRepository?: ControlledReleaseExecutionRepository
): Promise<ControlledReleaseRecord> {
  if (!actor.canBypassSafetyWithdrawal) {
    throw new Error("CONTROLLED_RELEASE_FORBIDDEN");
  }
  const entity = entities.find((candidate) => candidate.id === input.entityId);
  if (!entity) throw new Error("CONTROLLED_RELEASE_ENTITY_NOT_FOUND");
  const entityRevisionSha256 =
    computeFastTrackEntityRevisionSha256(entity);
  if (entityRevisionSha256 !== input.expectedRevisionSha256) {
    throw new Error("CONTROLLED_RELEASE_REVISION_HASH_MISMATCH");
  }

  const decisionHead = await decisionRepository.getHead(entity.id);
  if (decisionHead?.decisionId !== input.expectedSafetyDecisionId) {
    throw new Error("CONTROLLED_RELEASE_SAFETY_DECISION_STALE");
  }
  const safetyDecision = await decisionRepository.getDecision(
    input.expectedSafetyDecisionId
  );
  if (
    !safetyDecision ||
    safetyDecision.outcome !== "safety-resolution-recorded" ||
    safetyDecision.entityRevisionSha256 !== entityRevisionSha256
  ) {
    throw new Error("CONTROLLED_RELEASE_SAFETY_RESOLUTION_REQUIRED");
  }

  const releaseHead = await releaseRepository.getHead(entity.id);
  if (
    (releaseHead?.releaseId || null) !== input.expectedPreviousReleaseId
  ) {
    throw new Error("CONTROLLED_RELEASE_HEAD_CONFLICT");
  }
  const workspace = await getControlledReleaseWorkspace(
    entities,
    decisionRepository,
    releaseRepository
  );
  const candidate = workspace.candidates.find(
    (item) => item.entityId === entity.id
  );
  if (!candidate?.preflightPassed) {
    throw new Error("CONTROLLED_RELEASE_PREFLIGHT_FAILED");
  }

  const releaseId = `KCR:${input.requestId}`;
  const existing = await releaseRepository.getRelease(releaseId);
  if (existing) {
    if (
      existing.entityId === entity.id &&
      existing.actorId === actor.actorId &&
      existing.entityRevisionSha256 === entityRevisionSha256
    ) {
      return existing;
    }
    throw new Error("CONTROLLED_RELEASE_IMMUTABLE_CONFLICT");
  }

  let phase = input.action === "rollback-release"
    ? candidate.currentRelease?.phase || "canary"
    : input.phase;
  let outcome: ControlledReleaseRecord["outcome"];
  let channels = { publication: false, rag: false };
  let observation: ControlledReleaseRecord["observation"] = null;

  if (input.action === "authorize-release") {
    if (!input.channels.publication && !input.channels.rag) {
      throw new Error("CONTROLLED_RELEASE_CHANNEL_REQUIRED");
    }
    if (
      (input.channels.publication && !actor.canAuthorizePublication) ||
      (input.channels.rag && !actor.canAuthorizeRag)
    ) {
      throw new Error("CONTROLLED_RELEASE_CHANNEL_FORBIDDEN");
    }
    if (input.phase === "canary") {
      if (
        workspace.canaryPassed ||
        !candidate.recommendedCanary ||
        !input.channels.publication ||
        input.channels.rag
      ) {
        throw new Error("CONTROLLED_RELEASE_CANARY_POLICY_FAILED");
      }
    } else if (!workspace.canaryPassed) {
      throw new Error("CONTROLLED_RELEASE_CANARY_OBSERVATION_REQUIRED");
    }
    outcome = "release-authorized";
    channels = { ...input.channels };
  } else if (input.action === "record-canary-observation") {
    const current = candidate.currentRelease;
    if (
      !current ||
      current.phase !== "canary" ||
      current.outcome !== "release-authorized" ||
      !current.channels.publication ||
      current.channels.rag
    ) {
      throw new Error("CONTROLLED_RELEASE_CANARY_AUTHORIZATION_REQUIRED");
    }
    if (executionRepository) {
      const executionHead = await executionRepository.getHead(entity.id);
      const execution = executionHead
        ? await executionRepository.getExecution(
            executionHead.executionId
          )
        : null;
      if (
        !execution ||
        execution.outcome !== "publication-canary-executed" ||
        execution.releaseId !== current.releaseId ||
        !execution.publicationApplied ||
        execution.ragApplied
      ) {
        throw new Error(
          "CONTROLLED_RELEASE_CANARY_EXECUTION_REQUIRED"
        );
      }
      const executionElapsed =
        Date.parse(now) - Date.parse(execution.executedAt);
      if (
        !Number.isFinite(executionElapsed) ||
        executionElapsed < 24 * 60 * 60 * 1_000
      ) {
        throw new Error(
          "CONTROLLED_RELEASE_OBSERVATION_WINDOW_INCOMPLETE"
        );
      }
    }
    const elapsedMilliseconds =
      Date.parse(now) - Date.parse(current.recordedAt);
    if (
      !Number.isFinite(elapsedMilliseconds) ||
      elapsedMilliseconds < 24 * 60 * 60 * 1_000
    ) {
      throw new Error("CONTROLLED_RELEASE_OBSERVATION_WINDOW_INCOMPLETE");
    }
    outcome = "canary-observation-passed";
    phase = "canary";
    channels = { ...current.channels };
    observation = { ...input.observation };
  } else {
    const current = candidate.currentRelease;
    if (
      !current ||
      (!current.publicationReleaseAuthorized &&
        !current.ragReleaseAuthorized)
    ) {
      throw new Error("CONTROLLED_RELEASE_ACTIVE_AUTHORIZATION_REQUIRED");
    }
    outcome = "release-rolled-back";
  }

  const release: ControlledReleaseRecord = {
    schemaVersion: "1.0.0",
    releaseId,
    entityId: entity.id,
    entityRevisionSha256,
    safetyDecisionId: safetyDecision.decisionId,
    phase,
    outcome,
    channels,
    rationale: input.rationale,
    attestations: exactAttestations(input),
    observation,
    actorId: actor.actorId,
    actorName: actor.actorName,
    actorRole: actor.actorRole,
    recordedAt: now,
    supersedesReleaseId: releaseHead?.releaseId || null,
    publicationReleaseAuthorized:
      outcome !== "release-rolled-back" && channels.publication,
    ragReleaseAuthorized:
      outcome !== "release-rolled-back" && channels.rag,
    executionApplied: false,
  };
  const auditEvent: ControlledReleaseAuditEvent = {
    schemaVersion: "1.0.0",
    eventId: `KCR-AUD:${input.requestId}`,
    releaseId,
    entityId: entity.id,
    entityRevisionSha256,
    outcome,
    actorId: actor.actorId,
    occurredAt: now,
    previousReleaseId: releaseHead?.releaseId || null,
  };
  await releaseRepository.createRelease(
    release,
    auditEvent,
    input.expectedPreviousReleaseId
  );
  return release;
}
