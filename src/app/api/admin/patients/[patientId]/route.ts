import { NextRequest, NextResponse } from "next/server";
import type { DocumentReference } from "firebase-admin/firestore";
import {
  forbiddenApiResponse,
  requireAdminApiSession,
  unauthorizedApiResponse,
} from "@/lib/adminApiAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { mockPatientCache } from "@/lib/mockStore";
import { normalizeRole } from "@/lib/security/rbac";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const session = await requireAdminApiSession(request, ["admin", "doctor"]);
  if (!session) return unauthorizedApiResponse();

  const { patientId } = await params;
  if (!patientId || patientId.includes("/")) {
    return NextResponse.json(
      { success: false, message: "A valid patient ID is required." },
      { status: 400 }
    );
  }

  try {
    const firebaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id"
    );
    let patient: Record<string, unknown> | undefined;
    let patientRef: DocumentReference | null = null;

    if (firebaseConfigured) {
      const firestorePatientRef = getAdminDb().collection("patients").doc(patientId);
      patientRef = firestorePatientRef;
      const snapshot = await firestorePatientRef.get();

      if (!snapshot.exists) {
        return NextResponse.json(
          { success: false, message: "Patient record not found." },
          { status: 404 }
        );
      }

      patient = snapshot.data() || {};
    } else {
      patient = mockPatientCache.get(patientId);
      if (!patient) {
        return NextResponse.json(
          { success: false, message: "Patient record not found." },
          { status: 404 }
        );
      }
    }

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient record not found." },
        { status: 404 }
      );
    }

    const isSuperAdmin = normalizeRole(session.role) === "super-admin";

    if (!isSuperAdmin && patient.assignedDoctor !== session.uid) {
      return forbiddenApiResponse("You can delete only cases assigned to you.");
    }

    if (patient.status !== "pending_plan") {
      return NextResponse.json(
        {
          success: false,
          message: "Only pending cases can be deleted. Active clinical records must be retained."
        },
        { status: 409 }
      );
    }

    if (patientRef) {
      await patientRef.delete();
    }

    mockPatientCache.delete(patientId);

    return NextResponse.json({
      success: true,
      patientId,
      workspaceRetained: true,
      message: "Pending patient record deleted. Google clinical files were retained for recovery."
    });
  } catch (error: any) {
    console.error("Failed to delete pending patient record:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete patient record." },
      { status: 500 }
    );
  }
}
