import fs from "node:fs";
import path from "node:path";

type BrowserRubric = {
  id: string;
  chapter: string;
  name: string;
  remedies: Record<string, number>;
  source: "jahr";
  scoringEnabled: true;
  scoringMode: "graded";
  citation: string;
  sourceUrl: string;
};

const sourceUrl = "https://archive.org/details/clinicalguideorp1850jahr";
const textUrl =
  "https://archive.org/download/clinicalguideorp1850jahr/clinicalguideorp1850jahr_djvu.txt";
const sourceFileArgument = process.argv
  .find((argument) => argument.startsWith("--source-file="))
  ?.slice("--source-file=".length);
const outputArgument = process.argv
  .find((argument) => argument.startsWith("--output="))
  ?.slice("--output=".length);
const outputPath = outputArgument
  ? path.resolve(outputArgument)
  : path.join(process.cwd(), "public", "data", "jahrClinicalGuideRepertoryData.json");

function remedyKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

const canonicalRemedyByKey = new Map<string, string>();
for (const relativePath of [
  "src/lib/remedyDataPack.json",
  "public/data/kentRepertoryData.json",
  "public/data/boerickeRepertoryData.json",
  "public/data/bogerBoenninghausenRepertoryData.json",
  "public/data/knerrHeringRepertoryData.json",
]) {
  const fullPath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(fullPath)) continue;
  const parsed = JSON.parse(fs.readFileSync(fullPath, "utf8")) as unknown;
  if (!Array.isArray(parsed)) continue;
  for (const item of parsed) {
    if (item && typeof item === "object" && "abbr" in item && typeof item.abbr === "string") {
      canonicalRemedyByKey.set(remedyKey(item.abbr), item.abbr);
    }
    if (item && typeof item === "object" && "remedies" in item && item.remedies && typeof item.remedies === "object") {
      for (const abbreviation of Object.keys(item.remedies)) {
        canonicalRemedyByKey.set(remedyKey(abbreviation), abbreviation);
      }
    }
  }
}

const aliases: Record<string, string> = {
  aeon: "Acon",
  acon: "Acon",
  agn: "Agn",
  am: "Arn",
  amm: "Am-c",
  ammm: "Am-m",
  ant: "Ant-c",
  tart: "Ant-t",
  asa: "Asaf",
  aur: "Aur",
  aurm: "Aur-m",
  baryt: "Baryta-c",
  bell: "Bell",
  bry: "Bry",
  calc: "Calc",
  carbveg: "Carbo-v",
  carban: "Carbo-an",
  chin: "Chin",
  cham: "Cham",
  cin: "Cina",
  cocc: "Cocculus",
  cupr: "Cupr",
  dros: "Dros",
  dulc: "Dulc",
  eupf: "Euphr",
  euphr: "Euphr",
  ferr: "Ferr",
  hep: "Hep",
  ign: "Ign",
  jod: "Iod",
  iod: "Iod",
  kal: "Kali-c",
  kreos: "Kreos",
  lyc: "Lyc",
  lye: "Lyc",
  magnarct: "Mag-c",
  magnaust: "Mag-c",
  magnm: "Mag-m",
  merc: "Merc",
  mere: "Merc",
  merccorr: "Merc-c",
  mez: "Mez",
  op: "Op",
  natr: "Nat-c",
  natrm: "Nat-m",
  nitrac: "Nit-ac",
  nmosch: "Nux-m",
  nux: "Nux-v",
  nvom: "Nux-v",
  phos: "Phos",
  phosph: "Phos",
  phosac: "Ph-ac",
  puls: "Puls",
  puis: "Puls",
  rhus: "Rhus-t",
  rhust: "Rhus-t",
  sabin: "Sabina",
  sassap: "Sars",
  sep: "Sep",
  sil: "Sil",
  spong: "Spong",
  staph: "Staph",
  stram: "Stram",
  sulph: "Sulph",
  thuj: "Thuja",
  veratr: "Verat",
  zinc: "Zinc",
};
for (const [key, value] of Object.entries(aliases)) canonicalRemedyByKey.set(key, value);

