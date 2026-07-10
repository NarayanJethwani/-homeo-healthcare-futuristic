import { NextRequest, NextResponse } from "next/server";
import { validatePractitionerPatientAccess } from "@/features/patient-attachments/authHelper";
import { getAttachmentById, getExtractedLabParameters, updateLabParameterReviewStatus } from "@/features/patient-attachments/attachmentRepository";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string; attachmentId: string }> }
) {
  try {
    const { patientId, attachmentId } = await params;
    const access = await validatePractitionerPatientAccess(request, patientId);
    if (!access.authorized) {
      return NextResponse.json(
        { ok: false, error: { code: access.status === 401 ? "UNAUTHORIZED" : "FORBIDDEN", message: access.error } },
        { status: access.status }
      );
    }

    const attachment = await getAttachmentById(attachmentId);
    if (!attachment) {
      return NextResponse.json(
        { ok: false, error: { code: "NOT_FOUND", message: "Attachment not found." } },
        { status: 404 }
      );
    }
    if (attachment.patientId !== patientId) {
      return NextResponse.json(
        { ok: false, error: { code: "FORBIDDEN", message: "Access forbidden: patient scope mismatch." } },
        { status: 403 }
      );
    }

    const parameters = await getExtractedLabParameters(patientId, attachmentId);
    return new NextResponse(
      JSON.stringify({ success: true, parameters }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        }
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to load lab parameters." } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string; attachmentId: string }> }
) {
  try {
    const { patientId, attachmentId } = await params;
    const access = await validatePractitionerPatientAccess(request, patientId);
    if (!access.authorized) {
      return NextResponse.json(
        { ok: false, error: { code: access.status === 401 ? "UNAUTHORIZED" : "FORBIDDEN", message: access.error } },
        { status: access.status }
      );
    }

    const attachment = await getAttachmentById(attachmentId);
    if (!attachment) {
      return NextResponse.json(
        { ok: false, error: { code: "NOT_FOUND", message: "Attachment not found." } },
        { status: 404 }
      );
    }
    if (attachment.patientId !== patientId) {
      return NextResponse.json(
        { ok: false, error: { code: "FORBIDDEN", message: "Access forbidden: patient scope mismatch." } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { parameterId, status, correction } = body;

    if (!parameterId || !status) {
      return NextResponse.json(
        { ok: false, error: { code: "BAD_REQUEST", message: "Missing parameterId or status." } },
        { status: 400 }
      );
    }

    // Verify parameter ownership
    const parameters = await getExtractedLabParameters(patientId, attachmentId);
    const hasParam = parameters.some(p => p.id === parameterId);
    if (!hasParam) {
      return NextResponse.json(
        { ok: false, error: { code: "FORBIDDEN", message: "Access denied. Parameter does not belong to this attachment." } },
        { status: 403 }
      );
    }

    const updated = await updateLabParameterReviewStatus(
      parameterId,
      status,
      correction,
      access.session!.uid
    );

    return NextResponse.json({ success: true, parameter: updated });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to update parameter status." } },
      { status: 500 }
    );
  }
}
