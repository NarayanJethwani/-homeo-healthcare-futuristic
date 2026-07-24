import fs from "node:fs";
import path from "node:path";
import { createGunzip } from "node:zlib";
import { Readable } from "node:stream";
import { SaxesParser } from "saxes";

type BrowserRubric = {
  id: string;
  chapter: string;
  name: string;
  remedies: Record<string, number>;
  source: "lippe";
  scoringEnabled: true;
  scoringMode: "graded";
  citation: string;
  sourceUrl: string;
};

type StyledChunk = {
  text: string;
  italic: boolean;
};

type SourceParagraph = {
  page: number;
  chunks: StyledChunk[];
};

const sourceUrl = "https://archive.org/details/101291818.nlm.nih.gov";
const abbyyUrl =
  "https://archive.org/download/101291818.nlm.nih.gov/101291818_abbyy.gz";
const sourceFileArgument = process.argv
  .find((argument) => argument.startsWith("--source-file="))
  ?.slice("--source-file=".length);
const outputArgument = process.argv
  .find((argument) => argument.startsWith("--output="))
  ?.slice("--output=".length);
const debugHeadings = process.argv.includes("--debug-headings");
const outputPath = outputArgument
  ? path.resolve(outputArgument)
  : path.join(
      process.cwd(),
      "public",
      "data",
      "lippeCharacteristicRepertoryData.json",
    );

const citation =
  "Constantine Lippe, Repertory to the More Characteristic Symptoms of the Materia Medica (1879)";

const chapters = [
  "1. Mind and Disposition",
  "2. Sensorium, Cloudiness, Dizziness and Vertigo",
  "3. Head Interior, Headache, Congestion, Heaviness and Fullness",
  "4. Scalp",
  "5. Eyes and Sight",
  "6. Ears and Hearing",
  "7. Nose and Smell",
  "8. Face, Lips and Lower Jaw",
  "9. Teeth and Gums",
  "10. Cavity of Mouth, Palate and Tongue",
  "11. Fauces, Pharynx and Oesophagus",
  "12. Appetite and Taste, Hunger and Thirst",
  "13. Ailments During and After Meals",
  "14. Eructation, Nausea, Vomiting, Hiccough, Heartburn and Waterbrash",
  "15. Stomach and Pit of Stomach",
  "16. Hypochondres, Kidneys, Diaphragm, Liver and Spleen",
  "17. Abdomen, Groin and Flatulency",
  "18. Stool and Anus",
  "19. Urine and Urinary Organs",
  "20. Male Sexual Organs",
  "21. Female Sexual Organs",
  "22. Coryza",
  "23. Larynx and Trachea",
  "24. Cough",
  "25. Respiration",
  "26. Internal Chest and Heart",
  "27. External Chest and Mammae",
  "28. Neck, Back and Sacrum",
  "29. Upper Extremities",
  "30. Lower Extremities",
  "31. Sleep and Dreams",
  "32. Fever",
  "33. Skin",
  "34. Generalities, Aggravations and Ameliorations",
] as const;

