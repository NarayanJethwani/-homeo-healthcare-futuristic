import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { SaxesParser } from "saxes";

type StyledChar = {
  value: string;
  bold: boolean;
  italic: boolean;
};

type SourceLine = {
  page: number;
  left: number;
  chars: StyledChar[];
};

type BrowserRubric = {
  id: string;
  chapter: string;
  name: string;
  remedies: Record<string, number>;
  source: "boger";
  scoringEnabled: true;
  scoringMode: "graded";
  citation: string;
  sourceUrl: string;
};

const archiveIdentifier = "boenninghausensc00bn";
const sourceUrl = `https://archive.org/details/${archiveIdentifier}`;
const abbyyUrl = `https://archive.org/download/${archiveIdentifier}/${archiveIdentifier}_abbyy.gz`;
const outputPath = path.join(process.cwd(), "public", "data", "bogerBoenninghausenRepertoryData.json");
const sourceArgument = process.argv.find((argument) => argument.startsWith("--source="))?.slice("--source=".length);
const outputArgument = process.argv.find((argument) => argument.startsWith("--output="))?.slice("--output=".length);
const repertoryFirstXmlPage = 216;
const repertoryLastXmlPage = 782;

const canonicalRemedyByKey = new Map<string, string>();
for (const relativePath of [
  "src/lib/remedyDataPack.json",
  "public/data/kentRepertoryData.json",
  "public/data/boerickeRepertoryData.json",
]) {
  const parsed = JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")) as unknown;
  if (Array.isArray(parsed)) {
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
}

const sourceAliases: Record<string, string> = {
  aco: "Acon",
  agc: "Arg-n",
  alo: "Aloe",
  am: "Arn",
  amb: "Ambra",
  ap: "Apis",
  arg: "Arg-m",
  aur: "Aur-m",
  barc: "Baryta-c",
  bro: "Brom",
  calc: "Calc",
  calcc: "Calc",
  cam: "Camph",
  chain: "Cham",
  chin: "Chna",
  coccl: "Cocculus",
  cocci: "Cocculus",
  cup: "Cupr",
  euphor: "Euph",
  flxac: "Flu-ac",
  gel: "Gels",
  glo: "Glon",
  hyo: "Hyos",
  ip: "Ipec",
  kre: "Kreos",
  men: "Meny",
  mere: "Merc",
  mgs: "Mag-s",
  mos: "Mosch",
  natm: "Nat-m",
  phosac: "Ph-ac",
  plb: "Plumb",
  pul: "Puls",
  put: "Puls",
  rhe: "Rheum",
  rhust: "Rhus-t",
  saba: "Sabad",
  sabi: "Sabina",
  scil: "Squil",
  secc: "Sec",
  sele: "Sel",
  spo: "Spong",
  sul: "Sulph",
  sulac: "Sulph-ac",
  thu: "Thuja",
  thuj: "Thuja",
  verata: "Verat",
  zin: "Zinc",
};

const chapterLabels: Record<string, string> = {
  MIND: "Mind",
  "HEAD INTERNAL": "Head — Internal",
  "HEAD EXTERNAL": "Head — External",
  STOOL: "Stool & Rectum",
  "MALE ORGANS": "Male Genitalia",
  "FEMALE ORGANS": "Female Genitalia",
  EYES: "Eyes",
  EARS: "Ears",
  NOSE: "Nose",
  FACE: "Face",
  TEETH: "Teeth",
  MOUTH: "Mouth",
  THROAT: "Throat",
  APPETITE: "Appetite",
  THIRST: "Thirst",
  TASTE: "Taste",
  ERUCTATIONS: "Eructations",
  "NAUSEA AND VOMITING": "Nausea & Vomiting",
  STOMACH: "Stomach",
  ABDOMEN: "Abdomen",
  "STOOL AND RECTUM": "Stool & Rectum",
  "URINARY ORGANS": "Urinary Organs",
  "MALE GENITALIA": "Male Genitalia",
  "FEMALE GENITALIA": "Female Genitalia",
  RESPIRATION: "Respiration",
  COUGH: "Cough",
  LARYNX: "Larynx",
  CHEST: "Chest",
  BACK: "Back",
  "UPPER EXTREMITIES": "Upper Extremities",
  "LOWER EXTREMITIES": "Lower Extremities",
  "SENSATIONS AND COMPLAINTS IN GENERAL": "Sensations & Complaints in General",
  GLANDS: "Glands",
  BONES: "Bones",
  SKIN: "Skin",
  SLEEP: "Sleep",
  DREAMS: "Dreams",
  FEVER: "Fever",
  "CONDITIONS OF AGGRAVATION AND AMELIORATION": "Aggravation & Amelioration",
  "CONDITIONS IN GENERAL": "Conditions in General",
  "RELATIONS OF REMEDIES": "Relations of Remedies",
};

function remedyKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function plainText(chars: StyledChar[]): string {
  return chars.map((char) => char.value).join("").replace(/\s+/g, " ").trim();
}

function normalizeHeading(value: string): string {
  return value
    .replace(/^[*†"'“”‘’\s]+/, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/:$/, "")
    .trim();
}

function normalizeToken(value: string): string {
  return value
    .replace(/[“”‘’"'*†]/g, "")
    .replace(/\u00ad|¬/g, "")
    .replace(/^[\s([{]+|[\s)\]}]+$/g, "")
    .replace(/[;,:]+$/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function resolveRemedy(value: string): string | null {
  const token = normalizeToken(value);
  if (!token || token.length > 16 || !/[A-Za-z]/.test(token)) return null;
  if (/^(?:and|or|etc|compare|comp|see|also|with|without)$/i.test(token)) return null;
  const key = remedyKey(token);
  if (!key) return null;
  return sourceAliases[key] || canonicalRemedyByKey.get(key) || null;
}

function sourceGrade(chars: StyledChar[], rawToken: string): number {
  if (/^\s*\(/.test(rawToken) && /\)\s*$/.test(rawToken)) return 1;
  const letters = chars.filter((char) => /[A-Za-z]/.test(char.value));
  if (letters.length === 0) return 2;
  const text = letters.map((char) => char.value).join("");
  if (text.length > 1 && text === text.toUpperCase()) return 5;
  if (letters.filter((char) => char.bold).length / letters.length >= 0.6) return 4;
  if (letters.filter((char) => char.italic).length / letters.length >= 0.6) return 3;
  return 2;
}

function parseRemedies(chars: StyledChar[], unresolved: Map<string, number>): Record<string, number> {
  const remedies: Record<string, number> = {};
  let tokenChars: StyledChar[] = [];
  const flush = () => {
    const raw = tokenChars.map((char) => char.value).join("").trim();
    const styledToken = tokenChars;
    tokenChars = [];
    if (!raw) return;
    if (/^(?:compare|comp|see)\b/i.test(raw)) return;
    const remedy = resolveRemedy(raw);
    if (!remedy) {
      const cleaned = normalizeToken(raw);
      if (cleaned) unresolved.set(cleaned, (unresolved.get(cleaned) || 0) + 1);
      return;
    }
    remedies[remedy] = Math.max(remedies[remedy] || 0, sourceGrade(styledToken, raw));
  };
  for (const char of chars) {
    if (char.value === "," || char.value === ";") {
      flush();
    } else {
      tokenChars.push(char);
    }
  }
  flush();
  return remedies;
}

function rubricStart(line: SourceLine): { heading: string; remedyChars: StyledChar[] } | null {
  const text = plainText(line.chars);
  const colon = text.indexOf(":");
  if (colon < 2 || colon > 150) return null;
  const rawHeading = text.slice(0, colon + 1);
  const headingLength = rawHeading.length;
  const headingChars = line.chars.slice(0, headingLength);
  const letters = headingChars.filter((char) => /[A-Za-z]/.test(char.value));
  const boldRatio = letters.length ? letters.filter((char) => char.bold).length / letters.length : 0;
  if (boldRatio < 0.55) return null;
  const heading = normalizeHeading(rawHeading);
  if (
    heading.length < 2
    || !/[A-Za-z]{2}/.test(heading)
    || /^(?:compare|comp|see|page)$/i.test(heading)
  ) return null;
  const actualColonIndex = line.chars.findIndex((char, index) => index >= Math.max(0, colon - 4) && char.value === ":");
  return {
    heading,
    remedyChars: line.chars.slice(actualColonIndex >= 0 ? actualColonIndex + 1 : colon + 1),
  };
}

function detectChapter(line: SourceLine): string | null {
  const text = plainText(line.chars).replace(/[.·]+$/, "").replace(/\s+/g, " ").trim();
  if (!text || text.length > 70 || text.includes(":") || !/[A-Z]{3}/.test(text)) return null;
  const normalized = text.toUpperCase().replace(/[^A-Z ]/g, "").replace(/\s+/g, " ").trim();
  const printedPage = line.page - 13;
  if (normalized === "INTERNAL" && printedPage >= 224 && printedPage <= 249) return "Head — Internal";
  if (normalized === "EXTERNAL" && printedPage >= 250 && printedPage <= 255) return "Head — External";
  return chapterLabels[normalized] || null;
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
  let formatting = { bold: false, italic: false };
  let charValue = "";
  let charFormatting = formatting;
  const parser = new SaxesParser();
  parser.on("opentag", (tag) => {
    const name = tag.name.split(":").pop();
    if (name === "page") page += 1;
    if (page < repertoryFirstXmlPage || page > repertoryLastXmlPage) return;
    if (name === "line") {
      currentLine = {
        page,
        left: Number(tag.attributes.l || 0),
        chars: [],
      };
    } else if (name === "formatting") {
      formatting = {
        bold: tag.attributes.bold === "true",
        italic: tag.attributes.italic === "true",
      };
    } else if (name === "charParams") {
      charValue = "";
      charFormatting = {
        bold: tag.attributes.bold === "true" || formatting.bold,
        italic: tag.attributes.italic === "true" || formatting.italic,
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

function buildRubrics(lines: SourceLine[]): { rubrics: BrowserRubric[]; unresolved: Map<string, number> } {
  const rubrics: BrowserRubric[] = [];
  const unresolved = new Map<string, number>();
  let chapter = "Mind";
  let lastRootHeading = "";
  let current: { heading: string; page: number; remedyChars: StyledChar[] } | null = null;
  const finish = () => {
    if (!current) return;
    const remedies = parseRemedies(current.remedyChars, unresolved);
    if (Object.keys(remedies).length > 0) {
      const printedPage = current.page - 13;
      rubrics.push({
        id: `boger-${printedPage}-${slug(chapter)}-${slug(current.heading)}-${rubrics.length + 1}`,
        chapter,
        name: current.heading,
        remedies,
        source: "boger",
        scoringEnabled: true,
        scoringMode: "graded",
        citation: `C. M. Boger, Boenninghausen's Characteristics and Repertory (1905), p. ${printedPage}`,
        sourceUrl: `${sourceUrl}/page/n${current.page - 1}/mode/1up`,
      });
    }
    current = null;
  };

  for (const line of lines) {
    const text = plainText(line.chars);
    if (/^\d{1,3}$/.test(text) || /^(?:BOENNINGHAUSEN|BCENNINGHAUSEN|REPERTORY)\b/i.test(text)) continue;
    const detectedChapter = detectChapter(line);
    if (detectedChapter) {
      finish();
      chapter = detectedChapter;
      lastRootHeading = "";
      continue;
    }
    const start = rubricStart(line);
    if (start) {
      finish();
      const isChild = /^[a-z]/.test(start.heading);
      const heading = isChild && lastRootHeading ? `${lastRootHeading} — ${start.heading}` : start.heading;
      if (!isChild) lastRootHeading = start.heading;
      current = { heading, page: line.page, remedyChars: start.remedyChars };
      continue;
    }
    if (!current || /^(?:compare|comp\.|see)\b/i.test(text)) continue;
    current.remedyChars.push({ value: " ", bold: false, italic: false }, ...line.chars);
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
  if (rubrics.length < 8_000) throw new Error(`Quality gate failed: only ${rubrics.length} scored rubrics were recovered.`);
  if (occurrenceCount < 100_000) throw new Error(`Quality gate failed: only ${occurrenceCount} remedy occurrences were recovered.`);
  for (const grade of [2, 3, 4, 5]) {
    if (!gradeCounts[grade]) throw new Error(`Quality gate failed: printed grade ${grade} was not recovered.`);
  }
  const destination = outputArgument ? path.resolve(outputArgument) : outputPath;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify(rubrics)}\n`);
  const unresolvedTop = Array.from(unresolved.entries()).sort((left, right) => right[1] - left[1]).slice(0, 30);
  console.log(JSON.stringify({
    source: abbyyUrl,
    destination,
    rubrics: rubrics.length,
    chapters: new Set(rubrics.map((rubric) => rubric.chapter)).size,
    remedyOccurrences: occurrenceCount,
    gradeCounts,
    unresolvedTokenTypes: unresolved.size,
    unresolvedTop,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
