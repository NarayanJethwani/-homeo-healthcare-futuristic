import { getAdminDb } from "../../../lib/firebaseAdmin";

export interface SearchLogEntry {
  id?: string;
  query: string;
  normalizedQuery: string;
  resultCount: number;
  clickedResultId?: string;
  entityTypeFilter?: string;
  timestamp: string; // ISO string
  timestampBucket: string; // YYYY-MM-DD
  source: 'public-site' | 'admin-portal' | 'clinical-os' | 'patient-education';
}

// In-memory runtime cache for serverless sessions/fallback
const searchLogsInMemoryCache: SearchLogEntry[] = [];

/**
 * Normalizes query string and redacts PII/PHI.
 */
export function redactSensitiveSearchQuery(query: string): string {
  if (!query) return "";
  const trimmed = query.trim();
  
  // 1. Phone number regex matching formats: 123-456-7890, (123) 456-7890, 123.456.7890, 555-0199, etc.
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{3}[-.\s]\d{4}\b/;
  
  // 2. Email address regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
  
  // 3. Date / DOB / SSN pattern matching (e.g. 10/12/1984, 1984-12-10, 12-12-84, etc.)
  const dateRegex = /\b(?:\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})|(?:\d{4}[-/.]\d{1,2}[-/.]\d{1,2})\b/;
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/;

  // 4. Clinical notes indicators and case indicators (e.g., patient details, case report phrasing)
  const phiIndicators = /\b(?:patient|case|dr|doctor|prescription|chart|dob|age|mr|mrs|ms|male|female|year-old|\d+\s*yo|\d+\s*year\s*old|\d+\s*years\s*old|clinical|note|treatment)\b/i;

  // 5. ZIP and Address patterns (handles multi-word names like "123 Main Street")
  const zipRegex = /\b\d{5}(?:-\d{4})?\b/;
  const addressRegex = /\b\d+\s+(?:[A-Za-z0-9'-]+\s+){1,3}(?:street|st|avenue|ave|road|rd|highway|hwy|lane|ln|drive|dr|court|ct|boulevard|blvd|postcode|zip)\b/i;

  // 6. Case/patient markers
  const caseRegex = /\b(?:case|patient|chart|record|subject|file|id)\s*#?\s*\d+\b/i;

  // 7. Prescription/Remedy potencies and dosages (avoiding raw dosing details)
  const rxRegex = /\b(?:\d+(?:c|x|m|lm)|qd|bid|tid|qid|potency|dosage|drops|daily|dose|frequency|30c|200c|1m|10m)\b/i;

  // 8. Patient names heuristics (Mr. Smith, Dr. Patel, or Capitalized names indicating individuals)
  const nameIndicatorRegex = /\b(?:mr|mrs|ms|miss|dr|doctor|patient|client)\.?\s+[A-Z][a-z]+\b/;

  // Check if query matches any of these high-risk patterns
  if (
    phoneRegex.test(trimmed) ||
    emailRegex.test(trimmed) ||
    dateRegex.test(trimmed) ||
    ssnRegex.test(trimmed) ||
    phiIndicators.test(trimmed) ||
    zipRegex.test(trimmed) ||
    addressRegex.test(trimmed) ||
    caseRegex.test(trimmed) ||
    rxRegex.test(trimmed) ||
    nameIndicatorRegex.test(trimmed)
  ) {
    return "[redacted-sensitive-query]";
  }

  // 9. Check if query is too long (potential copy-paste of a clinical note)
  if (trimmed.length > 80) {
    return "[redacted-sensitive-query]";
  }

  return trimmed.toLowerCase();
}

/**
 * Normalizes query string for exact matching.
 */
export function normalizeQuery(query: string): string {
  const redacted = redactSensitiveSearchQuery(query);
  if (redacted === "[redacted-sensitive-query]") {
    return redacted;
  }
  return redacted
    .replace(/[^\w\s-]/g, "") // remove punctuation except hyphens/spaces
    .replace(/\s+/g, " ")      // unify spaces
    .trim();
}

// In-memory rate-limiter state
let lastResetTime = Date.now();
let queryCountThisMinute = 0;
const MAX_QUERIES_PER_MINUTE = 60;

/**
 * Tracks a search event in memory and Firestore.
 */
export async function trackSearchQuery(entry: Omit<SearchLogEntry, 'normalizedQuery' | 'timestamp' | 'timestampBucket'>): Promise<void> {
  const normalized = normalizeQuery(entry.query);
  const now = new Date();
  
  const fullEntry: SearchLogEntry = {
    ...entry,
    query: normalized === "[redacted-sensitive-query]" ? normalized : entry.query,
    normalizedQuery: normalized,
    timestamp: now.toISOString(),
    timestampBucket: now.toISOString().split("T")[0]
  };

  // Add to in-memory cache (limit cache to prevent memory leaks)
  searchLogsInMemoryCache.push(fullEntry);
  if (searchLogsInMemoryCache.length > 500) {
    searchLogsInMemoryCache.shift();
  }

  // Rate limiter check
  const nowMs = Date.now();
  if (nowMs - lastResetTime > 60000) {
    lastResetTime = nowMs;
    queryCountThisMinute = 0;
  }

  if (queryCountThisMinute >= MAX_QUERIES_PER_MINUTE) {
    console.warn("Analytics: Search logging rate limit reached (60/min), skipping Firestore persist.");
    return;
  }
  queryCountThisMinute++;

  // Persist to Firestore if available
  try {
    const db = getAdminDb();
    if (db) {
      await db.collection("knowledge_search_analytics").add(fullEntry);
    }
  } catch (err: any) {
    // Silent fail to ensure zero interference/crashes
    console.warn("Analytics: Failed to store search log in Firestore, retained in memory cache:", err?.message || err);
  }
}

/**
 * Retrieves aggregate search analytics.
 */
export async function getSearchAnalyticsSummary(): Promise<{
  totalSearches: number;
  noResultQueries: { query: string; count: number }[];
  lowResultQueries: { query: string; count: number }[];
  commonQueries: { query: string; count: number; resultsCount: number }[];
}> {
  // Try retrieving from Firestore first, fallback to memory
  try {
    const db = getAdminDb();
    if (db) {
      const snap = await db.collection("knowledge_search_analytics")
        .orderBy("timestamp", "desc")
        .limit(1000)
        .get();

      const entries: SearchLogEntry[] = [];
      snap.forEach((doc: any) => {
        entries.push(doc.data() as SearchLogEntry);
      });

      return computeAggregates(entries);
    }
  } catch (err) {
    console.warn("Analytics: Error fetching GSC/Firestore search logs, falling back to memory:", err);
  }

  return computeAggregates(searchLogsInMemoryCache);
}

function computeAggregates(entries: SearchLogEntry[]) {
  const queryCounts: Record<string, { count: number; resultsCount: number }> = {};
  const noResultCounts: Record<string, number> = {};
  const lowResultCounts: Record<string, number> = {};

  entries.forEach(e => {
    const q = e.normalizedQuery;
    if (!q) return;

    if (!queryCounts[q]) {
      queryCounts[q] = { count: 0, resultsCount: e.resultCount };
    }
    queryCounts[q].count++;

    if (e.resultCount === 0) {
      noResultCounts[q] = (noResultCounts[q] || 0) + 1;
    } else if (e.resultCount > 0 && e.resultCount <= 2) {
      lowResultCounts[q] = (lowResultCounts[q] || 0) + 1;
    }
  });

  const commonQueries = Object.entries(queryCounts)
    .map(([query, data]) => ({ query, count: data.count, resultsCount: data.resultsCount }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const noResultQueries = Object.entries(noResultCounts)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const lowResultQueries = Object.entries(lowResultCounts)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalSearches: entries.length,
    noResultQueries,
    lowResultQueries,
    commonQueries
  };
}
