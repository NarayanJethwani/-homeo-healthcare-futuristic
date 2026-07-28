import type { KEP1DraftingRepository } from "../drafting/kep1DraftingTypes";
import type { KEP1EvaluationRepository } from "../evaluation/kep1EvaluationTypes";
import { getKEP1EvaluationWorkspace } from "../evaluation/kep1EvaluationService";
import type { KEP1PrivateOnboardingRepository } from "../onboarding/privateOnboardingTypes";
import type { KEP1ReviewRepository } from "../review/kep1ReviewTypes";
import type { RecordKEP1GoNoGoDecisionInput } from "./kep1DecisionSchemas";
import type {
  KEP1DecisionAuditEvent,
  KEP1DecisionRepository,
  KEP1GoNoGoDecisionRecord,
} from "./kep1DecisionTypes";

const GO_CONFIRMATION =
  "I AUTHORIZE KEP-1 GO WITHOUT PUBLICATION OR RAG AUTHORITY";
const NO_GO_CONFIRMATION = "I RECORD KEP-1 NO-GO";

export interface KEP1DecisionActor {
  actorId: string;
}

function allTrue(record: Record<string, boolean>): boolean {
  return Object.values(record).every(Boolean);
}

function ownerIsEligible(
  record: Awaited<ReturnType<KEP1PrivateOnboardingRepository["get"]>>
) {
  return Boolean(
    record &&
      record.kind === "program-owner" &&
      record.status === "eligible" &&
      record.identity.verificationStatus === "verified" &&
      record.identity.evidenceRef &&
      record.identity.verifiedAt &&
      record.attestations.conflictOfInterestDeclared &&
      record.attestations.editorialIndependenceAccepted &&
      record.attestations.aiAssistanceDisclosureAccepted &&
      record.attestations.sourceUsePolicyAccepted &&
      record.attestations.acceptanceEvidenceRef
  );
}

export async function recordKEP1GoNoGoDecision(
  decisionRepository: KEP1DecisionRepository,
  evaluationRepository: KEP1EvaluationRepository,
  draftingRepository: KEP1DraftingRepository,
  reviewRepository: KEP1ReviewRepository,
  onboardingRepository: KEP1PrivateOnboardingRepository,
  input: RecordKEP1GoNoGoDecisionInput,
  actor: KEP1DecisionActor,
  now: string
): Promise<KEP1GoNoGoDecisionRecord> {
  const evaluationWorkspace = await getKEP1EvaluationWorkspace(
    evaluationRepository,
    draftingRepository,
    reviewRepository
  );
  const currentEvaluation = evaluationWorkspace.evaluations.find(
    (evaluation) => evaluation.current
  );
  if (
    evaluationWorkspace.readiness !== "offline-evaluation-passed" ||
    !currentEvaluation ||
    currentEvaluation.status !== "passed" ||
    currentEvaluation.evaluationId !== input.evaluationId
  ) {
    throw new Error("GO_NO_GO_CURRENT_PASSING_EVALUATION_REQUIRED");
  }
  const evaluation = await evaluationRepository.getEvaluation(
    input.evaluationId
  );
  if (!evaluation || evaluation.status !== "passed") {
    throw new Error("GO_NO_GO_EVALUATION_NOT_FOUND");
  }
  if (
    evaluation.corpusManifestSha256 !==
      input.expectedCorpusManifestSha256 ||
    evaluation.querySetSha256 !== input.expectedQuerySetSha256
  ) {
    throw new Error("GO_NO_GO_EVALUATION_HASH_MISMATCH");
  }
  if (evaluation.executedByActorId === actor.actorId) {
    throw new Error("GO_NO_GO_EVALUATOR_SEPARATION_REQUIRED");
  }

  const owner = await onboardingRepository.get(input.programOwnerRecordId);
  if (!ownerIsEligible(owner)) {
    throw new Error("GO_NO_GO_ELIGIBLE_PROGRAM_OWNER_REQUIRED");
  }

  if (input.decision === "go") {
    if (!allTrue(input.checklist)) {
      throw new Error("GO_NO_GO_CHECKLIST_INCOMPLETE");
    }
    if (input.blockers.length > 0) {
      throw new Error("GO_NO_GO_UNRESOLVED_BLOCKERS");
    }
    if (input.confirmationPhrase !== GO_CONFIRMATION) {
      throw new Error("GO_NO_GO_CONFIRMATION_MISMATCH");
    }
  } else {
    if (input.blockers.length === 0) {
      throw new Error("GO_NO_GO_BLOCKERS_REQUIRED");
    }
    if (input.confirmationPhrase !== NO_GO_CONFIRMATION) {
      throw new Error("GO_NO_GO_CONFIRMATION_MISMATCH");
    }
  }

  const decisionId = `KEP1-GNG-${evaluation.evaluationId}`;
  const decision: KEP1GoNoGoDecisionRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    decisionId,
    decision: input.decision,
    evaluationId: evaluation.evaluationId,
    corpusManifestSha256: evaluation.corpusManifestSha256,
    querySetSha256: evaluation.querySetSha256,
    programOwnerRecordId: owner!.recordId,
    programOwnerRecordVersion: owner!.version,
    checklist: input.checklist,
    blockers: [...input.blockers],
    residualRisks: [...input.residualRisks],
    rationale: input.rationale,
    decisionEvidenceRef: input.decisionEvidenceRef,
    meetingMinutesRef: input.meetingMinutesRef,
    confirmationPhrase: input.confirmationPhrase,
    decidedByActorId: actor.actorId,
    decidedAt: now,
  };
  const event: KEP1DecisionAuditEvent = {
    eventId: `${decisionId}-AUD`,
    programId: "KEP-1",
    decisionId,
    decision: decision.decision,
    evaluationId: decision.evaluationId,
    corpusManifestSha256: decision.corpusManifestSha256,
    querySetSha256: decision.querySetSha256,
    programOwnerRecordId: decision.programOwnerRecordId,
    actorId: actor.actorId,
    occurredAt: now,
  };
  await decisionRepository.createDecision(decision, event);
  return decision;
}

