import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import {
  reverseManualPayment,
  isAuthorizedStaffRole,
  type ActorContext,
} from "@/lib/manualPaymentWorkflow";

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeRequest(request, "PAYMENT_MANAGE" as any, "MANUAL_PAYMENT_REVERSE");
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
    const { paymentId, reversalReason } = body;

    if (!paymentId || !reversalReason) {
      return NextResponse.json(
        { success: false, error: "Validation Error: Missing paymentId or reversalReason." },
        { status: 400 }
      );
    }

    const result = reverseManualPayment(paymentId, reversalReason, actor);

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
