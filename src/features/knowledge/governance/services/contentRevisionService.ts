import crypto from "crypto";
import { ContentRevision, ContributorId, ClinicalReviewRecord } from "../types/governanceTypes";

/**
 * List of non-material metadata fields that do NOT alter clinical content meaning
 * and are excluded during SHA-256 canonical hashing.
 */
const VOLATILE_METADATA_FIELDS = new Set([
  "updatedAt",
  "generatedAt",
  "renderTimestamp",
  "lastModified",
  "cachedAt",
  "viewCount",
]);

/**
 * Computes a deterministic SHA-256 content hash for an entity content object.
 * Enforces key sorting, volatile field exclusion, and deterministic whitespace normalization.
 */
export function computeContentHash(content: any): string {
  if (!content) return "empty-content-hash-000000";

  const normalizeObj = (obj: any): any => {
    if (obj === null || obj === undefined) return null;
    if (typeof obj === "string") {
      // Normalize whitespace: trim and collapse carriage returns
      return obj.replace(/\r\n/g, "\n").trim();
    }
    if (typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      // Preserve array element order strictly
      return obj.map(normalizeObj);
    }

    const sortedKeys = Object.keys(obj)
      .filter((k) => !VOLATILE_METADATA_FIELDS.has(k))
      .sort();

    const sortedObj: Record<string, any> = {};
    for (const key of sortedKeys) {
      sortedObj[key] = normalizeObj(obj[key]);
    }
    return sortedObj;
  };

  const canonicalObj = normalizeObj(content);
  const jsonStr = JSON.stringify(canonicalObj);
  return crypto.createHash("sha256").update(jsonStr).digest("hex");
}

/**
 * Creates a ContentRevision record with an immutable content hash.
 */
export function createContentRevision(
  entityId: string,
  content: any,
  createdBy: ContributorId,
  changeSummary: string = "Initial revision",
  isMaterialChange: boolean = true
): ContentRevision {
  const contentHash = computeContentHash(content);
  return {
    revisionId: `REV-${entityId}-${contentHash.substring(0, 12)}`,
    entityId,
    contentHash,
    createdAt: new Date().toISOString(),
    createdBy,
    changeSummary,
    isMaterialChange,
  };
}

/**
 * Checks whether an existing approval record is valid for a target ContentRevision.
 * Returns false if material edits post-date approval.
 */
export function isApprovalValidForRevision(
  revision: ContentRevision,
  review: ClinicalReviewRecord | null | undefined
): boolean {
  if (!review) return false;
  return review.reviewedVersion === revision.contentHash || review.reviewedVersion === revision.revisionId;
}
