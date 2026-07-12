import { NextRequest, NextResponse } from "next/server";
import { resolveApiContext } from "@/features/repertory/access/resolveContext";
import { getKnowledgeAccessService } from "@/features/repertory/application/KnowledgeAccessService";
import { RepertoryEditionId } from "@/features/repertory/types/repertoryTypes";
import { z } from "zod";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ParamsSchema = z.object({
  editionId: z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/).transform(v => v as RepertoryEditionId)
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ editionId: string }> }
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
          error: { code: "INVALID_INPUT", message: "Invalid edition identifier." }
        },
        { status: 400 }
      );
    }

    const auth = await resolveApiContext(request, "repertory.review.read");
    if (!auth.authorized || !auth.context) {
      return auth.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = getKnowledgeAccessService();
    const chapters = await service.getChapters(auth.context, validated.data.editionId);

    return NextResponse.json({
      metadata: {
        requestId,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime
      },
      data: chapters
    });
  } catch (error: any) {
    const isAccessDenied = error.message && error.message.includes("Access denied");
    return NextResponse.json(
      {
        metadata: {
          requestId,
          generatedAt: new Date().toISOString(),
          durationMs: Date.now() - startTime
        },
        error: {
          code: isAccessDenied ? "FORBIDDEN" : "INTERNAL_ERROR",
          message: error.message || "Failed to retrieve chapters."
        }
      },
      { status: isAccessDenied ? 403 : 500 }
    );
  }
}
