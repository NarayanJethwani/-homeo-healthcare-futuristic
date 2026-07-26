import fs from "node:fs";
import path from "node:path";

type BrowserRubric = {
  id: string;
  chapter: string;
  name: string;
  remedies: Record<string, number>;
  source: "hering-specialized";
  scoringEnabled: true;
  scoringMode: "occurrence";
  occurrenceScoringEnabled: true;
  citation: string;
  sourceUrl: string;
};

type RemedyReference = {
  abbr: string;
  name: string;
  words: string[];
};

const sourceUrl =
  "https://archive.org/details/repertorytoheri00herigoog";
const textUrl =
  "https://archive.org/download/repertorytoheri00herigoog/repertorytoheri00herigoog_djvu.txt";
const sourceFileArgument = process.argv
  .find((argument) => argument.startsWith("--source-file="))
  ?.slice("--source-file=".length);
const outputArgument = process.argv
  .find((argument) => argument.startsWith("--output="))
  ?.slice("--output=".length);
const debugUnresolved = process.argv.includes("--debug-unresolved");
const outputPath = outputArgument
  ? path.resolve(outputArgument)
  : path.join(
      process.cwd(),
      "public",
      "data",
      "heringSpecializedRepertoriesData.json",
    );

const citation =
  "Homœopathic Medical Society of Pennsylvania, Repertory to Hering's Condensed Materia Medica (1889)";

const sections = [
  {
    chapter: "Lower Extremities — John L. Ferson",
    marker: "REPERTORY OF SYMPTOMS OF THE LOWER \n\nEXTREMITIES.",
  },
  {
    chapter: "Male Sexual Organs — Chandler Weaver",
    marker: "REPERTORY OF MALE SEXUAL ORGANS.— FROM",
  },
  {
    chapter: "Appetite, Thirst, Desires and Aversions — Edward Cranch",
    marker: "REPERTORY TO APPETITE, THIRST, DESIRES,",
  },
  {
    chapter: "Outer Chest — S. F. Shannon",
    marker: "REPERTORY OF OUTER CHEST.",
  },
  {
    chapter: "Stomach Symptoms — A. P. Bowie",
    marker: "REPERTORY OF STOMACH SYMPTOMS.",
  },
  {
    chapter: "Mental Aggravations and Symptoms — Z. T. Miller",
    marker: "REPERTORY OF AGGRAVATIONS WITH REFER-",
  },
  {
    chapter: "Tongue Symptoms — Eduardo Fornias",
    marker: "REPERTORY OF SYMPTOMS OF THE TONGUE.",
  },
  {
    chapter: "Pregnancy — Theodore J. Gramm",
    marker: "REPERTORY OF SYMPTOMS OCCURRING DURING",
  },
  {
    chapter: "Heart Symptoms — E. R. Snader",
    marker: "REPERTORY OF THE HEART SYMPTOMS FOUND",
  },
] as const;

function key(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(?:acidum|acid)\b/g, "ac")
    .replace(/[^a-z0-9]/g, "");
}

function words(value: string): string[] {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/æ/g, "ae")
    .match(/[a-z]+/g) || [];
}

function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 105);
}

const packPath = path.join(process.cwd(), "src", "lib", "remedyDataPack.json");
const remedyPack = JSON.parse(fs.readFileSync(packPath, "utf8")) as Array<{
  abbr?: string;
  name?: string;
}>;
const references: RemedyReference[] = remedyPack
  .filter(
    (remedy): remedy is { abbr: string; name: string } =>
      Boolean(remedy.abbr && remedy.name),
  )
  .map((remedy) => ({
    abbr: remedy.abbr,
    name: remedy.name,
    words: words(remedy.name),
  }));

