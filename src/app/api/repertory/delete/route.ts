import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { isOriginAllowed, getCorsHeaders, handleOptionsRequest } from "@/features/ai-security/access/aiSecurityHeaders";
import { consumeRepertoryRateLimit, rateLimitResponse, readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { z } from "zod";

export const dynamic = "force-dynamic";

const SAFE_IDENTIFIER = /^[a-zA-Z0-9_\-.:]+$/;

const deleteSchema = z.object({
  id: z.string().min(1).max(100)
}).strict();

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return handleOptionsRequest(origin, "POST, OPTIONS");
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
    // 2. Admin Authorization (runs before consuming rate limit or reading body)
    const auth = await authorizeRequest(request, "repertory.review.correct", "REPERTORY_RUBRIC_DELETE");
    if (!auth.authorized) {
      const response = auth.response;
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 3. Rate Limiting
    const rateLimit = consumeRepertoryRateLimit("delete_post", auth.session.uid, {
      maxRequests: 20,
      windowMs: 60_000,
    });
    if (!rateLimit.allowed) {
      const response = rateLimitResponse(rateLimit.retryAfterSeconds);
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 4. Secure stream-bound request body reading (1KB limit)
    let rawBody = "";
    try {
      rawBody = await readAndBoundRequestBody(request, 1024);
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
    const parsed = deleteSchema.safeParse(parsedJson);
    if (!parsed.success) {
      const response = NextResponse.json({ success: false, message: "Invalid payload schema." }, { status: 400 });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    const { id } = parsed.data;

    if (!SAFE_IDENTIFIER.test(id)) {
      const response = NextResponse.json({ success: false, message: "Invalid ID format." }, { status: 400 });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    const docRef = getAdminDb().collection("rubrics").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      const response = NextResponse.json({ success: false, message: "Rubric not found." }, { status: 404 });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    const data = docSnap.data();

    // Overwrite/delete protection: only custom rubrics can be deleted/modified
    if (data?.status !== "custom") {
      const response = NextResponse.json({ success: false, message: "Standard published rubrics cannot be deleted or modified." }, { status: 403 });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    await docRef.delete();

    const response = NextResponse.json({
      success: true,
      message: "Custom rubric permanently deleted."
    });
    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error: any) {
    // Redact exception trace
    console.error("Repertory Delete API failed. Details redacted.");

    const response = NextResponse.json({
      success: false,
      message: "An internal server error occurred while performing the delete action."
    }, { status: 500 });
    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
