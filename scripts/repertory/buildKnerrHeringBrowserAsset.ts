import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { SaxesParser } from "saxes";

type SourceLine = { page: number; text: string };
type BrowserRubric = {
  id: string;
  chapter: string;
  name: string;
  remedies: Record<string, number>;
  source: "knerr";
  scoringEnabled: true;
  scoringMode: "graded";
  citation: string;
  sourceUrl: string;
};

const archiveIdentifier = "repertoryofherin00heri";
const abbyyUrl = `https://archive.org/download/${archiveIdentifier}/${archiveIdentifier}_abbyy.gz`;
const sourceArgument = process.argv.find((argument) => argument.startsWith("--source="))?.slice(9);
const outputArgument = process.argv.find((argument) => argument.startsWith("--output="))?.slice(9);
const outputPath = path.join(process.cwd(), "public", "data", "knerrHeringRepertoryData.json");
const firstXmlPage = 12;
const lastXmlPage = 1233;

const canonicalRemedyByKey = new Map<string, string>();
for (const relativePath of [
  "src/lib/remedyDataPack.json",
  "public/data/kentRepertoryData.json",
  "public/data/boerickeRepertoryData.json",
  "public/data/bogerBoenninghausenRepertoryData.json",
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

const explicitAliases: Record<string, string> = {
  aeon: "Acon",
  acon: "Acon",
  arm: "Arn",
  brv: "Bry",
  cepa: "All-c",
  chin: "Chna",
  coccul: "Cocculus",
  cupm: "Cupr",
  cypr: "Cupr",
  hyos: "Hyos",
  hyo: "Hyos",
  natm: "Nat-m",
  nuxv: "Nux-v",
  phosac: "Ph-ac",
  rhust: "Rhus-t",
  barc: "Baryta-c",
  aco: "Acon",
  argmet: "Arg-m",
  aurmet: "Aur-m",
  sul: "Sulph",
};

function remedyKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function cleanText(value: string): string {
  return value
    .replace(/\u00ad|¬/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .trim();
}

function cleanHeading(value: string): string {
  const cleaned = cleanText(value)
    .replace(/^[*†"'“”‘’•\s]+/, "")
    .replace(/:$/, "")
    .trim();
  return cleaned
    .split(/\s+/)
    .map((word, index) => index === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase())
    .join(" ");
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function escapePattern(value: string): string {
  return value
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\\\./g, "\\.?")
    .replace(/\s+/g, "\\s+");
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
  let inLine = false;
  let inChar = false;
  let charValue = "";
  let lineValue = "";
  const parser = new SaxesParser();
  parser.on("opentag", (tag) => {
    const name = tag.name.split(":").pop();
    if (name === "page") page += 1;
    if (page < firstXmlPage || page > lastXmlPage) return;
    if (name === "line") {
      inLine = true;
      lineValue = "";
    } else if (name === "charParams") {
      inChar = true;
      charValue = "";
    }
  });
  parser.on("text", (value) => {
    if (inChar) charValue += value;
  });
  parser.on("closetag", (tag) => {
    const name = tag.name.split(":").pop();
    if (page < firstXmlPage || page > lastXmlPage) return;
    if (name === "charParams") {
      lineValue += charValue;
      inChar = false;
    } else if (name === "line") {
      const text = cleanText(lineValue);
      if (text) lines.push({ page, text });
      inLine = false;
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

function extractSourceAbbreviations(lines: SourceLine[]): string[] {
  const abbreviations = new Set<string>();
  for (const { page, text } of lines) {
    if (page < 12 || page > 16) continue;
    const match = text.match(/^[^A-Za-z]*([A-Z][A-Za-z. ]{0,22}?),\s+[A-Z][A-Za-z]/);
    if (!match) continue;
    const abbreviation = cleanText(match[1]).replace(/^[^A-Za-z]+/, "").replace(/\s+/g, " ");
    if (abbreviation.length >= 2 && abbreviation.length <= 22) abbreviations.add(abbreviation);
  }
  // Frequent first-edition OCR substitutions and abbreviations missed in the remedy list.
  for (const abbreviation of ["Acon", "Arn", "Bry", "Chin", "Nux v", "Rhus t", "Sulph", "Puls"]) {
    abbreviations.add(abbreviation);
  }
  return [...abbreviations];
}

function canonicalRemedy(abbreviation: string): string {
  const key = remedyKey(abbreviation);
  return explicitAliases[key] || canonicalRemedyByKey.get(key) || abbreviation
    .replace(/\s+/g, "-")
    .replace(/\.+/g, "")
    .replace(/-+$/g, "");
}

function makeRemedyParser(abbreviations: string[]) {
  const ordered = [...abbreviations].sort((a, b) => b.length - a.length);
  const aliases = new Map(ordered.map((alias) => [remedyKey(alias), canonicalRemedy(alias)]));
  const alternatives = ordered.map(escapePattern).join("|");
  // ABBYY retains thin rules as I/l/1 and heavy rules as blocks. Two heavy
  // rules are also commonly fused into H/M/B/U glyphs in this scan.
  const pattern = new RegExp(
    `(^|[\\s,;:(])([■█]{1,2}\\s*[Il1|]?|[HMBU](?=[A-Z])|[Il1|](?:\\s*[Il1|])?\\s*)?(${alternatives})(?=$|[\\s,;.)])`,
    "g",
  );
  return (text: string): Record<string, number> => {
    const remedies: Record<string, number> = {};
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      const mark = (match[2] || "").replace(/\s+/g, "");
      const sourceAbbreviation = match[3];
      const remedy = aliases.get(remedyKey(sourceAbbreviation));
      if (!remedy) continue;
      let grade = 1;
      if (/^[HMBU]$/.test(mark) || /[■█].*[■█Il1|]|[■█]{2}/.test(mark)) grade = 5;
      else if (/[■█]/.test(mark)) grade = 4;
      else if ((mark.match(/[Il1|]/g) || []).length >= 2) grade = 3;
      else if (/[Il1|]/.test(mark)) grade = 2;
      remedies[remedy] = Math.max(remedies[remedy] || 0, grade);
    }
    return remedies;
  };
}

function detectChapter(text: string): { number: number; label: string } | null {
  const match = text.match(/^(\d{1,2})\.\s+([A-Z][A-Z .'&,\-]+)$/);
  if (!match) return null;
  const chapterNumber = Number(match[1]);
  if (chapterNumber < 1 || chapterNumber > 48) return null;
  return {
    number: chapterNumber,
    label: cleanHeading(match[2]).replace(/[.,]+$/, ""),
  };
}

function rubricStart(text: string): { heading: string; remainder: string } | null {
  const colon = text.indexOf(":");
  if (colon < 2 || colon > 190) return null;
  const heading = cleanHeading(text.slice(0, colon));
  if (heading.length < 2 || heading.length > 170 || !/^[A-Z]/.test(heading)) return null;
  if (/^(?:see|compare|note|page|remedies|list of remedies)$/i.test(heading)) return null;
  return { heading, remainder: text.slice(colon + 1) };
}

function buildRubrics(lines: SourceLine[], abbreviations: string[]): BrowserRubric[] {
  const rubrics: BrowserRubric[] = [];
  const parseRemedies = makeRemedyParser(abbreviations);
  const chapterCandidates = new Map<number, Map<string, number>>();
  for (const line of lines) {
    const detected = detectChapter(line.text);
    if (!detected) continue;
    const labels = chapterCandidates.get(detected.number) || new Map<string, number>();
    labels.set(detected.label, (labels.get(detected.label) || 0) + 1);
    chapterCandidates.set(detected.number, labels);
  }
  const canonicalChapters = new Map<number, string>();
  for (const [number, labels] of chapterCandidates) {
    const preferred = [...labels.entries()].sort((left, right) => {
      const frequency = right[1] - left[1];
      if (frequency) return frequency;
      const leftPenalty = /(?:kesp|sck|ukin|nausfa)/i.test(left[0]) ? 1 : 0;
      const rightPenalty = /(?:kesp|sck|ukin|nausfa)/i.test(right[0]) ? 1 : 0;
      return leftPenalty - rightPenalty;
    })[0]?.[0];
    if (preferred) canonicalChapters.set(number, preferred);
  }
  let chapter = "";
  let current: { heading: string; page: number; text: string } | null = null;
  const finish = () => {
    if (!current || !chapter) {
      current = null;
      return;
    }
    const remedies = parseRemedies(current.text);
    if (Object.keys(remedies).length) {
      const printedPage = current.page + 1;
      rubrics.push({
        id: `knerr-${printedPage}-${slug(chapter)}-${slug(current.heading)}-${rubrics.length + 1}`,
        chapter,
        name: current.heading,
        remedies,
        source: "knerr",
        scoringEnabled: true,
        scoringMode: "graded",
        citation: `C. B. Knerr, A Repertory of Hering's Guiding Symptoms (1896), p. ${printedPage}`,
        sourceUrl: `https://archive.org/details/${archiveIdentifier}/page/n${current.page - 1}/mode/1up`,
      });
    }
    current = null;
  };
  for (const line of lines) {
    if (line.page < 16) continue;
    const detectedChapter = detectChapter(line.text);
    if (detectedChapter) {
      finish();
      chapter = canonicalChapters.get(detectedChapter.number) || detectedChapter.label;
      continue;
    }
    if (!chapter || /^\(?\d{1,4}\)?$/.test(line.text) || /^(?:REPERTORY OF HERING|GUIDING SYMPTOMS)\b/i.test(line.text)) continue;
    const start = rubricStart(line.text);
    if (start) {
      finish();
      current = { heading: start.heading, page: line.page, text: start.remainder };
    } else if (current) {
      current.text += ` ${line.text}`;
    }
  }
  finish();
  return rubrics;
}

async function main() {
  const lines = await parseLines(await readSource());
  const abbreviations = extractSourceAbbreviations(lines);
  if (abbreviations.length < 300) throw new Error(`Quality gate failed: only ${abbreviations.length} remedy abbreviations recovered.`);
  const rubrics = buildRubrics(lines, abbreviations);
  const chapters = new Set(rubrics.map((rubric) => rubric.chapter));
  const occurrenceCount = rubrics.reduce((sum, rubric) => sum + Object.keys(rubric.remedies).length, 0);
  const gradeCounts = rubrics.reduce<Record<number, number>>((counts, rubric) => {
    for (const grade of Object.values(rubric.remedies)) counts[grade] = (counts[grade] || 0) + 1;
    return counts;
  }, {});
  if (chapters.size < 45) {
    throw new Error(`Quality gate failed: only ${chapters.size} chapters recovered (${[...chapters].join(" | ")}).`);
  }
  if (rubrics.length < 10_000) throw new Error(`Quality gate failed: only ${rubrics.length} scored rubrics recovered.`);
  if (occurrenceCount < 100_000) throw new Error(`Quality gate failed: only ${occurrenceCount} remedy occurrences recovered.`);
  for (const grade of [1, 2, 3, 4, 5]) {
    if (!gradeCounts[grade]) throw new Error(`Quality gate failed: printed grade ${grade} was not recovered.`);
  }
  const destination = outputArgument ? path.resolve(outputArgument) : outputPath;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify(rubrics)}\n`);
  console.log(JSON.stringify({
    source: abbyyUrl,
    destination,
    remedyAbbreviations: abbreviations.length,
    rubrics: rubrics.length,
    chapters: chapters.size,
    remedyOccurrences: occurrenceCount,
    gradeCounts,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
