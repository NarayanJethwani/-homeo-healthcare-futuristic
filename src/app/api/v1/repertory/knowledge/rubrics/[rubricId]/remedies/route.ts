import { NextRequest, NextResponse } from "next/server";
import { resolveApiContext } from "@/features/repertory/access/resolveContext";
import { getRemedyGradeAccessService } from "@/features/repertory/application/RemedyGradeAccessService";
import { RubricRecordId } from "@/features/repertory/types/repertoryTypes";
import { z } from "zod";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ParamsSchema = z.object({
  rubricId: z.string().min(1).max(100).transform(v => v as RubricRecordId)
});

const QuerySchema = z.object({
  limit: z.preprocess(val => (val ? Number(val) : undefined), z.number().int().min(1).max(100).optional().default(50)),
  cursor: z.string().optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rubricId: string }> }
) {
  const startTime = Date.now();
  const requestId = `req_${crypto.randomUUID()}`;

  try {
    const rawParams = await params;
    const validatedParams = ParamsSchema.safeParse(rawParams);
    if (!validatedParams.success) {
      return NextResponse.json(
        {
          metadata: { requestId, generatedAt: new Date().toISOString(), durationMs: 0 },
          error: { code: "INVALID_INPUT", message: "Invalid rubric identifier." }
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const validatedQuery = QuerySchema.safeParse({
      limit: searchParams.get("limit") || undefined,
      cursor: searchParams.get("cursor") || undefined
    });
    if (!validatedQuery.success) {
      return NextResponse.json(
        {
          metadata: { requestId, generatedAt: new Date().toISOString(), durationMs: 0 },
          error: { code: "INVALID_INPUT", message: "Invalid query parameters.", details: validatedQuery.error.flatten() }
        },
        { status: 400 }
      );
    }

    const auth = await resolveApiContext(request, "repertory.review.read");
    if (!auth.authorized || !auth.context) {
      return auth.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rubricId } = validatedParams.data;
    const { limit, cursor } = validatedQuery.data;

    const service = getRemedyGradeAccessService();
    const result = await service.getRemediesForRubric(auth.context, rubricId, { limit, position: cursor });

    return NextResponse.json({
      metadata: {
        requestId,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        schemaVersion: 2,
        pagination: {
          hasNextPage: result.hasNextPage,
          nextCursor: result.nextCursor
        },
        sourceVersions: { active: result.sourceVersion }
      },
      data: result.items
    });
  } catch (error: any) {
    const isAccessDenied = error.message && (error.message.includes("Access denied") || error.message.includes("Forbidden"));
    const isNotFound = error.message && error.message.includes("not found");
    return NextResponse.json(
      {
        metadata: {
          requestId,
          generatedAt: new Date().toISOString(),
          durationMs: Date.now() - startTime
        },
        error: {
          code: isNotFound ? "NOT_FOUND" : isAccessDenied ? "FORBIDDEN" : "INTERNAL_ERROR",
          message: error.message || "Failed to retrieve rubric remedies."
        }
      },
      { status: isNotFound ? 404 : isAccessDenied ? 403 : 500 }
    );
  }
}
