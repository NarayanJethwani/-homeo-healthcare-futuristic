import "server-only";

const EUTILS_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const PUBMED_RESULT_LIMIT = 6;
const DOI_PATTERN = /^10\.\d{4,9}\/[-._;()/:a-z0-9]+$/i;

export type LiteratureStudyType = "any" | "systematic-review" | "randomized-trial" | "guideline" | "review";

const STUDY_FILTERS: Record<LiteratureStudyType, string | null> = {
  any: null,
  "systematic-review": "systematic review[pt]",
  "randomized-trial": "randomized controlled trial[pt]",
  guideline: "practice guideline[pt]",
  review: "review[pt]",
};

export interface PubMedCitation {
  pmid: string;
  title: string;
  authors: string;
  journal: string;
  publicationDate: string;
  year: string | null;
  publicationTypes: string[];
  pubMedUrl: string;
  doi: string | null;
  doiUrl: string | null;
  abstractExcerpt: string | null;
  designSignal: string;
  crossref: {
    publisher: string | null;
    type: string | null;
    citedByCount: number | null;
    url: string | null;
  } | null;
}

export interface PubMedSearchResult {
  query: string;
  total: number;
  citations: PubMedCitation[];
  retrievedAt: string;
}

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function decodePubMedText(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)));
}

export function normalizeLiteratureQuery(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 240);
}

function extractAuthors(summary: Record<string, unknown>): string {
  if (!Array.isArray(summary.authors)) return "Authors not listed";
  const names = summary.authors
    .map((author) => asString(asRecord(author)?.name))
    .filter(Boolean);
  if (names.length === 0) return "Authors not listed";
  return names.length > 3 ? `${names.slice(0, 3).join(", ")}, et al.` : names.join(", ");
}

function extractDoi(summary: Record<string, unknown>): string | null {
  if (!Array.isArray(summary.articleids)) return null;
  for (const candidate of summary.articleids) {
    const record = asRecord(candidate);
    if (asString(record?.idtype).toLowerCase() !== "doi") continue;
    const doi = asString(record?.value);
    if (DOI_PATTERN.test(doi)) return doi;
  }
  return null;
}

function extractPublicationTypes(summary: Record<string, unknown>): string[] {
  if (!Array.isArray(summary.pubtype)) return [];
  return summary.pubtype.map(asString).filter(Boolean).slice(0, 3);
}

function classifyDesign(publicationTypes: string[]): string {
  const normalized = publicationTypes.join(" ").toLowerCase();
  if (normalized.includes("systematic review") || normalized.includes("meta-analysis")) return "Evidence synthesis";
  if (normalized.includes("randomized controlled trial")) return "Randomized trial";
  if (normalized.includes("practice guideline") || normalized.includes("guideline")) return "Guideline";
  if (normalized.includes("clinical trial")) return "Clinical trial";
  if (normalized.includes("observational") || normalized.includes("cohort") || normalized.includes("case-control")) return "Observational study";
  if (normalized.includes("review")) return "Narrative review";
  return "Design not classified";
}

function parseSearchPayload(payload: unknown): { ids: string[]; total: number } {
  const root = asRecord(payload);
  const searchResult = asRecord(root?.esearchresult);
  const ids = Array.isArray(searchResult?.idlist)
    ? searchResult.idlist.map(asString).filter((id) => /^\d+$/.test(id)).slice(0, PUBMED_RESULT_LIMIT)
    : [];
  const parsedCount = Number.parseInt(asString(searchResult?.count), 10);
  return { ids, total: Number.isFinite(parsedCount) ? Math.max(0, parsedCount) : ids.length };
}

function parseSummaryPayload(payload: unknown, ids: string[]): PubMedCitation[] {
  const result = asRecord(asRecord(payload)?.result);
  if (!result) return [];
  return ids.flatMap((pmid) => {
    const summary = asRecord(result[pmid]);
    if (!summary) return [];
    const title = decodePubMedText(asString(summary.title));
    if (!title) return [];
    const publicationDate = asString(summary.pubdate) || asString(summary.epubdate) || "Date not listed";
    const yearMatch = publicationDate.match(/\b(19|20)\d{2}\b/);
    const doi = extractDoi(summary);
    const publicationTypes = extractPublicationTypes(summary);
    return [{
      pmid,
      title,
      authors: extractAuthors(summary),
      journal: decodePubMedText(asString(summary.fulljournalname) || asString(summary.source) || "Journal not listed"),
      publicationDate,
      year: yearMatch?.[0] ?? null,
      publicationTypes,
      pubMedUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      doi,
      doiUrl: doi ? `https://doi.org/${doi}` : null,
      abstractExcerpt: null,
      designSignal: classifyDesign(publicationTypes),
      crossref: null,
    }];
  });
}

function stripXml(value: string): string {
  return decodePubMedText(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function parseAbstracts(xml: string): Map<string, string> {
  const abstracts = new Map<string, string>();
  for (const articleMatch of xml.matchAll(/<PubmedArticle(?:\s[^>]*)?>([\s\S]*?)<\/PubmedArticle>/gi)) {
    const article = articleMatch[1];
    const pmid = article.match(/<PMID(?:\s[^>]*)?>(\d+)<\/PMID>/i)?.[1];
    if (!pmid) continue;
    const sections: string[] = [];
    for (const abstractMatch of article.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/gi)) {
      const label = abstractMatch[1].match(/\bLabel="([^"]+)"/i)?.[1];
      const text = stripXml(abstractMatch[2]);
      if (text) sections.push(label ? `${stripXml(label)}: ${text}` : text);
    }
    const abstract = sections.join(" ");
    if (abstract) abstracts.set(pmid, abstract.length > 900 ? `${abstract.slice(0, 897).trimEnd()}…` : abstract);
  }
  return abstracts;
}

