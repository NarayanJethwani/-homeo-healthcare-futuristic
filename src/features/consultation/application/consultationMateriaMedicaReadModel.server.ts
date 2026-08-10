import "server-only";

import fs from "fs";
import path from "path";
import { REMEDIES } from "@/features/knowledge/content/remedies";
import { getCitationById } from "@/features/knowledge/content/citations";
import { MATERIA_MEDICA_REGISTRY } from "@/features/materia-medica/data/registry";
import type {
  MateriaMedicaRemedyProfile,
  MateriaMedicaSourceView,
} from "../types/repertory-intelligence.types";

type CorpusChunkIndex = {
  title: string;
  file: string;
};

type CorpusManifest = {
  correctionStatus: "raw-ocr" | "machine-cleaned" | "human-reviewed";
  editorialStatus: "draft" | "needs-review" | "approved" | "rejected";
  chunks: CorpusChunkIndex[];
};

const CORPUS_ROOT = path.join(process.cwd(), "public", "data", "materia-medica", "v1", "books");
const manifestCache = new Map<string, CorpusManifest | null>();

const REMEDY_SLUG_OVERRIDES: Record<string, string> = {
  gelsemium: "gelsemium-sempervirens",
  glonoinum: "glonoine",
  hepar_sulphuris: "hepar-sulphuris-calcareum",
  hyoscyamus_niger: "hyoscyamus",
  lachesis_mutus: "lachesis-muta",
  nitricum_acidum: "acidum-nitricum",
  phosphoricum_acidum: "acidum-phosphoricum",
  pulsatilla: "pulsatilla-pratensis",
  sepia: "sepia-officinalis",
  silicea: "silicea-terra",
};

const SOURCE_NAME_OVERRIDES: Record<string, string[]> = {
  glonoinum: ["glonoine", "glonoinum"],
  hepar_sulphuris: ["hepar sulphuris calcareum", "hepar sulphuris"],
  hyoscyamus_niger: ["hyoscyamus niger", "hyoscyamus"],
  lachesis_mutus: ["lachesis muta", "lachesis"],
  nitricum_acidum: ["nitricum acidum", "acidum nitricum", "nitric acid"],
  phosphoricum_acidum: ["phosphoricum acidum", "acidum phosphoricum", "phosphoric acid"],
  pulsatilla: ["pulsatilla", "pulsatilla pratensis"],
  sepia: ["sepia", "sepia officinalis"],
  silicea: ["silicea", "silicea terra", "silica"],
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function titleWithoutCommonName(title: string): string {
  return title.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function resolveRemedy(remedyId: string) {
  const normalizedId = remedyId.trim().toLowerCase().replace(/-/g, "_");
  const defaultSlug = normalizedId.replace(/_/g, "-");
  const slug = REMEDY_SLUG_OVERRIDES[normalizedId] || defaultSlug;
  return REMEDIES.find((candidate) => candidate.slug === slug) || null;
}

function readManifest(bookId: string): CorpusManifest | null {
  if (manifestCache.has(bookId)) return manifestCache.get(bookId) || null;
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(CORPUS_ROOT, bookId, "manifest.json"), "utf8")
    ) as CorpusManifest;
    manifestCache.set(bookId, manifest);
    return manifest;
  } catch {
    manifestCache.set(bookId, null);
    return null;
  }
}

function remedySourceNames(remedyId: string, remedyName?: string, slug?: string): string[] {
  const normalizedId = remedyId.trim().toLowerCase().replace(/-/g, "_");
  const names = [
    ...(SOURCE_NAME_OVERRIDES[normalizedId] || []),
    normalizedId.replace(/_/g, " "),
    slug?.replace(/-/g, " ") || "",
    remedyName ? titleWithoutCommonName(remedyName) : "",
  ];
  return Array.from(new Set(names.map(normalize).filter(Boolean)));
}

function chunkMatchesRemedy(chunkTitle: string, names: string[]): boolean {
  const title = normalize(chunkTitle.replace(/\s*[·-]\s*part\s+\d+$/i, ""));
  return names.some((name) => title === name || title.startsWith(`${name} `) || name.startsWith(`${title} `));
}

