import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { activateCareOrder } from "@/lib/careActivation";
import { isAuthorizedStaffRole, type ActorContext } from "@/lib/manualPaymentWorkflow";

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeRequest(request, "PAYMENT_MANAGE" as any, "MANUAL_PAYMENT_ACTIVATE_CARE");
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
        { success: false, error: "Unauthorized: Active Staff session required for care activation." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { careOrderId, patientId, invoiceId, agreementAccepted, billingDocumentExists } = body;

    if (!careOrderId || !patientId || !invoiceId) {
      return NextResponse.json(
        { success: false, error: "Validation Error: Missing careOrderId, patientId, or invoiceId." },
        { status: 400 }
      );
    }

    const result = activateCareOrder({
      careOrderId,
      patientId,
      invoiceId,
      agreementAccepted: Boolean(agreementAccepted),
      billingDocumentExists: Boolean(billingDocumentExists),
      actorId: actor.actorId,
      actorRole: actor.role,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 422 }
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
