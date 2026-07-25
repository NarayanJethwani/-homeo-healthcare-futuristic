import fs from "fs";
import path from "path";
import { CLARKE_REMEDY_MAP } from "../../src/features/repertory/import-export/ingestionPipeline";

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
  remedies: Record<string, 1>;
  source: "clarke";
  scoringEnabled: false;
  scoringMode: "occurrence";
  occurrenceScoringEnabled: true;
  citation: string;
  sourceUrl: string;
};

type ParsedRubricLine = {
  heading: string;
  remedyText: string;
};

const wellcomeWorkId = "b31353812";
const altoBaseUrl = `https://api.wellcomecollection.org/text/alto/${wellcomeWorkId}`;
const outputPath = path.join(process.cwd(), "public", "data", "clarkeClinicalRepertoryData.json");
const remedyPackPath = path.join(process.cwd(), "src", "lib", "remedyDataPack.json");
const remedyPack = JSON.parse(fs.readFileSync(remedyPackPath, "utf8")) as Array<{ abbr?: string }>;
const canonicalRemedyByKey = new Map<string, string>();
const originalClarkeAbbreviationByKey = new Map<string, string>();
const unresolvedRemedyTokens = new Map<string, number>();
for (const abbreviation of [
  ...remedyPack.map((remedy) => remedy.abbr).filter((value): value is string => Boolean(value)),
  ...Object.values(CLARKE_REMEDY_MAP),
]) {
  const key = abbreviation.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (key && !canonicalRemedyByKey.has(key)) canonicalRemedyByKey.set(key, abbreviation);
}
const chapters: ClarkeChapter[] = [
  { name: "Clinical", firstCanvas: 50, lastCanvas: 152 },
  { name: "Causation", firstCanvas: 153, lastCanvas: 170 },
  { name: "Temperaments", firstCanvas: 171, lastCanvas: 216 },
];
const abbreviationIndexCanvases = Array.from({ length: 12 }, (_, index) => 32 + index);

const sourceVerifiedCorrections: Record<string, string> = {
  trn: "Tarent",
  ain: "Alum",
  flx: "Fl-ac",
  fix: "Fl-ac",
  rap: "Raph",
  cua: "Cupr-ac",
  crdm: "Card-m",
  son: "Sol-n",
  cub: "Cube",
  epu: "Eup-pur",
  wye: "Wyeth",
  par: "Paris",
  rnb: "Ran-b",
  nph: "Naph",
  drs: "Dros",
  iof: "Iof",
  src: "Sarr",
  lcvd: "Lac-d",
  znm: "Zin-Mur",
  ill: "Illi",
  mrcy: "Merc-cy",
  znv: "Zinc-val",
  paeo: "Paeon",
  arlp: "Arct",
  cod: "Code",
  rsv: "Rhus-v",
  dir: "Dirc",
  til: "Tili",
  kcy: "Kali-cy",
  sue: "Succ",
};

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