function normalizeSource(value: string): string {
  return value
    .replace(/\r/g, "")
    .replace(/-\s*\n\s*(?=[a-z])/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n");
}

function cleanLabel(value: string): string {
  return value
    .replace(/\^/g, "")
    .replace(/»/g, "as")
    .replace(/\bwo\b/gi, "we")
    .replace(/\btiie\b/gi, "the")
    .replace(/\btlie\b/gi, "the")
    .replace(/\beverting\b/gi, "evening")
    .replace(/^\s*(?:§\s*\d+\.?|[a-z]\)|\d+\))\s*/i, "")
    .replace(/\b(?:give|use|require|requires|required|principally|especially)\s*$/i, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/^[,.;:\s-]+|[,.;:\s-]+$/g, "")
    .trim();
}

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/(^|[\s(—/-])([a-z])/g, (_match, prefix: string, letter: string) =>
      `${prefix}${letter.toUpperCase()}`);
}

function chapterFor(article: string): string {
  const first = article.match(/[A-Z]/)?.[0] || "Z";
  if (first <= "C") return "A–C";
  if (first <= "F") return "D–F";
  if (first <= "I") return "G–I";
  if (first <= "L") return "J–L";
  if (first <= "O") return "M–O";
  if (first <= "R") return "P–R";
  if (first <= "U") return "S–U";
  return "V–Z";
}

function parseRemedies(value: string, defaultGrade: number): Record<string, number> {
  const remedies: Record<string, number> = {};
  const numbered = [...value.matchAll(/(?:^|[\s;,(])([1234])\)\s*/g)];
  const segments: Array<{ text: string; grade: number }> = [];
  if (numbered.length) {
    for (let index = 0; index < numbered.length; index += 1) {
      const marker = numbered[index];
      const start = (marker.index || 0) + marker[0].length;
      const end = index + 1 < numbered.length ? numbered[index + 1].index : value.length;
      const sourceClass = Number(marker[1]);
      if (sourceClass <= 3) {
        segments.push({ text: value.slice(start, end), grade: 4 - sourceClass });
      }
    }
  } else {
    segments.push({ text: value, grade: defaultGrade });
  }

  for (const segment of segments) {
    const proposalOffset = segment.text.search(/\b(?:or,?\s+perhaps|perhaps)\b/i);
    const governedText = proposalOffset >= 0 ? segment.text.slice(0, proposalOffset) : segment.text;
    for (const match of governedText.matchAll(/\b([A-Za-z][A-Za-z-]{1,18})(\.|\?)?/g)) {
      if (match[0].includes("?")) continue;
      const key = remedyKey(match[1]);
      if (!match[2] && !Object.hasOwn(aliases, key)) continue;
      const canonical = canonicalRemedyByKey.get(key);
      if (!canonical) continue;
      remedies[canonical] = Math.max(remedies[canonical] || 0, segment.grade);
    }
  }
  return remedies;
}

