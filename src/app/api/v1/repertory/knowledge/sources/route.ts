import { NextRequest, NextResponse } from "next/server";
import { resolveApiContext } from "@/features/repertory/access/resolveContext";
import { getKnowledgeAccessService } from "@/features/repertory/application/KnowledgeAccessService";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${crypto.randomUUID()}`;

  try {
    const auth = await resolveApiContext(request, "repertory.review.read");
    if (!auth.authorized || !auth.context) {
      return auth.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = getKnowledgeAccessService();
    const sources = await service.getSources(auth.context);

    return NextResponse.json({
      metadata: {
        requestId,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime
      },
      data: sources
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        metadata: {
          requestId,
          generatedAt: new Date().toISOString(),
          durationMs: Date.now() - startTime
        },
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to retrieve sources"
        }
      },
      { status: 500 }
    );
  }
}
