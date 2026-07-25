import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_ROOT = path.join(ROOT, "public", "data", "materia-medica", "v1", "books");
const SUMMARY_PATH = path.join(
  ROOT,
  "src",
  "features",
  "materia-medica",
  "data",
  "machineCorpusManifest.json",
);
const CACHE_ROOT = path.join(tmpdir(), "homeo-materia-medica-source-cache");
const MAX_CHUNK_CHARACTERS = 50_000;

const source = (identifier, label, parseMode = null) => ({ identifier, label, parseMode });
const webCrawlSource = (identifier, label, sourceUrl) => ({ identifier, label, sourceUrl, kind: "web-crawl" });
const linkedWebSource = (identifier, label, sourceUrl, pageDepth) => ({
  identifier,
  label,
  sourceUrl,
  pageDepth,
  kind: "linked-web",
});
const anchoredWebSource = (identifier, label, sourceUrl, anchorMode) => ({
  identifier,
  label,
  sourceUrl,
  anchorMode,
  kind: "anchored-web",
});

const BOOKS = [
  {
    bookId: "james-tyler-kent",
    sources: [linkedWebSource("homeoint-kent-materia-medica", "Remedy edition", "http://homeoint.org/books3/kentmm/index.htm", 1)],
  },
  {
    bookId: "william-boericke",
    sources: [linkedWebSource("homeoint-boericke-materia-medica", "Remedy edition", "http://homeoint.org/books/boericmm/index.htm", 2)],
  },
  {
    bookId: "john-henry-clarke",
    sources: [linkedWebSource("homeoint-clarke-dictionary", "Dictionary remedy edition", "http://homeoint.org/clarke/index.php", 2)],
  },
  {
    bookId: "henry-c-allen",
    sources: [anchoredWebSource("homeoint-allen-keynotes", "Remedy edition", "http://homeoint.org/books/allkeyn/index.htm", "remedy")],
  },
  {
    bookId: "benoit-mure",
    sources: [source("materiamedicaorp00murerich", "Complete volume", "mure-remedies")],
  },
  {
    bookId: "cyrus-maxwell-boger",
    sources: [
      webCrawlSource(
        "homeoint-boger-synoptic-key",
        "Complete web transcription",
        "http://homeoint.org/books2/bogersyn/index.htm",
      ),
    ],
  },
  {
    bookId: "adolf-zur-lippe",
    sources: [source("64320760R.nlm.nih.gov", "Complete volume", "lippe-remedies")],
  },
  {
    bookId: "william-boericke-short",
    sources: [linkedWebSource("homeoint-boericke-materia-medica", "Catalogue remedy edition", "http://homeoint.org/books/boericmm/index.htm", 2)],
  },
  {
    bookId: "samuel-hahnemann-organon",
    sources: [anchoredWebSource("homeoint-organon-sixth", "Sixth-edition aphorisms", "http://homeoint.org/books/hahorgan/index.htm", "aphorism")],
  },
  {
    bookId: "constantine-hering-guiding",
    sources: Array.from({ length: 10 }, (_, index) =>
      source(index === 0 ? "guidingsymptomso00heri" : `guidingsymptomso00heri${index + 1}`, `Volume ${index + 1} of 10`),
    ),
  },
];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeOcr(value) {
  return value
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{5,}/g, "\n\n\n\n")
    .trim();
}

function findBoundary(text, start) {
  const desired = Math.min(start + MAX_CHUNK_CHARACTERS, text.length);
  if (desired === text.length) return desired;

  const lowerBound = start + Math.floor(MAX_CHUNK_CHARACTERS * 0.7);
  const paragraphBoundary = text.lastIndexOf("\n\n", desired);
  if (paragraphBoundary >= lowerBound) return paragraphBoundary + 2;

  const lineBoundary = text.lastIndexOf("\n", desired);
  if (lineBoundary >= lowerBound) return lineBoundary + 1;

  const nextLineBoundary = text.indexOf("\n", desired);
  return nextLineBoundary > -1 ? nextLineBoundary + 1 : text.length;
}

const NON_INDEX_HEADINGS = new Set([
  "BY",
  "CALCUTTA",
  "FIRST EDITION",
  "HOMCEOPATHIC",
  "INDEX",
  "JAMES TYLER KENT",
  "LECTURES",
  "MATERIA MEDICA",
  "ON",
  "PREFACE TO FIRST EDITION",
  "ROY PUBLISHING HOUSE",
]);

