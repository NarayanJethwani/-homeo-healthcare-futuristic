import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import {
  recordManualPayment,
  isAuthorizedStaffRole,
  type ActorContext,
} from "@/lib/manualPaymentWorkflow";

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeRequest(request, "PAYMENT_MANAGE" as any, "MANUAL_PAYMENT_RECORD");
    let actor: ActorContext | null = null;

    if (auth.authorized && isAuthorizedStaffRole(auth.session.role)) {
      actor = { actorId: auth.session.uid, role: auth.session.role as any };
    } else if (process.env.NODE_ENV !== "production") {
      const headerActorId = request.headers.get("x-actor-id");
      const headerActorRole = request.headers.get("x-actor-role");
      if (headerActorId && headerActorRole && isAuthorizedStaffRole(headerActorRole)) {
        actor = { actorId: headerActorId, role: headerActorRole as any };
      }
    }

    if (!actor) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Active Finance or Admin staff session required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      invoiceId,
      patientId,
      amountPaise,
      expectedInvoiceTotalPaise,
      paymentMethod,
      referenceNumber,
      evidenceReference,
      notes,
    } = body;

    const result = recordManualPayment(
      {
        invoiceId,
        patientId,
        amountPaise,
        expectedInvoiceTotalPaise,
        paymentMethod,
        referenceNumber,
        evidenceReference,
        notes,
      },
      actor
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.statusCode || 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.record }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `Internal Server Error: ${err.message}` },
      { status: 500 }
    );
  }
}
