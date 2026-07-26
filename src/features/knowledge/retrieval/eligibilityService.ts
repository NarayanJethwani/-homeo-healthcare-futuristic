import { featureFlags } from "@/features/dashboard/constants/featureFlags";
import { isEntityEligibleForRag } from "@/features/knowledge/governance/publicationGuard";

/**
 * Centrally determines if a governed knowledge entity is eligible for AI retrieval.
 * Enforces status checks, version snapshot availability, and legacy verification matrices.
 */
export function isEntityEligibleForRetrieval(entity: any): boolean {
  if (!entity) return false;

  // Enforce central RAG eligibility (handles transitional freeze, withdrawn status, safety issues)
  if (!isEntityEligibleForRag(entity)) {
    return false;
  }

  // 2. Must carry active "published" status
  if (entity.editorialStatus !== "published") {
    return false;
  }

  // 3. Exclude archived state
  if (entity.status === "archived" || entity.editorialStatus === "archived") {
    return false;
  }

  // 4. Verify that a published version pointer exists
  if (!entity.publishedVersionId) {
    return false;
  }

  // 5. Legacy verification check - exclude unverified, review-required or archived legacy files by default
  if (entity.legacyVerificationStatus) {
    if (
      entity.legacyVerificationStatus === "legacy-published-unverified" || 
      entity.legacyVerificationStatus === "review-required" ||
      entity.legacyVerificationStatus === "excluded" ||
      entity.legacyVerificationStatus === "archived"
    ) {
      return false;
    }
  }

  // 6. Exclude blocked or invalid content
  if (entity.blocked || entity.invalid) {
    return false;
  }

  return true;
}
