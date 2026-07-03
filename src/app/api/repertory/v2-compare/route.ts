import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";
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

export const dynamic = "force-dynamic";

function noStoreJson(body: unknown, status = 200) {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function snapshotRubric(record: any): V2RubricSnapshot {
  return {
    id: record.id || record.rubricId || record.slug || record.name,
    title: record.name || record.title || record.id,
    source: "v1",
    category: record.category || record.section,
    organSystem: record.organSystem,
  };
}

async function readRequest(request: NextRequest) {
  if (request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    return {
      query: typeof body.query === "string" ? body.query : "",
      filters: (body.filters || {}) as V2LiveFilters,
      selectedRubricIds: Array.isArray(body.selectedRubricIds) ? body.selectedRubricIds.filter((id: unknown): id is string => typeof id === "string") : [],
    };
  }

  const searchParams = request.nextUrl.searchParams;
  return {
    query: searchParams.get("q") || "",
    filters: {
      category: searchParams.get("category") || "All",
      organSystem: searchParams.get("organSystem") || "All",
      miasm: searchParams.get("miasm") || "All",
      remedy: searchParams.get("remedy") || "All",
    },
    selectedRubricIds: searchParams.getAll("selectedRubricIds"),
  };
}

async function activeRubricCandidates(limit = 5000) {
  try {
    const snapshot = await getAdminDb()
      .collection("rubrics")
      .where("status", "==", "active")
      .limit(limit)
      .get();

    const rubrics: any[] = [];
    snapshot.forEach((doc: any) => rubrics.push({ id: doc.id, ...doc.data() }));
    return rubrics.length > 0 ? rubrics : getV2FallbackRubrics();
  } catch (error) {
    console.warn("V2 comparison could not load Firestore rubrics. Using local repertory fallback:", error);
    return getV2FallbackRubrics();
  }
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

  if (filters.category && filters.category !== "All") results = results.filter((rubric) => rubric.category === filters.category || rubric.section === filters.category);
  if (filters.organSystem && filters.organSystem !== "All") results = results.filter((rubric) => rubric.organSystem === filters.organSystem);
  if (filters.miasm && filters.miasm !== "All") results = results.filter((rubric) => Array.isArray(rubric.miasms) && rubric.miasms.includes(filters.miasm));
  if (filters.remedy && filters.remedy !== "All") results = results.filter((rubric) => rubric.remedies?.[filters.remedy!] !== undefined);

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

export async function GET(request: NextRequest) {
  return POST(request);
}

export async function POST(request: NextRequest) {
  const session = await requireAdminApiSession(request);
  if (!session) return unauthorizedApiResponse();

  try {
    const input = await readRequest(request);
    const query = input.query.toLowerCase().trim();
    const [v1, candidateRubrics] = await Promise.all([
      runV1Search(query, input.filters, input.selectedRubricIds),
      activeRubricCandidates(),
    ]);
    const v2Live = runV2ClinicalLiveEngine({
      query,
      filters: input.filters,
      selectedRubricIds: input.selectedRubricIds,
      candidateRubrics,
      limit: 100,
    });
    const rubricComparison = compareRubricSnapshots(v1.topRubrics, v2Live.search.topRubrics);
    const scoreDifferences = compareRemedyScores(v1.rankings, v2Live.repertorization.result.rankings.slice(0, 10));

    return noStoreJson({
      success: true,
      mode: "compare",
      query,
      filters: input.filters,
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
  } catch (error: any) {
    return noStoreJson({
      success: false,
      message: "V1 vs V2 comparison failed. V1 remains available.",
      error: error?.message || String(error),
    }, 500);
  }
}