const directAliases: Record<string, string> = {
  aconite: "Acon",
  aconitum: "Acon",
  abiescan: "Abies-c",
  abiesnigr: "Abies-n",
  aceticumac: "Acet-ac",
  acetac: "Acet-ac",
  actaearac: "Act-r",
  aethusa: "Aeth",
  amanita: "Agar",
  alumen: "Alum",
  anantherum: "Anan",
  angustura: "Ang",
  antimonium: "Ant-c",
  armoracea: "Coch",
  argentumm: "Arg-m",
  arsenicumalb: "Ars",
  arsenicummet: "Ars",
  ammoncarb: "Am-c",
  ammonmur: "Am-m",
  antimoncrud: "Ant-c",
  antimontart: "Ant-t",
  apocynumcannab: "Apoc",
  argentmet: "Arg-m",
  argentnitr: "Arg-n",
  arsenicalb: "Ars",
  arsenicum: "Ars",
  arsenicumhydr: "Ars-h",
  asafoetida: "Asaf",
  asafcetida: "Asaf",
  asarum: "Asar",
  apis: "Apis",
  aurum: "Aur",
  barytacarb: "Bar-c",
  baryta: "Bar-c",
  belladonna: "Bell",
  benzoicumac: "Benz-ac",
  bismuthum: "Bism",
  brachyglottis: "Brach",
  cadmiumsulph: "Cadm-s",
  calcareaost: "Calc",
  calcareacarb: "Calc",
  calcareaphos: "Calc-p",
  calcarea: "Calc",
  cantharides: "Canth",
  capsicum: "Caps",
  carduus: "Card-m",
  castoreum: "Cast",
  castorequo: "Cast-eq",
  cepa: "All-c",
  cicuta: "Cic",
  cimex: "Cimx",
  clematis: "Clem",
  condurango: "Cund",
  cornus: "Corn",
  crotalus: "Crot-h",
  cuprum: "Cupr",
  cuprumm: "Cupr",
  cannabisind: "Cann-i",
  cannabissat: "Cann-s",
  carbolicumac: "Carb-ac",
  carboan: "Carbo-an",
  carboveg: "Carbo-v",
  chinchonaoff: "Chin",
  cinchonaoff: "Chin",
  chininumsulph: "Chin-s",
  eupatoriumperf: "Eup-per",
  eupatoriumpurp: "Eup-pur",
  euphorbia: "Euph",
  ethusa: "Aeth",
  ferrum: "Ferr",
  fluoricumac: "Fl-ac",
  gambogia: "Gamb",
  gelsemium: "Gels",
  heparsc: "Hep",
  hepar: "Hep",
  helleborus: "Hell",
  jacea: "Jace",
  jodum: "Iod",
  iodum: "Iod",
  kalibich: "Kali-bi",
  kalicarb: "Kali-c",
  kaliiod: "Kali-i",
  kreosotum: "Kreos",
  kobaltum: "Cob",
  lachesis: "Lach",
  lilium: "Lil-t",
  liliumtig: "Lil-t",
  lithium: "Lith-c",
  lobelia: "Lob",
  lycopodium: "Lyc",
  magnesiacarb: "Mag-c",
  magnesiamur: "Mag-m",
  mercurius: "Merc",
  mercuriuscorr: "Merc-c",
  mercuriusiodflav: "Merc-i-f",
  mercuriusiodrub: "Merc-i-r",
  mercuriusprot: "Merc-i-f",
  mercuriussol: "Merc",
  mercuriusviv: "Merc",
  mercuriusbin: "Merc-i-f",
  muriaticumac: "Mur-ac",
  natrum: "Nat-m",
  natrumars: "Nat-ar",
  natrumcarb: "Nat-c",
  natrummur: "Nat-m",
  natrumsulph: "Nat-s",
  nitriac: "Nit-ac",
  nitrum: "Kali-n",
  nux: "Nux-v",
  nuxmosch: "Nux-m",
  nuxvom: "Nux-v",
  oxalicumac: "Ox-ac",
  phosphoricumac: "Ph-ac",
  phosphorus: "Phos",
  plumbum: "Plb",
  pulsatilla: "Puls",
  ranunculus: "Ran-b",
  ranunculusbulb: "Ran-b",
  ranunculusscel: "Ran-s",
  ranunculusseel: "Ran-s",
  esculus: "Aesc",
  iesculus: "Aesc",
  esculuship: "Aesc",
  iesculushipp: "Aesc",
  kaliBrom: "Kal-Bro",
  kalibrom: "Kal-Bro",
  chimaphilla: "Chim",
  rumex: "Rumx",
  rhustox: "Rhus-t",
  sambucus: "Samb",
  secalecom: "Sec",
  secalecorn: "Sec",
  sulphuricumac: "Sul-ac",
  sulphur: "Sulph",
  silicea: "Sil",
  sepia: "Sep",
  stannum: "Stann",
  staphisagria: "Staph",
  terebinthinae: "Tereb",
  thuya: "Thuja",
  veratrumalb: "Verat",
  veratrum: "Verat",
  zincum: "Zinc",
};
const unresolvedRemedies = new Map<string, number>();

for (const reference of references) {
  directAliases[key(reference.abbr)] ||= reference.abbr;
  directAliases[key(reference.name)] ||= reference.abbr;
}

