import { NextRequest, NextResponse } from "next/server";
import { validatePractitionerPatientAccess } from "@/features/patient-attachments/authHelper";
import { getLatestReviewedLabSummary } from "@/features/patient-labs/labRepository";
import { logSecurityEvent } from "@/lib/security/auditLogger";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const { patientId } = await params;
    
    // 1. Authenticate and check patient file assignment
    const access = await validatePractitionerPatientAccess(request, patientId);
    if (!access.authorized) {
      // Log unauthorized lab access attempt
      await logSecurityEvent({
        userId: "anonymous",
        userEmail: "unauthenticated@homeo.healthcare",
        userRole: "none",
        action: "unauthorized_lab_access_attempt",
        resource: `/api/patients/${patientId}/labs/summary`,
        status: "denied",
        timestamp: new Date().toISOString(),
        details: { patientId }
      });

      return NextResponse.json(
        { ok: false, error: { code: access.status === 401 ? "UNAUTHORIZED" : "FORBIDDEN", message: access.error } },
        { 
          status: access.status,
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" }
        }
      );
    }

    const { summary, abnormal } = await getLatestReviewedLabSummary(patientId);

    // Audit summary viewed
    await logSecurityEvent({
      userId: access.session!.uid,
      userEmail: "clinician@homeo.healthcare",
      userRole: "doctor",
      action: "lab_summary_viewed",
      resource: `/api/patients/${patientId}/labs/summary`,
      status: "success",
      timestamp: new Date().toISOString(),
      details: { patientId }
    });

    return new NextResponse(
      JSON.stringify({ success: true, summary, abnormal }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
        }
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to load lab summary." } },
      { 
        status: 500,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" }
      }
    );
  }
}