const chapterSignatures: Array<{ chapter: string; patterns: RegExp[] }> = [
  { chapter: chapters[0], patterns: [/\bmind\b.*\bdisposition\b/i, /\bmind\s+and\b/i] },
  { chapter: chapters[1], patterns: [/\bsensori(?:um|un)\b/i] },
  {
    chapter: chapters[2],
    patterns: [
      /\bhead\b.*\binterior\b/i,
      /\bheadache\b.*\bcongestion\b/i,
      /^\s*3\s*[-.]\s*head[.]?\s*$/i,
    ],
  },
  { chapter: chapters[3], patterns: [/^\s*(?:\d+[.,]?\s*)?scalp\b/i] },
  { chapter: chapters[4], patterns: [/\beyes?\b.*\bsight\b/i] },
  { chapter: chapters[5], patterns: [/\bears?\b.*\bhearing\b/i] },
  { chapter: chapters[6], patterns: [/\bnose\b.*\bsmell\b/i] },
  {
    chapter: chapters[7],
    patterns: [
      /\bface\b.*\blips?\b.*\b(?:jaw|lower)\b/i,
      /^\s*8[.]\s*face[.,]?\s*$/i,
    ],
  },
  { chapter: chapters[8], patterns: [/\bteeth\b.*\bgums?\b/i] },
  {
    chapter: chapters[9],
    patterns: [
      /\bcavity\b.*\bmouth\b.*\b(?:palate|tongue)\b/i,
      /^\s*(?:10|l[o0])[.]\s*(?:cavity\s+of\s+)?mouth,\s*palate\s+and\s+tongue[.]?\s*$/i,
    ],
  },
  { chapter: chapters[10], patterns: [/\bfauces\b.*\bpharynx\b/i, /\bpharynx\b.*\boesophagus\b/i] },
  { chapter: chapters[11], patterns: [/\bappetite\b.*\btaste\b/i, /\bhunger\b.*\bthirst\b/i] },
  { chapter: chapters[12], patterns: [/\b(?:ailments|complaints)\b.*\bduring\b.*\bmeals?\b/i] },
  { chapter: chapters[13], patterns: [/\beructation/i, /\bnausea\b.*\bvomiting\b/i] },
  {
    chapter: chapters[14],
    patterns: [
      /\bstomach\b.*\bpit\b/i,
      /^\s*15[.]\s*stomach[.]?\s*$/i,
    ],
  },
  { chapter: chapters[15], patterns: [/\bhypochond/i, /\bkidneys?\b.*\bdiaphragm\b/i] },
  { chapter: chapters[16], patterns: [/\babdomen\b.*\bgroin\b/i] },
  { chapter: chapters[17], patterns: [/\bstool\b.*\banus\b/i] },
  { chapter: chapters[18], patterns: [/\burine\b.*\burinary\b/i] },
  { chapter: chapters[19], patterns: [/\bmale\b.*\bsexual\b.*\borgan/i, /\bmale\s+skxual\b/i, /\bmalk\s+sexual\b/i] },
  { chapter: chapters[20], patterns: [/\bfemale\b.*\bsexual\b.*\borgan/i] },
  {
    chapter: chapters[21],
    patterns: [
      /^\s*(?:22|2\s+2)[.]\s*coryza[.]?\s*$/i,
      /^\s*coryza[.]?\s*$/i,
    ],
  },
  { chapter: chapters[22], patterns: [/\blarynx\b.*\btrachea\b/i] },
  { chapter: chapters[23], patterns: [/^\s*(?:\d+[.,]?\s*)?cough\b/i] },
  { chapter: chapters[24], patterns: [/^\s*(?:\d+[.,]?\s*)?respiration\b/i] },
  { chapter: chapters[25], patterns: [/\b(?:internal\s+)?ch(?:e|f|k)st\b.*\bheart\b/i] },
  { chapter: chapters[26], patterns: [/\b(?:external\s+)?(?:chest|mammae|nipples)\b.*\b(?:mammae|nipples)\b/i] },
  { chapter: chapters[27], patterns: [/\b(?:neck|nape)\b.*\bback\b.*\b(?:sacrum|sacral|region|rkgion)\b/i] },
  { chapter: chapters[28], patterns: [/\bupper\b.*\bextremities\b/i] },
  { chapter: chapters[29], patterns: [/\blower\b.*\bextr(?:e|k)mit/i] },
  { chapter: chapters[30], patterns: [/\bsl(?:e|k)ep\b.*\b(?:and|axd)\b.*\bdr(?:e|k)ams\b/i] },
  { chapter: chapters[31], patterns: [/^\s*(?:\d+[.,]?\s*)?fev(?:er|kr)\b/i] },
  { chapter: chapters[32], patterns: [/^\s*(?:\d+[.,]?\s*)?skin\b/i] },
  { chapter: chapters[33], patterns: [/\bg(?:e|k)neralit(?:ies|iks)\b/i] },
];

function detectChapter(value: string): string | null {
  const compactValue = compact(value);
  if (compactValue.length > 110) return null;
  const numberedHeading = /^(?:\d{1,2}|l[o0])\s*[-.]/i.test(compactValue);
  const letters = compactValue.match(/[A-Za-z]/g) || [];
  const uppercaseLetters = compactValue.match(/[A-Z]/g) || [];
  if (
    !letters.length ||
    (!numberedHeading && uppercaseLetters.length / letters.length < 0.65)
  ) {
    return null;
  }
  for (const signature of chapterSignatures) {
    if (signature.patterns.some((pattern) => pattern.test(compactValue))) {
      return signature.chapter;
    }
  }
  return null;
}

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
    .slice(0, 110);
}

