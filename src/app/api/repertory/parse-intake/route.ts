import { NextRequest, NextResponse } from "next/server";
import { RepertorySearch } from "@/features/repertory/search/repertorySearch";
import { authorizeRepertoryRequest } from "@/features/repertory/access/RepertoryRequestAuthorization";
import {
  consumeRepertoryRateLimit,
  rateLimitResponse,
} from "@/features/repertory/security/RepertoryApiSecurity";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeRepertoryRequest(request, "repertory.search", "REPERTORY_PARSE_INTAKE");
    if (!auth.authorized) return auth.response;

    const rateLimit = consumeRepertoryRateLimit("parse_intake", auth.session.uid, {
      maxRequests: 30,
      windowMs: 60_000,
    });
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Request body must contain valid JSON." },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!text) {
      return NextResponse.json(
        { success: false, message: "Intake text cannot be empty." },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const mappingResult = await RepertorySearch.parseAIIntakeText(text);

    return NextResponse.json(
      {
        success: true,
        ...mappingResult,
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error: any) {
    console.error("AI Intake parsing API failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to parse intake text into repertory rubrics.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
