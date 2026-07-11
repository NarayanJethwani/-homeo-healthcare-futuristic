import type { 
  EvidenceStrength, 
  SourceQuality, 
  ReviewExpiryPolicy, 
  EvidenceReviewState,
  KnowledgeEvidenceProfile 
} from "../types";
export type { EvidenceReviewState };

// Centralized immutable configuration
export const EVIDENCE_REVIEW_POLICY_V1 = {
  dueSoonWindowDays: 30,
  defaultGracePeriodDays: 90,
  minReviewIntervalDays: 1,
  maxReviewIntervalDays: 3650,
  defaultReviewIntervalDays: 365,
} as const;

export const RETRIEVAL_PRIORITY_WEIGHTS_V1 = {
  evidenceStrength: 0.25,
  sourceQuality: 0.20,
  clinicalConfidence: 0.15,
  editorialConfidence: 0.10,
  citationCompleteness: 0.15,
  reviewFreshness: 0.10,
  sourceTypeAdjustment: 0.05,
} as const;

export const EVIDENCE_STRENGTH_SCORE: Record<EvidenceStrength, number> = {
  "very-low": 20,
  "low": 40,
  "moderate": 60,
  "high": 80,
  "very-high": 100,
} as const;

export const SOURCE_QUALITY_SCORE: Record<SourceQuality, number> = {
  "unverified": 10,
  "secondary": 40,
  "primary": 65,
  "peer-reviewed": 85,
  "authoritative": 100,
} as const;

export interface CitationCompletenessResult {
  totalReferences: number;
  structurallyCompleteReferences: number;
  duplicateReferences: number;
  completenessScore: number;
  warnings: string[];
}

export interface RetrievalPriorityInput {
  evidenceProfile?: KnowledgeEvidenceProfile;
  reviewState: EvidenceReviewState;
  citationCount: number;
  validCitationCount: number;
  sourceType?: string;
  publicationDate?: string;
}

export interface RetrievalPriorityResult {
  score: number;
  components: {
    evidenceStrength: number;
    sourceQuality: number;
    clinicalConfidence: number;
    editorialConfidence: number;
    citationCompleteness: number;
    reviewFreshness: number;
    sourceTypeAdjustment: number;
  };
  warnings: string[];
  methodologyVersion: string;
}

/**
 * Calculates next review due date deterministically using UTC timestamps.
 */
export function calculateNextReviewDueAt(
  lastReviewedAt: string,
  reviewIntervalDays: number
): string {
  if (!lastReviewedAt) {
    throw new Error("lastReviewedAt date is required");
  }
  const date = new Date(lastReviewedAt);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid lastReviewedAt date");
  }
  
  if (
    reviewIntervalDays < EVIDENCE_REVIEW_POLICY_V1.minReviewIntervalDays ||
    reviewIntervalDays > EVIDENCE_REVIEW_POLICY_V1.maxReviewIntervalDays
  ) {
    throw new Error(`reviewIntervalDays must be between ${EVIDENCE_REVIEW_POLICY_V1.minReviewIntervalDays} and ${EVIDENCE_REVIEW_POLICY_V1.maxReviewIntervalDays}`);
  }

  // Safe UTC addition: add days in milliseconds
  const nextDate = new Date(date.getTime() + reviewIntervalDays * 24 * 60 * 60 * 1000);
  return nextDate.toISOString();
}

/**
 * Deterministically determines review state relative to a reference date.
 */
export function calculateEvidenceReviewState(input: {
  nextReviewDueAt?: string;
  lastReviewedAt?: string;
  referenceDate?: string;
  dueSoonWindowDays: number;
  gracePeriodDays: number;
}): EvidenceReviewState {
  const { nextReviewDueAt, referenceDate, dueSoonWindowDays, gracePeriodDays } = input;
  
  if (!nextReviewDueAt) {
    return "not-configured";
  }

  const refDate = referenceDate ? new Date(referenceDate) : new Date();
  if (isNaN(refDate.getTime())) {
    return "not-configured";
  }

  const dueDate = new Date(nextReviewDueAt);
  if (isNaN(dueDate.getTime())) {
    return "not-configured";
  }

  // Timezone-neutral millisecond differences converted to days
  const msDiff = dueDate.getTime() - refDate.getTime();
  const daysRemaining = msDiff / (24 * 60 * 60 * 1000);

  if (daysRemaining > dueSoonWindowDays) {
    return "current";
  }
  if (daysRemaining >= 0) {
    return "due-soon";
  }
  
  const overdueDays = Math.abs(daysRemaining);
  if (overdueDays <= gracePeriodDays) {
    return "overdue";
  }
  return "expired";
}

