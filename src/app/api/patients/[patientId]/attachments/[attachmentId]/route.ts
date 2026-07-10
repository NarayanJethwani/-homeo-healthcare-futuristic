import { NextRequest, NextResponse } from "next/server";
import { validatePractitionerPatientAccess } from "@/features/patient-attachments/authHelper";
import { getAttachmentById, archiveAttachment } from "@/features/patient-attachments/attachmentRepository";

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

    return new NextResponse(
      JSON.stringify({ success: true, attachment }),
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
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to retrieve attachment." } },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    if (!attachment || attachment.patientId !== patientId) {
      return NextResponse.json(
        { ok: false, error: { code: "NOT_FOUND", message: "Attachment not found." } },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const reason = body.reason || "Clinician request";

    // Archive (soft delete metadata)
    const updated = await archiveAttachment(attachmentId, reason, access.session!.uid);
    return NextResponse.json({ success: true, attachment: updated });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to delete attachment." } },
      { status: 500 }
    );
  }
}
