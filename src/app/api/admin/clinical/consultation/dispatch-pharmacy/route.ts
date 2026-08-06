import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { dispatchRepository, auditRepository, idempotencyRepository } from "@/features/consultation/repositories/consultationRepositories";
import { PharmacyDispatchState } from "@/features/consultation/types/prescription.types";

export async function POST(req: NextRequest) {
  const session = await requireAdminApiSession(req);
  if (!session || !session.uid || !session.role) {
    return unauthorizedApiResponse();
  }

  try {
    const body: {
      prescriptionId: string;
      consultationId: string;
      patientId: string;
      pharmacyNotes?: string;
      idempotencyKey?: string;
    } = await req.json();

    if (!body.prescriptionId || !body.consultationId || !body.patientId) {
      return NextResponse.json(
        { error: "Invalid parameters: prescriptionId, consultationId, and patientId are required." },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();

    const dispatchState: PharmacyDispatchState = {
      status: "failed",
      requestedAt: timestamp,
      providerName: "Unconfigured Local Adapter",
      errorMessage: "Pharmacy dispatch provider is unconfigured. Consultation completion remains preserved.",
    };

    await dispatchRepository.saveDispatchState(body.prescriptionId, dispatchState);

    await auditRepository.logAuditEvent({
      id: `audit_evt_${randomUUID()}`,
      consultationId: body.consultationId,
      patientId: body.patientId,
      actorId: session.uid,
      actorRole: session.role,
      eventType: "prescription_dispatch_requested",
      occurredAt: timestamp,
      metadata: {
        prescriptionId: body.prescriptionId,
        providerName: "Unconfigured Local Adapter",
        status: "failed",
      },
    });

    return NextResponse.json({
      success: false,
      dispatchState,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