function levenshtein(left: string, right: string): number {
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}

function loadCanonicalRemedies(): Map<string, string> {
  const canonical = new Map<string, string>();
  const packPath = path.join(process.cwd(), "src", "lib", "remedyDataPack.json");
  const pack = JSON.parse(fs.readFileSync(packPath, "utf8")) as Array<{
    abbr?: string;
  }>;
  for (const remedy of pack) {
    if (remedy.abbr) canonical.set(remedyKey(remedy.abbr), remedy.abbr);
  }
  for (const relativePath of [
    "public/data/kentRepertoryData.json",
    "public/data/boerickeRepertoryData.json",
    "public/data/bogerBoenninghausenRepertoryData.json",
    "public/data/knerrHeringRepertoryData.json",
    "public/data/gentryConcordanceRepertoryData.json",
    "public/data/bogerSynopticKeyRepertoryData.json",
    "public/data/jahrClinicalGuideRepertoryData.json",
  ]) {
    const fullPath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(fullPath)) continue;
    const rubrics = JSON.parse(fs.readFileSync(fullPath, "utf8")) as Array<{
      remedies?: Record<string, number>;
    }>;
    for (const rubric of rubrics) {
      for (const abbreviation of Object.keys(rubric.remedies || {})) {
        canonical.set(remedyKey(abbreviation), abbreviation);
      }
    }
  }
  return canonical;
}

const canonicalRemedyByKey = loadCanonicalRemedies();
const sourceAliases: Record<string, string> = {
  aeon: "Acon",
  acon: "Acon",
  aetli: "Aeth",
  aieth: "Aeth",
  am: "Arn",
  ambr: "Ambra",
  amm: "Am-c",
  ammc: "Am-c",
  anr: "Arn",
  ant: "Ant-c",
  arg: "Arg-m",
  arsn: "Ars",
  asaf: "Asaf",
  aur: "Aur-m",
  barc: "Baryta-c",
  barm: "Baryta-m",
  bell: "Bell",
  bry: "Bry",
  calc: "Calc",
  canth: "Canth",
  carban: "Carbo-an",
  carbveg: "Carbo-v",
  caust: "Caust",
  cham: "Cham",
  chin: "Chin",
  cocc: "Cocculus",
  coloc: "Coloc",
  cupr: "Cupr",
  dig: "Dig",
  dros: "Dros",
  dulc: "Dulc",
  ferr: "Ferr",
  graph: "Graph",
  hepar: "Hep",
  hep: "Hep",
  hydroph: "Hydroph",
  hyosc: "Hyos",
  igt: "Ign",
  ign: "Ign",
  ip: "Ipec",
  kali: "Kali-c",
  kalic: "Kali-c",
  kalijod: "Kali-i",
  lach: "Lach",
  laur: "Laur",
  led: "Led",
  lyc: "Lyc",
  lye: "Lyc",
  meic: "Merc",
  merc: "Merc",
  mere: "Merc",
  mgnc: "Mag-c",
  mgnm: "Mag-m",
  mgns: "Mag-s",
  mosch: "Mosch",
  murac: "Mur-ac",
  nicc: "Nicc",
  nitr: "Nit-s",
  nitrac: "Nit-ac",
  ntrc: "Nat-c",
  ntrm: "Nat-m",
  ntrs: "Nat-s",
  nux: "Nux-v",
  nuxm: "Nux-m",
  op: "Op",
  petr: "Petr",
  phosp: "Phos",
  phospac: "Ph-ac",
  plat: "Plat",
  plb: "Plumb",
  puis: "Puls",
  puls: "Puls",
  ranb: "Ran-b",
  ransc: "Ran-s",
  rhus: "Rhus-t",
  ruta: "Ruta",
  sabin: "Sabina",
  sass: "Sars",
  secc: "Sec",
  seneg: "Seneg",
  sep: "Sep",
  sil: "Sil",
  spig: "Spig",
  spong: "Spong",
  stann: "Stann",
  staph: "Staph",
  stram: "Stram",
  stront: "Stront",
  sulph: "Sulph",
  sulphac: "Sul-ac",
  tabac: "Tab",
  tart: "Ant-t",
  thuj: "Thuja",
  valer: "Valer",
  verat: "Verat",
  veiat: "Verat",
  zinc: "Zinc",
};
for (const [key, abbreviation] of Object.entries(sourceAliases)) {
  canonicalRemedyByKey.set(key, abbreviation);
}

