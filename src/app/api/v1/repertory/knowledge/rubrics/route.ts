import { NextRequest, NextResponse } from "next/server";
import { resolveApiContext } from "@/features/repertory/access/resolveContext";
import { getKnowledgeAccessService } from "@/features/repertory/application/KnowledgeAccessService";
import { RepertoryEditionId, RepertoryChapterId } from "@/features/repertory/types/repertoryTypes";
import { z } from "zod";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  editionId: z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/).transform(v => v as RepertoryEditionId),
  chapterId: z.string().min(1).max(100).transform(v => v as RepertoryChapterId),
  limit: z.preprocess(val => (val ? Number(val) : undefined), z.number().int().min(1).max(100).optional().default(50)),
  cursor: z.string().optional()
});

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${crypto.randomUUID()}`;

  try {
    const { searchParams } = new URL(request.url);
    const params = {
      editionId: searchParams.get("editionId") || undefined,
      chapterId: searchParams.get("chapterId") || undefined,
      limit: searchParams.get("limit") || undefined,
      cursor: searchParams.get("cursor") || undefined
    };

    const validated = QuerySchema.safeParse(params);
    if (!validated.success) {
      return NextResponse.json(
        {
          metadata: { requestId, generatedAt: new Date().toISOString(), durationMs: 0 },
          error: { code: "INVALID_INPUT", message: "Invalid query parameters.", details: validated.error.flatten() }
        },
        { status: 400 }
      );
    }

    const auth = await resolveApiContext(request, "repertory.review.read");
    if (!auth.authorized || !auth.context) {
      return auth.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { editionId, chapterId, limit, cursor } = validated.data;
    const service = getKnowledgeAccessService();
    const result = await service.getRubricsByChapter(auth.context, editionId, chapterId, { limit, position: cursor });

    return NextResponse.json({
      metadata: {
        requestId,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        pagination: {
          hasNextPage: result.hasNextPage,
          nextCursor: result.nextCursor
        },
        sourceVersions: { active: result.sourceVersion }
      },
      data: result.items
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
          message: error.message || "Failed to retrieve rubrics."
        }
      },
      { status: isAccessDenied ? 403 : 500 }
    );
  }
}
