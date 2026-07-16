import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { isOriginAllowed, getCorsHeaders, handleOptionsRequest } from "@/features/ai-security/access/aiSecurityHeaders";
import { consumeRepertoryRateLimit, rateLimitResponse, readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import {
  CLINICAL_REVIEW_REQUIRED_NOTICE,
  compareRemedyScores,
  compareRubricSnapshots,
  runV2ClinicalLiveEngine,
  V1SearchRun,
  V2LiveFilters,
  V2RubricSnapshot,
} from "@/features/repertory/liveMode";
import { adaptFirestoreRubric } from "@/features/repertory/adapters/firestoreRubricAdapter";
import { createClinicalRepertorizationSession, repertorizeClinicalSession } from "@/features/repertory/repertorization/clinicalRepertorization";
import { getV2FallbackRubrics } from "@/features/repertory/liveMode/fallbackRubrics";
import { z } from "zod";

export const dynamic = "force-dynamic";

const SAFE_IDENTIFIER = /^[A-Za-z0-9_\-.:]{1,100}$/;

const compareFiltersSchema = z.object({
  category: z.string().max(100).optional(),
  organSystem: z.string().max(100).optional(),
  miasm: z.string().max(100).optional(),
  remedy: z.string().max(100).optional(),
}).strict().optional();

const compareRequestSchema = z.object({
  query: z.string().max(100).optional().default(""),
  filters: compareFiltersSchema,
  selectedRubricIds: z.array(z.string().max(100).regex(SAFE_IDENTIFIER)).max(100).optional().default([]),
}).strict();

function snapshotRubric(record: any): V2RubricSnapshot {
  return {
    id: record.id || record.rubricId || record.slug || record.name,
    title: record.name || record.title || record.id,
    source: "v1",
    category: record.category || record.section,
    organSystem: record.organSystem,
  };
}

async function activeRubricCandidates(limit = 5000) {
  const snapshot = await getAdminDb()
    .collection("rubrics")
    .where("status", "==", "active")
    .limit(limit)
    .get();

  const rubrics: any[] = [];
  snapshot.forEach((doc: any) => rubrics.push({ id: doc.id, ...doc.data() }));
  return rubrics.length > 0 ? rubrics : getV2FallbackRubrics();
}

function applyV1Filters(results: any[], filters: V2LiveFilters): any[] {
  let filtered = results;
  if (filters.category && filters.category !== "All") {
    filtered = filtered.filter((rubric) => rubric.category === filters.category || rubric.section === filters.category);
  }
  if (filters.organSystem && filters.organSystem !== "All") {
    filtered = filtered.filter((rubric) => rubric.organSystem === filters.organSystem);
  }
  if (filters.miasm && filters.miasm !== "All") {
    filtered = filtered.filter((rubric) => Array.isArray(rubric.miasms) && rubric.miasms.includes(filters.miasm));
  }
  if (filters.remedy && filters.remedy !== "All") {
    filtered = filtered.filter((rubric) => rubric.remedies?.[filters.remedy!] !== undefined);
  }
  return filtered;
}

function buildV1SearchRun(results: any[], startedAt: number, selectedRubricIds: string[]): V1SearchRun {
  const selected = selectedRubricIds.length
    ? results.filter((rubric) => selectedRubricIds.includes(rubric.id))
    : results.slice(0, 10);
  const canonicalSelected = selected.map((rubric) => adaptFirestoreRubric(rubric));
  const session = createClinicalRepertorizationSession({
    id: `v1-compare-${Date.now()}`,
    rubrics: canonicalSelected,
    strategyId: "weighted_grades",
  });
  const repertorization = repertorizeClinicalSession(session);

  return {
    count: results.length,
    latencyMs: Date.now() - startedAt,
    topRubrics: results.slice(0, 10).map(snapshotRubric),
    rankings: repertorization.rankings.slice(0, 10).map((ranking) => ({
      remedyId: ranking.remedyId,
      totalScore: ranking.totalScore,
      matchedRubricCount: ranking.matchedRubricCount,
    })),
  };
}

function runV1FallbackSearch(query: string, filters: V2LiveFilters, selectedRubricIds: string[], startedAt: number): V1SearchRun {
  const q = query.toLowerCase().trim();
  let results = getV2FallbackRubrics();

  if (q) {
    const words = q.split(/[\s,\.\-_]+/).filter((word) => word.length > 2);
    const searchTerms = Array.from(new Set([q, ...words].map((term) => term.toLowerCase())));
    const scored = results.map((rubric) => {
      let score = 0;
      const name = String(rubric.name || "").toLowerCase();
      const desc = String(rubric.description || "").toLowerCase();
      searchTerms.forEach((term) => {
        if (name === term) score += 200;
        else if (name.includes(term)) score += 100;
        else if (desc.includes(term)) score += 40;
        if (rubric.keywords?.includes(term)) score += 30;
        if (rubric.remedies && Object.keys(rubric.remedies).some((remedy) => remedy.toLowerCase() === term)) score += 50;
      });
      return { rubric, score };
    });
    results = scored.filter((item) => item.score > 0).sort((a, b) => b.score - a.score).map((item) => item.rubric);
  }

  return buildV1SearchRun(applyV1Filters(results, filters), startedAt, selectedRubricIds);
}

async function runV1Search(query: string, filters: V2LiveFilters, selectedRubricIds: string[]): Promise<V1SearchRun> {
  const startedAt = Date.now();
  const q = query.toLowerCase().trim();
  const rubricsRef = getAdminDb().collection("rubrics");
  let results: any[] = [];

  if (!q) {
    const snapshot = await rubricsRef.where("status", "==", "active").limit(100).get();
    snapshot.forEach((doc: any) => results.push({ id: doc.id, ...doc.data() }));
  } else {
    let searchTerms = [q];
    const synDoc = await getAdminDb().collection("synonyms").doc(q).get();
    if (synDoc.exists) {
      const data = synDoc.data();
      if (data?.synonyms) searchTerms = Array.from(new Set([q, ...data.synonyms]));
    }

    const words = q.split(/[\s,\.\-_]+/);
    for (const word of words) {
      if (word.length > 2 && word !== q) {
        searchTerms.push(word);
        const wSynDoc = await getAdminDb().collection("synonyms").doc(word).get();
        if (wSynDoc.exists) {
          const data = wSynDoc.data();
          if (data?.synonyms) searchTerms.push(...data.synonyms);
        }
      }
    }

    searchTerms = Array.from(new Set(searchTerms.map((term) => term.toLowerCase())));
    const chunks: string[][] = [];
    const tempTerms = [...searchTerms];
    while (tempTerms.length > 0) chunks.push(tempTerms.splice(0, 10));

    const matchedDocs = new Map<string, any>();
    for (const chunk of chunks) {
      const querySnapshot = await rubricsRef
        .where("status", "==", "active")
        .where("keywords", "array-contains-any", chunk)
        .get();
      querySnapshot.forEach((doc: any) => matchedDocs.set(doc.id, { id: doc.id, ...doc.data() }));
    }

    const directSnapshot = await rubricsRef
      .where("status", "==", "active")
      .where("slug", "==", q.replace(/[\s_]+/g, "-"))
      .get();
    directSnapshot.forEach((doc: any) => matchedDocs.set(doc.id, { id: doc.id, ...doc.data() }));

    results = Array.from(matchedDocs.values());
    const scored = results.map((rubric) => {
      let score = 0;
      const name = String(rubric.name || "").toLowerCase();
      const desc = String(rubric.description || "").toLowerCase();
      searchTerms.forEach((term) => {
        if (name === term) score += 200;
        else if (name.includes(term)) score += 100;
        else if (desc.includes(term)) score += 40;
        if (rubric.keywords?.includes(term)) score += 30;
        if (rubric.remedies && Object.keys(rubric.remedies).some((remedy) => remedy.toLowerCase() === term)) score += 50;
      });
      return { rubric, score };
    });
    results = scored.filter((item) => item.score > 0).sort((a, b) => b.score - a.score).map((item) => item.rubric);
  }

  return buildV1SearchRun(applyV1Filters(results, filters), startedAt, selectedRubricIds);
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return handleOptionsRequest(origin, "POST, OPTIONS");
}

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ ok: false, error: { code: "METHOD_NOT_ALLOWED", message: "GET not allowed on this endpoint" } }, { status: 405 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  // 1. Exact-Origin check
  if (!isOriginAllowed(origin)) {
    const response = NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Disallowed Origin" } }, { status: 403 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const corsHeaders = getCorsHeaders(origin, "POST, OPTIONS");

  try {
    // 2. Admin Authorization (runs before rate limits or body streams)
    const auth = await authorizeRequest(request, "repertory.review.read", "REPERTORY_V2_COMPARE");
    if (!auth.authorized) {
      const response = auth.response;
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 3. Rate Limiting
    const rateLimit = consumeRepertoryRateLimit("compare_post", auth.session.uid, {
      maxRequests: 60,
      windowMs: 60_000,
    });
    if (!rateLimit.allowed) {
      const response = rateLimitResponse(rateLimit.retryAfterSeconds);
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 4. Secure stream-bound request body reading (16KB limit to prevent buffering attacks)
    let rawBody = "";
    try {
      rawBody = await readAndBoundRequestBody(request, 16 * 1024);
    } catch (err: any) {
      if (err.message === "PAYLOAD_TOO_LARGE") {
        const response = NextResponse.json({ ok: false, error: { code: "PAYLOAD_TOO_LARGE", message: "Payload too large" } }, { status: 413 });
        Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
        response.headers.set("Cache-Control", "no-store");
        return response;
      }
      throw err;
    }

    const parsedJson = JSON.parse(rawBody);
    const parsed = compareRequestSchema.safeParse(parsedJson);
    if (!parsed.success) {
      const response = NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "Invalid payload schema." } }, { status: 400 });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    const { query = "", filters = {}, selectedRubricIds = [] } = parsed.data;

    const [v1, candidateRubrics] = await Promise.all([
      runV1Search(query, filters, selectedRubricIds),
      activeRubricCandidates(),
    ]);

    const v2Live = runV2ClinicalLiveEngine({
      query,
      filters: filters,
      selectedRubricIds,
      candidateRubrics,
      limit: 100,
    });

    const rubricComparison = compareRubricSnapshots(v1.topRubrics, v2Live.search.topRubrics);
    const scoreDifferences = compareRemedyScores(v1.rankings, v2Live.repertorization.result.rankings.slice(0, 10));

    const response = NextResponse.json({
      success: true,
      mode: "compare",
      query,
      filters: filters,
      safetyNotice: CLINICAL_REVIEW_REQUIRED_NOTICE,
      v1,
      v2: {
        ...v2Live.search,
        repertorization: v2Live.repertorization,
      },
      comparison: {
        ...rubricComparison,
        scoreDifferences,
        clinicalExplanation: [
          "V1 is preserved as the stable reference.",
          "V2 differences are shown for clinician review and do not auto-prescribe.",
          rubricComparison.v2OnlyRubrics.length > 0
            ? "V2 found additional rubric candidates that may reflect synonym, fuzzy, or hierarchy expansion."
            : "V2 did not add additional top rubric candidates in this comparison.",
        ],
      },
    });

    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error: any) {
    console.error("Repertory Compare API failed. Details redacted.");

    const response = NextResponse.json({
      success: false,
      message: "V1 vs V2 comparison failed. V1 remains available."
    }, { status: 500 });
    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