/**
 * Assesses references structurally for citation completeness.
 */
export function calculateCitationCompleteness(
  references?: any[]
): CitationCompletenessResult {
  if (!references || !Array.isArray(references) || references.length === 0) {
    return {
      totalReferences: 0,
      structurallyCompleteReferences: 0,
      duplicateReferences: 0,
      completenessScore: 0,
      warnings: ["No reference citations configured."]
    };
  }

  const totalReferences = references.length;
  let structurallyCompleteReferences = 0;
  let duplicateReferences = 0;
  const warnings: string[] = [];

  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const seenKeys = new Set<string>();

  for (let i = 0; i < references.length; i++) {
    const ref = references[i];
    if (!ref) {
      warnings.push(`Reference at index ${i} is empty or null.`);
      continue;
    }

    if (typeof ref === "string") {
      const cleanRef = ref.trim();
      if (cleanRef.length === 0) {
        warnings.push(`Reference at index ${i} is an empty string.`);
        continue;
      }
      if (seenKeys.has(cleanRef)) {
        duplicateReferences++;
        warnings.push(`Duplicate legacy reference detected: "${cleanRef}".`);
        continue;
      }
      seenKeys.add(cleanRef);

      if (cleanRef.length < 5) {
        warnings.push(`Legacy reference at index ${i} is too short: "${cleanRef}".`);
        continue;
      }

      structurallyCompleteReferences++;
    } else if (typeof ref === "object") {
      const keys = Object.keys(ref);
      if (keys.length === 0) {
        warnings.push(`Reference at index ${i} is an empty object.`);
        continue;
      }

      const id = ref.id ? String(ref.id).trim() : "";
      const title = ref.title ? String(ref.title).trim() : "";
      const doi = ref.doi ? String(ref.doi).trim() : "";
      const pubmedId = ref.pubmedId ? String(ref.pubmedId).trim() : "";
      const url = ref.url ? String(ref.url).trim() : "";

      let isDuplicate = false;
      if (id && seenIds.has(id)) isDuplicate = true;
      if (title && seenTitles.has(title.toLowerCase())) isDuplicate = true;
      if (doi && seenKeys.has(`doi:${doi.toLowerCase()}`)) isDuplicate = true;
      if (pubmedId && seenKeys.has(`pmid:${pubmedId}`)) isDuplicate = true;

      if (isDuplicate) {
        duplicateReferences++;
        warnings.push(`Duplicate reference detected at index ${i}: "${title || id}".`);
        continue;
      }

      if (id) seenIds.add(id);
      if (title) seenTitles.add(title.toLowerCase());
      if (doi) seenKeys.add(`doi:${doi.toLowerCase()}`);
      if (pubmedId) seenKeys.add(`pmid:${pubmedId}`);

      let complete = true;
      if (!title) {
        complete = false;
        warnings.push(`Reference at index ${i} is missing a title.`);
      }

      const authors = ref.authors;
      const hasAuthors = authors && (
        (Array.isArray(authors) && authors.length > 0 && authors.every(a => String(a).trim().length > 0)) ||
        (typeof authors === "string" && authors.trim().length > 0)
      );
      if (!hasAuthors) {
        complete = false;
        warnings.push(`Reference "${title || id || i}" is missing authors.`);
      }

      const hasIdentifier = doi || pubmedId || url;
      if (!hasIdentifier) {
        complete = false;
        warnings.push(`Reference "${title || id || i}" lacks a unique identifier (DOI, PubMed ID, or URL).`);
      }

      if (url && !/^https?:\/\/\S+/.test(url)) {
        complete = false;
        warnings.push(`Reference "${title || id || i}" has an invalid URL format: "${url}".`);
      }

      if (complete) {
        structurallyCompleteReferences++;
      }
    } else {
      warnings.push(`Reference at index ${i} has an unrecognized type.`);
    }
  }

  const completenessScore = Math.round(
    (structurallyCompleteReferences / Math.max(1, totalReferences)) * 100
  );

  return {
    totalReferences,
    structurallyCompleteReferences,
    duplicateReferences,
    completenessScore,
    warnings
  };
}

