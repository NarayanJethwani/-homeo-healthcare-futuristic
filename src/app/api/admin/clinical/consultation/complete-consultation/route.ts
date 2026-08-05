import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { ConsultationOutcome, PrescriptionDraft } from "@/features/consultation/types/prescription.types";
import { StructuredClinicalNotes } from "@/features/consultation/types/clinical-notes.types";
import { validatePrescriptionDraft } from "@/features/consultation/utils/prescription-validation";

export async function POST(req: NextRequest) {
  const session = await requireAdminApiSession(req);
  if (!session || !session.uid || !session.role) {
    return unauthorizedApiResponse();
  }

  try {
    const body: {
      patientId: string;
      consultationId: string;
      idempotencyKey?: string;
      recordVersion: number;
      outcome: ConsultationOutcome;
      notes: StructuredClinicalNotes;
      prescriptionDraft?: PrescriptionDraft;
    } = await req.json();

    if (!body.consultationId || !body.patientId || !body.outcome || !body.notes) {
      return NextResponse.json(
        { error: "Invalid parameters: consultationId, patientId, outcome, and notes are required." },
        { status: 400 }
      );
    }

    // Outcome-dependent validation
    if (body.outcome === "prescription_issued") {
      if (!body.prescriptionDraft) {
        return NextResponse.json(
          { error: "Prescription draft is required when outcome is 'prescription_issued'." },
          { status: 400 }
        );
      }

      const rxVal = validatePrescriptionDraft(body.prescriptionDraft, body.outcome);
      if (!rxVal.valid) {
        return NextResponse.json(
          { error: "Prescription validation failed before consultation completion", details: rxVal.errors },
          { status: 422 }
        );
      }
    }

    const timestamp = new Date().toISOString();
    const updatedRecordVersion = body.recordVersion + 1;

    const auditEvent = {
      id: `audit_evt_${randomUUID()}`,
      consultationId: body.consultationId,
      patientId: body.patientId,
      actorId: session.uid,
      actorRole: session.role,
      eventType: "consultation_completed",
      occurredAt: timestamp,
      metadata: {
        outcome: body.outcome,
        idempotencyKey: body.idempotencyKey || `idemp_${randomUUID()}`,
        recordVersion: updatedRecordVersion,
      },
    };

    console.log(`[Audit] consultation_completed logged for consultation=${body.consultationId}, outcome=${body.outcome}`);

    return NextResponse.json({
      success: true,
      lifecycleStatus: "completed",
      outcome: body.outcome,
      recordVersion: updatedRecordVersion,
      completedAt: timestamp,
      auditEvent,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
