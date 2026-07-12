import { NextRequest, NextResponse } from "next/server";
import { resolveApiContext } from "@/features/repertory/access/resolveContext";
import { getKnowledgeAccessService } from "@/features/repertory/application/KnowledgeAccessService";
import { RepertoryEditionId } from "@/features/repertory/types/repertoryTypes";
import { z } from "zod";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  q: z.string().min(2).max(200),
  chapterId: z.string().optional(),
  editionIds: z.preprocess(
    val => (typeof val === "string" ? val.split(",") : val),
    z.array(z.string().min(1)).optional().default([])
  ).transform(val => val as RepertoryEditionId[]),
  limit: z.preprocess(val => (val ? Number(val) : undefined), z.number().int().min(1).max(100).optional().default(50)),
  cursor: z.string().optional()
});

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${crypto.randomUUID()}`;

  try {
    const { searchParams } = new URL(request.url);
    const params = {
      q: searchParams.get("q") || undefined,
      chapterId: searchParams.get("chapterId") || undefined,
      editionIds: searchParams.get("editionIds") || undefined,
      limit: searchParams.get("limit") || undefined,
      cursor: searchParams.get("cursor") || undefined
    };

    const validated = QuerySchema.safeParse(params);
    if (!validated.success) {
      return NextResponse.json(
        {
          metadata: { requestId, generatedAt: new Date().toISOString(), durationMs: 0 },
          error: { code: "INVALID_INPUT", message: "Invalid search query parameters.", details: validated.error.flatten() }
        },
        { status: 400 }
      );
    }

    const auth = await resolveApiContext(request, "repertory.review.read");
    if (!auth.authorized || !auth.context) {
      return auth.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { q, chapterId, editionIds, limit, cursor } = validated.data;
    const service = getKnowledgeAccessService();
    const result = await service.searchRubrics(
      auth.context,
      q,
      { chapterId, editionIds },
      { limit, position: cursor }
    );

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
    return NextResponse.json(
      {
        metadata: {
          requestId,
          generatedAt: new Date().toISOString(),
          durationMs: Date.now() - startTime
        },
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to execute search."
        }
      },
      { status: 500 }
    );
  }
}