function resolveRemedy(rawValue: string): string | null {
  const cleaned = rawValue
    .replace(/\([^)]*\)/g, "")
    .replace(/^[^A-Za-zÆæ]+|[^A-Za-z. -]+$/g, "")
    .replace(/\b(?:and|also|see)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const cleanedKey = key(cleaned);
  if (cleanedKey.length < 3) return null;
  if (directAliases[cleanedKey]) return directAliases[cleanedKey];

  const sourceWords = words(cleaned);
  if (!sourceWords.length) return null;
  const first = sourceWords[0].replace(/^ieth/, "aeth");
  const candidates = references.filter((reference) => {
    const target = reference.words[0] || "";
    return (
      first === target ||
      (first.length >= 4 &&
        target.length >= 4 &&
        (first.startsWith(target) || target.startsWith(first)))
    );
  });
  if (!candidates.length) {
    unresolvedRemedies.set(cleaned, (unresolvedRemedies.get(cleaned) || 0) + 1);
    return null;
  }
  if (candidates.length === 1) return candidates[0].abbr;

  if (sourceWords[1]) {
    const second = sourceWords[1];
    const narrowed = candidates.filter((reference) =>
      reference.words.slice(1).some(
        (target) =>
          second === target ||
          (second.length >= 2 &&
            target.length >= 2 &&
            (second.startsWith(target) || target.startsWith(second))),
      ),
    );
    if (narrowed.length === 1) return narrowed[0].abbr;
  }
  unresolvedRemedies.set(cleaned, (unresolvedRemedies.get(cleaned) || 0) + 1);
  return null;
}

