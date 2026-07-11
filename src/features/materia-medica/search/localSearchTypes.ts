export type IntegrityReference = {
  originalTextChecksum: string;
  normalizedTextChecksum: string;
  blocksChecksum: string;
};

export type SearchIndexEntry = {
  passageId: string;
  remedyId: string;
  remedyDisplayName: string;
  normalizedRemedyName: string;
  aliases: string[];
  bookId: string;
  bookTitle: string;
  authorName: string;
  editionId: string;
  publicationYear: number;
  sectionLabels: string[];
  searchableTokens: string[];
  printedPageStart: number;
  printedPageEnd: number;
  scanPageIndexStart: number;
  scanPageIndexEnd: number;
  sourceVersionId: string;
  integrityReference: IntegrityReference;
};

export type RemedyAliasRecord = {
  id: string;
  canonicalRemedyId: string;
  aliasText: string;
  normalizedAlias: string;
  aliasType: "abbreviation" | "synonym" | "common-name";
  verificationStatus: "verified" | "unverified";
  sourceReference?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  deprecatedAt?: string;
};

export type LocalSearchQuery = {
  term: string;
  author?: string;
  bookId?: string;
  editionId?: string;
  sectionLabel?: string;
};

export type ExcerptSegment = {
  text: string;
  highlighted: boolean;
};

export type SearchExcerpt = {
  segments: ExcerptSegment[];
  truncatedAtStart: boolean;
  truncatedAtEnd: boolean;
};

export type LocalSearchResult = {
  entry: SearchIndexEntry;
  score: number;
  matchingExcerpt: SearchExcerpt;
  matchedTokens: string[];
  matchedAliases: string[];
};

export type ComparisonSelection = {
  remedyId: string;
  passageIds: string[];
  addedAt: string;
};
