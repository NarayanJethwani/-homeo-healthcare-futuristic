"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = void 0;
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const adminApiAuth_1 = require("@/lib/adminApiAuth");
const firebaseAdmin_1 = require("@/lib/firebaseAdmin");
const liveMode_1 = require("@/features/repertory/liveMode");
const firestoreRubricAdapter_1 = require("@/features/repertory/adapters/firestoreRubricAdapter");
const clinicalRepertorization_1 = require("@/features/repertory/repertorization/clinicalRepertorization");
const fallbackRubrics_1 = require("@/features/repertory/liveMode/fallbackRubrics");
exports.dynamic = "force-dynamic";
function noStoreJson(body, status = 200) {
    const response = server_1.NextResponse.json(body, { status });
    response.headers.set("Cache-Control", "no-store");
    return response;
}
function snapshotRubric(record) {
    return {
        id: record.id || record.rubricId || record.slug || record.name,
        title: record.name || record.title || record.id,
        source: "v1",
        category: record.category || record.section,
        organSystem: record.organSystem,
    };
}
async function readRequest(request) {
    if (request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        return {
            query: typeof body.query === "string" ? body.query : "",
            filters: (body.filters || {}),
            selectedRubricIds: Array.isArray(body.selectedRubricIds) ? body.selectedRubricIds.filter((id) => typeof id === "string") : [],
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
        const snapshot = await (0, firebaseAdmin_1.getAdminDb)()
            .collection("rubrics")
            .where("status", "==", "active")
            .limit(limit)
            .get();
        const rubrics = [];
        snapshot.forEach((doc) => rubrics.push({ id: doc.id, ...doc.data() }));
        return rubrics.length > 0 ? rubrics : (0, fallbackRubrics_1.getV2FallbackRubrics)();
    }
    catch (error) {
        console.warn("V2 comparison could not load Firestore rubrics. Using local repertory fallback:", error);
        return (0, fallbackRubrics_1.getV2FallbackRubrics)();
    }
}
function applyV1Filters(results, filters) {
    let filtered = results;
    if (filters.category && filters.category !== "All")
        filtered = filtered.filter((rubric) => rubric.category === filters.category || rubric.section === filters.category);
    if (filters.organSystem && filters.organSystem !== "All")
        filtered = filtered.filter((rubric) => rubric.organSystem === filters.organSystem);
    if (filters.miasm && filters.miasm !== "All")
        filtered = filtered.filter((rubric) => Array.isArray(rubric.miasms) && rubric.miasms.includes(filters.miasm));
    if (filters.remedy && filters.remedy !== "All")
        filtered = filtered.filter((rubric) => rubric.remedies?.[filters.remedy] !== undefined);
    return filtered;
}
function buildV1SearchRun(results, startedAt, selectedRubricIds) {
    const selected = selectedRubricIds.length
        ? results.filter((rubric) => selectedRubricIds.includes(rubric.id))
        : results.slice(0, 10);
    const canonicalSelected = selected.map((rubric) => (0, firestoreRubricAdapter_1.adaptFirestoreRubric)(rubric));
    const session = (0, clinicalRepertorization_1.createClinicalRepertorizationSession)({
        id: `v1-compare-${Date.now()}`,
        rubrics: canonicalSelected,
        strategyId: "weighted_grades",
    });
    const repertorization = (0, clinicalRepertorization_1.repertorizeClinicalSession)(session);
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
function runV1FallbackSearch(query, filters, selectedRubricIds, startedAt) {
    const q = query.toLowerCase().trim();
    let results = (0, fallbackRubrics_1.getV2FallbackRubrics)();
    if (q) {
        const words = q.split(/[\s,\.\-_]+/).filter((word) => word.length > 2);
        const searchTerms = Array.from(new Set([q, ...words].map((term) => term.toLowerCase())));
        const scored = results.map((rubric) => {
            let score = 0;
            const name = String(rubric.name || "").toLowerCase();
            const desc = String(rubric.description || "").toLowerCase();
            searchTerms.forEach((term) => {
                if (name === term)
                    score += 200;
                else if (name.includes(term))
                    score += 100;
                else if (desc.includes(term))
                    score += 40;
                if (rubric.keywords?.includes(term))
                    score += 30;
                if (rubric.remedies && Object.keys(rubric.remedies).some((remedy) => remedy.toLowerCase() === term))
                    score += 50;
            });
            return { rubric, score };
        });
        results = scored.filter((item) => item.score > 0).sort((a, b) => b.score - a.score).map((item) => item.rubric);
    }
    return buildV1SearchRun(applyV1Filters(results, filters), startedAt, selectedRubricIds);
}
async function runV1Search(query, filters, selectedRubricIds) {
    const startedAt = Date.now();
    const q = query.toLowerCase().trim();
    try {
        const rubricsRef = (0, firebaseAdmin_1.getAdminDb)().collection("rubrics");
        let results = [];
        if (!q) {
            const snapshot = await rubricsRef.where("status", "==", "active").limit(100).get();
            snapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
        }
        else {
            let searchTerms = [q];
            const synDoc = await (0, firebaseAdmin_1.getAdminDb)().collection("synonyms").doc(q).get();
            if (synDoc.exists) {
                const data = synDoc.data();
                if (data?.synonyms)
                    searchTerms = Array.from(new Set([q, ...data.synonyms]));
            }
            const words = q.split(/[\s,\.\-_]+/);
            for (const word of words) {
                if (word.length > 2 && word !== q) {
                    searchTerms.push(word);
                    const wSynDoc = await (0, firebaseAdmin_1.getAdminDb)().collection("synonyms").doc(word).get();
                    if (wSynDoc.exists) {
                        const data = wSynDoc.data();
                        if (data?.synonyms)
                            searchTerms.push(...data.synonyms);
                    }
                }
            }
            searchTerms = Array.from(new Set(searchTerms.map((term) => term.toLowerCase())));
            const chunks = [];
            const tempTerms = [...searchTerms];
            while (tempTerms.length > 0)
                chunks.push(tempTerms.splice(0, 10));
            const matchedDocs = new Map();
            for (const chunk of chunks) {
                const querySnapshot = await rubricsRef
                    .where("status", "==", "active")
                    .where("keywords", "array-contains-any", chunk)
                    .get();
                querySnapshot.forEach((doc) => matchedDocs.set(doc.id, { id: doc.id, ...doc.data() }));
            }
            const directSnapshot = await rubricsRef
                .where("status", "==", "active")
                .where("slug", "==", q.replace(/[\s_]+/g, "-"))
                .get();
            directSnapshot.forEach((doc) => matchedDocs.set(doc.id, { id: doc.id, ...doc.data() }));
            results = Array.from(matchedDocs.values());
            const scored = results.map((rubric) => {
                let score = 0;
                const name = String(rubric.name || "").toLowerCase();
                const desc = String(rubric.description || "").toLowerCase();
                searchTerms.forEach((term) => {
                    if (name === term)
                        score += 200;
                    else if (name.includes(term))
                        score += 100;
                    else if (desc.includes(term))
                        score += 40;
                    if (rubric.keywords?.includes(term))
                        score += 30;
                    if (rubric.remedies && Object.keys(rubric.remedies).some((remedy) => remedy.toLowerCase() === term))
                        score += 50;
                });
                return { rubric, score };
            });
            results = scored.filter((item) => item.score > 0).sort((a, b) => b.score - a.score).map((item) => item.rubric);
        }
        return buildV1SearchRun(applyV1Filters(results, filters), startedAt, selectedRubricIds);
    }
    catch (error) {
        console.warn("V2 comparison could not run Firestore-backed V1 reference search. Using local repertory fallback:", error);
        return runV1FallbackSearch(query, filters, selectedRubricIds, startedAt);
    }
}
async function GET(request) {
    return POST(request);
}
async function POST(request) {
    const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
    if (!session)
        return (0, adminApiAuth_1.unauthorizedApiResponse)();
    try {
        const input = await readRequest(request);
        const query = input.query.toLowerCase().trim();
        const [v1, candidateRubrics] = await Promise.all([
            runV1Search(query, input.filters, input.selectedRubricIds),
            activeRubricCandidates(),
        ]);
        const v2Live = (0, liveMode_1.runV2ClinicalLiveEngine)({
            query,
            filters: input.filters,
            selectedRubricIds: input.selectedRubricIds,
            candidateRubrics,
            limit: 100,
        });
        const rubricComparison = (0, liveMode_1.compareRubricSnapshots)(v1.topRubrics, v2Live.search.topRubrics);
        const scoreDifferences = (0, liveMode_1.compareRemedyScores)(v1.rankings, v2Live.repertorization.result.rankings.slice(0, 10));
        return noStoreJson({
            success: true,
            mode: "compare",
            query,
            filters: input.filters,
            safetyNotice: liveMode_1.CLINICAL_REVIEW_REQUIRED_NOTICE,
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
    }
    catch (error) {
        return noStoreJson({
            success: false,
            message: "V1 vs V2 comparison failed. V1 remains available.",
            error: error?.message || String(error),
        }, 500);
    }
}
