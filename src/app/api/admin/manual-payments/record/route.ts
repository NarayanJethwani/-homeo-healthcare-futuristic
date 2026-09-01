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
      paymentMethod,
      referenceNumber,
      evidenceReference,
      notes,
    } = body;

    const { getAdminDb } = await import("@/lib/firebaseAdmin");
    const invoiceReference = getAdminDb().collection("invoices").doc(String(invoiceId || ""));
    const invoiceSnapshot = await invoiceReference.get();
    let invoice = invoiceSnapshot.exists ? (invoiceSnapshot.data() as { patientId?: string; grandTotal?: number; status?: string }) : null;
    if (!invoice) {
      invoice = {
        patientId,
        grandTotal: amountPaise ? amountPaise / 100 : 0,
        status: "Pending",
      };
      await invoiceReference.set({
        ...invoice,
        id: invoiceId,
        invoiceNo: invoiceId,
        createdAt: new Date().toISOString(),
      });
    }
    if (invoice.patientId && invoice.patientId !== patientId) {
      return NextResponse.json({ success: false, error: "The selected patient does not match this invoice." }, { status: 422 });
    }
    if (invoice.status === "Paid") {
      return NextResponse.json({ success: false, error: "This invoice is already marked paid." }, { status: 409 });
    }
    const expectedInvoiceTotalPaise = Math.round(Number(invoice.grandTotal || 0) * 100) || amountPaise;
    if (!expectedInvoiceTotalPaise) {
      return NextResponse.json({ success: false, error: "Invoice total is invalid." }, { status: 422 });
    }

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

    // Keep the queue workflow and the finance ledger separate: collection totals
    // come only from durable payment receipts, never invoice display status.
    const receiptData = JSON.parse(JSON.stringify({
      ...result.record,
      createdAt: new Date().toISOString(),
    }));
    await getAdminDb().collection("paymentReceipts").doc(result.record!.paymentId).set(receiptData);
    await invoiceReference.update({ status: "Paid", paidAt: result.record!.receivedAt, paymentReceiptId: result.record!.paymentId, paymentMode: result.record!.paymentMethod });
    const { recordClinicalActivity } = await import("@/lib/clinicalOperations");
    await recordClinicalActivity({ type: "payment.recorded", title: "Payment recorded", detail: `${result.record!.invoiceId} · ₹${(result.record!.amountPaise / 100).toLocaleString("en-IN")}`, patientId: result.record!.patientId, actor: { id: actor.actorId, name: auth.authorized ? auth.session.name : actor.actorId, role: actor.role } });

    return NextResponse.json({ success: true, data: result.record }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `Internal Server Error: ${err.message}` },
      { status: 500 }
    );
  }
}
