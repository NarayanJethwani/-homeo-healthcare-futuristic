import { GovernedMateriaMedicaRepository } from "../services/GovernedMateriaMedicaRepository";
import { MATERIA_MEDICA_REGISTRY } from "../data/registry";
import {
  SearchIndexEntry,
  LocalSearchQuery,
  LocalSearchResult,
  SearchExcerpt,
  ExcerptSegment,
  RemedyAliasRecord
} from "./localSearchTypes";
import { computeSearchScore, evaluateTokenMatching, sortSearchResults } from "./searchScoring";
import { normalizeSearchQuery, normalizeSearchField, tokenizeSearchText } from "./textNormalization";
import { REMEDY_ALIASES_REGISTRY, validateAliasRegistry } from "./remedyAliases";
import { MateriaMedicaSourceVersion, SampleMateriaMedicaPassage, SampleCorpusManifest } from "../types";

let memoizedIndex: SearchIndexEntry[] | null = null;
const normalizedTextCache = new Map<string, string>();

export function isEligibleForLocalSearch(
  source: MateriaMedicaSourceVersion,
  passage: SampleMateriaMedicaPassage,
  manifest: SampleCorpusManifest
): boolean {
  return (
    source.editorialStatus === "approved" &&
    source.ingestionStatus === "approved" &&
    source.deprecatedAt == null &&
    passage.editorialStatus === "approved" &&
    passage.correctionStatus === "human-reviewed" &&
    manifest.passageIds.includes(passage.id)
  );
}

export async function getOrCreateSearchIndex(): Promise<SearchIndexEntry[]> {
  if (memoizedIndex) return memoizedIndex;

  // Retrieve approved passages
  const passages = await GovernedMateriaMedicaRepository.listApprovedPassages("james-tyler-kent");
  const registry = MATERIA_MEDICA_REGISTRY;
  const manifest = await GovernedMateriaMedicaRepository.getManifest();

  // Validate alias registry integrity (collission checks)
  if (!validateAliasRegistry()) {
    throw new Error("Local Search Index Build Blocked: Duplicate alias mapping collision detected.");
  }

  const index: SearchIndexEntry[] = [];

  for (const passage of passages) {
    const book = registry.find((b) => b.id === passage.bookId);
    if (!book) continue;

    // Build mock source version record for validation
    const source: MateriaMedicaSourceVersion = {
      sourceVersionId: passage.sourceVersionId,
      bookId: passage.bookId,
      provider: "internet-archive",
      providerItemId: "kents-lectures-on-materia-medica",
      sourceFilename: "Kent's Lectures on Materia Medica_djvu.txt",
      sourceFileChecksum: passage.sourceFileChecksum,
      sourceFileType: "txt",
      sourceFileSize: 2664852,
      rightsStatus: book.rightsStatus,
      editorialStatus: book.editorialStatus,
      ingestionStatus: book.ingestionStatus,
    };

    // Strict eligibility check
    if (!isEligibleForLocalSearch(source, passage, manifest)) {
      throw new Error(`Local Search Index Build Blocked: Unapproved or deprecated record detected for passage ID: ${passage.id}`);
    }

    // Cache the normalized text in-memory for this application session (to avoid search copy duplication)
    const normText = normalizeSearchField(passage.normalizedText);
    normalizedTextCache.set(passage.id, normText);

    const aliases = REMEDY_ALIASES_REGISTRY.filter(
      (a) => a.canonicalRemedyId === passage.remedyId && a.verificationStatus === "verified" && !a.deprecatedAt
    ).map((a) => a.aliasText);

    const searchableTokens = tokenizeSearchText(passage.normalizedText);

    index.push({
      passageId: passage.id,
      remedyId: passage.remedyId,
      remedyDisplayName: passage.remedyDisplayName,
      normalizedRemedyName: normalizeSearchField(passage.remedyDisplayName),
      aliases,
      bookId: passage.bookId,
      bookTitle: book.title,
      authorName: book.author,
      editionId: passage.editionId,
      publicationYear: Number(book.year),
      sectionLabels: passage.blocks.filter((b) => b.type === "section-label" || b.type === "heading").map((b) => b.text),
      searchableTokens,
      printedPageStart: passage.sourcePageRange.printedPageStart || 0,
      printedPageEnd: passage.sourcePageRange.printedPageEnd || 0,
      scanPageIndexStart: passage.sourcePageRange.scanPageIndexStart,
      scanPageIndexEnd: passage.sourcePageRange.scanPageIndexEnd,
      sourceVersionId: passage.sourceVersionId,
      integrityReference: {
        originalTextChecksum: passage.originalTextChecksum,
        normalizedTextChecksum: passage.normalizedTextChecksum,
        blocksChecksum: passage.blocksChecksum,
      },
    });
  }

  memoizedIndex = index;
  return index;
}

