import { NextRequest, NextResponse } from "next/server";
import { validatePractitionerPatientAccess } from "@/features/patient-attachments/authHelper";
import { getAttachmentById } from "@/features/patient-attachments/attachmentRepository";
import { queueLabExtraction } from "@/features/patient-attachments/labExtraction";

export const dynamic = "force-dynamic";

export async function POST(
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

    // Trigger lab extraction pipeline
    const parameters = await queueLabExtraction(attachmentId);

    return NextResponse.json({ success: true, parameters });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: err.message || "Lab extraction failed." } },
      { status: 500 }
    );
  }
}
