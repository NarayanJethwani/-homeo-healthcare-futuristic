import { z } from "zod";
import { CorpusEligibilityEntry, CorpusEligibilityRegistry } from "./CorpusEligibilityRegistry";

const ISO_UTC_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const OPAQUE_APPROVAL_ID = /^apr_[a-z0-9]{12,64}$/;
const SNAPSHOT_VERSION = /^v[0-9]+\.[0-9]+\.[0-9]+(?:-[a-z0-9.-]+)?$/;
const CANONICAL_ENTITY_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const PUBLISHED_VERSION_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

const isoUtcTimestampSchema = z.string().regex(ISO_UTC_TIMESTAMP).refine(
  (value) => Number.isFinite(Date.parse(value)),
  { message: "invalid UTC timestamp" }
);

const approvalIdSchema = z.string().regex(OPAQUE_APPROVAL_ID);

export const corpusCacheActivationEntryV1Schema = z.object({
  entityId: z.string().regex(CANONICAL_ENTITY_ID),
  entityType: z.enum(["disease", "symptom", "remedy", "lab-test", "faq", "research", "case-study"]),
  publishedVersionId: z.string().regex(PUBLISHED_VERSION_ID),
  dataClassification: z.literal("non-phi"),
  provenance: z.string().min(3).max(256).regex(/^[^\r\n]+$/),
  rightsStatus: z.enum(["public-domain", "licensed"]),
  reviewExpiresAt: isoUtcTimestampSchema,
  approvals: z.object({
    clinicalReviewId: approvalIdSchema,
    editorialReviewId: approvalIdSchema,
    rightsReviewId: approvalIdSchema
  }).strict()
}).strict();

export const corpusCacheActivationManifestV1Schema = z.object({
  schemaVersion: z.literal("1.0.0"),
  snapshotVersion: z.string().regex(SNAPSHOT_VERSION),
  approvedAt: isoUtcTimestampSchema,
  approvalExpiresAt: isoUtcTimestampSchema,
  entries: z.array(corpusCacheActivationEntryV1Schema).min(1).max(5000)
}).strict();

export type CorpusCacheActivationManifestV1 = z.infer<typeof corpusCacheActivationManifestV1Schema>;

export type ActivationManifestErrorCode =
  | "SCHEMA_INVALID"
  | "SNAPSHOT_VERSION_MISMATCH"
  | "APPROVAL_NOT_YET_VALID"
  | "APPROVAL_EXPIRED"
  | "ENTRY_REVIEW_EXPIRED"
  | "DUPLICATE_ENTITY";

export type ActivationManifestValidationResult =
  | { ok: true; manifest: Readonly<CorpusCacheActivationManifestV1> }
  | { ok: false; errorCodes: readonly ActivationManifestErrorCode[] };

export type ActivationRegistryCompileResult =
  | { ok: true; registry: CorpusEligibilityRegistry; entryCount: number; snapshotVersion: string }
  | { ok: false; errorCodes: readonly ActivationManifestErrorCode[] };

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value as Record<string, unknown>)) {
      deepFreeze(nested);
    }
    Object.freeze(value);
  }
  return value;
}

export function validateCorpusCacheActivationManifestV1(
  input: unknown,
  expectedSnapshotVersion: string,
  now = new Date()
): ActivationManifestValidationResult {
  const parsed = corpusCacheActivationManifestV1Schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errorCodes: Object.freeze(["SCHEMA_INVALID"] as ActivationManifestErrorCode[]) };
  }

  const errors = new Set<ActivationManifestErrorCode>();
  const nowMs = now.getTime();
  const manifest = parsed.data;

  if (manifest.snapshotVersion !== expectedSnapshotVersion) {
    errors.add("SNAPSHOT_VERSION_MISMATCH");
  }
  if (Date.parse(manifest.approvedAt) > nowMs) {
    errors.add("APPROVAL_NOT_YET_VALID");
  }
  if (Date.parse(manifest.approvalExpiresAt) <= nowMs) {
    errors.add("APPROVAL_EXPIRED");
  }

  const entityIds = new Set<string>();
  for (const entry of manifest.entries) {
    if (entityIds.has(entry.entityId)) {
      errors.add("DUPLICATE_ENTITY");
    }
    entityIds.add(entry.entityId);
    if (Date.parse(entry.reviewExpiresAt) <= nowMs) {
      errors.add("ENTRY_REVIEW_EXPIRED");
    }
  }

  if (errors.size > 0) {
    return { ok: false, errorCodes: Object.freeze(Array.from(errors).sort()) };
  }

  return { ok: true, manifest: deepFreeze(structuredClone(manifest)) };
}

export function compileCorpusEligibilityRegistryFromManifestV1(
  input: unknown,
  expectedSnapshotVersion: string,
  now = new Date()
): ActivationRegistryCompileResult {
  const validation = validateCorpusCacheActivationManifestV1(input, expectedSnapshotVersion, now);
  if (!validation.ok) {
    return validation;
  }

  const entries: CorpusEligibilityEntry[] = validation.manifest.entries.map((entry) => ({
    entityId: entry.entityId,
    entityType: entry.entityType,
    publishedVersionId: entry.publishedVersionId,
    dataClassification: entry.dataClassification,
    provenance: entry.provenance
  }));

  return {
    ok: true,
    registry: new CorpusEligibilityRegistry(entries),
    entryCount: entries.length,
    snapshotVersion: validation.manifest.snapshotVersion
  };
}
