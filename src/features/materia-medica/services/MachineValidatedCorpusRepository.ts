import corpusSummary from "../data/machineCorpusManifest.json";

export type MachineCorpusChunkIndex = {
  id: string;
  sourceIdentifier: string;
  sourceIndex: number;
  sourceChunkIndex: number;
  label: string;
  title: string;
  indexHeadings?: string[];
  characterCount: number;
  sha256: string;
  file: string;
};

export type MachineCorpusManifest = {
  schemaVersion: 1;
  bookId: string;
  corpusStatus: "machine-validated";
  correctionStatus: "raw-ocr";
  editorialStatus: "needs-review";
  sourceCount: number;
  chunkCount: number;
  characterCount: number;
  chunks: MachineCorpusChunkIndex[];
};

export type MachineCorpusChunk = MachineCorpusChunkIndex & {
  schemaVersion: 1;
  bookId: string;
  text: string;
};

export type MachineCorpusSummaryEntry = (typeof corpusSummary.books)[number];

const byBook = new Map(corpusSummary.books.map((entry) => [entry.bookId, entry]));

export function getMachineCorpusSummary(bookId: string): MachineCorpusSummaryEntry | null {
  return byBook.get(bookId) ?? null;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) throw new Error(`Corpus request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export function getMachineChunkUrl(bookId: string, chunk: MachineCorpusChunkIndex): string {
  const baseUrl = `/data/materia-medica/v1/books/${encodeURIComponent(bookId)}/${encodeURIComponent(chunk.file)}`;
  // Chunk filenames are stable between corpus releases. Version the request with
  // the content hash so a regenerated manifest can never be paired with a stale
  // browser/CDN-cached JSON payload.
  return `${baseUrl}?sha256=${encodeURIComponent(chunk.sha256)}`;
}

export const MachineValidatedCorpusRepository = {
  hasBook(bookId: string): boolean {
    return byBook.has(bookId);
  },

  async getManifest(bookId: string): Promise<MachineCorpusManifest | null> {
    const summary = getMachineCorpusSummary(bookId);
    if (!summary) return null;
    const versionedManifestUrl = `${summary.manifestUrl}?corpus=${encodeURIComponent(corpusSummary.generatedAt)}`;
    const manifest = await fetchJson<MachineCorpusManifest>(versionedManifestUrl);
    if (
      manifest.bookId !== bookId ||
      manifest.corpusStatus !== "machine-validated" ||
      manifest.editorialStatus !== "needs-review" ||
      manifest.chunkCount !== manifest.chunks.length
    ) {
      throw new Error("Corpus manifest validation failed");
    }
    return manifest;
  },

  async getChunk(bookId: string, chunk: MachineCorpusChunkIndex): Promise<MachineCorpusChunk> {
    const url = getMachineChunkUrl(bookId, chunk);
    const result = await fetchJson<MachineCorpusChunk>(url);
    if (result.bookId !== bookId || result.id !== chunk.id || result.sha256 !== chunk.sha256) {
      throw new Error("Corpus chunk metadata validation failed");
    }
    return result;
  },
};
