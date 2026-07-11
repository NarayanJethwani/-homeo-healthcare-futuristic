import { SearchIndexEntry } from "./localSearchTypes";
import { REMEDY_ALIASES_REGISTRY } from "./remedyAliases";
import { normalizeSearchQuery, tokenizeSearchText } from "./textNormalization";

export function computeSearchScore(entry: SearchIndexEntry, query: string): { score: number; matchedAliases: string[] } {
  const normQuery = normalizeSearchQuery(query);
  if (!normQuery) return { score: 0, matchedAliases: [] };

  const normRemedyName = entry.normalizedRemedyName;
  const queryTokens = tokenizeSearchText(query);
  const textTokens = entry.searchableTokens;

  const textTokensSet = new Set(textTokens);
  const matchedAliases: string[] = [];

  let primaryTier = 0;

  // 1. Exact canonical remedy name match (1000 pts)
  if (normRemedyName === normQuery) {
    primaryTier = 1000;
  }
  // 2. Exact verified alias match (800 pts)
  else {
    const verifiedAliases = REMEDY_ALIASES_REGISTRY.filter(
      (a) => a.canonicalRemedyId === entry.remedyId && a.verificationStatus === "verified" && !a.deprecatedAt
    );
    for (const alias of verifiedAliases) {
      if (alias.normalizedAlias === normQuery) {
        primaryTier = 800;
        matchedAliases.push(alias.aliasText);
        break;
      }
    }
  }

  // 3. Remedy-name prefix match (500 pts)
  if (primaryTier === 0 && normRemedyName.startsWith(normQuery)) {
    primaryTier = 500;
  }

  // 4. Exact phrase in approved text (300 pts)
  // Note: we check query phrase inside normalizedSearchText tokens joined, or check normalized text from repo
  // To avoid storing full text, we can check matching tokens or check normalized query matches
  // Wait! In the index build, do we have normalizedSearchText?
  // Ah! The user requested: "Do not store an uncontrolled second copy of full passage text in the search index."
  // Wait, so how do we evaluate "exact phrase in text"?
  // We can fetch the passage from GovernedMateriaMedicaRepository or build a temporary session cache!
  // Yes! The user said: "Prefer either... or build a private in-memory normalized-text cache from the governed repository once per application session."
  // Let's implement a private in-memory cache in the search engine!
  // Yes, `materiaMedicaLocalSearch.ts` can keep a private Map: `const normalizedTextCache = new Map<string, string>();`!
  // Then we can pass the normalized text to `computeSearchScore`!
  // This is beautiful and extremely clean!

  return { score: primaryTier, matchedAliases };
}

export function evaluateTokenMatching(
  entry: SearchIndexEntry,
  normalizedText: string,
  query: string,
  primaryTier: number
): number {
  const normQuery = normalizeSearchQuery(query);
  if (!normQuery) return 0;

  let currentTier = primaryTier;
  const queryTokens = tokenizeSearchText(query);
  const textTokens = entry.searchableTokens;

  // Exact phrase match check in normalized text (300 pts)
  if (currentTier < 300 && normalizedText.includes(normQuery)) {
    currentTier = 300;
  }

  // All query tokens present (150 pts)
  if (currentTier < 150) {
    const textTokensSet = new Set(textTokens);
    const allTokensPresent = queryTokens.every((t) => textTokensSet.has(t));
    if (allTokensPresent) {
      currentTier = 150;
    }
  }

  // Partial token base (10 pts)
  if (currentTier < 10) {
    const textTokensSet = new Set(textTokens);
    const hasAnyToken = queryTokens.some((t) => textTokensSet.has(t));
    if (hasAnyToken) {
      currentTier = 10;
    }
  }

  if (currentTier === 0) {
    return 0;
  }

  // Bounded matched token bonus: score = primaryTier + min(matchedTokenCount, 10)
  const textTokensSet = new Set(textTokens);
  const matchedTokenCount = queryTokens.filter((t) => textTokensSet.has(t)).length;
  
  return currentTier + Math.min(matchedTokenCount, 10);
}

export function sortSearchResults(
  a: { entry: SearchIndexEntry; score: number },
  b: { entry: SearchIndexEntry; score: number }
): number {
  if (b.score !== a.score) {
    return b.score - a.score;
  }
  // Locale-independent comparison
  const nameCmp = a.entry.remedyDisplayName.localeCompare(b.entry.remedyDisplayName, "en", {
    sensitivity: "base",
  });
  if (nameCmp !== 0) return nameCmp;

  const bookCmp = a.entry.bookTitle.localeCompare(b.entry.bookTitle, "en", {
    sensitivity: "base",
  });
  if (bookCmp !== 0) return bookCmp;

  const pageCmp = a.entry.printedPageStart - b.entry.printedPageStart;
  if (pageCmp !== 0) return pageCmp;

  return a.entry.passageId.localeCompare(b.entry.passageId);
}
