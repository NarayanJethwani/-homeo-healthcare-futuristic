import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { getManualPaymentAuditEvents } from "@/lib/manualPaymentWorkflow";

export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeRequest(request, "OBSERVABILITY_VIEW" as any, "MANUAL_PAYMENT_AUDIT_GET");
    const auditLogs = getManualPaymentAuditEvents();
    return NextResponse.json({ success: true, data: auditLogs }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `Internal Server Error: ${err.message}` },
      { status: 500 }
    );
  }
}