export function resetSearchIndex(): void {
  memoizedIndex = null;
  normalizedTextCache.clear();
}

export async function performLocalSearch(query: LocalSearchQuery): Promise<LocalSearchResult[]> {
  const normTerm = normalizeSearchQuery(query.term);
  if (!normTerm || normTerm.length === 0) return [];

  const index = await getOrCreateSearchIndex();
  const results: LocalSearchResult[] = [];

  for (const entry of index) {
    // Apply filters
    if (query.author && entry.authorName.toLowerCase() !== query.author.toLowerCase()) continue;
    if (query.bookId && entry.bookId !== query.bookId) continue;
    if (query.editionId && entry.editionId !== query.editionId) continue;
    if (query.sectionLabel && !entry.sectionLabels.some((s) => s.toLowerCase().includes(query.sectionLabel!.toLowerCase()))) continue;

    const { score: primaryTier, matchedAliases } = computeSearchScore(entry, normTerm);
    
    // Retrieve the normalized text from cache
    const normalizedText = normalizedTextCache.get(entry.passageId) || "";
    const finalScore = evaluateTokenMatching(entry, normalizedText, normTerm, primaryTier);

    if (finalScore > 0) {
      const excerpt = generateSafeExcerpt(normalizedText, normTerm);
      results.push({
        entry,
        score: finalScore,
        matchingExcerpt: excerpt,
        matchedTokens: tokenizeSearchText(normTerm),
        matchedAliases,
      });
    }
  }

  return results.sort(sortSearchResults);
}

function generateSafeExcerpt(text: string, query: string, maxLength = 160): SearchExcerpt {
  const normQuery = normalizeSearchQuery(query);
  const lowerText = text.toLowerCase();

  let startIdx = lowerText.indexOf(normQuery);
  if (startIdx === -1) {
    const firstToken = tokenizeSearchText(query)[0];
    if (firstToken) {
      startIdx = lowerText.indexOf(firstToken);
    }
  }

  if (startIdx === -1) {
    startIdx = 0;
  }

  let selectStart = Math.max(0, startIdx - 40);
  let selectEnd = Math.min(text.length, selectStart + maxLength);

  if (selectEnd - selectStart < maxLength) {
    selectStart = Math.max(0, selectEnd - maxLength);
  }

  const excerptText = text.slice(selectStart, selectEnd);
  const truncatedAtStart = selectStart > 0;
  const truncatedAtEnd = selectEnd < text.length;

  const segments: ExcerptSegment[] = [];

  if (!normQuery) {
    segments.push({ text: excerptText, highlighted: false });
  } else {
    // Match segment boundaries safely
    let currentIdx = 0;
    const lowerExcerpt = excerptText.toLowerCase();

    while (currentIdx < excerptText.length) {
      const matchIdx = lowerExcerpt.indexOf(normQuery, currentIdx);
      if (matchIdx === -1) {
        segments.push({ text: excerptText.slice(currentIdx), highlighted: false });
        break;
      }

      if (matchIdx > currentIdx) {
        segments.push({ text: excerptText.slice(currentIdx, matchIdx), highlighted: false });
      }

      segments.push({ text: excerptText.slice(matchIdx, matchIdx + normQuery.length), highlighted: true });
      currentIdx = matchIdx + normQuery.length;
    }
  }

  return {
    segments,
    truncatedAtStart,
    truncatedAtEnd,
  };
}
