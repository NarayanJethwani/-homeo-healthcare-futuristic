import fs from "node:fs";
import path from "node:path";
// jsdom ships without declarations in this workspace; the builder uses only its stable DOM surface.
// @ts-expect-error Missing optional @types/jsdom package.
import { JSDOM } from "jsdom";

type BrowserRubric = {
  id: string;
  chapter: string;
  name: string;
  remedies: Record<string, number>;
  source: "synoptic";
  scoringEnabled: true;
  scoringMode: "graded";
  citation: string;
  sourceUrl: string;
};

type ChapterSource = {
  filename: string;
  label: string;
};

const baseUrl = "http://homeoint.org/books2/bogersyn";
const sourceDirArgument = process.argv
  .find((argument) => argument.startsWith("--source-dir="))
  ?.slice("--source-dir=".length);
const outputArgument = process.argv
  .find((argument) => argument.startsWith("--output="))
  ?.slice("--output=".length);
const outputPath = outputArgument
  ? path.resolve(outputArgument)
  : path.join(process.cwd(), "public", "data", "bogerSynopticKeyRepertoryData.json");

const textDecoder = new TextDecoder("windows-1252");

function compactText(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function remedyKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function nameKey(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

async function readSource(filename: string): Promise<string> {
  if (sourceDirArgument) {
    return textDecoder.decode(
      fs.readFileSync(path.join(path.resolve(sourceDirArgument), filename)),
    );
  }
  const response = await fetch(`${baseUrl}/${filename}`);
  if (!response.ok) throw new Error(`${filename} returned HTTP ${response.status}.`);
  return textDecoder.decode(await response.arrayBuffer());
}

function parseChapters(indexHtml: string): ChapterSource[] {
  const document = new JSDOM(indexHtml).window.document;
  const chapters: ChapterSource[] = [];
  const seen = new Set<string>();
  let inAnalysis = false;
  for (const anchor of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
    const filename = (anchor.getAttribute("href") || "").split(/[?#]/)[0].toLowerCase();
    if (filename === "listremrep.htm") {
      inAnalysis = true;
      continue;
    }
    if (inAnalysis && filename === "listrem.htm") break;
    if (!inAnalysis || !/^[a-z0-9-]+\.htm$/.test(filename) || seen.has(filename)) continue;
    const label = compactText(anchor.textContent || "")
      .replace(/\s*\*\s*$/, "")
      .replace(/\s+/g, " ");
    if (!label) continue;
    seen.add(filename);
    chapters.push({
      filename,
      label: label
        .toLowerCase()
        .replace(/(^|[ (])([a-z])/g, (_match, prefix: string, letter: string) =>
          `${prefix}${letter.toUpperCase()}`),
    });
  }
  return chapters;
}

function parseSourceRemedies(remedyListHtml: string): Map<string, string> {
  const document = new JSDOM(remedyListHtml).window.document;
  const paragraphs = [...document.querySelectorAll("p")]
    .map((paragraph) => compactText(paragraph.textContent || ""))
    .filter(Boolean);
  const start = paragraphs.findIndex((value) => value === "Abbreviation");
  if (start < 0) throw new Error("Could not find the Synoptic Key abbreviation table.");
  const sourceNames = new Map<string, string>();
  for (let index = start + 2; index + 1 < paragraphs.length; index += 2) {
    const abbreviation = paragraphs[index].replace(/\.$/, "");
    const fullName = paragraphs[index + 1];
    if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(abbreviation) || fullName.length < 3) break;
    sourceNames.set(remedyKey(abbreviation), fullName);
  }
  return sourceNames;
}

function loadCanonicalRemedies(): {
  byName: Map<string, string>;
  byAbbreviation: Map<string, string>;
} {
  const byName = new Map<string, string>();
  const byAbbreviation = new Map<string, string>();
  const packPath = path.join(process.cwd(), "src", "lib", "remedyDataPack.json");
  const pack = JSON.parse(fs.readFileSync(packPath, "utf8")) as Array<{
    name?: string;
    abbr?: string;
  }>;
  for (const remedy of pack) {
    if (!remedy.abbr) continue;
    byAbbreviation.set(remedyKey(remedy.abbr), remedy.abbr);
    if (remedy.name) byName.set(nameKey(remedy.name), remedy.abbr);
  }
  for (const relativePath of [
    "public/data/kentRepertoryData.json",
    "public/data/boerickeRepertoryData.json",
    "public/data/bogerBoenninghausenRepertoryData.json",
    "public/data/knerrHeringRepertoryData.json",
  ]) {
    const fullPath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(fullPath)) continue;
    const rubrics = JSON.parse(fs.readFileSync(fullPath, "utf8")) as Array<{
      remedies?: Record<string, number>;
    }>;
    for (const rubric of rubrics) {
      for (const abbreviation of Object.keys(rubric.remedies || {})) {
        byAbbreviation.set(remedyKey(abbreviation), abbreviation);
      }
    }
  }
  return { byName, byAbbreviation };
}

const canonicalAliases: Record<string, string> = {
  agrap: "Agrap",
  aco: "Acon",
  alo: "Aloe",
  alu: "Alum",
  amb: "Ambra",
  amyn: "Aml-n",
  amyln: "Aml-n",
  anthx: "Anthr",
  ap: "Apis",
  arg: "Arg-m",
  aur: "Aur-m",
  barc: "Baryta-c",
  bro: "Brom",
  buf: "Bufo",
  burp: "Bursa-p",
  calcio: "Calc-i",
  calcc: "Calc",
  cam: "Camph",
  cancfl: "Canc-f",
  castr: "Castr",
  caus: "Caust",
  chlhy: "Chlor-h",
  chin: "Chna",
  cimi: "Cimic",
  coc: "Cocculus",
  cof: "Coff",
  col: "Coloc",
  cond: "Cond",
  cup: "Cupr",
  cyc: "Cycl",
  dict: "Dict",
  euph: "Euph",
  fer: "Ferr",
  gel: "Gels",
  glo: "Glon",
  gnap: "Gnaph",
  grap: "Graph",
  gym: "Gymn",
  hydac: "Hydr-ac",
  hyds: "Hydr",
  hyo: "Hyos",
  hypr: "Hyper",
  ip: "Ipec",
  jus: "Just",
  kalibro: "Kali-br",
  kaliio: "Kali-i",
  kre: "Kreos",
  latro: "Lat-m",
  magpaus: "Mag-p-a",
  med: "Med",
  men: "Meny",
  merc: "Merc",
  mos: "Mosch",
  mygl: "Mygal",
  naj: "Naja",
  oenan: "Oena",
  pho: "Phos",
  phoac: "Ph-ac",
  plb: "Plumb",
  pod: "Podoph",
  pul: "Puls",
  radmb: "Rad-br",
  rhe: "Rheum",
  rut: "Ruta",
  sabi: "Sabina",
  secc: "Sec",
  sele: "Sel",
  spo: "Spong",
  stan: "Stann",
  stap: "Staph",
  stro: "Stront-c",
  sul: "Sulph",
  thu: "Thuja",
  tarx: "Tarax",
  tril: "Trill",
  vera: "Verat",
  zin: "Zinc",
  zinar: "Zinc-ar",
};

function makeCanonicalSourceMap(sourceNames: Map<string, string>): Map<string, string> {
  const { byName, byAbbreviation } = loadCanonicalRemedies();
  const mapped = new Map<string, string>();
  for (const [sourceKey, fullName] of sourceNames) {
    mapped.set(
      sourceKey,
      canonicalAliases[sourceKey]
        || byName.get(nameKey(fullName))
        || byAbbreviation.get(sourceKey)
        || sourceKey,
    );
  }
  return mapped;
}

function gradeForTextNode(textNode: Text): number {
  let element = textNode.parentElement;
  let bold = false;
  let italic = false;
  let underlined = false;
  while (element && element.tagName !== "BODY") {
    const tag = element.tagName.toLowerCase();
    const color = (element.getAttribute("color") || "").toLowerCase();
    underlined ||= tag === "u";
    bold ||= tag === "b" || tag === "strong" || color === "#ff0000" || color === "red";
    italic ||= tag === "i" || tag === "em" || color === "#0000ff" || color === "blue";
    element = element.parentElement;
  }
  if (underlined) return 4;
  if (bold) return 3;
  if (italic) return 2;
  return 1;
}

function parseRemedies(
  paragraph: HTMLParagraphElement,
  sourceRemedies: Map<string, string>,
  window: { NodeFilter: { SHOW_TEXT: number } },
): Record<string, number> | null {
  const remedies: Record<string, number> = {};
  const walker = paragraph.ownerDocument.createTreeWalker(
    paragraph,
    window.NodeFilter.SHOW_TEXT,
  );
  let recognized = 0;
  let unrecognized = 0;
  while (walker.nextNode()) {
    const textNode = walker.currentNode as Text;
    const grade = gradeForTextNode(textNode);
    for (const match of textNode.data.matchAll(/[A-Za-z][A-Za-z0-9-]*\./g)) {
      const sourceKey = remedyKey(match[0]);
      const canonical = sourceRemedies.get(sourceKey);
      if (!canonical) {
        unrecognized += 1;
        continue;
      }
      recognized += 1;
      remedies[canonical] = Math.max(remedies[canonical] || 0, grade);
    }
  }
  if (!recognized || unrecognized > Math.max(2, recognized * 0.08)) return null;
  return remedies;
}

function buildChapter(
  html: string,
  chapter: ChapterSource,
  sourceRemedies: Map<string, string>,
): BrowserRubric[] {
  const dom = new JSDOM(html);
  const { document } = dom.window;
  const paragraphs = [...document.querySelectorAll<HTMLParagraphElement>("p")];
  const rubrics: BrowserRubric[] = [];
  let ordinal = 0;
  for (let index = 0; index < paragraphs.length; index += 1) {
    const name = compactText(paragraphs[index].textContent || "");
    if (!name.endsWith(":")) continue;
    let remedyParagraphIndex = index + 1;
    while (
      remedyParagraphIndex < paragraphs.length
      && !compactText(paragraphs[remedyParagraphIndex].textContent || "")
    ) {
      remedyParagraphIndex += 1;
    }
    const remedyParagraph = paragraphs[remedyParagraphIndex];
    if (!remedyParagraph) continue;
    const remedies = parseRemedies(
      remedyParagraph,
      sourceRemedies,
      dom.window,
    );
    if (!remedies) continue;
    const rubricName = name.replace(/\s*:\s*$/, "").trim();
    if (!rubricName || rubricName.length > 500) continue;
    ordinal += 1;
    rubrics.push({
      id: `synoptic-${slug(chapter.filename.replace(/\.htm$/, ""))}-${ordinal}-${slug(rubricName)}`,
      chapter: chapter.label,
      name: rubricName,
      remedies,
      source: "synoptic",
      scoringEnabled: true,
      scoringMode: "graded",
      citation: `C. M. Boger, A Synoptic Key of the Materia Medica, 2nd ed. (1916), Part I: Analysis, ${chapter.label}.`,
      sourceUrl: `${baseUrl}/${chapter.filename}`,
    });
    index = remedyParagraphIndex;
  }
  return rubrics;
}

async function main() {
  const [indexHtml, remedyListHtml] = await Promise.all([
    readSource("index.htm"),
    readSource("listremrep.htm"),
  ]);
  const chapters = parseChapters(indexHtml);
  if (chapters.length < 70) {
    throw new Error(`Quality gate failed: only ${chapters.length} analysis chapters.`);
  }
  const sourceNames = parseSourceRemedies(remedyListHtml);
  if (sourceNames.size < 350) {
    throw new Error(`Quality gate failed: only ${sourceNames.size} source remedies.`);
  }
  const sourceRemedies = makeCanonicalSourceMap(sourceNames);
  const allRubrics: BrowserRubric[] = [];
  for (const chapter of chapters) {
    const rubrics = buildChapter(await readSource(chapter.filename), chapter, sourceRemedies);
    allRubrics.push(...rubrics);
    process.stdout.write(`${chapter.label}: ${rubrics.length.toLocaleString()} rubrics\n`);
  }
  const remedyOccurrences = allRubrics.reduce(
    (total, rubric) => total + Object.keys(rubric.remedies).length,
    0,
  );
  const gradeCounts = allRubrics.reduce<Record<number, number>>((counts, rubric) => {
    for (const grade of Object.values(rubric.remedies)) counts[grade] = (counts[grade] || 0) + 1;
    return counts;
  }, {});
  if (allRubrics.length < 2_750) {
    throw new Error(`Quality gate failed: only ${allRubrics.length} rubrics.`);
  }
  if (remedyOccurrences < 20_000) {
    throw new Error(`Quality gate failed: only ${remedyOccurrences} remedy occurrences.`);
  }
  for (const grade of [1, 2, 3, 4]) {
    if (!gradeCounts[grade]) throw new Error(`Quality gate failed: grade ${grade} is absent.`);
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(allRubrics)}\n`);
  process.stdout.write(
    `Wrote ${allRubrics.length.toLocaleString()} rubrics, ${remedyOccurrences.toLocaleString()} remedy occurrences, ${chapters.length} chapters; grades ${JSON.stringify(gradeCounts)}.\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
