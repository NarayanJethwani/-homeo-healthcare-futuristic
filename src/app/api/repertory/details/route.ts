import { NextRequest, NextResponse } from "next/server";
import repertoryRepository from "@/features/repertory/database/repertoryDb";
import { authorizeRepertoryRequest } from "@/features/repertory/access/RepertoryRequestAuthorization";
import { consumeRepertoryRateLimit, rateLimitResponse } from "@/features/repertory/security/RepertoryApiSecurity";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SAFE_IDENTIFIER = /^[a-zA-Z0-9_\-.:]+$/;

export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeRepertoryRequest(request, "repertory.search", "REPERTORY_DETAILS_GET");
    if (!auth.authorized) return auth.response;

    const rateLimit = consumeRepertoryRateLimit("details_get", auth.session.uid, {
      maxRequests: 60,
      windowMs: 60_000,
    });
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || id.length > 100 || !SAFE_IDENTIFIER.test(id)) {
      const response = NextResponse.json({
        success: false,
        message: "Invalid Rubric ID."
      }, { status: 400 });
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    const rubric = await repertoryRepository.getRubricById(id);

    if (!rubric) {
      const response = NextResponse.json({
        success: false,
        message: "Rubric not found in active published snapshot."
      }, { status: 404 });
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // Enrich remedies with full names
    const remediesEnriched: any[] = [];
    if (rubric.relatedRemedies) {
      rubric.relatedRemedies.forEach((rem) => {
        remediesEnriched.push({
          abbreviation: rem.remedyId,
          fullName: rem.remedyName || rem.remedyId,
          source: rem.keynoteReason || "Unknown",
          grade: rem.grade
        });
      });
    }

    // Sort remedies by grade descending
    remediesEnriched.sort((a, b) => b.grade - a.grade);

    const response = NextResponse.json({
      success: true,
      rubric: {
        ...rubric,
        remediesEnriched
      }
    });
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error: any) {
    console.error("Repertory Details API failed. Details redacted.");
    const response = NextResponse.json({
      success: false,
      message: "Failed to load rubric details."
    }, { status: 500 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
