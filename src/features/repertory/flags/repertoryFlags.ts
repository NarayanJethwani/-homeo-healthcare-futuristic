export interface RepertoryFeatureFlags {
  uiEnabled: boolean;
  apiEnabled: boolean;
  readFromFirestore: boolean;
  writeEnabled: boolean;
  showScoreBreakdown: boolean;
  aiMappingReview: boolean;
  useIndexedSearch: boolean;
  useClinicalSearchEngine: boolean;
}

function isEnabled(value: string | undefined): boolean {
  return value === "true" || value === "1";
}

export function getRepertoryFeatureFlags(env: Record<string, string | undefined> = process.env): RepertoryFeatureFlags {
  return {
    uiEnabled: isEnabled(env.NEXT_PUBLIC_REPERTORY_V2_ENABLED),
    apiEnabled: isEnabled(env.REPERTORY_V2_API_ENABLED),
    readFromFirestore: isEnabled(env.REPERTORY_V2_READ_FROM_FIRESTORE),
    writeEnabled: isEnabled(env.REPERTORY_V2_WRITE_ENABLED),
    showScoreBreakdown: isEnabled(env.REPERTORY_V2_SHOW_SCORE_BREAKDOWN),
    aiMappingReview: isEnabled(env.REPERTORY_V2_AI_MAPPING_REVIEW),
    useIndexedSearch: isEnabled(env.REPERTORY_V2_USE_INDEXED_SEARCH),
    useClinicalSearchEngine: isEnabled(env.REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE),
  };
}

export const repertoryFeatureFlags = getRepertoryFeatureFlags();
