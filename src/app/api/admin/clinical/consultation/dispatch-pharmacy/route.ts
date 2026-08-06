import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";

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
    } = await req.json();

    if (!body.prescriptionId || !body.consultationId || !body.patientId) {
      return NextResponse.json(
        { error: "Invalid parameters: prescriptionId, consultationId, and patientId are required." },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();

    // Decoupled Pharmacy Dispatch Adapter Status (Truthfully reports adapter-ready / unconfigured status)
    const auditEvent = {
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
        status: "failed", // Decoupled: failure does NOT roll back completed consultation
      },
    };

    console.log(`[Audit] prescription_dispatch_requested logged for rx=${body.prescriptionId}`);

    return NextResponse.json({
      success: false,
      dispatchState: {
        status: "failed",
        requestedAt: timestamp,
        providerName: "Unconfigured Local Adapter",
        errorMessage: "Pharmacy dispatch provider is unconfigured. Consultation completion remains preserved.",
      },
      auditEvent,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