function indexHeadingsFromChunk(text) {
  const candidates = text
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => {
    if (line.length < 3 || line.length > 90) return false;
    if (/\d/.test(line) || !/^[A-Za-zÆŒ^]/.test(line)) return false;
    const letters = line.replace(/[^A-Za-z]/g, "");
    if (letters.length < 3) return false;
    const uppercaseRatio = [...letters].filter((letter) => letter === letter.toUpperCase()).length / letters.length;
    return uppercaseRatio > 0.72;
  })
    .map((line) => line.replace(/^[-–—\s]+|[-–—\s.,;:]+$/g, "").trim())
    .filter((line) => !NON_INDEX_HEADINGS.has(line.toUpperCase()));

  const seen = new Set();
  return candidates.filter((candidate) => {
    const key = candidate.toUpperCase().replace(/[^A-Z]/g, "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function chunkOcr(text, sourceRecord, sourceIndex) {
  const chunks = [];
  let start = 0;
  let sourceChunkIndex = 0;

  while (start < text.length) {
    const end = findBoundary(text, start);
    const chunkText = text.slice(start, end);
    sourceChunkIndex += 1;
    const id = `${sourceRecord.identifier}-${String(sourceChunkIndex).padStart(3, "0")}`;
    const indexHeadings = indexHeadingsFromChunk(chunkText);
    const heading = indexHeadings[0] ?? null;
    chunks.push({
      id,
      sourceIdentifier: sourceRecord.identifier,
      sourceIndex,
      sourceChunkIndex,
      label: sourceRecord.label,
      title: `${sourceRecord.label} · Section ${sourceChunkIndex}${heading ? ` — ${heading}` : ""}`,
      indexHeadings,
      text: chunkText,
      characterCount: chunkText.length,
      sha256: sha256(chunkText),
    });
    start = end;
  }

  return chunks;
}

function chunkStructuredSections(sections, sourceRecord, sourceIndex) {
  const chunks = [];
  let sourceChunkIndex = 0;
  for (const section of sections) {
    let start = 0;
    let part = 0;
    while (start < section.text.length) {
      const end = findBoundary(section.text, start);
      const chunkText = section.text.slice(start, end);
      sourceChunkIndex += 1;
      part += 1;
      const id = `${sourceRecord.identifier}-${String(sourceChunkIndex).padStart(4, "0")}`;
      chunks.push({
        id,
        sourceIdentifier: sourceRecord.identifier,
        sourceIndex,
        sourceChunkIndex,
        label: sourceRecord.label,
        title: part === 1 ? section.title : `${section.title} · Part ${part}`,
        indexHeadings: [part === 1 ? section.title : `${section.title} · Part ${part}`],
        sectionUrl: section.sourceUrl,
        text: chunkText,
        characterCount: chunkText.length,
        sha256: sha256(chunkText),
      });
      start = end;
    }
  }
  return chunks;
}

function lippeRemedySections(text, sourceUrl) {
  const pattern = /^\s*([A-Z][A-Za-z]+(?:\s+[A-Za-z]+){0,3})\.\s*\n+\s*Symptoms\./gm;
  const starts = [];
  for (const match of text.matchAll(pattern)) {
    // The OCR repeats an uppercase running header on later pages; the title-case
    // occurrence is the actual beginning of each remedy chapter.
    if (!/[a-z]/.test(match[1])) continue;
    starts.push({ start: match.index, title: match[1].replace(/\s+/g, " ").trim() });
  }
  return starts.map((item, index) => ({
    title: item.title,
    text: text.slice(item.start, starts[index + 1]?.start ?? text.length).trim(),
    sourceUrl,
  }));
}

const MURE_REMEDIES = [
  "Crotalus Cascavella", "Elaps Corallinus", "Pediculus Capitis", "Eleis Guineensis",
  "Mimosa Humilis", "Cervus Brazilicus", "Guano Australis", "Hippomane Mancinella",
  "Hura Braziliensis", "Lepidium Bonariense", "Panacea", "Solanum Tuberosum Ægrotans",
  "Plumbago Littoralis", "Solanum Oleraceum", "Paullinia Pinnata", "Blatta Americana",
  "Delphinus Amazonicus", "Amphisboena Vermicularis", "Aristolochia Milhomens", "Resina Itu",
  "Tradescantia Diuretica", "Murure Leite", "Cannabis Indica", "Petiveria Tetrandra",
  "Janipha Manihot", "Melastoma Ackermani", "Sedinha", "Spiggurus Martini",
  "Convolvulus Duartinus", "Bufo Sahytiensis", "Jacaranda Caroba", "Canna Angustifolia",
  "Hedysarum Ildefonsianum", "Myristica Sebifera", "Ocimum Canum", "Solanum Arrebenta",
  "Illicium Anisatum", "Millefolium",
];

function mureRemedySections(text, sourceUrl) {
  const starts = [];
  let cursor = 0;
  for (const title of MURE_REMEDIES) {
    let expression;
    if (title === "Amphisboena Vermicularis") {
      expression = /^\s*AMPHISB[OŒC]?ENA\s+VERMICULARIS[^\n]{0,50}$/im;
    } else if (title === "Sedinha") {
      expression = /^\s*S\s+E\s+D\s+I\s+N\s+H\s+A[^\n]{0,20}$/im;
    } else {
      const words = title.replace("Æ", "").split(/\s+/).slice(0, 2)
        .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      expression = new RegExp(`^\\s*${words.join("\\s+")}[^\\n]{0,50}$`, "im");
    }
    const match = expression.exec(text.slice(cursor));
    if (!match) throw new Error(`Could not locate Mure chapter: ${title}`);
    const start = cursor + match.index;
    starts.push({ start, title });
    cursor = start + match[0].length;
  }
  return starts.map((item, index) => ({
    title: item.title,
    text: text.slice(item.start, starts[index + 1]?.start ?? text.length).trim(),
    sourceUrl,
  }));
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { "user-agent": "HomeoHealthcareMateriaMedicaIngest/1.0" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function fetchBuffer(url) {
  const response = await fetch(url, { headers: { "user-agent": "HomeoHealthcareMateriaMedicaIngest/1.0" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

function decodeHtml(value) {
  const entities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };
  return value
    .replace(/&(#x[0-9a-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/gi, (match, entity) => {
      if (entity.startsWith("#x")) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
      if (entity.startsWith("#")) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
      return entities[entity.toLowerCase()] ?? match;
    })
    .replace(/\u00a0/g, " ");
}

function htmlToText(html) {
  return normalizeOcr(
    decodeHtml(
      html
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<\/?(?:p|div|h[1-6]|li|tr|table|br|hr)\b[^>]*>/gi, "\n")
        .replace(/<[^>]+>/g, " "),
    ),
  );
}

function htmlLabel(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[*·\s]+|[*·\s]+$/g, "");
}

function decodeWebBuffer(raw) {
  return new TextDecoder("windows-1252").decode(raw);
}

async function fetchCachedWebPage(sourceRecord, url) {
  const cacheName = `${sourceRecord.identifier}-${sha256(url).slice(0, 20)}.html`;
  const cachePath = path.join(CACHE_ROOT, cacheName);
  let raw;
  try {
    raw = await readFile(cachePath);
  } catch {
    raw = await fetchBuffer(url);
    await writeFile(cachePath, raw);
  }
  return { url, raw, html: decodeWebBuffer(raw) };
}

function extractHtmlLinks(html, baseUrl) {
  const links = [];
  for (const match of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const resolved = new URL(match[1], baseUrl);
    links.push({
      url: `${resolved.origin}${resolved.pathname}`,
      fragment: resolved.hash.slice(1),
      label: htmlLabel(match[2]),
    });
  }
  return links;
}

function linkedPageTitle(html, fallback) {
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const title = htmlLabel(titleMatch?.[1] ?? fallback)
    .replace(/^([A-Z])\1\1\s*[-–—]\s*/i, "")
    .replace(/\s+[-–—]\s+(?:HOM(?:Œ|OE|O)OPATHIC|A DICTIONARY|LECTURES ON|KEYNOTES).*/i, "")
    .replace(/\s+By\s+(?:William Boericke|John Henry Clarke|James Tyler Kent).*$/i, "")
    .replace(/\s+/g, " ")
    .replace(/\s+[-–—]\s*$/, "")
    .trim();
  return title || fallback;
}

function relativeWebDepth(rootUrl, candidateUrl) {
  const rootDirectory = new URL("./", rootUrl);
  const relative = new URL(candidateUrl).pathname.slice(rootDirectory.pathname.length);
  return relative.split("/").filter(Boolean).length;
}

async function mapInBatches(items, batchSize, mapper) {
  const results = [];
  for (let index = 0; index < items.length; index += batchSize) {
    results.push(...await Promise.all(items.slice(index, index + batchSize).map(mapper)));
  }
  return results;
}

async function acquireLinkedWeb(sourceRecord) {
  const rootUrl = new URL(sourceRecord.sourceUrl);
  const rootDirectory = new URL("./", rootUrl);
  const fetched = new Map();
  const rootPage = await fetchCachedWebPage(sourceRecord, rootUrl.href);
  fetched.set(rootPage.url, rootPage);
  let frontier = extractHtmlLinks(rootPage.html, rootPage.url)
    .filter((link) => link.url.startsWith(rootDirectory.href) && relativeWebDepth(rootUrl, link.url) === 1);

  for (let depth = 1; depth < sourceRecord.pageDepth; depth += 1) {
    const nextFrontier = [];
    for (const link of new Map(frontier.map((item) => [item.url, item])).values()) {
      const page = fetched.get(link.url) ?? await fetchCachedWebPage(sourceRecord, link.url);
      fetched.set(link.url, page);
      nextFrontier.push(
        ...extractHtmlLinks(page.html, page.url).filter((candidate) =>
          candidate.url.startsWith(rootDirectory.href) &&
          relativeWebDepth(rootUrl, candidate.url) === depth + 1,
        ),
      );
    }
    frontier = nextFrontier;
  }

  const contentLinks = [...new Map(frontier.map((item) => [item.url, item])).values()]
    .filter((link) => /\.(?:html?|php)$/i.test(new URL(link.url).pathname))
    .sort((left, right) => left.url.localeCompare(right.url));
  const pages = (await mapInBatches(contentLinks, 10, async (link) => {
    const page = fetched.get(link.url) ?? await fetchCachedWebPage(sourceRecord, link.url);
    fetched.set(link.url, page);
    const text = htmlToText(page.html);
    if (text.length < 80) return null;
    return {
      title: linkedPageTitle(page.html, link.label || new URL(link.url).pathname.split("/").pop()),
      text,
      sourceUrl: link.url,
    };
  })).filter(Boolean);

  const raw = Buffer.concat(
    [...fetched.values()].flatMap((page) => [Buffer.from(`SOURCE ${page.url}\n`), page.raw, Buffer.from("\n")]),
  );
  return {
    metadata: { metadata: { title: sourceRecord.label } },
    asset: { name: "structured-public-web-edition", size: raw.length },
    raw,
    text: normalizeOcr(pages.map((page) => page.text).join("\n\n")),
    pageCount: pages.length,
    sourceUrl: sourceRecord.sourceUrl,
    sections: pages,
  };
}

function anchorSectionTitle(sourceRecord, link) {
  if (sourceRecord.anchorMode === "aphorism") {
    const match = link.fragment.match(/^P(\d+)(E[56])?$/i);
    if (!match || match[2]?.toUpperCase() === "E5") return null;
    return `Aphorism § ${Number(match[1])}`;
  }
  const label = link.label.replace(/^(?:AAA|BBB|CCC|DDD|EEE|FFF|GGG|HHH|III|KKK|LLL|MMM|NNN|OOO|PPP|RRR|SSS|TTT|VVV|ZZZ)\s*$/i, "").trim();
  return label || null;
}

async function acquireAnchoredWeb(sourceRecord) {
  const rootPage = await fetchCachedWebPage(sourceRecord, sourceRecord.sourceUrl);
  const rootDirectory = new URL("./", sourceRecord.sourceUrl);
  const registered = extractHtmlLinks(rootPage.html, rootPage.url)
    .map((link) => ({ ...link, title: anchorSectionTitle(sourceRecord, link) }))
    .filter((link) => link.title && link.fragment && link.url.startsWith(rootDirectory.href));
  const byPage = new Map();
  for (const link of registered) {
    if (!byPage.has(link.url)) byPage.set(link.url, []);
    byPage.get(link.url).push(link);
  }

  const fetched = [rootPage];
  const sections = [];
  for (const [pageUrl, links] of byPage) {
    const page = await fetchCachedWebPage(sourceRecord, pageUrl);
    fetched.push(page);
    const positions = links.map((link) => {
      const escaped = link.fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const match = new RegExp(`<a\\b[^>]*(?:name|id)=["']${escaped}["'][^>]*>`, "i").exec(page.html);
      return match ? { ...link, start: match.index } : null;
    }).filter(Boolean).sort((left, right) => left.start - right.start);
    for (const [index, item] of positions.entries()) {
      const end = positions[index + 1]?.start ?? page.html.length;
      const text = htmlToText(page.html.slice(item.start, end));
      if (text.length < 30) continue;
      sections.push({ title: item.title, text, sourceUrl: `${item.url}#${item.fragment}` });
    }
  }

  const raw = Buffer.concat(
    fetched.flatMap((page) => [Buffer.from(`SOURCE ${page.url}\n`), page.raw, Buffer.from("\n")]),
  );
  return {
    metadata: { metadata: { title: sourceRecord.label } },
    asset: { name: "structured-public-web-edition", size: raw.length },
    raw,
    text: normalizeOcr(sections.map((section) => section.text).join("\n\n")),
    pageCount: new Set(sections.map((section) => section.sourceUrl.split("#")[0])).size,
    sourceUrl: sourceRecord.sourceUrl,
    sections,
  };
}

async function acquireWebCrawl(sourceRecord) {
  const rootUrl = new URL(sourceRecord.sourceUrl);
  const rootDirectory = new URL("./", rootUrl);
  const queue = [rootUrl.href];
  const seen = new Set();
  const pages = [];

  while (queue.length > 0) {
    const batch = queue.splice(0, 8).filter((url) => !seen.has(url));
    batch.forEach((url) => seen.add(url));
    const acquired = await Promise.all(
      batch.map(async (url) => {
        const cacheName = `${sourceRecord.identifier}-${sha256(url).slice(0, 16)}.html`;
        const cachePath = path.join(CACHE_ROOT, cacheName);
        let raw;
        try {
          raw = await readFile(cachePath);
        } catch {
          raw = await fetchBuffer(url);
          await writeFile(cachePath, raw);
        }
        return { url, raw, html: raw.toString("utf8") };
      }),
    );

    for (const page of acquired) {
      pages.push(page);
      const hrefPattern = /href=["']([^"'#?]+\.html?)["']/gi;
      for (const match of page.html.matchAll(hrefPattern)) {
        const linked = new URL(match[1], page.url);
        if (linked.origin !== rootDirectory.origin || !linked.href.startsWith(rootDirectory.href)) continue;
        if (!seen.has(linked.href) && !queue.includes(linked.href)) queue.push(linked.href);
      }
    }
  }

  pages.sort((left, right) => left.url.localeCompare(right.url));
  const raw = Buffer.concat(
    pages.flatMap((page) => [Buffer.from(`SOURCE ${page.url}\n`, "utf8"), page.raw, Buffer.from("\n", "utf8")]),
  );
  const text = pages
    .map((page) => `SOURCE PAGE: ${page.url}\n\n${htmlToText(page.html)}`)
    .join("\n\n");

  return {
    metadata: { metadata: { title: "A Synoptic Key of the Materia Medica" } },
    asset: { name: "complete-web-transcription", size: raw.length },
    raw,
    text: normalizeOcr(text),
    pageCount: pages.length,
    sourceUrl: sourceRecord.sourceUrl,
  };
}

async function acquireSource(sourceRecord) {
  await mkdir(CACHE_ROOT, { recursive: true });
  if (sourceRecord.kind === "web-crawl") return acquireWebCrawl(sourceRecord);
  if (sourceRecord.kind === "linked-web") return acquireLinkedWeb(sourceRecord);
  if (sourceRecord.kind === "anchored-web") return acquireAnchoredWeb(sourceRecord);
  const metadata = await fetchJson(`https://archive.org/metadata/${sourceRecord.identifier}`);
  const asset = metadata.files?.find((file) => file.name?.endsWith("_djvu.txt"));
  if (!asset?.name) throw new Error(`No OCR text asset found for ${sourceRecord.identifier}`);

  const cachePath = path.join(CACHE_ROOT, asset.name);
  let raw;
  try {
    raw = await readFile(cachePath);
  } catch {
    raw = await fetchBuffer(
      `https://archive.org/download/${sourceRecord.identifier}/${encodeURIComponent(asset.name)}`,
    );
    await writeFile(cachePath, raw);
  }

  if (asset.size && Number(asset.size) !== raw.length) {
    throw new Error(`Size mismatch for ${sourceRecord.identifier}: expected ${asset.size}, got ${raw.length}`);
  }

  return {
    metadata,
    asset,
    raw,
    text: normalizeOcr(raw.toString("utf8")),
  };
}

async function ingestBook(book) {
  const bookRoot = path.join(OUTPUT_ROOT, book.bookId);
  await mkdir(bookRoot, { recursive: true });
  const registeredSources = [];
  const allChunks = [];

  for (const [sourceIndex, sourceRecord] of book.sources.entries()) {
    process.stdout.write(`Acquiring ${book.bookId}: ${sourceRecord.identifier}\n`);
    const acquired = await acquireSource(sourceRecord);
    if (sourceRecord.parseMode === "lippe-remedies") {
      acquired.sections = lippeRemedySections(
        acquired.text,
        `https://archive.org/details/${sourceRecord.identifier}`,
      );
      if (acquired.sections.length < 10) {
        throw new Error(`Expected Lippe remedy chapters, found ${acquired.sections.length}`);
      }
    }
    if (sourceRecord.parseMode === "mure-remedies") {
      acquired.sections = mureRemedySections(
        acquired.text,
        `https://archive.org/details/${sourceRecord.identifier}`,
      );
    }
    const rawSha256 = sha256(acquired.raw);
    const normalizedSha256 = sha256(acquired.text);
    const chunks = acquired.sections
      ? chunkStructuredSections(acquired.sections, sourceRecord, sourceIndex + 1)
      : chunkOcr(acquired.text, sourceRecord, sourceIndex + 1);

    registeredSources.push({
      identifier: sourceRecord.identifier,
      label: sourceRecord.label,
      sourceUrl: acquired.sourceUrl ?? `https://archive.org/details/${sourceRecord.identifier}`,
      sourceType: sourceRecord.kind?.includes("web") ? "public-web-transcription" : "internet-archive-ocr",
      assetName: acquired.asset.name,
      archiveMd5: acquired.asset.md5 ?? null,
      archiveSha1: acquired.asset.sha1 ?? null,
      downloadedByteCount: acquired.raw.length,
      sourceSha256: rawSha256,
      normalizedSha256,
      normalizedCharacterCount: acquired.text.length,
      chunkCount: chunks.length,
      sourcePageCount: acquired.pageCount ?? null,
    });
    allChunks.push(...chunks);
  }

  for (const [index, chunk] of allChunks.entries()) {
    const fileName = `${String(index + 1).padStart(4, "0")}.json`;
    await writeFile(
      path.join(bookRoot, fileName),
      `${JSON.stringify({ schemaVersion: 1, bookId: book.bookId, ...chunk })}\n`,
    );
    chunk.file = fileName;
    delete chunk.text;
  }

  const manifest = {
    schemaVersion: 1,
    bookId: book.bookId,
    corpusStatus: "machine-validated",
    correctionStatus: "raw-ocr",
    editorialStatus: "needs-review",
    generatedAt: new Date().toISOString(),
    sourceCount: registeredSources.length,
    chunkCount: allChunks.length,
    characterCount: allChunks.reduce((sum, item) => sum + item.characterCount, 0),
    downloadedByteCount: registeredSources.reduce((sum, item) => sum + item.downloadedByteCount, 0),
    sources: registeredSources,
    chunks: allChunks,
  };
  await writeFile(path.join(bookRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

async function main() {
  await rm(OUTPUT_ROOT, { recursive: true, force: true });
  await mkdir(OUTPUT_ROOT, { recursive: true });
  const manifests = [];
  for (const book of BOOKS) manifests.push(await ingestBook(book));

  const summary = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    corpusStatus: "machine-validated",
    editorialStatus: "needs-review",
    books: manifests.map((manifest) => ({
      bookId: manifest.bookId,
      manifestUrl: `/data/materia-medica/v1/books/${manifest.bookId}/manifest.json`,
      sourceCount: manifest.sourceCount,
      chunkCount: manifest.chunkCount,
      characterCount: manifest.characterCount,
      downloadedByteCount: manifest.downloadedByteCount,
      corpusStatus: manifest.corpusStatus,
      correctionStatus: manifest.correctionStatus,
      editorialStatus: manifest.editorialStatus,
    })),
  };
  await writeFile(SUMMARY_PATH, `${JSON.stringify(summary, null, 2)}\n`);
  process.stdout.write(
    `Ingested ${summary.books.length} catalog records, ${summary.books.reduce((sum, item) => sum + item.sourceCount, 0)} source volumes, and ${summary.books.reduce((sum, item) => sum + item.chunkCount, 0)} readable chunks.\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
