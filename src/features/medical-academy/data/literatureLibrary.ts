export interface AcademyLiteratureCitation {
  pmid: string;
  title: string;
  authors: string;
  journal: string;
  publicationDate: string;
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

export interface PicoQuestion {
  population: string;
  intervention: string;
  comparison: string;
  outcome: string;
}

function text(value: unknown, maxLength: number): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength)
    : "";
}

function nullableText(value: unknown, maxLength: number): string | null {
  const normalized = text(value, maxLength);
  return normalized || null;
}

export function buildPicoQuery(value: PicoQuestion): string {
  return [value.population, value.intervention, value.comparison, value.outcome]
    .map((item) => text(item, 48))
    .filter(Boolean)
    .map((item) => `(${item})`)
    .join(" AND ");
}

export function sanitizeLiteratureCitation(value: unknown): AcademyLiteratureCitation | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Partial<AcademyLiteratureCitation>;
  const pmid = text(record.pmid, 12);
  const title = text(record.title, 600);
  if (!/^\d+$/.test(pmid) || !title) return null;
  const pubMedUrl = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  const doi = nullableText(record.doi, 180);
  const doiUrl = doi && /^10\.\d{4,9}\//i.test(doi) ? `https://doi.org/${doi}` : null;
  const crossrefRecord = record.crossref && typeof record.crossref === "object" ? record.crossref : null;
  const citedByCount = typeof crossrefRecord?.citedByCount === "number" && Number.isFinite(crossrefRecord.citedByCount)
    ? Math.max(0, Math.floor(crossrefRecord.citedByCount))
    : null;
  return {
    pmid,
    title,
    authors: text(record.authors, 500) || "Authors not listed",
    journal: text(record.journal, 300) || "Journal not listed",
    publicationDate: text(record.publicationDate, 80) || "Date not listed",
    publicationTypes: Array.isArray(record.publicationTypes)
      ? record.publicationTypes.map((item) => text(item, 80)).filter(Boolean).slice(0, 4)
      : [],
    pubMedUrl,
    doi,
    doiUrl,
    abstractExcerpt: nullableText(record.abstractExcerpt, 900),
    designSignal: text(record.designSignal, 80) || "Design not classified",
    crossref: crossrefRecord ? {
      publisher: nullableText(crossrefRecord.publisher, 240),
      type: nullableText(crossrefRecord.type, 100),
      citedByCount,
      url: doiUrl,
    } : null,
  };
}

export function sanitizeLiteratureLibrary(value: unknown): AcademyLiteratureCitation[] {
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, AcademyLiteratureCitation>();
  for (const item of value.slice(0, 100)) {
    const citation = sanitizeLiteratureCitation(item);
    if (citation) unique.set(citation.pmid, citation);
  }
  return [...unique.values()];
}

function risValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function formatLiteratureLibraryAsRis(citations: AcademyLiteratureCitation[]): string {
  return citations.map((citation) => [
    "TY  - JOUR",
    `TI  - ${risValue(citation.title)}`,
    `AU  - ${risValue(citation.authors)}`,
    `JO  - ${risValue(citation.journal)}`,
    `PY  - ${risValue(citation.publicationDate)}`,
    `AN  - PMID:${citation.pmid}`,
    ...(citation.doi ? [`DO  - ${risValue(citation.doi)}`] : []),
    `UR  - ${citation.pubMedUrl}`,
    "ER  -",
  ].join("\r\n")).join("\r\n\r\n");
}