const fuzzyCandidates = [...canonicalRemedyByKey.entries()]
  .filter(([key]) => key.length >= 4 && key.length <= 12);

function canonicalRemedy(value: string): string | null {
  const key = remedyKey(value);
  const exact = canonicalRemedyByKey.get(key);
  if (exact) return exact;
  if (key.length < 4 || key.length > 12) return null;
  const candidates = fuzzyCandidates.filter(
    ([candidate]) => Math.abs(candidate.length - key.length) <= 1,
  );
  let best: { abbreviation: string; distance: number } | null = null;
  let tied = false;
  for (const [candidate, abbreviation] of candidates) {
    const distance = levenshtein(key, candidate);
    if (distance > 1) continue;
    if (!best || distance < best.distance) {
      best = { abbreviation, distance };
      tied = false;
    } else if (distance === best.distance && abbreviation !== best.abbreviation) {
      tied = true;
    }
  }
  return best && !tied ? best.abbreviation : null;
}

function compact(value: string): string {
  return value
    .replace(/\u00ad/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function cleanLabel(value: string): string {
  return compact(value)
    .replace(/^[\s_•■▪·]+/, "")
    .replace(/\bDISPOStTION\b/gi, "Disposition")
    .replace(/\bE3'es\b/g, "Eyes")
    .replace(/\bpharj'nx\b/gi, "pharynx")
    .replace(/\bhurfger\b/gi, "hunger")
    .replace(/\bkidnej'S\b/gi, "kidneys")
    .replace(/\bsacrujn\b/gi, "sacrum")
    .replace(/\bmammoe\b/gi, "mammae")
    .replace(/\bftom\b/gi, "from")
    .replace(/\bmoihing\b/gi, "morning")
    .replace(/\bf<irenoon\b/gi, "forenoon")
    .replace(/\biiatred\b/gi, "hatred")
    .replace(/\bvexatiiin\b/gi, "vexation")
    .replace(/\bg[.]?iiety\b/gi, "gaiety")
    .replace(/\bcliilly\b/gi, "chilly")
    .replace(/\bcanniage\b/gi, "carriage")
    .replace(/\bmed nation\b/gi, "meditation")
    .replace(/\bhead che\b/gi, "headache")
    .replace(/\bpalptation\b/gi, "palpitation")
    .replace(/\bApithy\b/gi, "Apathy")
    .replace(/\bApprehensions\b/gi, "Apprehension")
    .replace(/\bCaielessness\b/gi, "Carelessness")
    .replace(/\bCen-?oriousness\b/gi, "Censoriousness")
    .replace(/[|^<>]/g, "")
    .replace(/\s+/g, " ")
    .replace(/^[,.;:\s-]+|[,.;:\s-]+$/g, "")
    .trim();
}

async function sourceStream(): Promise<NodeJS.ReadableStream> {
  if (sourceFileArgument) {
    const stream = fs.createReadStream(path.resolve(sourceFileArgument));
    return sourceFileArgument.endsWith(".gz") ? stream.pipe(createGunzip()) : stream;
  }
  const response = await fetch(abbyyUrl);
  if (!response.ok) throw new Error(`Lippe ABBYY source returned HTTP ${response.status}.`);
  if (!response.body) throw new Error("Lippe ABBYY source returned an empty body.");
  return Readable.fromWeb(response.body as never).pipe(createGunzip());
}

async function parseParagraphs(): Promise<SourceParagraph[]> {
  const paragraphs: SourceParagraph[] = [];
  let page = 0;
  let inParagraph = false;
  let inFormatting = false;
  let inChar = false;
  let italic = false;
  let charText = "";
  let chunks: StyledChunk[] = [];

  const parser = new SaxesParser({ xmlns: false });
  parser.on("opentag", (node) => {
    const name = node.name.toLowerCase();
    if (name === "page") page += 1;
    if (name === "par") {
      inParagraph = true;
      chunks = [];
    } else if (inParagraph && name === "formatting") {
      inFormatting = true;
      italic = String(node.attributes.italic || "").toLowerCase() === "true";
    } else if (inParagraph && name === "charparams") {
      inChar = true;
      charText = "";
    }
  });
  parser.on("text", (text) => {
    if (inChar) charText += text;
  });
  parser.on("closetag", (tag) => {
    const name = tag.name.toLowerCase();
    if (name === "charparams" && inChar) {
      if (charText) {
        const previous = chunks[chunks.length - 1];
        if (previous?.italic === italic) previous.text += charText;
        else chunks.push({ text: charText, italic });
      }
      inChar = false;
      charText = "";
    } else if (name === "formatting") {
      inFormatting = false;
      italic = false;
    } else if (name === "par" && inParagraph) {
      if (compact(chunks.map((chunk) => chunk.text).join(""))) {
        paragraphs.push({ page, chunks });
      }
      inParagraph = false;
      inFormatting = false;
      italic = false;
      chunks = [];
    }
  });

  const stream = await sourceStream();
  for await (const chunk of stream) parser.write(chunk.toString());
  parser.close();
  return paragraphs;
}

function styledText(paragraph: SourceParagraph): {
  text: string;
  italicOffsets: Set<number>;
} {
  let raw = "";
  const italicRawOffsets = new Set<number>();
  for (const chunk of paragraph.chunks) {
    for (const character of chunk.text) {
      if (chunk.italic) italicRawOffsets.add(raw.length);
      raw += character;
    }
  }
  const text = compact(raw);
  const italicOffsets = new Set<number>();
  let compactIndex = 0;
  let previousWasSpace = false;
  for (let rawIndex = 0; rawIndex < raw.length; rawIndex += 1) {
    const character = raw[rawIndex];
    if (/\s/.test(character)) {
      if (previousWasSpace || compactIndex === 0) continue;
      previousWasSpace = true;
      compactIndex += 1;
      continue;
    }
    previousWasSpace = false;
    if (italicRawOffsets.has(rawIndex)) italicOffsets.add(compactIndex);
    compactIndex += 1;
  }
  return { text, italicOffsets };
}

function leadingDepth(value: string): number {
  const match = value.match(/^(?:\s*[—–_•■▪-]\s*)+/);
  if (!match) return 0;
  return Math.min(5, (match[0].match(/[—–_•■▪-]/g) || []).length);
}

function stripLeadingDashes(value: string): string {
  return value.replace(/^(?:\s*[—–_•■▪-]\s*)+/, "");
}

function remedyMatches(
  text: string,
  italicOffsets: Set<number>,
): Array<{ index: number; abbreviation: string; grade: number }> {
  const matches: Array<{ index: number; abbreviation: string; grade: number }> = [];
  for (const match of text.matchAll(/\b([A-Za-z][A-Za-z0-9-]{1,18})\s*[.]?/g)) {
    const token = match[1];
    const index = match.index || 0;
    const after = text.slice(index + match[0].length, index + match[0].length + 1);
    const hasPeriod = match[0].includes(".");
    if (!hasPeriod && after !== "." && !Object.hasOwn(sourceAliases, remedyKey(token))) continue;
    const abbreviation = canonicalRemedy(token);
    if (!abbreviation) continue;
    const grade = [...Array.from({ length: token.length }, (_, offset) => index + offset)]
      .some((offset) => italicOffsets.has(offset))
      ? 2
      : 1;
    matches.push({ index, abbreviation, grade });
  }
  return matches;
}

async function main(): Promise<void> {
  const paragraphs = await parseParagraphs();
  const rubricsByKey = new Map<string, BrowserRubric>();
  const parentLabels: string[] = [];
  let chapter = "";
  let started = false;

  for (const paragraph of paragraphs) {
    const { text, italicOffsets } = styledText(paragraph);
    if (
      debugHeadings &&
      text.length < 120 &&
      /(HEAD|FACE|CAVITY|STOMACH|CORYZA)/i.test(text)
    ) {
      const letters = text.match(/[A-Za-z]/g) || [];
      const uppercaseLetters = text.match(/[A-Z]/g) || [];
      if (
        /(?:CAVITY|MOUTH|PALATE|TONGUE)/i.test(text) ||
        (letters.length && uppercaseLetters.length / letters.length >= 0.5)
      ) {
        console.log(`HEADING CANDIDATE p${paragraph.page}: ${text}`);
      }
    }
    const detectedChapter = detectChapter(text);
    if (detectedChapter) {
      chapter = detectedChapter;
      parentLabels.length = 0;
      started = true;
      continue;
    }
    if (!started || !chapter) continue;
    if (
      text.length < 4 ||
      /^(?:REPERTORY|CONTENTS|PREFACE|SECT[.]?\s*PAGE|\d{1,3})[.]?$/i.test(text) ||
      /^\d{1,2}[.]?\s+[A-Z][A-Z ,/&'-]{3,}[.]?$/.test(text)
    ) {
      continue;
    }

    const matches = remedyMatches(text, italicOffsets);
    if (!matches.length) continue;
    const firstRemedy = matches[0];
    const prefix = text.slice(0, firstRemedy.index).replace(/[,;:\s]+$/g, "");
    const depth = leadingDepth(prefix);
    const label = cleanLabel(stripLeadingDashes(prefix));
    if (
      label.length < 2 ||
      label.length > 180 ||
      !/[A-Za-z]/.test(label) ||
      /^(?:and|or|with|also)$/i.test(label)
    ) {
      continue;
    }

    if (depth === 0) {
      parentLabels.length = 0;
      parentLabels[0] = label;
    } else {
      parentLabels.length = Math.min(parentLabels.length, depth);
      parentLabels[depth] = label;
    }
    const hierarchy = parentLabels
      .slice(0, depth + 1)
      .filter(Boolean)
      .map(cleanLabel);
    const name = hierarchy.length ? hierarchy.join(" — ") : label;
    if (!name || name.length > 260) continue;

    const remedies: Record<string, number> = {};
    for (const match of matches) {
      remedies[match.abbreviation] = Math.max(
        remedies[match.abbreviation] || 0,
        match.grade,
      );
    }
    if (!Object.keys(remedies).length) continue;

    const key = `${chapter}\u0000${name.toLowerCase()}`;
    const existing = rubricsByKey.get(key);
    if (existing) {
      for (const [abbreviation, grade] of Object.entries(remedies)) {
        existing.remedies[abbreviation] = Math.max(
          existing.remedies[abbreviation] || 0,
          grade,
        );
      }
      continue;
    }
    rubricsByKey.set(key, {
      id: `lippe-${slug(chapter)}-${slug(name)}`,
      chapter,
      name,
      remedies,
      source: "lippe",
      scoringEnabled: true,
      scoringMode: "graded",
      citation,
      sourceUrl,
    });
  }

  const duplicateIds = new Map<string, number>();
  const rubrics = [...rubricsByKey.values()]
    .sort(
      (left, right) =>
        Number.parseInt(left.chapter, 10) - Number.parseInt(right.chapter, 10) ||
        left.name.localeCompare(right.name),
    )
    .map((rubric) => {
      const count = duplicateIds.get(rubric.id) || 0;
      duplicateIds.set(rubric.id, count + 1);
      return count ? { ...rubric, id: `${rubric.id}-${count + 1}` } : rubric;
    });
  const relationships = rubrics.reduce(
    (total, rubric) => total + Object.keys(rubric.remedies).length,
    0,
  );
  const grades = new Set(
    rubrics.flatMap((rubric) => Object.values(rubric.remedies)),
  );
  if (rubrics.length < 4_000 || relationships < 35_000) {
    throw new Error(
      `Lippe corpus is unexpectedly small (${rubrics.length} rubrics, ${relationships} relationships).`,
    );
  }
  if (!grades.has(1) || !grades.has(2)) {
    throw new Error(`Lippe typography grades were not recovered: ${[...grades].join(", ")}.`);
  }
  const chapterCount = new Set(rubrics.map((rubric) => rubric.chapter)).size;
  if (chapterCount !== chapters.length) {
    const recovered = new Set(rubrics.map((rubric) => rubric.chapter));
    const missing = chapters.filter((chapterName) => !recovered.has(chapterName));
    throw new Error(
      `Expected ${chapters.length} Lippe chapters, recovered ${chapterCount}; missing ${missing.join("; ")}.`,
    );
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(rubrics)}\n`);
  console.log(
    `Wrote ${rubrics.length.toLocaleString()} Lippe rubrics and ${relationships.toLocaleString()} remedy relationships to ${outputPath}.`,
  );
}

void main();
