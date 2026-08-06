import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { validatePrescriptionDraft } from "@/features/consultation/utils/prescription-validation";
import { PrescriptionDraft } from "@/features/consultation/types/prescription.types";

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

    const auditEvent = {
      id: `audit_evt_${randomUUID()}`,
      consultationId: body.consultationId,
      patientId: body.patientId,
      actorId: session.uid,
      actorRole: session.role,
      eventType: "prescription_finalized",
      occurredAt: timestamp,
      metadata: {
        prescriptionId,
        remedyName: finalizedPrescription.selectedRemedyName,
        potency: finalizedPrescription.potency?.displayLabel,
        revision: version,
      },
    };

    console.log(`[Audit] prescription_finalized logged for rx=${prescriptionId}, consultation=${body.consultationId}`);

    return NextResponse.json({
      success: true,
      prescription: finalizedPrescription,
      auditEvent,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
