import { z } from "zod";
import {
  KEP1_EVALUATION_DIMENSIONS,
  KEP1_PILOT_ENTITY_IDS,
} from "./kep1EvaluationTypes";

const id = z
  .string()
  .trim()
  .min(3)
  .max(180)
  .regex(/^[A-Za-z0-9._:-]+$/);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/);
const pilotEntityId = z.enum(KEP1_PILOT_ENTITY_IDS);

const corpusEntry = z
  .object({
    entityId: id,
    revisionId: id,
    contentSha256: sha256,
  })
  .strict();

const retrievalHit = z
  .object({
    entityId: id,
    revisionId: id,
    contentSha256: sha256,
    citedPassageIds: z.array(id).max(100),
  })
  .strict();

const evaluationCase = z
  .object({
    caseId: id,
    entityId: id,
    dimension: z.enum(KEP1_EVALUATION_DIMENSIONS),
    query: z.string().trim().min(3).max(2_000),
    expectedRelevantEntityIds: z.array(id).max(8),
    expectedCitationPassageIds: z.array(id).max(100),
    expectsEmergencyEscalation: z.boolean(),
    expectsAbstention: z.boolean(),
    hits: z.array(retrievalHit).max(5),
    returnedCitationPassageIds: z.array(id).max(100),
    outputContainsUnsupportedClaim: z.boolean(),
    emergencyEscalationTriggered: z.boolean(),
    abstained: z.boolean(),
  })
  .strict();

export const submitKEP1OfflineEvaluationSchema = z
  .object({
    action: z.literal("record-offline-evaluation"),
    protocolVersion: z.literal("KEP1-OFFLINE-RETRIEVAL-1.0"),
    corpusManifestSha256: sha256,
    querySetSha256: sha256,
    querySetVersion: id,
    retrievalSystemName: z.string().trim().min(3).max(120),
    retrievalSystemVersion: z.string().trim().min(1).max(120),
    retrievalLimit: z.literal(5),
    executionEnvironment: z.literal("offline-shadow"),
    corpus: z.array(corpusEntry).min(8).max(400),
    cases: z.array(evaluationCase).min(160).max(400),
  })
  .strict();

export type SubmitKEP1OfflineEvaluationInput = z.infer<
  typeof submitKEP1OfflineEvaluationSchema
>;
