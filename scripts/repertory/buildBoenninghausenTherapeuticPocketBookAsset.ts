import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { SaxesParser } from "saxes";

type StyledChar = {
  value: string;
  italic: boolean;
  smallcaps: boolean;
};

type SourceLine = {
  page: number;
  chars: StyledChar[];
};

type BrowserRubric = {
  id: string;
  chapter: string;
  name: string;
  remedies: Record<string, number>;
  source: "boenninghausen";
  scoringEnabled: true;
  scoringMode: "graded";
  citation: string;
  sourceUrl: string;
};

const archiveIdentifier = "64240620R.nlm.nih.gov";
const archiveSourceFile = "64240620R_abbyy.gz";
const sourceUrl = `https://archive.org/details/${archiveIdentifier}`;
const abbyyUrl = `https://archive.org/download/${archiveIdentifier}/${archiveSourceFile}`;
const outputPath = path.join(
  process.cwd(),
  "public",
  "data",
  "boenninghausenTherapeuticPocketBookData.json",
);
const sourceArgument = process.argv.find((argument) => argument.startsWith("--source="))?.slice("--source=".length);
const outputArgument = process.argv.find((argument) => argument.startsWith("--output="))?.slice("--output=".length);

// The Hempel edition starts the repertory at scan 22. Scan 369 begins the
// concordances, a remedy-relationship reference rather than selectable symptoms.
const repertoryFirstXmlPage = 23;
const repertoryLastXmlPage = 367;

const partByPage: Array<{ first: number; last: number; label: string }> = [
  { first: 23, last: 29, label: "Mind & Soul" },
  { first: 30, last: 139, label: "Parts of the Body & Organs" },
  { first: 140, last: 256, label: "Sensations & Complaints" },
  { first: 257, last: 270, label: "Sleep & Dreams" },
  { first: 271, last: 291, label: "Fever" },
  { first: 292, last: 367, label: "Alterations of the State of Health" },
];

function remedyKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const canonicalRemedyByKey = new Map<string, string>();
for (const relativePath of [
  "src/lib/remedyDataPack.json",
  "public/data/kentRepertoryData.json",
  "public/data/boerickeRepertoryData.json",
]) {
  const parsed = JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")) as unknown;
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

const sourceAliases: Record<string, string> = {
  acon: "Acon",
  aeon: "Acon",
  aconit: "Acon",
  antcrud: "Ant-c",
  anttart: "Ant-t",
  argent: "Arg-m",
  ammcarb: "Am-c",
  ammmur: "Am-m",
  am: "Arn",
  arnica: "Arn",
  ars: "Ars",
  asafoet: "Asaf",
  aur: "Aur",
  bar: "Bar-c",
  bell: "Bell",
  bov: "Bov",
  bry: "Bry",
  brt: "Bry",
  calad: "Calad",
  calc: "Calc",
  camph: "Camph",
  cann: "Cann-s",
  canth: "Canth",
  carban: "Carb-an",
  carbveg: "Carb-v",
  cham: "Cham",
  chin: "Chin",
  cocc: "Cocc",
  coff: "Coff",
  coloc: "Coloc",
  con: "Con",
  creos: "Kreos",
  cupr: "Cupr",
  cycl: "Cycl",
  dulc: "Dulc",
  ferr: "Ferr",
  graph: "Graph",
  guaj: "Guaj",
  hell: "Hell",
  hep: "Hep",
  hyosc: "Hyos",
  ignat: "Ign",
  ipec: "Ipec",
  jod: "Iod",
  kali: "Kali-c",
  lach: "Lach",
  laur: "Laur",
  led: "Led",
  lyc: "Lyc",
  ltc: "Lyc",
  lack: "Lach",
  lacb: "Lach",
  magnmur: "Mag-m",
  mar: "M-arct",
  marct: "M-arct",
  maustr: "M-aust",
  men: "Meny",
  mgs: "Mag-s",
  merc: "Merc",
  mezer: "Mez",
  mosch: "Mosch",
  murac: "Mur-ac",
  natr: "Nat-c",
  nair: "Nat-c",
  natrmur: "Nat-m",
  nitr: "Nitr",
  nitrac: "Nit-ac",
  nmosch: "Nux-m",
  nuxvom: "Nux-v",
  nvom: "Nux-v",
  oleand: "Olnd",
  op: "Op",
  petr: "Petr",
  phosph: "Phos",
  phac: "Ph-ac",
  plat: "Plat",
  plumb: "Plb",
  puls: "Puls",
  puis: "Puls",
  ranbulb: "Ran-b",
  ranscel: "Ran-s",
  rhodod: "Rhod",
  rhus: "Rhus-t",
  sabad: "Sabad",
  sabin: "Sabin",
  sassap: "Sars",
  scill: "Squil",
  seccorn: "Sec",
  selen: "Sel",
  seneg: "Seneg",
  sep: "Sep",
  sil: "Sil",
  spig: "Spig",
  spong: "Spong",
  stann: "Stann",
  staph: "Staph",
  stram: "Stram",
  stront: "Stront-c",
  sulph: "Sulph",
  sulphac: "Sul-ac",
  tar: "Tarent",
  thuj: "Thuja",
  valer: "Valer",
  veratr: "Verat",
  violod: "Viol-o",
  violtr: "Viol-t",
  vit: "Vit",
  zinc: "Zinc",
};

function plainText(chars: StyledChar[]): string {
  return chars.map((char) => char.value).join("").replace(/\s+/g, " ").trim();
}

function normalizeHeading(value: string): string {
  const normalized = value
    .replace(/^[*†"'“”‘’\s]+/, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/[.,;:]+$/, "")
    .trim();
  const sourceVerifiedCorrections: Record<string, string> = {
    "Covctousness": "Covetousness",
    "Daring1": "Daring",
    "ffladaess": "Madness",
  };
  return sourceVerifiedCorrections[normalized] || normalized;
}

function normalizeToken(value: string): string {
  return value
    .replace(/[“”‘’"'*†]/g, "")
    .replace(/\u00ad|¬/g, "")
    .replace(/^[\s([{]+|[\s)\]}]+$/g, "")
    .replace(/[.,;:!?]+$/g, "")
    .replace(/\^/g, "-")
    .replace(/[^A-Za-z0-9()-]/g, "")
    .trim();
}

function resolveRemedy(value: string): string | null {
  const token = normalizeToken(value);
  if (!token || token.length > 18 || !/[A-Za-z]/.test(token)) return null;
  const key = remedyKey(token);
  if (!key || /^(?:and|or|see|comp|compare|during|after|before|from|with|without)$/i.test(key)) return null;
  return sourceAliases[key] || canonicalRemedyByKey.get(key) || null;
}

function sourceGrade(chars: StyledChar[], rawToken: string): number {
  if (/^\s*\(/.test(rawToken) && /\)\s*[.,]?\s*$/.test(rawToken)) return 1;
  const letters = chars.filter((char) => /[A-Za-z]/.test(char.value));
  if (!letters.length) return 2;
  const text = letters.map((char) => char.value).join("");
  if (letters.filter((char) => char.smallcaps).length / letters.length >= 0.5) return 4;
  if (text.length > 1 && text === text.toUpperCase()) return 5;
  if (letters.filter((char) => char.italic).length / letters.length >= 0.5) return 3;
  return 2;
}

function tokenGroups(chars: StyledChar[]): StyledChar[][] {
  const groups: StyledChar[][] = [];
  let group: StyledChar[] = [];
  const flush = () => {
    if (group.some((char) => /[A-Za-z]/.test(char.value))) groups.push(group);
    group = [];
  };
  for (const char of chars) {
    if (/[\s,;]/.test(char.value)) flush();
    else group.push(char);
  }
  flush();
  return groups;
}

function parseRemedies(
  chars: StyledChar[],
  unresolved?: Map<string, number>,
): Record<string, number> {
  const remedies: Record<string, number> = {};
  for (const group of tokenGroups(chars)) {
    const raw = group.map((char) => char.value).join("").trim();
    const remedy = resolveRemedy(raw);
    if (!remedy) {
      const cleaned = normalizeToken(raw);
      if (unresolved && cleaned && /^[A-Za-z(]/.test(cleaned)) {
        unresolved.set(cleaned, (unresolved.get(cleaned) || 0) + 1);
      }
      continue;
    }
    remedies[remedy] = Math.max(remedies[remedy] || 0, sourceGrade(group, raw));
  }
  return remedies;
}

function remedyLineScore(line: SourceLine): { count: number; ratio: number } {
  const groups = tokenGroups(line.chars);
  const count = groups.filter((group) => resolveRemedy(group.map((char) => char.value).join(""))).length;
  return { count, ratio: groups.length ? count / groups.length : 0 };
}

function isRunningHeader(text: string): boolean {
  if (/^\d{1,3}$/.test(text)) return true;
  if (/^\d{1,3}\s+/.test(text)) return true;
  if (/^(?:THERAPEUTIC POCKET-BOOK|PART (?:FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH)|MIND AND SOUL|PARTS OF THE BODY AND ORGANS|SENSATIONS AND COMPLAINTS|SLEEP AND DREAMS|FEVER)\.?$/i.test(text)) return true;
  if (/^(?:\d{1,3}\s+)?[A-Z][A-Z '&,-]+\.?\s+\d{1,3}$/.test(text)) return true;
  if (/^\d{1,3}\s+[A-Z][A-Z .&,'-]+$/.test(text)) return true;
  return false;
}

function isSectionHeading(text: string): boolean {
  const normalized = text.replace(/\s+/g, " ").trim();
  return /^(?:[IVXLCDM]+\.)\s+[A-Z][A-Z '&,-]+\.?$/.test(normalized)
    || /^(?:[IVXLCDM]+\.)\s+(?:External|Internal|General|Concomitant)\b/i.test(normalized);
}

function isRubricHeading(lines: SourceLine[], index: number): boolean {
  const text = plainText(lines[index].chars);
  const lettersOnly = text.replace(/[^A-Za-z]/g, "");
  if (
    !text
    || text.length > 150
    || !/[A-Za-z]{3}/.test(text)
    || (lettersOnly.length > 3 && lettersOnly === lettersOnly.toUpperCase())
    || /\b[A-Z]?\d{1,3}$/.test(text)
    || isRunningHeader(text)
    || isSectionHeading(text)
    || remedyLineScore(lines[index]).count > 1
  ) return false;
  const punctuation = /[.!?)]$/.test(text);
  if (!punctuation && text.split(/\s+/).length > 8) return false;
  for (let lookahead = index + 1; lookahead <= Math.min(lines.length - 1, index + 2); lookahead += 1) {
    if (lines[lookahead].page !== lines[index].page && lookahead > index + 1) break;
    const score = remedyLineScore(lines[lookahead]);
    if (score.count >= 2 && score.ratio >= 0.2) return true;
    const nextText = plainText(lines[lookahead].chars);
    if (isSectionHeading(nextText) || isRunningHeader(nextText)) continue;
    if (nextText.length > 120) break;
  }
  return false;
}

function chapterForPage(page: number): string {
  return partByPage.find((part) => page >= part.first && page <= part.last)?.label || "Therapeutic Pocket Book";
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
}

async function readSource(): Promise<Buffer> {
  if (sourceArgument) return fs.readFileSync(path.resolve(sourceArgument));
  const response = await fetch(abbyyUrl);
  if (!response.ok) throw new Error(`Internet Archive ABBYY source returned HTTP ${response.status}.`);
  return Buffer.from(await response.arrayBuffer());
}

async function parseLines(compressedXml: Buffer): Promise<SourceLine[]> {
  const lines: SourceLine[] = [];
  let page = 0;
  let currentLine: SourceLine | null = null;
  let formatting = { italic: false, smallcaps: false };
  let charValue = "";
  let charFormatting = formatting;
  const parser = new SaxesParser();
  parser.on("opentag", (tag) => {
    const name = tag.name.split(":").pop();
    if (name === "page") page += 1;
    if (page < repertoryFirstXmlPage || page > repertoryLastXmlPage) return;
    if (name === "line") {
      currentLine = { page, chars: [] };
    } else if (name === "formatting") {
      formatting = {
        italic: tag.attributes.italic === "true",
        smallcaps: tag.attributes.smallcaps === "true",
      };
    } else if (name === "charParams") {
      charValue = "";
      charFormatting = {
        italic: tag.attributes.italic === "true" || formatting.italic,
        smallcaps: tag.attributes.smallcaps === "true" || formatting.smallcaps,
      };
    }
  });
  parser.on("text", (value) => {
    charValue += value;
  });
  parser.on("closetag", (tag) => {
    const name = tag.name.split(":").pop();
    if (page < repertoryFirstXmlPage || page > repertoryLastXmlPage) return;
    if (name === "charParams" && currentLine) {
      currentLine.chars.push({ value: charValue, ...charFormatting });
    } else if (name === "line" && currentLine) {
      if (plainText(currentLine.chars)) lines.push(currentLine);
      currentLine = null;
    }
  });
  await new Promise<void>((resolve, reject) => {
    const gunzip = zlib.createGunzip();
    gunzip.on("data", (chunk) => parser.write(chunk.toString()));
    gunzip.on("end", () => {
      parser.close();
      resolve();
    });
    gunzip.on("error", reject);
    gunzip.end(compressedXml);
  });
  return lines;
}

function buildRubrics(lines: SourceLine[]): {
  rubrics: BrowserRubric[];
  unresolved: Map<string, number>;
} {
  const rubrics: BrowserRubric[] = [];
  const unresolved = new Map<string, number>();
  let current: { heading: string; page: number; remedyChars: StyledChar[] } | null = null;
  const finish = () => {
    if (!current) return;
    const remedies = parseRemedies(current.remedyChars, unresolved);
    if (Object.keys(remedies).length > 0) {
      const chapter = chapterForPage(current.page);
      rubrics.push({
        id: `boenninghausen-scan-${current.page}-${slug(chapter)}-${slug(current.heading)}-${rubrics.length + 1}`,
        chapter,
        name: current.heading,
        remedies,
        source: "boenninghausen",
        scoringEnabled: true,
        scoringMode: "graded",
        citation: `C. M. F. von Bönninghausen, Therapeutic Pocket-Book (1846; first English ed., trans. C. J. Hempel, 1847), source scan ${current.page}`,
        sourceUrl: `${sourceUrl}/page/n${current.page - 1}/mode/1up`,
      });
    }
    current = null;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const text = plainText(line.chars);
    if (isRunningHeader(text) || isSectionHeading(text)) continue;
    if (isRubricHeading(lines, index)) {
      finish();
      current = { heading: normalizeHeading(text), page: line.page, remedyChars: [] };
      continue;
    }
    if (!current) continue;
    const previousText = plainText(current.remedyChars);
    current.remedyChars.push(
      ...(previousText.endsWith("-") ? [] : [{ value: " ", italic: false, smallcaps: false }]),
      ...line.chars,
    );
  }
  finish();
  return { rubrics, unresolved };
}

async function main() {
  const compressedXml = await readSource();
  const lines = await parseLines(compressedXml);
  const { rubrics, unresolved } = buildRubrics(lines);
  const occurrenceCount = rubrics.reduce((sum, rubric) => sum + Object.keys(rubric.remedies).length, 0);
  const gradeCounts = rubrics.reduce<Record<number, number>>((counts, rubric) => {
    for (const grade of Object.values(rubric.remedies)) counts[grade] = (counts[grade] || 0) + 1;
    return counts;
  }, {});
  if (rubrics.length < 1_000) throw new Error(`Quality gate failed: only ${rubrics.length} scored rubrics were recovered.`);
  if (occurrenceCount < 20_000) throw new Error(`Quality gate failed: only ${occurrenceCount} remedy occurrences were recovered.`);
  for (const grade of [1, 2, 3, 4, 5]) {
    if (!gradeCounts[grade]) throw new Error(`Quality gate failed: printed grade ${grade} was not recovered.`);
  }
  const destination = outputArgument ? path.resolve(outputArgument) : outputPath;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify(rubrics)}\n`);
  console.log(JSON.stringify({
    source: abbyyUrl,
    destination,
    rubrics: rubrics.length,
    chapters: new Set(rubrics.map((rubric) => rubric.chapter)).size,
    remedyOccurrences: occurrenceCount,
    gradeCounts,
    unresolvedTokenTypes: unresolved.size,
    unresolvedTop: Array.from(unresolved.entries()).sort((left, right) => right[1] - left[1]).slice(0, 40),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
