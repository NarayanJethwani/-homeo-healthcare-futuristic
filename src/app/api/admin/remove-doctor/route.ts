import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/remove-doctor
 *
 * Admin-only: deletes/removes a doctor from the system.
 *   1. Deletes the doctor from Firebase Auth (if configured)
 *   2. Deletes the user profile in Firestore (users/{uid})
 *   3. Deletes the doctor workspace metadata in Firestore (doctors/{uid})
 *   NOTE: Patient documents are preserved (assignedDoctor remains the doctor's UID)
 *
 * Body:
 *   doctorUid - The doctor's Firebase UID
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeRequest(request, "USER_MANAGE", "REMOVE_DOCTOR_API_POST");
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { doctorUid } = body;

    if (!doctorUid) {
      return NextResponse.json(
        { success: false, message: "doctorUid is required." },
        { status: 400 }
      );
    }

    const isFirebaseConfigured =
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id";

    if (isFirebaseConfigured) {
      const { getAdminAuth, getAdminDb } = await import("@/lib/firebaseAdmin");

      // 1. Delete from Firebase Auth
      try {
        await getAdminAuth().deleteUser(doctorUid);
        console.log(`Successfully deleted auth user: ${doctorUid}`);
      } catch (authErr: any) {
        console.warn(`Could not delete Auth user ${doctorUid} (it may not exist):`, authErr.message);
      }

      // 2. Delete Firestore documents
      const batch = getAdminDb().batch();
      batch.delete(getAdminDb().collection("users").doc(doctorUid));
      batch.delete(getAdminDb().collection("doctors").doc(doctorUid));
      await batch.commit();
      console.log(`Successfully deleted Firestore docs for: ${doctorUid}`);
    } else {
      console.log("[MOCK] Would remove doctor:", doctorUid);
    }

    return NextResponse.json({
      success: true,
      message: "Doctor successfully removed from the system. Patient records preserved.",
      doctorUid,
    });
  } catch (error: any) {
    console.error("remove-doctor error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to remove doctor." },
      { status: 500 }
    );
  }
}
