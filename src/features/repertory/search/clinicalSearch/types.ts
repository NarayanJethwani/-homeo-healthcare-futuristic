import { CanonicalRubric } from "../../engine/canonicalTypes";

export type SearchField =
  | "title"
  | "classicalWording"
  | "plainLanguageMeaning"
  | "description"
  | "keywords"
  | "clinicalKeywords"
  | "synonyms"
  | "patientExpressions"
  | "modalities"
  | "aggravations"
  | "ameliorations"
  | "clinicalConditions"
  | "organSystem"
  | "category"
  | "remedies";

export type MatchType = "exact" | "starts_with" | "contains" | "synonym" | "fuzzy";

export interface TokenizedText {
  original: string;
  normalized: string;
  tokens: string[];
}

export interface SearchableField {
  field: SearchField;
  text: string;
  tokens: string[];
  weight: number;
}

export interface SearchIndexDocument {
  rubric: CanonicalRubric;
  fields: SearchableField[];
  tokenFrequency: Map<string, number>;
  allTokens: Set<string>;
  relevanceWeight: number;
}

export interface SearchIndex {
  documents: SearchIndexDocument[];
  tokenToRubricIds: Map<string, Set<string>>;
  builtAt: string;
}

export interface SearchMatch {
  field: SearchField;
  token: string;
  queryToken: string;
  type: MatchType;
  score: number;
}

export interface SearchHighlight {
  field: SearchField;
  text: string;
  html: string;
  matchedTerms: string[];
}

export interface ClinicalSearchResult {
  rubric: CanonicalRubric;
  score: number;
  matches: SearchMatch[];
  matchedFields: SearchField[];
  highlights: SearchHighlight[];
}

export interface ClinicalSearchOptions {
  limit?: number;
  minScore?: number;
  includeHighlights?: boolean;
  maxEditDistance?: number;
}

export interface SearchBenchmarkResult {
  queryCount: number;
  documentCount: number;
  indexBuildMs: number;
  totalSearchMs: number;
  averageSearchMs: number;
  p95SearchMs: number;
  queriesPerSecond: number;
}
