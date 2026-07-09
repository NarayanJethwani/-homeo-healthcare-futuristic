"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = void 0;
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const adminApiAuth_1 = require("@/lib/adminApiAuth");
const firebaseAdmin_1 = require("@/lib/firebaseAdmin");
const liveMode_1 = require("@/features/repertory/liveMode");
const fallbackRubrics_1 = require("@/features/repertory/liveMode/fallbackRubrics");
exports.dynamic = "force-dynamic";
function noStoreJson(body, status = 200) {
    const response = server_1.NextResponse.json(body, { status });
    response.headers.set("Cache-Control", "no-store");
    return response;
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
        console.warn("V2 Clinical mode could not load Firestore rubrics. Using local repertory fallback:", error);
        return (0, fallbackRubrics_1.getV2FallbackRubrics)();
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
        const candidateRubrics = await activeRubricCandidates();
        const result = (0, liveMode_1.runV2ClinicalLiveEngine)({
            query: input.query.toLowerCase().trim(),
            filters: input.filters,
            selectedRubricIds: input.selectedRubricIds,
            candidateRubrics,
            limit: 100,
        });
        return noStoreJson(result);
    }
    catch (error) {
        return noStoreJson({
            success: false,
            message: "V2 Clinical mode failed. V1 remains available.",
            error: error?.message || String(error),
        }, 500);
    }
}
