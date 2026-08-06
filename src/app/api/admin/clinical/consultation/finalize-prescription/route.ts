import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { validatePrescriptionDraft } from "@/features/consultation/utils/prescription-validation";
import { PrescriptionDraft } from "@/features/consultation/types/prescription.types";
import { renderCanonicalPrescriptionPdf } from "@/features/consultation/server/clinicalPrescriptionPdf.server";
import {
  clinicalDocumentRepository,
  idempotencyRepository,
  prescriptionRepository,
  auditRepository,
  ClinicalDocumentRecord,
} from "@/features/consultation/repositories/consultationRepositories";

export async function POST(req: NextRequest) {
  const session = await requireAdminApiSession(req);
  if (!session || !session.uid || !session.role) {
    return unauthorizedApiResponse();
  }

  try {
    const body: {
      patientId: string;
      consultationId: string;
      prescriptionDraft: PrescriptionDraft;
      idempotencyKey?: string;
      isAnalysisStale?: boolean;
    } = await req.json();

    if (!body.consultationId || !body.patientId || !body.prescriptionDraft) {
      return NextResponse.json(
        { error: "Invalid parameters: consultationId, patientId, and prescriptionDraft are required." },
        { status: 400 }
      );
    }

    if (body.isAnalysisStale) {
      return NextResponse.json(
        { error: "Stale analysis error: Selected remedy analysis is stale. Please reconfirm selection before finalization." },
        { status: 409 }
      );
    }

    // 1. Compound Idempotency Reservation
    const idempKey = body.idempotencyKey || `idemp_rx_${randomUUID()}`;
    const idempResult = await idempotencyRepository.reserveIdempotencyKey({
      actorId: session.uid,
      operation: "finalize_prescription",
      consultationId: body.consultationId,
      idempotencyKey: idempKey,
      requestPayload: { consultationId: body.consultationId, patientId: body.patientId, remedy: body.prescriptionDraft.selectedRemedyName },
    });

    if (idempResult.isDuplicate && idempResult.existingRecord?.status === "completed") {
      return NextResponse.json({
        success: true,
        prescriptionId: idempResult.existingRecord.responseReference,
        idempotencyStatus: "replay",
      });
    }

    // 2. Draft Validation
    const valResult = validatePrescriptionDraft(body.prescriptionDraft, "prescription_issued");
    if (!valResult.valid) {
      return NextResponse.json(
        { error: "Prescription validation failed", details: valResult.errors },
        { status: 422 }
      );
    }

    const timestamp = new Date().toISOString();
    const prescriptionId = body.prescriptionDraft.id || `rx_${randomUUID()}`;
    const version = (body.prescriptionDraft.revision || 1) + 1;

    const finalizedPrescription: PrescriptionDraft = {
      ...body.prescriptionDraft,
      id: prescriptionId,
      revision: version,
    };

    // 3. Save Prescription & Revision in Repository
    await prescriptionRepository.savePrescription(finalizedPrescription);
    await prescriptionRepository.saveRevision({
      version,
      prescriptionId,
      finalizedAt: timestamp,
      finalizedBy: session.uid,
    });

    // 4. Render Server-Only Canonical PDF Document
    const pdf = renderCanonicalPrescriptionPdf({
      prescriptionId,
      revision: version,
      consultationId: body.consultationId,
      patientId: body.patientId,
      patientName: "Patient Record",
      prescriberName: session.uid,
      remedyName: finalizedPrescription.selectedRemedyName || "Nux Vomica",
      potencyScale: finalizedPrescription.potency?.scale || "centesimal",
      potencyValue: finalizedPrescription.potency?.value || "200C",
      dose: finalizedPrescription.dose || "4 pills",
      repetition: finalizedPrescription.repetition || "Twice daily",
      duration: finalizedPrescription.duration || "2 weeks",
      instructions: finalizedPrescription.instructions || "Take after meals",
      issuedAt: timestamp,
    });

    // 5. Store Document & Persist Record
    const documentId = `doc_${prescriptionId}`;
    const docRecord: ClinicalDocumentRecord = {
      id: documentId,
      patientId: body.patientId,
      consultationId: body.consultationId,
      prescriptionId,
      prescriptionRevision: version,
      documentType: "prescription",
      status: "available",
      storageProvider: "Local Repository Storage",
      storagePath: `/documents/prescriptions/${documentId}.pdf`,
      contentType: "application/pdf",
      byteLength: pdf.byteLength,
      checksumAlgorithm: "sha256",
      checksum: pdf.checksum,
      generatedAt: timestamp,
      generatedBy: session.uid,
      immutable: true,
    };

    await clinicalDocumentRepository.saveDocument(docRecord, pdf.buffer);

    // 6. Complete Idempotency & Log Audit
    const compoundKey = idempotencyRepository.createCompoundKey(session.uid, "finalize_prescription", body.consultationId, idempKey);
    await idempotencyRepository.completeIdempotency(compoundKey, prescriptionId);

    await auditRepository.logAuditEvent({
      id: `audit_evt_${randomUUID()}`,
      consultationId: body.consultationId,
      patientId: body.patientId,
      actorId: session.uid,
      actorRole: session.role,
      eventType: "prescription_finalized",
      occurredAt: timestamp,
      metadata: {
        prescriptionId,
        documentId,
        checksum: pdf.checksum,
        remedyName: finalizedPrescription.selectedRemedyName,
        revision: version,
      },
    });

    return NextResponse.json({
      success: true,
      prescription: finalizedPrescription,
      documentRecord: docRecord,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