async function fetchAbstracts(
  ids: string[],
  commonParams: URLSearchParams,
  fetchImpl: FetchLike,
  signal: AbortSignal,
): Promise<Map<string, string>> {
  const params = new URLSearchParams(commonParams);
  params.set("id", ids.join(","));
  params.set("retmode", "xml");
  const response = await fetchImpl(`${EUTILS_BASE}/efetch.fcgi?${params}`, {
    headers: { Accept: "application/xml" },
    signal,
    cache: "no-store",
  });
  if (!response.ok) return new Map();
  return parseAbstracts(await response.text());
}

async function fetchCrossrefMetadata(
  doi: string,
  fetchImpl: FetchLike,
  signal: AbortSignal,
): Promise<PubMedCitation["crossref"]> {
  const url = new URL(`https://api.crossref.org/v1/works/${encodeURIComponent(doi)}`);
  const mailto = process.env.CROSSREF_MAILTO?.trim() || process.env.NCBI_EUTILS_EMAIL?.trim();
  if (mailto) url.searchParams.set("mailto", mailto);
  try {
    const response = await fetchImpl(url, {
      headers: { Accept: "application/json", "User-Agent": "HomeoMedicalAcademy/1.6" },
      signal,
      cache: "force-cache",
    });
    if (!response.ok) return null;
    const message = asRecord(asRecord(await response.json())?.message);
    if (!message || asString(message.DOI).toLowerCase() !== doi.toLowerCase()) return null;
    const citedBy = typeof message["is-referenced-by-count"] === "number" ? message["is-referenced-by-count"] : null;
    const recordUrl = asString(message.URL);
    return {
      publisher: asString(message.publisher) || null,
      type: asString(message.type) || null,
      citedByCount: citedBy !== null && Number.isFinite(citedBy) ? Math.max(0, Math.floor(citedBy)) : null,
      url: /^https:\/\//i.test(recordUrl) ? recordUrl : null,
    };
  } catch {
    return null;
  }
}

export function normalizeStudyType(value: unknown): LiteratureStudyType {
  return typeof value === "string" && value in STUDY_FILTERS ? value as LiteratureStudyType : "any";
}

export async function searchPubMedLiterature(
  rawQuery: unknown,
  fetchImpl: FetchLike = fetch,
  rawStudyType: unknown = "any",
): Promise<PubMedSearchResult> {
  const query = normalizeLiteratureQuery(rawQuery);
  if (query.length < 2) throw new Error("LITERATURE_QUERY_INVALID");
  const studyType = normalizeStudyType(rawStudyType);
  const studyFilter = STUDY_FILTERS[studyType];

  const commonParams = new URLSearchParams({
    db: "pubmed",
    retmode: "json",
    tool: "homeo_medical_academy",
  });
  const contactEmail = process.env.NCBI_EUTILS_EMAIL?.trim();
  if (contactEmail) commonParams.set("email", contactEmail);
  const apiKey = process.env.NCBI_EUTILS_API_KEY?.trim();
  if (apiKey) commonParams.set("api_key", apiKey);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 14_000);
  try {
    const searchParams = new URLSearchParams(commonParams);
    searchParams.set("term", studyFilter ? `(${query}) AND ${studyFilter}` : query);
    searchParams.set("retmax", String(PUBMED_RESULT_LIMIT));
    searchParams.set("sort", "relevance");
    const searchResponse = await fetchImpl(`${EUTILS_BASE}/esearch.fcgi?${searchParams}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!searchResponse.ok) throw new Error("PUBMED_SEARCH_UNAVAILABLE");
    const search = parseSearchPayload(await searchResponse.json());
    if (search.ids.length === 0) {
      return { query, total: search.total, citations: [], retrievedAt: new Date().toISOString() };
    }

    const summaryParams = new URLSearchParams(commonParams);
    summaryParams.set("id", search.ids.join(","));
    const summaryResponse = await fetchImpl(`${EUTILS_BASE}/esummary.fcgi?${summaryParams}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!summaryResponse.ok) throw new Error("PUBMED_SUMMARY_UNAVAILABLE");
    let citations = parseSummaryPayload(await summaryResponse.json(), search.ids);
    const abstracts = await fetchAbstracts(search.ids, commonParams, fetchImpl, controller.signal).catch(() => new Map<string, string>());
    citations = citations.map((citation) => ({ ...citation, abstractExcerpt: abstracts.get(citation.pmid) ?? null }));

    for (const citation of citations.filter((item) => item.doi).slice(0, 3)) {
      citation.crossref = await fetchCrossrefMetadata(citation.doi!, fetchImpl, controller.signal);
    }

    return {
      query,
      total: search.total,
      citations,
      retrievedAt: new Date().toISOString(),
    };
  } finally {
    clearTimeout(timeout);
  }
}
