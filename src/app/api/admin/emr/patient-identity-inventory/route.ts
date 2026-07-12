import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { featureFlags } from "@/features/dashboard/constants/featureFlags";
import { loadPatientIdentityInventoryReport } from "@/features/emr-identity/PatientIdentityInventoryRepository";
import { authorizePatientIdentityInventory } from "@/features/emr-identity/PatientIdentityInventoryAccessPolicy";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!featureFlags.emrPatientIdentityReconciliationEnabled) {
    const decision = authorizePatientIdentityInventory(false, null);
    return NextResponse.json({ error: "Not found." }, {
      status: decision.allowed ? 404 : decision.status,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const session = await requireAdminApiSession(request);
  if (!session) return unauthorizedApiResponse();
  const decision = authorizePatientIdentityInventory(true, session);
  if (!decision.allowed) {
    return NextResponse.json({ error: "Forbidden." }, {
      status: decision.status,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const report = await loadPatientIdentityInventoryReport();
    return NextResponse.json(report, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Unable to generate the identity inventory." }, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
