import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { authorizeRepertoryRequest } from "@/features/repertory/access/RepertoryRequestAuthorization";
import { isOriginAllowed, getCorsHeaders, handleOptionsRequest } from "@/features/ai-security/access/aiSecurityHeaders";
import { consumeRepertoryRateLimit, rateLimitResponse, readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { runV2ClinicalLiveEngine, V2LiveFilters } from "@/features/repertory/liveMode";
import { getV2FallbackRubrics } from "@/features/repertory/liveMode/fallbackRubrics";
import { z } from "zod";

export const dynamic = "force-dynamic";

const SAFE_IDENTIFIER = /^[A-Za-z0-9_\-.:]{1,100}$/;

const liveFiltersSchema = z.object({
  category: z.string().max(100).optional(),
  organSystem: z.string().max(100).optional(),
  miasm: z.string().max(100).optional(),
  remedy: z.string().max(100).optional(),
}).strict().optional();

const liveRequestSchema = z.object({
  query: z.string().max(100).optional().default(""),
  filters: liveFiltersSchema,
  selectedRubricIds: z.array(z.string().max(100).regex(SAFE_IDENTIFIER)).max(100).optional().default([]),
}).strict();

async function activeRubricCandidates(limit = 5000) {
  const snapshot = await getAdminDb()
    .collection("rubrics")
    .where("status", "==", "active")
    .limit(limit)
    .get();

  const rubrics: unknown[] = [];
  snapshot.forEach((doc: any) => rubrics.push({ id: doc.id, ...doc.data() }));
  return rubrics.length > 0 ? rubrics : getV2FallbackRubrics();
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
    // 2. Doctor Pilot Clinician Authorization (runs before rate limits or body stream reads)
    const auth = await authorizeRepertoryRequest(request, "repertory.repertorize", "REPERTORY_V2_LIVE");
    if (!auth.authorized) {
      const response = auth.response;
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 3. Rate Limiting
    const rateLimit = consumeRepertoryRateLimit("live_post", auth.session.uid, {
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
    const parsed = liveRequestSchema.safeParse(parsedJson);
    if (!parsed.success) {
      const response = NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "Invalid payload schema." } }, { status: 400 });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    const { query = "", filters = {}, selectedRubricIds = [] } = parsed.data;
    const candidateRubrics = await activeRubricCandidates();
    const result = runV2ClinicalLiveEngine({
      query: query.toLowerCase().trim(),
      filters: filters,
      selectedRubricIds,
      candidateRubrics,
      limit: 100,
    });

    const response = NextResponse.json(result);
    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error: any) {
    console.error("Repertory Live API failed. Details redacted.");

    const response = NextResponse.json({
      success: false,
      message: "V2 Clinical mode failed. V1 remains available."
    }, { status: 500 });
    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
