import crypto from "crypto";
import { SynonymService, ExpansionRelationship } from "./SynonymService";
import {
  RepertoryRubricRecord,
  RepertorySourceId,
  RepertoryEditionId,
  RubricRecordId
} from "../types/repertoryTypes";

export interface HighlightSegment {
  text: string;
  matched: boolean;
}

export interface RubricSearchResult {
  rubric: RepertoryRubricRecord;
  relevanceScore: number;
  highlightedFields: {
    displayText?: HighlightSegment[];
    classicalWording?: HighlightSegment[];
    plainLanguageMeaning?: HighlightSegment[];
  };
  traceId: string;
}

export interface RubricSearchFilters {
  chapterId?: string;
  editionIds?: RepertoryEditionId[];
}

export interface SearchTrace {
  traceId: string;
  query: string;
  normalizedQuery: string;
  expandedTerms: string[];
  sourceIds: RepertorySourceId[];
  editionIds: RepertoryEditionId[];
  filters: RubricSearchFilters;
  executedAt: string;
  searchIndexVersion: string;
  synonymRegistryVersion: string;
  corpusVersions: Record<string, string>;
  durationMs: number;
  cacheStatus: "hit" | "miss" | "partial";
}

export class RubricSearchIndex {
  private readonly indexVersion = "1.0.0-index";

  constructor(private synonymService: SynonymService) {}

  search(
    query: string,
    rubrics: RepertoryRubricRecord[],
    filters: RubricSearchFilters,
    corpusVersion: string
  ): {
    results: RubricSearchResult[];
    trace: SearchTrace;
  } {
    const startTime = Date.now();
    const traceId = `tr_${crypto.randomUUID()}`;

    // Normalize query
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) {
      return {
        results: [],
        trace: this.createTrace(traceId, query, normalizedQuery, [], filters, corpusVersion, 0, "miss")
      };
    }

    // 1. Expand synonyms
    const { expandedTerms, termRelationships } = this.synonymService.expandQuery(normalizedQuery);

    const sourceIdsSet = new Set<RepertorySourceId>();
    const editionIdsSet = new Set<RepertoryEditionId>();
    const results: RubricSearchResult[] = [];

    // Filter and score rubrics
    for (const rubric of rubrics) {
      sourceIdsSet.add(rubric.sourceId);
      editionIdsSet.add(rubric.editionId);

      // Check filters
      if (filters.chapterId && rubric.chapterId !== filters.chapterId) {
        continue;
      }
      if (filters.editionIds && filters.editionIds.length > 0 && !filters.editionIds.includes(rubric.editionId)) {
        continue;
      }

      // Calculate text-only relevance
      let score = 0;
      let matchesAny = false;

      const dispText = (rubric.displayText || "").toLowerCase();
      const classWording = (rubric.classicalWording || "").toLowerCase();
      const plainMeaning = (rubric.plainLanguageMeaning || "").toLowerCase();

      // We track matched segments for highlight generation
      for (const term of expandedTerms) {
        const isOriginal = normalizedQuery.includes(term) || term === normalizedQuery;
        const rel = termRelationships[term];
        const synonymWeight = isOriginal ? 1.0 : this.synonymService.getRelationshipWeight(rel);

        let termScore = 0;
        let matchedInRubric = false;

        // Exact & token matches
        if (dispText.includes(term)) {
          termScore += 10 * synonymWeight;
          matchedInRubric = true;
        }
        if (classWording.includes(term)) {
          termScore += 5 * synonymWeight;
          matchedInRubric = true;
        }
        if (plainMeaning.includes(term)) {
          termScore += 3 * synonymWeight;
          matchedInRubric = true;
        }

        // Prefix match boost
        if (dispText.startsWith(term)) {
          termScore += 3 * synonymWeight;
        }

        if (matchedInRubric) {
          score += termScore;
          matchesAny = true;
        }
      }

      if (matchesAny && score > 0) {
        // Generate clean highlights
        results.push({
          rubric,
          relevanceScore: Math.round(score * 10) / 10,
          highlightedFields: {
            displayText: this.highlightText(rubric.displayText || "", expandedTerms),
            classicalWording: rubric.classicalWording ? this.highlightText(rubric.classicalWording, expandedTerms) : undefined,
            plainLanguageMeaning: rubric.plainLanguageMeaning ? this.highlightText(rubric.plainLanguageMeaning, expandedTerms) : undefined
          },
          traceId
        });
      }
    }

    // Sort results by relevance score (descending)
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const durationMs = Date.now() - startTime;

    const trace = this.createTrace(
      traceId,
      query,
      normalizedQuery,
      expandedTerms,
      filters,
      corpusVersion,
      durationMs,
      "miss",
      Array.from(sourceIdsSet),
      Array.from(editionIdsSet)
    );

    return { results, trace };
  }

  private highlightText(text: string, terms: string[]): HighlightSegment[] {
    if (!text) return [];
    if (terms.length === 0) return [{ text, matched: false }];

    // Sort terms by length descending to match longest terms first
    const sortedTerms = [...terms].sort((a, b) => b.length - a.length);

    // Create case-insensitive regex for all terms
    const escapedTerms = sortedTerms.map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
    const regex = new RegExp(`(${escapedTerms.join("|")})`, "gi");

    const parts = text.split(regex);
    return parts.map(part => {
      const isMatched = sortedTerms.some(term => part.toLowerCase() === term.toLowerCase());
      return {
        text: part,
        matched: isMatched
      };
    }).filter(p => p.text.length > 0);
  }

  private createTrace(
    traceId: string,
    query: string,
    normalizedQuery: string,
    expandedTerms: string[],
    filters: RubricSearchFilters,
    corpusVersion: string,
    durationMs: number,
    cacheStatus: "hit" | "miss" | "partial",
    sourceIds: RepertorySourceId[] = [],
    editionIds: RepertoryEditionId[] = []
  ): SearchTrace {
    return {
      traceId,
      query,
      normalizedQuery,
      expandedTerms,
      sourceIds,
      editionIds: filters.editionIds || editionIds,
      filters,
      executedAt: new Date().toISOString(),
      searchIndexVersion: this.indexVersion,
      synonymRegistryVersion: this.synonymService.expandTerm("").expansionVersion,
      corpusVersions: { active: corpusVersion },
      durationMs,
      cacheStatus
    };
  }
}