function sourceMetadata(remedyId: string, remedyName?: string, slug?: string): MateriaMedicaSourceView[] {
  const names = remedySourceNames(remedyId, remedyName, slug);
  const sources: MateriaMedicaSourceView[] = [];

  for (const book of MATERIA_MEDICA_REGISTRY) {
    const manifest = readManifest(book.id);
    if (!manifest) continue;
    const matches = manifest.chunks.filter((chunk) => chunkMatchesRemedy(chunk.title, names));
    if (!matches.length) continue;
    sources.push({
      bookId: book.id,
      title: book.title,
      author: book.author,
      year: book.year,
      sourceUrl: book.sourceUrl,
      passageTitle: matches.map((match) => match.title).join(" + "),
      correctionStatus: manifest.correctionStatus,
      editorialStatus: manifest.editorialStatus,
    });
  }

  return sources;
}

function cleanCorpusPassage(rawText: string, remedyNames: string[]): string {
  const lines = rawText.replace(/\r/g, "").split("\n");
  const headingIndex = lines.findIndex((line, index) => {
    if (index === 0) return false;
    const normalizedLine = normalize(line);
    return remedyNames.some((name) => normalizedLine === name);
  });
  const passageLines = headingIndex >= 0 ? lines.slice(headingIndex) : lines;
  return passageLines
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function loadSourceText(source: MateriaMedicaSourceView, remedyId: string, remedyName?: string, slug?: string): string {
  const manifest = readManifest(source.bookId);
  if (!manifest) return "";
  const names = remedySourceNames(remedyId, remedyName, slug);
  const chunks = manifest.chunks.filter((chunk) => chunkMatchesRemedy(chunk.title, names));
  const passages: string[] = [];
  for (const chunk of chunks) {
    try {
      const payload = JSON.parse(
        fs.readFileSync(path.join(CORPUS_ROOT, source.bookId, chunk.file), "utf8")
      ) as { text?: string };
      if (payload.text) passages.push(cleanCorpusPassage(payload.text, names));
    } catch {
      // A missing chunk must not prevent the curated remedy profile from loading.
    }
  }
  return passages.join("\n\n--- CONTINUED ---\n\n");
}

export function getConsultationMateriaMedicaProfile(
  remedyId: string,
  requestedSourceId?: string
): MateriaMedicaRemedyProfile | null {
  const cleanId = remedyId.trim();
  if (!cleanId || !/^[a-zA-Z0-9_-]{2,80}$/.test(cleanId)) return null;

  const remedy = resolveRemedy(cleanId);
  const remedyName = remedy?.title.en || cleanId.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const content = remedy?.content;
  const availableSources = sourceMetadata(cleanId, remedyName, remedy?.slug);
  const selectedMetadata =
    availableSources.find((source) => source.bookId === requestedSourceId) || availableSources[0];
  const selectedSource = selectedMetadata
    ? {
        ...selectedMetadata,
        text: loadSourceText(selectedMetadata, cleanId, remedyName, remedy?.slug),
      }
    : undefined;

  const referenceIds: string[] = Array.isArray(content?.references)
    ? content.references.filter((reference: unknown): reference is string => typeof reference === "string")
    : [];
  const citations = referenceIds
    .map((citationId) => getCitationById(citationId))
    .filter((citation) => citation != null)
    .map((citation) => ({
      id: citation.id,
      title: citation.title,
      authors: citation.authors,
      year: citation.year,
      canonicalUrl: citation.canonicalUrl,
      verificationStatus: citation.verificationStatus,
    }));

  if (!remedy && !selectedSource) return null;

  return {
    remedyId: cleanId,
    remedyName,
    slug: remedy?.slug,
    canonicalUrl: remedy?.canonicalUrl,
    editorialStatus: remedy?.editorialStatus,
    reviewStatus: remedy?.reviewStatus,
    summary: remedy?.summary.en,
    description: content?.description,
    clinicalPearl: remedy?.clinicalPearl,
    keynotes: Array.isArray(content?.keynotes) ? content.keynotes : [],
    mentalSymptoms: Array.isArray(content?.mentalSymptoms) ? content.mentalSymptoms : [],
    physicalSymptoms: Array.isArray(content?.physicalSymptoms) ? content.physicalSymptoms : [],
    generalities: content?.generalities,
    modalitiesBetter: Array.isArray(content?.modalitiesBetter) ? content.modalitiesBetter : [],
    modalitiesWorse: Array.isArray(content?.modalitiesWorse) ? content.modalitiesWorse : [],
    organAffinity: Array.isArray(content?.organAffinity) ? content.organAffinity : [],
    miasmaticAffinity: Array.isArray(content?.miasmaticAffinity) ? content.miasmaticAffinity : [],
    safetyNotes: content?.safetyNotes,
    citations,
    availableSources,
    selectedSource,
  };
}
