import type { RepertoryRubric } from "@/features/repertory/types";
import type { CanonicalRubricSearchResult } from "./repertoryConsultationAdapter";

export const UI_TO_CORPUS_SOURCE_ID = {
  kent_repertory_v1: "kent_1908",
  boericke_repertory_v1: "boericke_1927",
} as const;

const CORPUS_TO_UI_SOURCE_ID: Record<string, string> = Object.fromEntries(
  Object.entries(UI_TO_CORPUS_SOURCE_ID).map(([uiId, corpusId]) => [corpusId, uiId])
);

const CHAPTER_IDS_BY_SOURCE: Record<string, Record<string, string[]>> = {
  kent_1908: {
    MIND: ["Mind (Mental & Emotional)"],
    HEAD: ["Vertigo & Head"],
    STOMACH: ["Stomach & Gastric"],
    RESPIRATION: ["Respiration & Chest"],
    COUGH: ["Larynx, Cough & Trachea"],
    SKIN: ["Skin & Eruptions"],
    GENERALITIES: ["Generalities & Modalities"],
    EXTREMITIES: ["Extremities & Joints"],
    RECTUM: ["Rectum, Stool & Bowels"],
    ABDOMEN: ["Abdomen & Liver"],
    CHEST: ["Respiration & Chest"],
    FEVER: ["Fever, Chill & Sweat"],
    SLEEP: ["Sleep & Dreams"],
  },
  boericke_1927: {
    MIND: ["Mind & Nervous System"],
    HEAD: ["Head & Vertigo"],
    STOMACH: ["Stomach & Abdomen"],
    RESPIRATION: ["Respiratory System"],
    COUGH: ["Respiratory System"],
    SKIN: ["Skin & Eruptions"],
    GENERALITIES: ["Modalities & Generalities"],
    EXTREMITIES: ["Locomotor & Joints"],
    ABDOMEN: ["Stomach & Abdomen"],
    CHEST: ["Circulatory & Heart", "Respiratory System"],
    FEVER: ["Fever & Chill"],
  },
};

export function toCorpusSourceId(uiSourceId?: string): string | undefined {
  if (!uiSourceId || uiSourceId === "all") return undefined;
  return UI_TO_CORPUS_SOURCE_ID[uiSourceId as keyof typeof UI_TO_CORPUS_SOURCE_ID];
}

export function toUiSourceId(corpusSourceId?: string): string {
  if (!corpusSourceId) return "kent_repertory_v1";
  return CORPUS_TO_UI_SOURCE_ID[corpusSourceId] || corpusSourceId;
}

export function getCorpusChapterIds(sourceId: string, uiChapter?: string): string[] {
  if (!uiChapter || uiChapter === "all") return [];
  return CHAPTER_IDS_BY_SOURCE[sourceId]?.[uiChapter.toUpperCase()] || [];
}

function normalizeRemedyId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function mapPublishedRubric(rubric: RepertoryRubric): CanonicalRubricSearchResult {
  const chapterName = rubric.chapterId || rubric.organSystem || "GENERALITIES";
  const title = rubric.title || rubric.displayText || rubric.originalText || rubric.rubricId;
  const hierarchyPath = Array.isArray(rubric.hierarchyPath) ? [...rubric.hierarchyPath] : [];
  const rubricPath = hierarchyPath.length > 0 ? hierarchyPath : [chapterName];

  if (rubricPath[0]?.toLowerCase() !== chapterName.toLowerCase()) {
    rubricPath.unshift(chapterName);
  }
  if (rubricPath.at(-1)?.toLowerCase() !== title.toLowerCase()) {
    rubricPath.push(title);
  }

  const relatedRemedies = Array.isArray(rubric.relatedRemedies) ? rubric.relatedRemedies : [];
  const remedyEntries = Array.isArray(rubric.remedyEntries) ? rubric.remedyEntries : [];
  const remedies = relatedRemedies.length > 0
    ? relatedRemedies.map((remedy) => ({
        remedyId: normalizeRemedyId(remedy.remedyName || remedy.remedyId),
        remedyName: remedy.remedyName || remedy.remedyId,
        grade: Number(remedy.grade || 1),
      }))
    : remedyEntries.map((remedy) => ({
        remedyId: normalizeRemedyId(remedy.canonicalAbbreviation || remedy.remedyId || remedy.sourceAbbreviation),
        remedyName: remedy.canonicalAbbreviation || remedy.remedyId || remedy.sourceAbbreviation,
        grade: Number(remedy.normalizedGrade || remedy.sourceGrade || 1),
      }));

  return {
    rubricId: rubric.rubricId,
    sourceId: toUiSourceId(rubric.sourceId),
    sourceTitle: rubric.source || "Published Repertory Corpus",
    chapterName,
    rubricPath,
    remedyCount: remedies.length,
    remedies,
  };
}
