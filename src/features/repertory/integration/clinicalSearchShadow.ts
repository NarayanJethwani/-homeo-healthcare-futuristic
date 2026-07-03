import { adaptFirestoreRubric } from "../adapters/firestoreRubricAdapter";
import { buildCanonicalSearchIndex } from "../search/clinicalSearch/searchIndex";
import { searchCanonicalRubrics } from "../search/clinicalSearch/clinicalSearchEngine";

export interface ClinicalSearchShadowFilters {
  category: string;
  organSystem: string;
  miasm: string;
  remedy: string;
}

export interface ClinicalSearchShadowInput {
  query: string;
  filters: ClinicalSearchShadowFilters;
  v1Results: unknown[];
  candidateRubrics: unknown[];
  startedAt: number;
}

interface RankedResultSnapshot {
  id: string;
  title?: string;
  score?: number;
  synonymMatchCount?: number;
}

export interface ClinicalSearchShadowMetrics {
  query: string;
  filters: ClinicalSearchShadowFilters;
  v1ExecutionMs: number;
  v2ExecutionMs: number;
  v1Count: number;
  v2Count: number;
  matchedRubricIds: string[];
  missingRubricIds: string[];
  additionalRubricIds: string[];
  rankingDifferences: Array<{
    rubricId: string;
    v1Rank: number | null;
    v2Rank: number | null;
    rankDelta: number | null;
  }>;
  synonymMatches: Array<{
    rubricId: string;
    matchCount: number;
  }>;
  searchScoreDifferences: Array<{
    rubricId: string;
    v2Score: number;
  }>;
  topV1: RankedResultSnapshot[];
  topV2: RankedResultSnapshot[];
  adapterWarningCount: number;
  error?: string;
}

function rubricId(record: unknown): string | null {
  if (!record || typeof record !== "object") return null;
  const value = (record as { id?: unknown; rubricId?: unknown }).id || (record as { rubricId?: unknown }).rubricId;
  return typeof value === "string" && value.trim() ? value : null;
}

function rubricTitle(record: unknown): string | undefined {
  if (!record || typeof record !== "object") return undefined;
  const value = (record as { name?: unknown; title?: unknown }).name || (record as { title?: unknown }).title;
  return typeof value === "string" ? value : undefined;
}

function rankMap(ids: string[]): Map<string, number> {
  return new Map(ids.map((id, index) => [id, index + 1]));
}

function shouldKeepByFilters(record: unknown, filters: ClinicalSearchShadowFilters): boolean {
  if (!record || typeof record !== "object") return false;
  const rubric = record as {
    category?: unknown;
    organSystem?: unknown;
    miasms?: unknown;
    remedies?: unknown;
  };

  if (filters.category !== "All" && rubric.category !== filters.category) return false;
  if (filters.organSystem !== "All" && rubric.organSystem !== filters.organSystem) return false;
  if (filters.miasm !== "All" && (!Array.isArray(rubric.miasms) || !rubric.miasms.includes(filters.miasm))) return false;
  if (filters.remedy !== "All") {
    const remedies = rubric.remedies;
    if (!remedies || typeof remedies !== "object" || Array.isArray(remedies)) return false;
    if ((remedies as Record<string, unknown>)[filters.remedy] === undefined) return false;
  }

  return true;
}

function rankingDifferences(v1Ids: string[], v2Ids: string[]): ClinicalSearchShadowMetrics["rankingDifferences"] {
  const v1Ranks = rankMap(v1Ids);
  const v2Ranks = rankMap(v2Ids);
  const allIds = Array.from(new Set([...v1Ids, ...v2Ids]));

  return allIds.slice(0, 50).map((id) => {
    const v1Rank = v1Ranks.get(id) || null;
    const v2Rank = v2Ranks.get(id) || null;
    return {
      rubricId: id,
      v1Rank,
      v2Rank,
      rankDelta: v1Rank !== null && v2Rank !== null ? v2Rank - v1Rank : null,
    };
  });
}

function snapshotV1(records: unknown[]): RankedResultSnapshot[] {
  return records.slice(0, 10).map((record) => ({
    id: rubricId(record) || "unknown",
    title: rubricTitle(record),
  }));
}

function logMetrics(metrics: ClinicalSearchShadowMetrics): void {
  console.info("[repertory-v2-search-shadow]", JSON.stringify(metrics));
}

export function runClinicalSearchShadowComparison(input: ClinicalSearchShadowInput): void {
  const v2Start = Date.now();

  try {
    const filteredCandidates = input.candidateRubrics.filter((rubric) => shouldKeepByFilters(rubric, input.filters));
    const canonicalRubrics = filteredCandidates.map((record) => adaptFirestoreRubric(record as Parameters<typeof adaptFirestoreRubric>[0]));
    const adapterWarningCount = canonicalRubrics.reduce((sum, rubric) => sum + rubric.warnings.length, 0);
    const index = buildCanonicalSearchIndex(canonicalRubrics);
    const v2Results = input.query
      ? searchCanonicalRubrics(index, input.query, { includeHighlights: false, limit: 100 })
      : canonicalRubrics.slice(0, 100).map((rubric) => ({
          rubric,
          score: 0,
          matches: [],
          matchedFields: [],
          highlights: [],
        }));

    const v1Ids = input.v1Results.map(rubricId).filter((id): id is string => id !== null);
    const v2Ids = v2Results.map((result) => result.rubric.id);
    const v1Set = new Set(v1Ids);
    const v2Set = new Set(v2Ids);
    const matchedRubricIds = v1Ids.filter((id) => v2Set.has(id));
    const missingRubricIds = v1Ids.filter((id) => !v2Set.has(id));
    const additionalRubricIds = v2Ids.filter((id) => !v1Set.has(id));
    const synonymMatches = v2Results
      .map((result) => ({
        rubricId: result.rubric.id,
        matchCount: result.matches.filter((match) => match.type === "synonym").length,
      }))
      .filter((item) => item.matchCount > 0);

    logMetrics({
      query: input.query,
      filters: input.filters,
      v1ExecutionMs: v2Start - input.startedAt,
      v2ExecutionMs: Date.now() - v2Start,
      v1Count: v1Ids.length,
      v2Count: v2Ids.length,
      matchedRubricIds: matchedRubricIds.slice(0, 50),
      missingRubricIds: missingRubricIds.slice(0, 50),
      additionalRubricIds: additionalRubricIds.slice(0, 50),
      rankingDifferences: rankingDifferences(v1Ids, v2Ids),
      synonymMatches: synonymMatches.slice(0, 50),
      searchScoreDifferences: v2Results.slice(0, 50).map((result) => ({
        rubricId: result.rubric.id,
        v2Score: result.score,
      })),
      topV1: snapshotV1(input.v1Results),
      topV2: v2Results.slice(0, 10).map((result) => ({
        id: result.rubric.id,
        title: result.rubric.title,
        score: result.score,
        synonymMatchCount: result.matches.filter((match) => match.type === "synonym").length,
      })),
      adapterWarningCount,
    });
  } catch (error) {
    logMetrics({
      query: input.query,
      filters: input.filters,
      v1ExecutionMs: v2Start - input.startedAt,
      v2ExecutionMs: Date.now() - v2Start,
      v1Count: input.v1Results.length,
      v2Count: 0,
      matchedRubricIds: [],
      missingRubricIds: [],
      additionalRubricIds: [],
      rankingDifferences: [],
      synonymMatches: [],
      searchScoreDifferences: [],
      topV1: snapshotV1(input.v1Results),
      topV2: [],
      adapterWarningCount: 0,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
