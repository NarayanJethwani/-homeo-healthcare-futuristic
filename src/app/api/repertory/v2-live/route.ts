import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { runV2ClinicalLiveEngine, V2LiveFilters } from "@/features/repertory/liveMode";
import { getV2FallbackRubrics } from "@/features/repertory/liveMode/fallbackRubrics";

export const dynamic = "force-dynamic";

function noStoreJson(body: unknown, status = 200) {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "no-store");
  return response;
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

    const rubrics: unknown[] = [];
    snapshot.forEach((doc: any) => rubrics.push({ id: doc.id, ...doc.data() }));
    return rubrics.length > 0 ? rubrics : getV2FallbackRubrics();
  } catch (error) {
    console.warn("V2 Clinical mode could not load Firestore rubrics. Using local repertory fallback:", error);
    return getV2FallbackRubrics();
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}

export async function POST(request: NextRequest) {
  const session = await requireAdminApiSession(request);
  if (!session) return unauthorizedApiResponse();

  try {
    const input = await readRequest(request);
    const candidateRubrics = await activeRubricCandidates();
    const result = runV2ClinicalLiveEngine({
      query: input.query.toLowerCase().trim(),
      filters: input.filters,
      selectedRubricIds: input.selectedRubricIds,
      candidateRubrics,
      limit: 100,
    });

    return noStoreJson(result);
  } catch (error: any) {
    return noStoreJson({
      success: false,
      message: "V2 Clinical mode failed. V1 remains available.",
      error: error?.message || String(error),
    }, 500);
  }
}
