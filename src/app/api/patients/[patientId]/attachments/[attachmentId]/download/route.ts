import { NextRequest, NextResponse } from "next/server";
import { validatePractitionerPatientAccess } from "@/features/patient-attachments/authHelper";
import { getAttachmentById } from "@/features/patient-attachments/attachmentRepository";
import { getAttachmentDownloadUrl } from "@/features/patient-attachments/storageAdapter";

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

    if (attachment.status === "deleted" || attachment.status === "archived") {
      const isSuperAdmin = access.session!.role === "super-admin";
      const hasAuditModeFlag = request.nextUrl.searchParams.get("audit") === "true";
      if (!(isSuperAdmin && hasAuditModeFlag)) {
        return NextResponse.json(
          { ok: false, error: { code: "FORBIDDEN", message: "Access denied. Cannot download archived or deleted attachments." } },
          { status: 403 }
        );
      }
    }

    const downloadUrl = await getAttachmentDownloadUrl(attachment.storagePath);
    return new NextResponse(
      JSON.stringify({ success: true, downloadUrl }),
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
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to generate signed download link." } },
      { status: 500 }
    );
  }
}