/**
 * Calculates deterministic retrieval priority score (0-100).
 */
export function calculateRetrievalPriority(
  input: RetrievalPriorityInput
): RetrievalPriorityResult {
  const warnings: string[] = [];
  const methodologyVersion = "evidence-retrieval-v1";
  
  const profile = input.evidenceProfile;

  // 1. Evidence Strength
  let strengthComp = 40; // Default: low
  if (profile?.evidenceStrength) {
    if (EVIDENCE_STRENGTH_SCORE[profile.evidenceStrength] !== undefined) {
      strengthComp = EVIDENCE_STRENGTH_SCORE[profile.evidenceStrength];
    } else {
      warnings.push(`Invalid evidenceStrength value: "${profile.evidenceStrength}". Falling back to default.`);
    }
  } else {
    warnings.push("Missing evidenceStrength. Falling back to default.");
  }

  // 2. Source Quality
  let qualityComp = 10; // Default: unverified
  if (profile?.sourceQuality) {
    if (SOURCE_QUALITY_SCORE[profile.sourceQuality] !== undefined) {
      qualityComp = SOURCE_QUALITY_SCORE[profile.sourceQuality];
    } else {
      warnings.push(`Invalid sourceQuality value: "${profile.sourceQuality}". Falling back to default.`);
    }
  } else {
    warnings.push("Missing sourceQuality. Falling back to default.");
  }

  // 3. Clinical Confidence
  let clinicalComp = 40; // Default: neutral-low
  if (profile?.clinicalConfidence !== undefined) {
    const val = Number(profile.clinicalConfidence);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      clinicalComp = val;
    } else {
      warnings.push(`Invalid clinicalConfidence: ${profile.clinicalConfidence}. Out of bounds [0-100].`);
    }
  } else {
    warnings.push("Missing clinicalConfidence. Falling back to default.");
  }

  // 4. Editorial Confidence
  let editorialComp = 40; // Default: neutral-low
  if (profile?.editorialConfidence !== undefined) {
    const val = Number(profile.editorialConfidence);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      editorialComp = val;
    } else {
      warnings.push(`Invalid editorialConfidence: ${profile.editorialConfidence}. Out of bounds [0-100].`);
    }
  } else {
    warnings.push("Missing editorialConfidence. Falling back to default.");
  }

  // 5. Citation Completeness
  let citationComp = 0;
  if (profile?.citationCompleteness !== undefined) {
    const val = Number(profile.citationCompleteness);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      citationComp = val;
    } else {
      warnings.push(`Invalid citationCompleteness profile field: ${profile.citationCompleteness}.`);
    }
  } else if (input.citationCount !== undefined && input.validCitationCount !== undefined) {
    citationComp = input.citationCount > 0 
      ? Math.round((input.validCitationCount / input.citationCount) * 100)
      : 0;
  }

  // 6. Review Freshness
  let baseFreshness = 50; // Default: not-configured
  if (input.reviewState === "current") {
    baseFreshness = 100;
  } else if (input.reviewState === "due-soon") {
    baseFreshness = 75;
  } else if (input.reviewState === "overdue") {
    baseFreshness = 30;
  } else if (input.reviewState === "expired") {
    baseFreshness = 0;
  }

  const policy = profile?.reviewExpiryPolicy || "ranking-penalty";
  const policyResult = applyReviewPolicyToFreshness({
    baseFreshnessScore: baseFreshness,
    reviewPolicy: policy,
    reviewState: input.reviewState
  });

  const reviewComp = policyResult.freshnessScore;
  if (policyResult.warnings.length > 0) {
    warnings.push(...policyResult.warnings);
  }

  // 7. Source Type Adjustment
  let sourceTypeComp = 0;
  if (profile) {
    const classical = !!profile.classicalSource;
    const modern = !!profile.modernSource;
    sourceTypeComp = (classical ? 50 : 0) + (modern ? 50 : 0);
  }

  // Ensure weights sum is asserted at runtime (must be exactly 1)
  const sumWeights = 
    RETRIEVAL_PRIORITY_WEIGHTS_V1.evidenceStrength +
    RETRIEVAL_PRIORITY_WEIGHTS_V1.sourceQuality +
    RETRIEVAL_PRIORITY_WEIGHTS_V1.clinicalConfidence +
    RETRIEVAL_PRIORITY_WEIGHTS_V1.editorialConfidence +
    RETRIEVAL_PRIORITY_WEIGHTS_V1.citationCompleteness +
    RETRIEVAL_PRIORITY_WEIGHTS_V1.reviewFreshness +
    RETRIEVAL_PRIORITY_WEIGHTS_V1.sourceTypeAdjustment;

  if (Math.abs(sumWeights - 1.0) > 1e-9) {
    throw new Error("Scoring methodology configuration error: Weight total is not equal to 1.0.");
  }

  // Calculate weighted sum
  const finalScoreRaw = 
    strengthComp * RETRIEVAL_PRIORITY_WEIGHTS_V1.evidenceStrength +
    qualityComp * RETRIEVAL_PRIORITY_WEIGHTS_V1.sourceQuality +
    clinicalComp * RETRIEVAL_PRIORITY_WEIGHTS_V1.clinicalConfidence +
    editorialComp * RETRIEVAL_PRIORITY_WEIGHTS_V1.editorialConfidence +
    citationComp * RETRIEVAL_PRIORITY_WEIGHTS_V1.citationCompleteness +
    reviewComp * RETRIEVAL_PRIORITY_WEIGHTS_V1.reviewFreshness +
    sourceTypeComp * RETRIEVAL_PRIORITY_WEIGHTS_V1.sourceTypeAdjustment;

  // Bounded output
  const score = Math.max(0, Math.min(100, Math.round(finalScoreRaw)));

  return {
    score,
    components: {
      evidenceStrength: strengthComp,
      sourceQuality: qualityComp,
      clinicalConfidence: clinicalComp,
      editorialConfidence: editorialComp,
      citationCompleteness: citationComp,
      reviewFreshness: reviewComp,
      sourceTypeAdjustment: sourceTypeComp
    },
    warnings,
    methodologyVersion
  };
}

