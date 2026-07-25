import fs from "node:fs";
import path from "node:path";

type ChapterConfig = {
  label: string;
  marker: string;
};

type VolumeConfig = {
  volume: number;
  identifier: string;
  localFile: string;
  chapters: ChapterConfig[];
};

type BrowserRubric = {
  id: string;
  chapter: string;
  name: string;
  remedies: Record<string, 1>;
  source: "gentry";
  scoringEnabled: true;
  scoringMode: "occurrence";
  occurrenceScoringEnabled: true;
  citation: string;
  sourceUrl: string;
};

const volumes: VolumeConfig[] = [
  {
    volume: 1,
    identifier: "concordancereper00gent",
    localFile: "concordancereper00gent_djvu.txt",
    chapters: [
      { label: "Mind and Disposition", marker: "THE MI^D AE^D DISPOSITION" },
      { label: "Head and Scalp", marker: "HEAD AI^D SCALP." },
      { label: "Eyes", marker: "THE EYES." },
      { label: "Ears", marker: "THE EAES." },
      { label: "Nose and Nostrils", marker: "THE l^OSE AI^D I^OSTEILS." },
      { label: "Face", marker: "THE FACE." },
    ],
  },
  {
    volume: 2,
    identifier: "concordancereper00gent2",
    localFile: "concordancereper00gent2_djvu.txt",
    chapters: [
      { label: "Mouth", marker: "THE MOUTH." },
      { label: "Throat", marker: "THE THEOAT." },
      { label: "Stomach", marker: "THE STOMACH." },
      { label: "Hypochondria", marker: "THE HYPOCHONDRIA." },
    ],
  },
  {
    volume: 3,
    identifier: "concordancereper00gent3",
    localFile: "concordancereper00gent3_djvu.txt",
    chapters: [
      { label: "Abdomen", marker: "THE ABDOMEJ^." },
      { label: "Anus, Rectum and Stool", marker: "AI^US, EEOTUM AND   STOOL." },
      { label: "Urine and Urinary Organs", marker: "UEII^E  AND  UEII^ARY  OEGAl^S." },
      { label: "Male Sexual Organs", marker: "THE  MALE  SEXUAL  OEGAl^S." },
    ],
  },
  {
    volume: 4,
    identifier: "concordancereper00gent4",
    localFile: "concordancereper00gent4_djvu.txt",
    chapters: [
      { label: "Uterus and Appendages", marker: "TJTEEUS AND APPEND AGES." },
      { label: "Menstruation and Discharges", marker: "MENSTRUATION AND DISCHARGES." },
      { label: "Pregnancy and Parturition", marker: "PREGNANCY AND PARTURITION." },
      { label: "Lactation and Mammary Glands", marker: "LACTATION AND MAMMARY GLANDS." },
    ],
  },
  {
    volume: 5,
    identifier: "concordancereper00gent5",
    localFile: "concordancereper00gent5_djvu.txt",
    chapters: [
      { label: "Voice, Larynx and Trachea", marker: "YOIOE, LARTE^X AE\"D TRACHEA." },
      { label: "Chest, Lungs, Bronchia and Cough", marker: "CHEST, LUI^GS, BEOI^OHIA AND COUGH." },
      { label: "Heart and Circulation", marker: "THE HEART AI^D CIEOULATIOK" },
      { label: "Chill and Fever", marker: "CHILL AND FEYER." },
      { label: "Skin", marker: "THE SKIN." },
      { label: "Sleep and Dreams", marker: "SLEEP AND DEEAMS." },
    ],
  },
  {
    volume: 6,
    identifier: "concordancereper00gent6",
    localFile: "concordancereper00gent6_djvu.txt",
    chapters: [
      { label: "Neck and Back", marker: "THE IS^EOK A^T> BACK" },
      { label: "Upper Extremities", marker: "THE    UPPEE    EXTEEMITIES." },
      { label: "Lower Extremities", marker: "THE  LOWEE  EXTEEMITIES." },
      { label: "Bones and Limbs in General", marker: "BOE\"ES KE'D LIMBS I:N GEI^EEAL." },
      { label: "Nerves", marker: "THE HEEYES." },
      { label: "Generalities and Key Notes", marker: "GEISTEEALITIES K^T> KEY EOTES-" },
    ],
  },
];

const sourceDirArgument = process.argv
  .find((argument) => argument.startsWith("--source-dir="))
  ?.slice("--source-dir=".length);
const outputArgument = process.argv
  .find((argument) => argument.startsWith("--output="))
  ?.slice("--output=".length);
const outputPath = outputArgument
  ? path.resolve(outputArgument)
  : path.join(process.cwd(), "public", "data", "gentryConcordanceRepertoryData.json");

function remedyKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
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
  sc: "Aesc",
  th: "Aeth",
  aeon: "Acon",
  acon: "Acon",
  camph: "Camph",
  camphor: "Camph",
  chin: "Chin",
  coff: "Coff",
  ferr: "Ferr",
  iod: "Iod",
  jod: "Iod",
  kaliiod: "Kali-i",
  kreos: "Kreos",
  kreas: "Kreos",
  lyc: "Lyc",
  lye: "Lyc",
  natrc: "Nat-c",
  natrm: "Nat-m",
  nitrac: "Nit-ac",
  nuxv: "Nux-v",
  phosac: "Ph-ac",
  puls: "Puls",
  puis: "Puls",
  rhust: "Rhus-t",
  sulph: "Sulph",
  tartem: "Ant-t",
  vera: "Verat",
};

function canonicalRemedy(value: string): string {
  const key = remedyKey(value);
  return aliases[key]
    || canonicalRemedyByKey.get(key)
    || value.replace(/\.+/g, "").replace(/\s+/g, "-");
}

function compactText(value: string): string {
  return value
    .replace(/\r/g, "")
    .replace(/-\s*\n\s*/g, "")
    .replace(/\n+/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function markerIndex(source: string, marker: string): number {
  const normalizedMarker = marker.replace(/\s+/g, " ").trim();
  const normalizedSource = source.replace(/[ \t]+/g, " ");
  const normalizedIndex = normalizedSource.indexOf(normalizedMarker);
  if (normalizedIndex < 0) return -1;
  let sourceIndex = 0;
  let compactIndex = 0;
  while (sourceIndex < source.length && compactIndex < normalizedIndex) {
    if (source[sourceIndex] === " " || source[sourceIndex] === "\t") {
      while (sourceIndex < source.length && (source[sourceIndex] === " " || source[sourceIndex] === "\t")) sourceIndex += 1;
      compactIndex += 1;
    } else {
      sourceIndex += 1;
      compactIndex += 1;
    }
  }
  return sourceIndex;
}

function extractAbbreviations(source: string, firstChapterIndex: number): Map<string, string> {
  const abbreviations = new Map<string, string>();
  const frontMatter = source.slice(0, firstChapterIndex);
  for (const rawLine of frontMatter.split(/\r?\n/)) {
    const match = rawLine.match(/^\s*([A-ZÆJE^][A-Za-zÆæJEj^]*(?:\s*-\s*[A-Za-z]+)?)\s*[.,]\s{2,}/);
    if (!match) continue;
    const sourceAbbreviation = match[1].replace(/\s*-\s*/g, "-").trim();
    const key = remedyKey(sourceAbbreviation);
    if (key.length >= 2 && key.length <= 24) {
      abbreviations.set(key, canonicalRemedy(sourceAbbreviation));
    }
  }
  for (const [key, value] of Object.entries(aliases)) abbreviations.set(key, value);
  for (const [key, value] of canonicalRemedyByKey) abbreviations.set(key, value);
  return abbreviations;
}

function parseRemedySuffix(
  rawParagraph: string,
  abbreviations: Map<string, string>,
): { name: string; remedies: Record<string, 1> } | null {
  const openingParentheses = (rawParagraph.match(/\(/g) || []).length;
  const closingParentheses = (rawParagraph.match(/\)/g) || []).length;
  if (openingParentheses !== closingParentheses) return null;
  const candidates = [...rawParagraph.matchAll(/[ \t]{2,}/g)].map((match) => match.index || 0);
  // DjVu text uses expanded word spacing throughout. The first suffix whose
  // every token is a known source abbreviation is the complete remedy list;
  // searching backward would silently retain only the final remedy.
  for (const boundary of candidates) {
    const rawSuffix = rawParagraph.slice(boundary);
    const normalizedSuffix = compactText(rawSuffix)
      .replace(/Cam\s+ph\./gi, "Camph.")
      .replace(/Can\s+-\s+in\s+d\./gi, "Cann-i.")
      .replace(/[()[\]]/g, " ")
      .replace(/[;:]/g, ",");
    const tokens = normalizedSuffix
      .split(/[,\s]+/)
      .map((token) => token.replace(/^[^A-Za-zÆJE^]+|[^A-Za-z0-9ÆæJEj^.-]+$/g, ""))
      .filter(Boolean);
    if (!tokens.length || tokens.length > 45) continue;
    const remedies: Record<string, 1> = {};
    let valid = true;
    for (const token of tokens) {
      const canonical = abbreviations.get(remedyKey(token));
      if (!canonical) {
        valid = false;
        break;
      }
      remedies[canonical] = 1;
    }
    if (!valid || !Object.keys(remedies).length) continue;
    const name = compactText(rawParagraph.slice(0, boundary))
      .replace(/^\d+\s+/, "")
      .replace(/^[A-Z]{3}\s+(?=[A-Z])/, "")
      .trim();
    if (name.length < 3 || name.length > 900) continue;
    return { name, remedies };
  }
  return null;
}

function isRunningHeader(value: string, chapter: string): boolean {
  const text = compactText(value);
  return /^\d+$/.test(text)
    || /^[A-Z]{3}\s+.+\s+\d{1,4}$/.test(text)
    || /^\d{1,4}\s+.+\s+[A-Z]{3}$/.test(text)
    || text === chapter
    || /^(?:CONCORDANCE REPERTORY|OF THE|MOST RELIABLE SYMPTOMS)/i.test(text);
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

async function readVolume(volume: VolumeConfig): Promise<string> {
  if (sourceDirArgument) {
    return fs.readFileSync(path.join(path.resolve(sourceDirArgument), volume.localFile), "utf8");
  }
  const url = `https://archive.org/download/${volume.identifier}/${volume.identifier}_djvu.txt`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Gentry volume ${volume.volume} returned HTTP ${response.status}.`);
  return response.text();
}

function buildVolume(source: string, volume: VolumeConfig): BrowserRubric[] {
  const chapterIndexes = volume.chapters.map((chapter) => {
    const index = markerIndex(source, chapter.marker);
    if (index < 0) throw new Error(`Could not find volume ${volume.volume} marker: ${chapter.marker}`);
    return index;
  });
  const abbreviations = extractAbbreviations(source, chapterIndexes[0]);
  const rubrics: BrowserRubric[] = [];
  for (let chapterOffset = 0; chapterOffset < volume.chapters.length; chapterOffset += 1) {
    const chapter = volume.chapters[chapterOffset];
    const start = chapterIndexes[chapterOffset] + chapter.marker.length;
    const end = chapterIndexes[chapterOffset + 1] || source.length;
    const chapterSource = source.slice(start, end);
    let ordinal = 0;
    let accumulator = "";
    for (const line of chapterSource.split(/\r?\n/)) {
      if (!line.trim() || isRunningHeader(line, chapter.label)) continue;
      if (accumulator && /^[A-Z][A-Za-z-]{2,}[. ]*\s*[—-]\s/.test(line.trim())) {
        accumulator = "";
      }
      accumulator = accumulator ? `${accumulator}\n${line}` : line;
      const parsed = parseRemedySuffix(accumulator, abbreviations);
      if (!parsed) {
        if (accumulator.length > 8_000) accumulator = "";
        continue;
      }
      ordinal += 1;
      rubrics.push({
        id: `gentry-v${volume.volume}-${slug(chapter.label)}-${ordinal}-${slug(parsed.name)}`,
        chapter: chapter.label,
        name: parsed.name,
        remedies: parsed.remedies,
        source: "gentry",
        scoringEnabled: true,
        scoringMode: "occurrence",
        occurrenceScoringEnabled: true,
        citation: `William D. Gentry, The Concordance Repertory of the More Characteristic Symptoms of the Materia Medica (1890; volume I corrected printing 1892), vol. ${volume.volume}, ${chapter.label}.`,
        sourceUrl: `https://archive.org/details/${volume.identifier}`,
      });
      accumulator = "";
    }
  }
  return rubrics;
}

async function main() {
  const allRubrics: BrowserRubric[] = [];
  for (const volume of volumes) {
    const source = await readVolume(volume);
    const rubrics = buildVolume(source, volume);
    allRubrics.push(...rubrics);
    process.stdout.write(`Volume ${volume.volume}: ${rubrics.length.toLocaleString()} rubrics\n`);
  }
  const chapters = new Set(allRubrics.map((rubric) => rubric.chapter));
  const remedyOccurrences = allRubrics.reduce(
    (total, rubric) => total + Object.keys(rubric.remedies).length,
    0,
  );
  if (chapters.size !== 30) throw new Error(`Expected 30 chapters; found ${chapters.size}.`);
  if (allRubrics.length < 150_000) throw new Error(`Quality gate failed: only ${allRubrics.length} rubrics.`);
  if (remedyOccurrences < 240_000) {
    throw new Error(`Quality gate failed: only ${remedyOccurrences} remedy occurrences.`);
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(allRubrics)}\n`);
  process.stdout.write(
    `Wrote ${allRubrics.length.toLocaleString()} rubrics, ${remedyOccurrences.toLocaleString()} remedy occurrences, and ${chapters.size} chapters to ${outputPath}\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
