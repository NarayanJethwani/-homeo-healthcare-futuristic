process.env.NODE_ENV = "test";

import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/admin/medical-academy/literature/route";
import {
  normalizeLiteratureQuery,
  searchPubMedLiterature,
} from "../src/features/medical-academy/server/pubmedLiteratureService";
import {
  buildPicoQuery,
  formatLiteratureLibraryAsRis,
  sanitizeLiteratureLibrary,
} from "../src/features/medical-academy/data/literatureLibrary";

async function run() {
  assert.equal(normalizeLiteratureQuery("  heart\n anatomy\u0000  "), "heart anatomy");
  assert.equal(normalizeLiteratureQuery(null), "");
  assert.equal(buildPicoQuery({
    population: " adults with asthma ",
    intervention: "breathing exercise",
    comparison: "usual care",
    outcome: "quality\nof life",
  }), "(adults with asthma) AND (breathing exercise) AND (usual care) AND (quality of life)");
  assert.equal(buildPicoQuery({
    population: "adults with asthma",
    intervention: "breathing exercise",
    comparison: "",
    outcome: "quality of life",
  }), "(adults with asthma) AND (breathing exercise) AND (quality of life)");

  const calls: string[] = [];
  const mockFetch = async (input: string | URL | Request): Promise<Response> => {
    const url = String(input);
    calls.push(url);
    if (url.includes("esearch.fcgi")) {
      return Response.json({ esearchresult: { count: "27", idlist: ["123", "456", "unsafe-id"] } });
    }
    if (url.includes("efetch.fcgi")) {
      return new Response(`<?xml version="1.0"?><PubmedArticleSet><PubmedArticle><MedlineCitation><PMID>123</PMID><Article><Abstract><AbstractText Label="BACKGROUND">Structured &amp; verified abstract.</AbstractText></Abstract></Article></MedlineCitation></PubmedArticle></PubmedArticleSet>`, { status: 200 });
    }
    if (url.includes("api.crossref.org")) {
      return Response.json({ message: { DOI: "10.1000/example.123", publisher: "Example Publisher", type: "journal-article", "is-referenced-by-count": 12, URL: "https://doi.org/10.1000/example.123" } });
    }
    return Response.json({
      result: {
        uids: ["123", "456"],
        "123": {
          title: "Heart &amp; circulation",
          authors: [{ name: "Author A" }, { name: "Author B" }, { name: "Author C" }, { name: "Author D" }],
          fulljournalname: "Journal of Anatomy",
          pubdate: "2025 Jan",
          pubtype: ["Journal Article", "Review"],
          articleids: [{ idtype: "doi", value: "10.1000/example.123" }],
        },
        "456": {
          title: "Renal physiology",
          authors: [{ name: "Author E" }],
          source: "Physiol J",
          epubdate: "2024 Dec 02",
          pubtype: ["Clinical Study"],
          articleids: [{ idtype: "doi", value: "javascript:unsafe" }],
        },
      },
    });
  };

  const result = await searchPubMedLiterature(" cardiovascular physiology ", mockFetch);
  assert.equal(calls.length, 4);
  assert.match(calls[0], /esearch\.fcgi/);
  assert.match(calls[0], /retmax=6/);
  assert.match(calls[1], /esummary\.fcgi/);
  assert.match(calls[2], /efetch\.fcgi/);
  assert.match(calls[3], /api\.crossref\.org/);
  assert.equal(result.total, 27);
  assert.equal(result.citations.length, 2);
  assert.equal(result.citations[0].title, "Heart & circulation");
  assert.equal(result.citations[0].authors, "Author A, Author B, Author C, et al.");
  assert.equal(result.citations[0].doiUrl, "https://doi.org/10.1000/example.123");
  assert.equal(result.citations[0].abstractExcerpt, "BACKGROUND: Structured & verified abstract.");
  assert.equal(result.citations[0].designSignal, "Narrative review");
  assert.equal(result.citations[0].crossref?.citedByCount, 12);
  assert.equal(result.citations[1].doi, null, "unsafe DOI-shaped values must not become links");
  assert.equal(result.citations[1].pubMedUrl, "https://pubmed.ncbi.nlm.nih.gov/456/");

  const saved = sanitizeLiteratureLibrary([
    result.citations[0],
    result.citations[0],
    { ...result.citations[1], pmid: "not-a-pmid", pubMedUrl: "javascript:unsafe" },
  ]);
  assert.equal(saved.length, 1, "saved citations must be valid and deduplicated by PMID");
  assert.equal(saved[0].pubMedUrl, "https://pubmed.ncbi.nlm.nih.gov/123/");
  const ris = formatLiteratureLibraryAsRis(saved);
  assert.match(ris, /TY  - JOUR/);
  assert.match(ris, /AN  - PMID:123/);
  assert.match(ris, /DO  - 10\.1000\/example\.123/);
  assert.match(ris, /ER  -/);

  await assert.rejects(() => searchPubMedLiterature(" ", mockFetch), /LITERATURE_QUERY_INVALID/);

  let filteredUrl = "";
  await searchPubMedLiterature("heart", async (input) => {
    filteredUrl = String(input);
    return Response.json({ esearchresult: { count: "0", idlist: [] } });
  }, "systematic-review");
  assert.match(new URL(filteredUrl).searchParams.get("term") || "", /systematic review\[pt\]/);

  const crossOrigin = await POST(new NextRequest("http://localhost/api/admin/medical-academy/literature", {
    method: "POST",
    headers: { origin: "https://attacker.example", host: "localhost", "content-type": "application/json" },
    body: JSON.stringify({ query: "heart" }),
  }));
  assert.equal(crossOrigin.status, 403);

  const invalid = await POST(new NextRequest("http://localhost/api/admin/medical-academy/literature", {
    method: "POST",
    headers: { origin: "http://localhost", host: "localhost", "content-type": "application/json" },
    body: JSON.stringify({ query: "x" }),
  }));
  assert.equal(invalid.status, 400);

  console.log("Medical Academy literature tests passed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