export type KnowledgeRetrievalContext =
  | "ai-clinical-context"
  | "manual-clinical-search"
  | "public-search"
  | "admin-search";

export type ReviewExclusionThreshold = "overdue" | "expired";

export function applyReviewPolicyToFreshness(input: {
  baseFreshnessScore: number;
  reviewPolicy: ReviewExpiryPolicy;
  reviewState: EvidenceReviewState;
}): {
  freshnessScore: number;
  applyPenalty: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  let freshnessScore = input.baseFreshnessScore;
  let applyPenalty = false;

  // flag-only never applies penalty and restores freshness to neutral baseline 100
  if (input.reviewPolicy === "flag-only") {
    if (input.reviewState === "overdue" || input.reviewState === "expired") {
      freshnessScore = 100; // neutral no-penalty baseline
      warnings.push(`Review is ${input.reviewState} (flag-only policy active: ranking penalty bypassed).`);
    }
    return { freshnessScore, applyPenalty, warnings };
  }

  // ranking-penalty and other policies apply deterministic penalties
  if (input.reviewState === "overdue") {
    applyPenalty = true;
    freshnessScore = 30; // deterministic overdue score
    warnings.push("Review is overdue (ranking penalty applied).");
  } else if (input.reviewState === "expired") {
    applyPenalty = true;
    freshnessScore = 0; // deterministic expired score
    warnings.push("Review is expired (ranking penalty applied).");
  }

  return { freshnessScore, applyPenalty, warnings };
}