function splitRubricLine(text: string): ParsedRubricLine | null {
  const normalized = text.replace(/\u00ad|¬/g, "").replace(/\s+/g, " ").trim();
  if (/^(?:see\b|part\b|a clinical repertory\b|repertory of\b)/i.test(normalized)) return null;

  const dashSeparator = normalized.match(/\s*\.?\s*—\s*/);
  if (dashSeparator?.index && dashSeparator.index > 1) {
    return {
      heading: normalized.slice(0, dashSeparator.index).trim(),
      remedyText: normalized.slice(dashSeparator.index + dashSeparator[0].length).trim(),
    };
  }

  const missingDash = normalized.match(/^(.{2,160}?)\.\s+(?=\(?[A-Z][A-Za-z]{0,3}(?:\.|,))/);
  if (!missingDash?.[1]) return null;
  return {
    heading: missingDash[1].trim(),
    remedyText: normalized.slice(missingDash[0].length).trim(),
  };
}

function normalizeRemedyToken(value: string): string {
  return value
    .replace(/\u00ad|¬/g, "")
    .replace(/[“”‘’]/g, "")
    .replace(/^0?1\.\s*j\.?$/i, "Ol. j.")
    .replace(/^[\s([{]+|[\s)\]}]+$/g, "")
    .replace(/[„;,]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function remedyKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function sourceAbbreviationDisplay(value: string): string {
  return value
    .replace(/\.$/, "")
    .replace(/\.\s*/g, "-")
    .replace(/[^A-Za-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/-$/, "");
}

function resolveRemedy(value: string): string | null {
  const token = normalizeRemedyToken(value);
  if (!token || /^(?:see|also|and|or)\b/i.test(token)) return null;

  const lower = token.toLowerCase();
  const withoutTrailingPeriod = lower.replace(/\.$/, "");
  const withoutPeriods = withoutTrailingPeriod.replace(/\./g, "").replace(/\s+/g, " ").trim();
  const mapped = CLARKE_REMEDY_MAP[token]
    || CLARKE_REMEDY_MAP[lower]
    || CLARKE_REMEDY_MAP[withoutTrailingPeriod]
    || CLARKE_REMEDY_MAP[withoutPeriods];
  if (mapped) return mapped;

  const canonicalKey = remedyKey(token);
  return sourceVerifiedCorrections[canonicalKey]
    || canonicalRemedyByKey.get(canonicalKey)
    || originalClarkeAbbreviationByKey.get(canonicalKey)
    || null;
}

function resolveRemedySequence(value: string): string[] {
  const direct = resolveRemedy(value);
  if (direct) return [direct];

  const words = normalizeRemedyToken(value).split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 6) return [];
  for (let splitIndex = 1; splitIndex < words.length; splitIndex += 1) {
    const left = resolveRemedySequence(words.slice(0, splitIndex).join(" "));
    const right = resolveRemedySequence(words.slice(splitIndex).join(" "));
    if (left.length > 0 && right.length > 0) return [...left, ...right];
  }
  return [];
}

function parseRemedies(value: string): string[] {
  const remedyPortion = value.split(/\bsee\s+also\b/i)[0].trim();
  if (!remedyPortion) return [];
  const remedies: string[] = [];
  for (const rawToken of remedyPortion.split(/,\s*/)) {
    const resolved = resolveRemedySequence(rawToken);
    if (resolved.length === 0) {
      const token = normalizeRemedyToken(rawToken);
      if (token && !/^(?:see|also|and|or)\b/i.test(token)) {
        unresolvedRemedyTokens.set(token, (unresolvedRemedyTokens.get(token) || 0) + 1);
      }
      continue;
    }
    remedies.push(...resolved);
  }
  return Array.from(new Set(remedies));
}

function looksLikeRemedyContinuation(line: AltoLine): boolean {
  if (line.x < 340 || line.text.length > 180 || !/[.,]/.test(line.text)) return false;
  const parts = line.text.split(/,\s*/).filter(Boolean);
  return parts.length > 0 && parts.every((part) => part.trim().length <= 18);
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

async function loadOriginalAbbreviationIndex(): Promise<void> {
  const pages = await Promise.all(abbreviationIndexCanvases.map(fetchCanvas));
  for (const page of pages) {
    for (const line of page.lines) {
      const abbreviation = normalizeRemedyToken(line.text);
      if (
        abbreviation.length < 2
        || abbreviation.length > 16
        || !abbreviation.includes(".")
        || !/^[A-Z0-9][A-Za-z0-9.\s]+$/.test(abbreviation)
      ) continue;
      const key = remedyKey(abbreviation);
      const display = sourceAbbreviationDisplay(abbreviation);
      if (key && display && !originalClarkeAbbreviationByKey.has(key)) {
        originalClarkeAbbreviationByKey.set(key, display);
      }
    }
  }
}

async function main() {
  await loadOriginalAbbreviationIndex();
  const rubrics: ClarkeBrowserRubric[] = [];
  const seen = new Set<string>();

  for (const chapter of chapters) {
    let currentMainHeading = "";
    let lastRubric: ClarkeBrowserRubric | null = null;
    const pages = await fetchChapterPages(chapter);
    for (const page of pages) {
      let lineIndex = 0;
      for (const line of page.lines) {
        const parsed = splitRubricLine(line.text);
        if (!parsed) {
          if (lastRubric && looksLikeRemedyContinuation(line)) {
            for (const remedy of parseRemedies(line.text)) lastRubric.remedies[remedy] = 1;
          }
          continue;
        }
        const cleaned = cleanHeading(parsed.heading);
        if (!isReadableHeading(cleaned)) continue;
        lineIndex += 1;
        const isContinuationHeading = parsed.heading.trim().startsWith("-");
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
        const rubric: ClarkeBrowserRubric = {
          id: `clarke_wellcome_${String(page.canvas).padStart(4, "0")}_${String(lineIndex).padStart(3, "0")}`,
          chapter: chapter.name,
          name,
          remedies: Object.fromEntries(parseRemedies(parsed.remedyText).map((remedy) => [remedy, 1])),
          source: "clarke",
          scoringEnabled: false,
          scoringMode: "occurrence",
          occurrenceScoringEnabled: true,
          citation: `John Henry Clarke, A Clinical Repertory to the Dictionary of Materia Medica (1904), p. ${printedPage}`,
          sourceUrl: `https://wellcomecollection.org/works/qb85y2ct/items?canvas=${page.canvas}`,
        };
        rubrics.push(rubric);
        lastRubric = rubric;
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
  const rubricsWithRemedies = rubrics.filter((rubric) => Object.keys(rubric.remedies).length > 0);
  const remedyOccurrences = rubricsWithRemedies.reduce((sum, rubric) => sum + Object.keys(rubric.remedies).length, 0);
  if (rubricsWithRemedies.length < 3_000 || remedyOccurrences < 8_000) {
    throw new Error(`Remedy recovery gate expected at least 3,000 mapped rubrics and 8,000 occurrences; received ${rubricsWithRemedies.length} and ${remedyOccurrences}.`);
  }
  if (rubrics.some((rubric) =>
    !rubric.id ||
    !isReadableHeading(rubric.name) ||
    rubric.scoringEnabled !== false ||
    rubric.scoringMode !== "occurrence" ||
    !rubric.occurrenceScoringEnabled ||
    Object.values(rubric.remedies).some((weight) => weight !== 1)
  )) {
    throw new Error("Clarke browser projection violated readability or occurrence-scoring constraints.");
  }

  fs.writeFileSync(outputPath, JSON.stringify(rubrics));
  console.log(`Wrote ${rubrics.length} quality-gated Clarke rubrics with ${remedyOccurrences} equal-weight remedy occurrences across ${rubricsWithRemedies.length} rubrics to ${outputPath}.`);
  const unresolved = Array.from(unresolvedRemedyTokens.entries()).sort((left, right) => right[1] - left[1]);
  console.log(`Unresolved remedy token audit: ${unresolved.reduce((sum, [, count]) => sum + count, 0)} occurrences across ${unresolved.length} unique tokens.`);
  if (unresolved.length > 0) console.log(unresolved.slice(0, 40));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