function cleanSource(value: string): string {
  return value
    .replace(/\r/g, "")
    .replace(/-\s*\n\s*(?=[a-z])/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n");
}

function cleanLabel(value: string): string {
  return value
    .replace(/[“”"]/g, "")
    .replace(/\ba£ter\b/gi, "after")
    .replace(/\b<\s*f\s*t\b/gi, "of")
    .replace(/^[•|^»<>]+\s*/, "")
    .replace(/[•|^»<>]/g, "")
    .replace(/\b(?:See|Vide)\s+[^.]+[.]?$/i, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/^[,.;:\s—-]+|[,.;:\s—-]+$/g, "")
    .replace(/\b(?:tiie|tlie)\b/gi, "the")
    .trim();
}

function isNoiseParagraph(value: string): boolean {
  const compact = value.replace(/\s+/g, " ").trim();
  if (!compact || compact.length < 5) return true;
  return (
    /^(?:\d+\s+)?(?:REPERTORY|CONTENTS OF REPERTORY)\b/i.test(compact) ||
    /^(?:ARRANGED|COMPILED|BY)\b/i.test(compact) ||
    /^(?:Page|ERRATA|Editorial Committee)\b/i.test(compact) ||
    /^\(?\d+\)?$/.test(compact) ||
    /^[^A-Za-z]+$/.test(compact)
  );
}

function parseRemedyList(value: string): Record<string, number> {
  const remedies: Record<string, number> = {};
  const withoutNotes = value
    .replace(/\([^)]*\)/g, "")
    .replace(/\b(?:See|Vide)\b[^.;]*[.;]?/gi, "")
    .replace(/\band\b/gi, ",");
  for (const token of withoutNotes.split(/[,;]|\.(?=\s+[A-ZÆ])/)) {
    const remedy = resolveRemedy(token);
    if (remedy) remedies[remedy] = 1;
  }
  return remedies;
}

function splitHeartRemedyParagraph(
  paragraph: string,
): Array<{ name: string; remedies: Record<string, number> }> {
  const colon = paragraph.indexOf(":");
  if (colon < 1) return [];
  const remedy = resolveRemedy(paragraph.slice(0, colon));
  if (!remedy) return [];
  const symptomText = paragraph.slice(colon + 1).trim();
  return symptomText
    .split(/\.\s+(?=[A-Z])/)
    .map(cleanLabel)
    .filter((name) => name.length >= 8 && name.length <= 420)
    .map((name) => ({ name, remedies: { [remedy]: 1 } }));
}

function parseParagraph(
  paragraph: string,
  heartSection: boolean,
): Array<{ name: string; remedies: Record<string, number> }> {
  const compact = paragraph.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  if (isNoiseParagraph(compact)) return [];
  const colon = compact.indexOf(":");
  if (colon < 1) return [];

  if (heartSection && resolveRemedy(compact.slice(0, colon))) {
    return splitHeartRemedyParagraph(compact);
  }

  const name = cleanLabel(compact.slice(0, colon));
  const remedies = parseRemedyList(compact.slice(colon + 1));
  if (
    name.length < 3 ||
    name.length > 420 ||
    Object.keys(remedies).length === 0
  ) {
    return [];
  }
  return [{ name, remedies }];
}

function parseSectionBody(
  body: string,
  heartSection: boolean,
): Array<{ name: string; remedies: Record<string, number> }> {
  const parsed: Array<{ name: string; remedies: Record<string, number> }> = [];
  let pending = "";

  const flush = () => {
    if (!pending) return;
    parsed.push(...parseParagraph(pending, heartSection));
    pending = "";
  };

  for (const rawLine of body.split("\n")) {
    const line = rawLine.replace(/\s+/g, " ").trim();
    if (isNoiseParagraph(line)) {
      flush();
      continue;
    }
    if (line.includes(":")) {
      flush();
      pending = line;
      continue;
    }
    if (!pending) continue;

    const previousEnds = /[.!?)]$/.test(pending);
    const looksLikeHeading =
      line.length <= 90 &&
      (/^[A-Z][A-Za-z'’ -]+[.]$/.test(line) ||
        /^[A-Z][A-Z '’—-]+[.]?$/.test(line));
    if (previousEnds && looksLikeHeading) {
      flush();
      continue;
    }
    pending = `${pending} ${line}`;
  }
  flush();
  return parsed;
}

function mergeRubrics(
  entries: Array<{ chapter: string; name: string; remedies: Record<string, number> }>,
): BrowserRubric[] {
  const merged = new Map<string, BrowserRubric>();
  for (const entry of entries) {
    const normalizedName = cleanLabel(entry.name);
    const mergeKey = `${entry.chapter}::${normalizedName.toLowerCase()}`;
    const existing = merged.get(mergeKey);
    if (existing) {
      Object.assign(existing.remedies, entry.remedies);
      continue;
    }
    merged.set(mergeKey, {
      id: `hering-specialized-${slug(entry.chapter)}-${slug(normalizedName)}`,
      chapter: entry.chapter,
      name: normalizedName,
      remedies: { ...entry.remedies },
      source: "hering-specialized",
      scoringEnabled: true,
      scoringMode: "occurrence",
      occurrenceScoringEnabled: true,
      citation,
      sourceUrl,
    });
  }
  const usedIds = new Map<string, number>();
  return [...merged.values()].map((rubric) => {
    const count = usedIds.get(rubric.id) || 0;
    usedIds.set(rubric.id, count + 1);
    return count ? { ...rubric, id: `${rubric.id}-${count + 1}` } : rubric;
  });
}

async function loadSource(): Promise<string> {
  if (sourceFileArgument) {
    return fs.readFileSync(path.resolve(sourceFileArgument), "utf8");
  }
  const response = await fetch(textUrl);
  if (!response.ok) {
    throw new Error(`Unable to download source OCR (${response.status}).`);
  }
  return response.text();
}

async function main() {
  const source = cleanSource(await loadSource());
  const entries: Array<{
    chapter: string;
    name: string;
    remedies: Record<string, number>;
  }> = [];

  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index];
    const start = source.indexOf(section.marker);
    const endMarker = sections[index + 1]?.marker;
    const end = endMarker
      ? source.indexOf(endMarker, start + section.marker.length)
      : source.indexOf("REPERTORY \n\nTO", start + section.marker.length);
    if (start < 0 || end < 0) {
      throw new Error(`Could not locate the governed bounds for ${section.chapter}.`);
    }
    const body = source.slice(start + section.marker.length, end);
    for (const parsed of parseSectionBody(
      body,
      section.chapter.startsWith("Heart Symptoms"),
    )) {
      entries.push({ chapter: section.chapter, ...parsed });
    }
  }

  const rubrics = mergeRubrics(entries);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(rubrics, null, 2)}\n`);

  const chapterCounts = Object.fromEntries(
    sections.map(({ chapter }) => [
      chapter,
      rubrics.filter((rubric) => rubric.chapter === chapter).length,
    ]),
  );
  const relationships = rubrics.reduce(
    (sum, rubric) => sum + Object.keys(rubric.remedies).length,
    0,
  );
  console.log(
    JSON.stringify(
      {
        outputPath,
        rubrics: rubrics.length,
        relationships,
        chapters: chapterCounts,
      },
      null,
      2,
    ),
  );
  if (debugUnresolved) {
    console.log(
      [...unresolvedRemedies.entries()]
        .sort((left, right) => right[1] - left[1])
        .slice(0, 180)
        .map(([value, count]) => `${count}\t${value}`)
        .join("\n"),
    );
  }
}

void main();