export function evaluateEvidenceRetrievalPolicy(input: {
  policy: ReviewExpiryPolicy;
  reviewState: EvidenceReviewState;
  context: KnowledgeRetrievalContext;
  exclusionThreshold: ReviewExclusionThreshold;
}): {
  eligible: boolean;
  applyPenalty: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Excluded only if the state reaches or exceeds the threshold
  let isExcludable = false;
  if (input.exclusionThreshold === "expired") {
    isExcludable = input.reviewState === "expired";
  } else if (input.exclusionThreshold === "overdue") {
    isExcludable = input.reviewState === "overdue" || input.reviewState === "expired";
  }

  if (isExcludable) {
    if (input.policy === "exclude-from-all-search") {
      // Excluded from AI, public, and manual clinical search. Allowed in admin.
      if (input.context !== "admin-search") {
        warnings.push(`Record excluded from ${input.context} context due to expired review under exclude-from-all-search policy.`);
        return { eligible: false, applyPenalty: true, warnings };
      }
    } else if (input.policy === "exclude-from-ai") {
      // Excluded from AI clinical search. Allowed in public, manual clinical, and admin search.
      if (input.context === "ai-clinical-context") {
        warnings.push("Record excluded from AI clinical context due to expired review under exclude-from-ai policy.");
        return { eligible: false, applyPenalty: true, warnings };
      }
    }
  }

  // Determine if ranking penalty applies
  // flag-only has no ranking penalty.
  const isOverdueOrExpired = input.reviewState === "overdue" || input.reviewState === "expired";
  const applyPenalty = isOverdueOrExpired && input.policy !== "flag-only";

  if (isOverdueOrExpired) {
    warnings.push(`Record is ${input.reviewState} under policy '${input.policy}'.`);
  }

  return { eligible: true, applyPenalty, warnings };
}

export function parseCanonicalEvidenceStrength(val: any): EvidenceStrength {
  if (!val) return "low"; // default
  const clean = String(val).trim().toLowerCase();
  switch (clean) {
    case "very-high":
    case "veryhigh":
    case "level-a":
      return "very-high";
    case "high":
    case "level-b":
    case "strong":
    case "keynote":
      return "high";
    case "moderate":
    case "level-c":
    case "supporting":
      return "moderate";
    case "low":
    case "level-d":
      return "low";
    case "very-low":
    case "verylow":
    case "level-e":
    case "uncertain":
    case "hypothetical":
    case "anecdotal":
      return "very-low";
    default:
      throw new Error(`Unsupported evidence strength: ${val}`);
  }
}

export function parseCanonicalSourceQuality(val: any): SourceQuality {
  if (!val) return "unverified"; // default
  const clean = String(val).trim().toLowerCase();
  switch (clean) {
    case "authoritative":
      return "authoritative";
    case "peer-reviewed":
    case "peerreviewed":
      return "peer-reviewed";
    case "primary":
      return "primary";
    case "secondary":
      return "secondary";
    case "unverified":
    case "anecdotal":
      return "unverified";
    default:
      throw new Error(`Unsupported source quality: ${val}`);
  }
}

export function parseCanonicalReviewExpiryPolicy(val: any): ReviewExpiryPolicy {
  if (!val) return "ranking-penalty"; // default
  const clean = String(val).trim().toLowerCase();
  switch (clean) {
    case "flag-only":
    case "flagonly":
    case "editorial-flag-only":
    case "editorialflagonly":
      return "flag-only";
    case "ranking-penalty":
    case "rankingpenalty":
      return "ranking-penalty";
    case "exclude-from-ai":
    case "excludefromai":
      return "exclude-from-ai";
    case "exclude-from-all-search":
    case "excludefromallsearch":
    case "exclude-from-all":
      return "exclude-from-all-search";
    default:
      throw new Error(`Unsupported review expiry policy: ${val}`);
  }
}

