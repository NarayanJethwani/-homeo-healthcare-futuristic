import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import {
  updatePaymentQueueState,
  getPaymentQueueState,
  getInvoicePaymentRecords,
  getInvoicePaymentStatus,
  isAuthorizedStaffRole,
  type ActorContext,
  type ManualPaymentQueueState,
} from "@/lib/manualPaymentWorkflow";

export async function GET(request: NextRequest) {
  try {
    const invoiceId = request.nextUrl.searchParams.get("invoiceId") || "INV-2026-001";
    const queueState = getPaymentQueueState(invoiceId);
    const records = getInvoicePaymentRecords(invoiceId);
    const paymentStatus = getInvoicePaymentStatus(invoiceId);

    return NextResponse.json(
      {
        success: true,
        data: {
          invoiceId,
          queueState,
          paymentStatus,
          records,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `Internal Server Error: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeRequest(request, "PAYMENT_MANAGE" as any, "MANUAL_PAYMENT_QUEUE_UPDATE");
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
    const { invoiceId, newState } = body;

    if (!invoiceId || !newState) {
      return NextResponse.json(
        { success: false, error: "Validation Error: Missing invoiceId or newState." },
        { status: 400 }
      );
    }

    const result = updatePaymentQueueState(invoiceId, newState as ManualPaymentQueueState, actor);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.statusCode || 400 }
      );
    }

    return NextResponse.json({ success: true, data: { invoiceId, queueState: result.state } }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `Internal Server Error: ${err.message}` },
      { status: 500 }
    );
  }
}