export async function getKEP1DecisionWorkspace(
  decisionRepository: KEP1DecisionRepository,
  evaluationRepository: KEP1EvaluationRepository,
  draftingRepository: KEP1DraftingRepository,
  reviewRepository: KEP1ReviewRepository,
  onboardingRepository: KEP1PrivateOnboardingRepository
) {
  const [evaluationWorkspace, decisions, onboardingRecords] =
    await Promise.all([
      getKEP1EvaluationWorkspace(
        evaluationRepository,
        draftingRepository,
        reviewRepository
      ),
      decisionRepository.listDecisions(),
      onboardingRepository.list(),
    ]);
  const currentEvaluation = evaluationWorkspace.evaluations.find(
    (evaluation) => evaluation.current
  );
  const currentDecision = currentEvaluation
    ? decisions.find(
        (decision) => decision.evaluationId === currentEvaluation.evaluationId
      ) || null
    : null;
  const eligibleOwners = onboardingRecords
    .filter((record) => ownerIsEligible(record))
    .map((record) => ({
      recordId: record.recordId,
      version: record.version,
      updatedAt: record.updatedAt,
    }));
  return {
    programId: "KEP-1" as const,
    prerequisites: {
      ready:
        evaluationWorkspace.readiness === "offline-evaluation-passed" &&
        Boolean(currentEvaluation) &&
        eligibleOwners.length > 0,
      blockerCode:
        evaluationWorkspace.readiness === "offline-evaluation-passed"
          ? eligibleOwners.length > 0
            ? null
            : "GO_NO_GO_ELIGIBLE_PROGRAM_OWNER_REQUIRED"
          : "GO_NO_GO_CURRENT_PASSING_EVALUATION_REQUIRED",
      currentEvaluation: currentEvaluation
        ? {
            evaluationId: currentEvaluation.evaluationId,
            corpusManifestSha256:
              currentEvaluation.corpusManifestSha256,
            querySetSha256: currentEvaluation.querySetSha256,
            querySetVersion: currentEvaluation.querySetVersion,
            retrievalSystemName: currentEvaluation.retrievalSystemName,
            retrievalSystemVersion: currentEvaluation.retrievalSystemVersion,
            metrics: currentEvaluation.metrics,
            executedAt: currentEvaluation.executedAt,
          }
        : null,
      eligibleOwners,
    },
    decisions: decisions.map((decision) => ({
      decisionId: decision.decisionId,
      decision: decision.decision,
      evaluationId: decision.evaluationId,
      corpusManifestSha256: decision.corpusManifestSha256,
      querySetSha256: decision.querySetSha256,
      programOwnerRecordId: decision.programOwnerRecordId,
      blockerCount: decision.blockers.length,
      residualRiskCount: decision.residualRisks.length,
      decidedAt: decision.decidedAt,
      current:
        decision.evaluationId === currentEvaluation?.evaluationId,
    })),
    readiness:
      currentDecision?.decision === "go"
        ? "kep1-go"
        : currentDecision?.decision === "no-go"
          ? "kep1-no-go"
          : "decision-pending",
    authority: {
      kep1CompletionGranted: currentDecision?.decision === "go",
      controlledExpansionPlanningGranted:
        currentDecision?.decision === "go",
      editorialWorkflowApprovalGranted: false,
      publicationAuthorityGranted: false,
      publicIndexAuthorityGranted: false,
      embeddingAuthorityGranted: false,
      productionRagAuthorityGranted: false,
      productionMigrationAuthorityGranted: false,
    },
  };
}

export const KEP1_GO_CONFIRMATION_PHRASE = GO_CONFIRMATION;
export const KEP1_NO_GO_CONFIRMATION_PHRASE = NO_GO_CONFIRMATION;
