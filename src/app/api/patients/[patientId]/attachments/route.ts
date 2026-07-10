import { NextRequest, NextResponse } from "next/server";
import { validatePractitionerPatientAccess } from "@/features/patient-attachments/authHelper";
import { getPatientAttachments, createAttachmentMetadata } from "@/features/patient-attachments/attachmentRepository";
import { validateAttachmentUpload, detectAttachmentType, sanitizeFileName } from "@/features/patient-attachments/uploadValidation";
import { uploadAttachmentFile } from "@/features/patient-attachments/storageAdapter";
import { PatientAttachment, AttachmentStatus, ExtractionStatus } from "@/features/patient-attachments/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ patientId: string }> }) {
  try {
    const { patientId } = await params;
    const access = await validatePractitionerPatientAccess(request, patientId);
    if (!access.authorized) {
      return NextResponse.json(
        { ok: false, error: { code: access.status === 401 ? "UNAUTHORIZED" : "FORBIDDEN", message: access.error } },
        { status: access.status }
      );
    }

    const attachments = await getPatientAttachments(patientId);
    return new NextResponse(
      JSON.stringify({ success: true, attachments }),
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
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to load attachments." } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ patientId: string }> }) {
  try {
    const { patientId } = await params;
    const access = await validatePractitionerPatientAccess(request, patientId);
    if (!access.authorized) {
      return NextResponse.json(
        { ok: false, error: { code: access.status === 401 ? "UNAUTHORIZED" : "FORBIDDEN", message: access.error } },
        { status: access.status }
      );
    }

    const body = await request.json();
    const { fileName, mimeType, sizeBytes, fileData, type, notes } = body;

    if (!fileName || !mimeType || !fileData) {
      return NextResponse.json(
        { ok: false, error: { code: "BAD_REQUEST", message: "Missing required upload parameters." } },
        { status: 400 }
      );
    }

    // Validation
    try {
      validateAttachmentUpload({ name: fileName, mimeType, sizeBytes });
    } catch (vErr: any) {
      return NextResponse.json(
        { ok: false, error: { code: "BAD_REQUEST", message: vErr.message } },
        { status: 400 }
      );
    }

    const attachmentId = "att_" + Math.random().toString(36).substr(2, 9);
    const sanitizedName = sanitizeFileName(fileName);
    
    // Storage
    const storageResult = await uploadAttachmentFile({
      patientId,
      attachmentId,
      fileName: sanitizedName,
      mimeType,
      fileData
    });

    const nowStr = new Date().toISOString();
    const detectedType = detectAttachmentType(sanitizedName, mimeType, type);

    const metadata: PatientAttachment = {
      id: attachmentId,
      patientId,
      uploadedBy: access.session!.uid,
      fileName: sanitizedName,
      originalFileName: sanitizedName,
      mimeType,
      sizeBytes,
      storagePath: storageResult.storagePath,
      type: detectedType as any,
      status: "uploaded" as AttachmentStatus,
      extractionStatus: "not-started" as ExtractionStatus,
      createdAt: nowStr,
      updatedAt: nowStr,
      notes,
      source: "clinician-upload"
    };

    const savedMetadata = await createAttachmentMetadata(metadata);
    return NextResponse.json({ success: true, attachment: savedMetadata });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to upload file." } },
      { status: 500 }
    );
  }
}
