import { NextRequest, NextResponse } from "next/server";
import { resolveApiContext } from "@/features/repertory/access/resolveContext";
import { getKnowledgeAccessService } from "@/features/repertory/application/KnowledgeAccessService";
import { RepertorySourceId } from "@/features/repertory/types/repertoryTypes";
import { z } from "zod";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ParamsSchema = z.object({
  sourceId: z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/).transform(v => v as RepertorySourceId)
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sourceId: string }> }
) {
  const startTime = Date.now();
  const requestId = `req_${crypto.randomUUID()}`;

  try {
    const rawParams = await params;
    const validated = ParamsSchema.safeParse(rawParams);
    if (!validated.success) {
      return NextResponse.json(
        {
          metadata: { requestId, generatedAt: new Date().toISOString(), durationMs: 0 },
          error: { code: "INVALID_INPUT", message: "Invalid source identifier." }
        },
        { status: 400 }
      );
    }

    const auth = await resolveApiContext(request, "repertory.review.read");
    if (!auth.authorized || !auth.context) {
      return auth.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = getKnowledgeAccessService();
    const editions = await service.getEditions(auth.context, validated.data.sourceId);

    return NextResponse.json({
      metadata: {
        requestId,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime
      },
      data: editions
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
          message: error.message || "Failed to retrieve editions."
        }
      },
      { status: 500 }
    );
  }
}
