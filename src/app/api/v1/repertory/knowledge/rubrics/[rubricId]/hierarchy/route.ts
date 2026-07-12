import { NextRequest, NextResponse } from "next/server";
import { resolveApiContext } from "@/features/repertory/access/resolveContext";
import { getKnowledgeAccessService } from "@/features/repertory/application/KnowledgeAccessService";
import { RubricRecordId } from "@/features/repertory/types/repertoryTypes";
import { z } from "zod";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ParamsSchema = z.object({
  rubricId: z.string().min(1).max(100).transform(v => v as RubricRecordId)
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rubricId: string }> }
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
          error: { code: "INVALID_INPUT", message: "Invalid rubric identifier." }
        },
        { status: 400 }
      );
    }

    const auth = await resolveApiContext(request, "repertory.review.read");
    if (!auth.authorized || !auth.context) {
      return auth.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rubricId } = validated.data;
    const service = getKnowledgeAccessService();

    // Verify rubric exists and is access-permitted
    const rubric = await service.getRubricById(auth.context, rubricId);
    if (!rubric) {
      return NextResponse.json(
        {
          metadata: { requestId, generatedAt: new Date().toISOString(), durationMs: Date.now() - startTime },
          error: { code: "NOT_FOUND", message: "Rubric not found or access denied." }
        },
        { status: 404 }
      );
    }

    // Traverse hierarchy via service delegation
    const parent = rubric.parentRecordId ? await service.getRubricById(auth.context, rubric.parentRecordId as RubricRecordId) : null;
    const children = await service.getChildren(auth.context, rubric.id);
    const breadcrumbs = await service.buildBreadcrumb(auth.context, rubric.id);

    return NextResponse.json({
      metadata: {
        requestId,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime
      },
      data: {
        rubric,
        parent,
        children,
        breadcrumbs
      }
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
          message: error.message || "Failed to retrieve hierarchy."
        }
      },
      { status: 500 }
    );
  }
}
