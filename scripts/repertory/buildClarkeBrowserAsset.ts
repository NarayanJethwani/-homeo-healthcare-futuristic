import fs from "fs";
import path from "path";

type ClarkeChapter = {
  name: "Clinical" | "Causation" | "Temperaments";
  firstCanvas: number;
  lastCanvas: number;
};

type AltoLine = {
  x: number;
  text: string;
};

type ClarkeBrowserRubric = {
  id: string;
  chapter: ClarkeChapter["name"];
  name: string;
  remedies: Record<string, never>;
  source: "clarke";
  scoringEnabled: false;
  citation: string;
  sourceUrl: string;
};

const wellcomeWorkId = "b31353812";
const altoBaseUrl = `https://api.wellcomecollection.org/text/alto/${wellcomeWorkId}`;
const outputPath = path.join(process.cwd(), "public", "data", "clarkeClinicalRepertoryData.json");
const chapters: ClarkeChapter[] = [
  { name: "Clinical", firstCanvas: 50, lastCanvas: 152 },
  { name: "Causation", firstCanvas: 153, lastCanvas: 170 },
  { name: "Temperaments", firstCanvas: 171, lastCanvas: 216 },
];

function decodeXml(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function extractAltoLines(xml: string): AltoLine[] {
  const printSpace = xml.match(/<PrintSpace\b[\s\S]*?<\/PrintSpace>/)?.[0] || "";
  return Array.from(printSpace.matchAll(/<TextLine\b([^>]*)>([\s\S]*?)<\/TextLine>/g)).map((lineMatch) => {
    const x = Number(lineMatch[1].match(/\bHPOS="(\d+)"/)?.[1] || 0);
    const words = Array.from(lineMatch[2].matchAll(/<String\b[^>]*\bCONTENT="([^"]*)"[^>]*\/>/g))
      .map((wordMatch) => decodeXml(wordMatch[1]));
    return { x, text: words.join(" ").trim() };
  }).filter((line) => line.text.length > 0);
}

function splitRubricHeading(text: string): string | null {
  const normalized = text.replace(/\u00ad|¬/g, "").replace(/\s+/g, " ").trim();
  if (/^(?:see\b|part\b|a clinical repertory\b|repertory of\b)/i.test(normalized)) return null;

  const dashSeparator = normalized.search(/\s*\.?\s*—\s*/);
  if (dashSeparator > 1) return normalized.slice(0, dashSeparator).trim();

  const missingDash = normalized.match(/^(.{2,160}?)\.\s+(?=\(?[A-Z][A-Za-z]{0,3}(?:\.|,))/);
  return missingDash?.[1]?.trim() || null;
}

function cleanHeading(value: string): string {
  return value
    .replace(/\u00ad|¬/g, "")
    .replace(/^[\s.'‘’"“”•*—–-]+/, "")
    .replace(/^\(E(?=[a-z])/i, "Oe")
    .replace(/\bBheum/g, "Rheum")
    .replace(/\bBash\b/g, "Rash")
    .replace(/\bBepeated\b/g, "Repeated")
    .replace(/\boi\b/g, "of")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/[.;:,]+$/, "")
    .trim();
}

function isReadableHeading(value: string): boolean {
  if (value.length < 3 || value.length > 180) return false;
  if (!/^[A-ZÀ-ÖØ-ÞŒ]/.test(value)) return false;
  if (!/[A-Za-z]{3}/.test(value) || /\d|\uFFFD/.test(value)) return false;
  if (/[a-z][A-Z]/.test(value)) return false;
  if ((value.match(/,/g) || []).length > 4) return false;
  const commaParts = value.split(",").map((part) => part.replace(/[().\s]/g, "")).filter(Boolean);
  if (commaParts.length >= 2 && commaParts.every((part) => /^[A-Za-z]{1,5}$/.test(part))) return false;
  const words = value.split(/\s+/).map((word) => word.replace(/[^A-Za-z]/g, "")).filter(Boolean);
  if (value.includes(".") && words.length <= 4 && words.every((word) => word.length <= 4)) return false;
  if ((value.match(/[^A-Za-zÀ-ÖØ-öø-ÿæœÆŒ\s,'’()./&—–-]/g) || []).length > 0) return false;
  const letters = (value.match(/[A-Za-zÀ-ÖØ-öø-ÿæœÆŒ]/g) || []).length;
  return letters / value.length >= 0.62;
}

async function fetchCanvas(canvas: number): Promise<{ canvas: number; lines: AltoLine[] }> {
  const paddedCanvas = String(canvas).padStart(4, "0");
  const response = await fetch(`${altoBaseUrl}/${wellcomeWorkId}_${paddedCanvas}.jp2`);
  if (!response.ok) throw new Error(`Wellcome ALTO canvas ${canvas} returned HTTP ${response.status}.`);
  return { canvas, lines: extractAltoLines(await response.text()) };
}

async function fetchChapterPages(chapter: ClarkeChapter): Promise<Array<{ canvas: number; lines: AltoLine[] }>> {
  const canvases = Array.from(
    { length: chapter.lastCanvas - chapter.firstCanvas + 1 },
    (_, index) => chapter.firstCanvas + index
  );
  const pages: Array<{ canvas: number; lines: AltoLine[] }> = [];
  for (let index = 0; index < canvases.length; index += 8) {
    pages.push(...await Promise.all(canvases.slice(index, index + 8).map(fetchCanvas)));
  }
  return pages.sort((left, right) => left.canvas - right.canvas);
}

async function main() {
  const rubrics: ClarkeBrowserRubric[] = [];
  const seen = new Set<string>();

  for (const chapter of chapters) {
    let currentMainHeading = "";
    const pages = await fetchChapterPages(chapter);
    for (const page of pages) {
      const pageCandidates = page.lines.map((line) => {
        const rawHeading = splitRubricHeading(line.text);
        if (!rawHeading) return null;
        const cleaned = cleanHeading(rawHeading);
        return isReadableHeading(cleaned) ? { line, rawHeading, cleaned } : null;
      }).filter((candidate): candidate is { line: AltoLine; rawHeading: string; cleaned: string } => Boolean(candidate));
      let lineIndex = 0;
      for (const { line, rawHeading, cleaned } of pageCandidates) {
        lineIndex += 1;
        const isContinuationHeading = rawHeading.trim().startsWith("-");
        const clinicalIndentThreshold = page.canvas % 2 === 0 ? 410 : 300;
        const isIndentedClinicalHeading = chapter.name === "Clinical" && line.x >= clinicalIndentThreshold;

        let name = cleaned;
        if (chapter.name === "Clinical" && !isIndentedClinicalHeading && cleaned.includes(",")) {
          const commaIndex = cleaned.indexOf(",");
          currentMainHeading = cleaned.slice(0, commaIndex).trim();
          name = `${currentMainHeading} — ${cleaned.slice(commaIndex + 1).trim()}`;
        } else if (isContinuationHeading || (isIndentedClinicalHeading && currentMainHeading)) {
          name = `${currentMainHeading} — ${cleaned}`;
        } else {
          currentMainHeading = cleaned;
        }
        if (!isReadableHeading(name)) continue;

        const dedupeKey = `${chapter.name}\u0000${name.toLocaleLowerCase("en")}`;
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);

        const printedPage = page.canvas - 16;
        rubrics.push({
          id: `clarke_wellcome_${String(page.canvas).padStart(4, "0")}_${String(lineIndex).padStart(3, "0")}`,
          chapter: chapter.name,
          name,
          remedies: {},
          source: "clarke",
          scoringEnabled: false,
          citation: `John Henry Clarke, A Clinical Repertory to the Dictionary of Materia Medica (1904), p. ${printedPage}`,
          sourceUrl: `https://wellcomecollection.org/works/qb85y2ct/items?canvas=${page.canvas}`,
        });
      }
    }
  }

  rubrics.sort((left, right) =>
    left.chapter.localeCompare(right.chapter) ||
    left.name.localeCompare(right.name) ||
    left.id.localeCompare(right.id)
  );

  const requiredLabels = ["Abdomen — Coldness in", "Acne — Rosacea", "Scorbutic Affections", "Spermatorrhoea"];
  const labels = new Set(rubrics.map((rubric) => rubric.name));
  if (rubrics.length < 2_000) {
    throw new Error(`Quality gate expected at least 2,000 readable Clarke rubrics, received ${rubrics.length}.`);
  }
  if (requiredLabels.some((label) => !labels.has(label))) {
    throw new Error(`Quality gate is missing representative labels: ${requiredLabels.filter((label) => !labels.has(label)).join(", ")}`);
  }
  if (rubrics.some((rubric) =>
    !rubric.id ||
    !isReadableHeading(rubric.name) ||
    Object.keys(rubric.remedies).length > 0 ||
    rubric.scoringEnabled
  )) {
    throw new Error("Clarke browser projection violated readability or search-only constraints.");
  }

  fs.writeFileSync(outputPath, JSON.stringify(rubrics));
  console.log(`Wrote ${rubrics.length} quality-gated, search-only Clarke rubrics to ${outputPath}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