function extractArticleHeading(paragraph: string): string | null {
  const rawFirstLine = paragraph.split("\n", 1)[0].trim();
  if (/^\d+\s+[A-Z]/.test(rawFirstLine)) return null;
  const firstLine = rawFirstLine.replace(/^[^A-Z]+/, "");
  if (/^[A-Z]\)/.test(firstLine)) return null;
  const match = firstLine.match(/^([A-Z][A-Z '&(),.-]{2,})/);
  if (!match) return null;
  const raw = match[1]
    .replace(/\b(?:ETC|AND|OR)\s*$/g, "")
    .replace(/[,.\s-]+$/g, "")
    .trim();
  if (
    raw.length < 3
    || raw.length > 90
    || /^(CLINICAL|POCKET|THE |FOR |OF THE |XTC\b|CUSSIONS\b)/.test(raw)
  ) return null;
  return titleCase(raw)
    .replace(/,\s*A$/i, "")
    .replace(/^Affeotions\b/i, "Affections")
    .replace(/^Bleinorrh\b/i, "Blennorrh")
    .replace(/^Catarrf\b/i, "Catarrh")
    .replace(/^Diarrhcea\b/i, "Diarrhoea")
    .replace(/^Hæmorrh/i, "Haemorrh");
}

function parseCorpus(rawSource: string): BrowserRubric[] {
  const normalized = normalizeSource(rawSource);
  const start = normalized.indexOf("ABSCESSES, internal");
  const end = normalized.indexOf("CHARACTERISTIC SYMPTOMS");
  if (start < 0 || end <= start) throw new Error("Could not locate the governed Clinical Guide body.");

  const governedBody = normalized
    .slice(start, end)
    .replace(
      /^(?=['"]?[A-Z][A-Z '&(),.-]{2,}(?:—|:|\.|\s))/gm,
      "\n\n",
    );
  const paragraphs = governedBody.split(/\n\s*\n/);
  const byKey = new Map<string, BrowserRubric>();
  let article = "Abscesses";

  for (const rawParagraph of paragraphs) {
    const paragraph = rawParagraph
      .replace(/^\s*\d+\s+[A-Z][A-Z ,.'-]{2,}\.?\s*$/gm, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!paragraph) continue;
    const heading = extractArticleHeading(rawParagraph);
    if (heading) article = heading;

    const clauses = paragraph.split(
      /\s+[—–]\s+|(?<=[.!?])\s+(?=(?:§\s*\d+\.?\s*)?(?:[A-Z]|[a-z]\)))/,
    );
    for (const clause of clauses) {
      const colon = clause.indexOf(":");
      if (colon < 0) continue;
      const before = cleanLabel(clause.slice(0, colon));
      const after = clause.slice(colon + 1);
      const hasNumberedGrades = /(?:^|[\s;,(])[1234]\)\s*/.test(after);
      const remedies = parseRemedies(after, 1);
      if (!Object.keys(remedies).length) continue;

      const genericLabel =
        !before
        || /^(?:the )?(?:principal|best|specific|following|chief) remedies(?: are)?$/i.test(before)
        || /^(?:we may )?(?:use|give)$/i.test(before);
      const articlePrefix = new RegExp(`^${article.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[.,:—\\s-]*`, "i");
      const specificLabel = before.replace(articlePrefix, "").trim();
      let name = genericLabel || !specificLabel ? article : `${article} — ${specificLabel}`;
      name = name
        .replace(/\s+/g, " ")
        .replace(/\s+([,.;:])/g, "$1")
        .trim();
      if (
        name.length < 3
        || name.length > 190
        || /[<>{}[\]|\\]/.test(name)
        || (name.match(/[A-Za-z]/g)?.length || 0) < name.length * 0.55
      ) continue;

      const rubricKey = `${chapterFor(article)}|${name.toLowerCase()}`;
      const existing = byKey.get(rubricKey);
      if (existing) {
        for (const [remedy, grade] of Object.entries(remedies)) {
          existing.remedies[remedy] = Math.max(existing.remedies[remedy] || 0, grade);
        }
        continue;
      }
      const gradeNote = hasNumberedGrades
        ? "source classes preserved as portal grades 3, 2, and 1"
        : "unclassified source recommendation retained at occurrence grade 1";
      byKey.set(rubricKey, {
        id: `jahr-1850-${slug(article)}-${slug(name)}`,
        chapter: chapterFor(article),
        name,
        remedies,
        source: "jahr",
        scoringEnabled: true,
        scoringMode: "graded",
        citation: `G. H. G. Jahr, Clinical Guide or Pocket-Repertory (1850), ${article}; ${gradeNote}.`,
        sourceUrl,
      });
    }
  }

  const rubrics = [...byKey.values()]
    .filter((rubric) => Object.keys(rubric.remedies).length > 0)
    .sort((left, right) =>
      left.chapter.localeCompare(right.chapter)
      || left.name.localeCompare(right.name));
  const usedIds = new Map<string, number>();
  for (const rubric of rubrics) {
    const count = (usedIds.get(rubric.id) || 0) + 1;
    usedIds.set(rubric.id, count);
    if (count > 1) rubric.id = `${rubric.id}-${count}`;
  }
  return rubrics;
}

async function main() {
  const rawSource = sourceFileArgument
    ? fs.readFileSync(path.resolve(sourceFileArgument), "utf8")
    : await fetch(textUrl).then((response) => {
        if (!response.ok) throw new Error(`Jahr OCR returned HTTP ${response.status}.`);
        return response.text();
      });
  const rubrics = parseCorpus(rawSource);
  if (rubrics.length < 500) {
    throw new Error(`Only ${rubrics.length} governed rubrics were extracted; refusing to publish.`);
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(rubrics)}\n`);
  const remedyOccurrences = rubrics.reduce(
    (total, rubric) => total + Object.keys(rubric.remedies).length,
    0,
  );
  console.log(
    `Wrote ${rubrics.length} Jahr clinical rubrics, ${remedyOccurrences} remedy occurrences, `
      + `${new Set(rubrics.map((rubric) => rubric.chapter)).size} alphabetical sections to ${outputPath}.`,
  );
}

void main();
