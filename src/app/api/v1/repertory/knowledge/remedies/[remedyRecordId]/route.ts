import { NextRequest, NextResponse } from "next/server";
import { resolveApiContext } from "@/features/repertory/access/resolveContext";
import { getRemedyGradeAccessService } from "@/features/repertory/application/RemedyGradeAccessService";
import { RemedyRecordId } from "@/features/repertory/types/remedyTypes";
import { z } from "zod";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ParamsSchema = z.object({
  remedyRecordId: z.string().min(1).max(100).transform(v => v as RemedyRecordId)
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ remedyRecordId: string }> }
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
          error: { code: "INVALID_INPUT", message: "Invalid remedy record identifier." }
        },
        { status: 400 }
      );
    }

    const auth = await resolveApiContext(request, "repertory.review.read");
    if (!auth.authorized || !auth.context) {
      return auth.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { remedyRecordId } = validatedParams.data;

    const service = getRemedyGradeAccessService();
    const result = await service.getRemedyRecord(auth.context, remedyRecordId);

    if (!result) {
      return NextResponse.json(
        {
          metadata: { requestId, generatedAt: new Date().toISOString(), durationMs: Date.now() - startTime },
          error: { code: "NOT_FOUND", message: "Remedy record not found." }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      metadata: {
        requestId,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        schemaVersion: 2
      },
      data: result
    });
  } catch (error: any) {
    const isAccessDenied = error.message && (error.message.includes("Access denied") || error.message.includes("Forbidden"));
    return NextResponse.json(
      {
        metadata: {
          requestId,
          generatedAt: new Date().toISOString(),
          durationMs: Date.now() - startTime
        },
        error: {
          code: isAccessDenied ? "FORBIDDEN" : "INTERNAL_ERROR",
          message: error.message || "Failed to retrieve remedy record."
        }
      },
      { status: isAccessDenied ? 403 : 500 }
    );
  }
}
