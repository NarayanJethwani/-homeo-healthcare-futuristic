import { CmsArticleDraft } from "./types";
import { EDITORIAL_REVIEWERS } from "../workflow/reviewerDirectory";
import { checkProhibitedClaims } from "../../knowledge/governance/prohibitedClaims";
import { globalKmsRepository } from "../repositories/MemoryRepository";
import { featureFlags } from "@/features/dashboard/constants/featureFlags";
import { 
  calculateCitationCompleteness, 
  calculateEvidenceReviewState,
  EVIDENCE_STRENGTH_SCORE,
  SOURCE_QUALITY_SCORE,
  EVIDENCE_REVIEW_POLICY_V1
} from "../../knowledge/retrieval/evidenceScoringService";

export interface ReadinessResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

function containsPII(text: string): boolean {
  const normalized = text.toLowerCase();
  // Emails
  if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) return true;
  // Phone numbers
  if (/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(text)) return true;
  // DOB / SSN keywords and dates
  if (/\b(?:dob|ssn|date\s*of\s*birth)\b/i.test(normalized)) return true;
  // Case / Patient identifiers
  if (/\bcase\s*#?\s*\d+\b/i.test(normalized)) return true;
  if (/\bpatient\s*#?\s*\d+\b/i.test(normalized)) return true;
  return false;
}

/**
 * Validates a CMS draft for publication readiness.
 */
export async function validatePublicationReadiness(
  draft: CmsArticleDraft
): Promise<ReadinessResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Basic Metadata presence
  if (!draft.title || draft.title.trim().length === 0) {
    errors.push("Article title is missing.");
  }
  if (!draft.slug || draft.slug.trim().length === 0) {
    errors.push("Article URL slug is missing.");
  } else if (!/^[a-z0-9-]+$/.test(draft.slug)) {
    errors.push("URL slug must contain only lowercase alphanumeric characters and hyphens.");
  }
  
  const validEntityTypes = ["disease", "symptom", "remedy", "lab-test", "faq", "research", "case-study"];
  if (!draft.entityType || !validEntityTypes.includes(draft.entityType)) {
    errors.push(`Invalid entity type '${draft.entityType}'. Must be one of: ${validEntityTypes.join(", ")}`);
  }

  // 2. Draft content existence
  if (!draft.draftContent || draft.draftContent.trim().length === 0) {
    errors.push("Article draft content body is empty.");
  }

  // 3. Summaries presence
  const isCornerstone = !!draft.metadata?.isCornerstone;
  if (!draft.patientSummary || draft.patientSummary.trim().length === 0) {
    if (isCornerstone) {
      errors.push("Cornerstone articles require a patient-friendly summary.");
    } else {
      warnings.push("Patient-friendly summary is empty.");
    }
  }
  if (!draft.practitionerSummary || draft.practitionerSummary.trim().length === 0) {
    if (isCornerstone) {
      errors.push("Cornerstone articles require a practitioner summary.");
    } else {
      warnings.push("Practitioner summary is empty.");
    }
  }

  // 4. Clinical Reviewer verification
  if (!draft.reviewer) {
    errors.push("Reviewer name is required.");
  } else {
    const activeReviewer = EDITORIAL_REVIEWERS.some(r => r.name.toLowerCase() === draft.reviewer!.toLowerCase());
    if (!activeReviewer) {
      errors.push(`Reviewer '${draft.reviewer}' is not registered in the active clinical directory.`);
    }
  }
  if (!draft.reviewerRole) {
    errors.push("Reviewer clinical specialty/role is required.");
  }
  if (!draft.clinicalReviewDate) {
    errors.push("Clinical review date is required.");
  }
  if (!draft.nextReviewDate) {
    errors.push("Next clinical review date deadline is required.");
  }

  // 5. References checks
  const refsCount = draft.references?.length || 0;
  if (draft.entityType !== "faq") {
    if (refsCount === 0) {
      errors.push("Entities (except FAQs) require at least one reference citation.");
    } else if (isCornerstone && refsCount < 3) {
      errors.push(`Cornerstone articles require at least 3 references (currently has ${refsCount}).`);
    }
  }

  // 6. PHI/PII check
  const fullText = [
    draft.title || "",
    draft.slug || "",
    draft.draftContent || "",
    draft.patientSummary || "",
    draft.practitionerSummary || "",
    draft.educationalSummary || "",
    draft.notes || ""
  ].join("\n");

  if (containsPII(fullText)) {
    errors.push("Potential PHI/PII (patient email, phone, case id, or birth date keyword) detected in draft fields.");
  }

  // 7. Prohibited Claims scans
  const claimMatches = checkProhibitedClaims(fullText);
  if (claimMatches.length > 0) {
    errors.push(`Draft contains prohibited medical claims or guarantees: ${claimMatches.join(", ")}`);
  }

  // Conventional treatment advice check
  const lowerText = fullText.toLowerCase();
  if (
    lowerText.includes("stop conventional") || 
    lowerText.includes("discontinue conventional") || 
    lowerText.includes("stop allopathic") || 
    lowerText.includes("discontinue allopathic")
  ) {
    errors.push("Draft contains prohibited advice recommending discontinuation of conventional medical treatment.");
  }

  // 8. Disclaimer / safety warnings
  const requiresDisclaimer = draft.entityType !== "faq" && draft.entityType !== "research";
  if (requiresDisclaimer) {
    const hasDisclaimerTerm = 
      lowerText.includes("disclaimer") || 
      lowerText.includes("educational only") || 
      lowerText.includes("for clinician review") ||
      lowerText.includes("consultation with a qualified") ||
      lowerText.includes("consult with physician");
    if (!hasDisclaimerTerm) {
      errors.push("Article content must contain standard medical disclaimer references or clinician consultation warning keywords.");
    }
  }

  // 9. Slug collision prevention
  if (draft.slug) {
    const allEntities = await globalKmsRepository.getEntities();
    const collision = allEntities.some(e => e.slug === draft.slug && e.id !== draft.articleId);
    if (collision) {
      errors.push(`slug collision detected: Another article is already published under slug '${draft.slug}'`);
    }
  }

  // 10. SEO Metadata
  if (draft.title && draft.title.length > 70) {
    warnings.push("Title exceeds recommended SEO length of 70 characters.");
  }
  if (draft.patientSummary && (draft.patientSummary.length < 10 || draft.patientSummary.length > 160)) {
    warnings.push("Patient summary length is outside optimal SEO meta description bounds (10-160 characters).");
  }

  // 11. Evidence Metadata Validation
  const profile = draft.evidenceProfile;

  if (featureFlags.knowledgeEvidenceScoringEnabled) {
    if (!profile) {
      errors.push("Evidence Profile is missing (required when evidence scoring is enabled).");
    } else {
      // Enforce valid enums and fields
      if (!profile.evidenceStrength) {
        errors.push("Evidence Profile: evidenceStrength is required.");
      } else if (EVIDENCE_STRENGTH_SCORE[profile.evidenceStrength] === undefined) {
        errors.push(`Evidence Profile: invalid evidenceStrength value '${profile.evidenceStrength}'.`);
      }

      if (!profile.sourceQuality) {
        errors.push("Evidence Profile: sourceQuality is required.");
      } else if (SOURCE_QUALITY_SCORE[profile.sourceQuality] === undefined) {
        errors.push(`Evidence Profile: invalid sourceQuality value '${profile.sourceQuality}'.`);
      }

      if (profile.clinicalConfidence === undefined || profile.clinicalConfidence === null) {
        errors.push("Evidence Profile: clinicalConfidence is required.");
      } else {
        const val = Number(profile.clinicalConfidence);
        if (isNaN(val) || val < 0 || val > 100 || !Number.isInteger(val)) {
          errors.push(`Evidence Profile: clinicalConfidence must be an integer between 0 and 100 (got ${profile.clinicalConfidence}).`);
        } else if (val < 50) {
          warnings.push(`Evidence Profile: clinicalConfidence is low (${val}/100).`);
        }
      }

      if (profile.editorialConfidence === undefined || profile.editorialConfidence === null) {
        errors.push("Evidence Profile: editorialConfidence is required.");
      } else {
        const val = Number(profile.editorialConfidence);
        if (isNaN(val) || val < 0 || val > 100 || !Number.isInteger(val)) {
          errors.push(`Evidence Profile: editorialConfidence must be an integer between 0 and 100 (got ${profile.editorialConfidence}).`);
        } else if (val < 50) {
          warnings.push(`Evidence Profile: editorialConfidence is low (${val}/100).`);
        }
      }

      if (profile.reviewIntervalDays !== undefined && profile.reviewIntervalDays !== null) {
        const val = Number(profile.reviewIntervalDays);
        if (isNaN(val) || val <= 0 || !Number.isInteger(val)) {
          errors.push(`Evidence Profile: reviewIntervalDays must be a positive integer (got ${profile.reviewIntervalDays}).`);
        } else if (val < EVIDENCE_REVIEW_POLICY_V1.minReviewIntervalDays || val > EVIDENCE_REVIEW_POLICY_V1.maxReviewIntervalDays) {
          errors.push(`Evidence Profile: reviewIntervalDays must be between ${EVIDENCE_REVIEW_POLICY_V1.minReviewIntervalDays} and ${EVIDENCE_REVIEW_POLICY_V1.maxReviewIntervalDays}.`);
        }
      } else {
        warnings.push("Evidence Profile: reviewIntervalDays is not configured.");
      }

      if (profile.reviewGracePeriodDays !== undefined && profile.reviewGracePeriodDays !== null) {
        const val = Number(profile.reviewGracePeriodDays);
        if (isNaN(val) || val < 0 || !Number.isInteger(val)) {
          errors.push(`Evidence Profile: reviewGracePeriodDays must be a non-negative integer.`);
        }
      }

      if (profile.reviewExpiryPolicy) {
        const allowedPolicies = ["flag-only", "ranking-penalty", "exclude-from-ai", "exclude-from-all-search"];
        if (!allowedPolicies.includes(profile.reviewExpiryPolicy)) {
          errors.push(`Evidence Profile: invalid reviewExpiryPolicy value '${profile.reviewExpiryPolicy}'.`);
        }
      }

      if (!profile.rationale || profile.rationale.trim().length === 0) {
        warnings.push("Evidence Profile: evidence rationale description is empty.");
      } else if (profile.rationale.length > 5000) {
        errors.push("Evidence Profile: evidence rationale description exceeds maximum limit of 5000 characters.");
      }

      if (!profile.assessedBy || profile.assessedBy.trim().length === 0) {
        errors.push("Evidence Profile: assessor identity is missing.");
      }
      if (!profile.assessedAt || profile.assessedAt.trim().length === 0 || isNaN(Date.parse(profile.assessedAt))) {
        errors.push("Evidence Profile: assessor timestamp is missing or invalid.");
      }

      // Check date correctness
      if (profile.nextReviewDueAt && isNaN(Date.parse(profile.nextReviewDueAt))) {
        errors.push(`Evidence Profile: calculated nextReviewDueAt date is invalid: "${profile.nextReviewDueAt}".`);
      }

      // Check source flags
      if (!profile.classicalSource && !profile.modernSource) {
        warnings.push("Evidence Profile: Neither classicalSource nor modernSource is enabled.");
      }

      // Calculate citation completeness and check warnings
      const citResult = calculateCitationCompleteness(draft.references);
      if (citResult.completenessScore < 50) {
        warnings.push(`Evidence Profile: Low structural citation completeness (${citResult.completenessScore}%).`);
      }

      if (profile.evidenceStrength === "low" || profile.evidenceStrength === "very-low") {
        warnings.push(`Evidence Profile: Low evidence strength level '${profile.evidenceStrength}'.`);
      }
      if (profile.sourceQuality === "unverified") {
        warnings.push("Evidence Profile: Source quality is unverified.");
      }

      // Check review state for warning
      if (profile.nextReviewDueAt && profile.lastReviewedAt) {
        const reviewState = calculateEvidenceReviewState({
          nextReviewDueAt: profile.nextReviewDueAt,
          referenceDate: new Date().toISOString(),
          dueSoonWindowDays: EVIDENCE_REVIEW_POLICY_V1.dueSoonWindowDays,
          gracePeriodDays: profile.reviewGracePeriodDays || EVIDENCE_REVIEW_POLICY_V1.defaultGracePeriodDays
        });
        if (reviewState === "due-soon") {
          warnings.push("Evidence Profile: Clinical review is due soon.");
        } else if (reviewState === "overdue" || reviewState === "expired") {
          warnings.push(`Evidence Profile: Clinical review is overdue (state: ${reviewState}).`);
        }
      }
    }
  } else {
    // Feature flag disabled. Only reject if evidenceProfile has malformed data structure (if present)
    if (profile) {
      if (profile.clinicalConfidence !== undefined && profile.clinicalConfidence !== null) {
        const val = Number(profile.clinicalConfidence);
        if (isNaN(val) || val < 0 || val > 100) {
          errors.push("Evidence Profile: clinicalConfidence must be between 0 and 100.");
        }
      }
      if (profile.editorialConfidence !== undefined && profile.editorialConfidence !== null) {
        const val = Number(profile.editorialConfidence);
        if (isNaN(val) || val < 0 || val > 100) {
          errors.push("Evidence Profile: editorialConfidence must be between 0 and 100.");
        }
      }
      if (profile.reviewIntervalDays !== undefined && profile.reviewIntervalDays !== null) {
        const val = Number(profile.reviewIntervalDays);
        if (isNaN(val) || val <= 0) {
          errors.push("Evidence Profile: reviewIntervalDays must be a positive integer.");
        }
      }
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings
  };
}
