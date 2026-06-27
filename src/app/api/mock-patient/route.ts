import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { mockPatientCache } from "@/lib/mockStore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Patient ID is required." }, { status: 400 });
    }

    // 1. Check in-memory store (local demo mode fallback)
    if (mockPatientCache.has(id)) {
      console.log(`Serving patient ${id} from in-memory cache`);
      return NextResponse.json({ success: true, patient: mockPatientCache.get(id) });
    }

    // 2. Query Firestore if configured
    try {
      const db = getAdminDb();
      const docRef = db.collection("patients").doc(id);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        console.log(`Serving patient ${id} from Firestore`);
        return NextResponse.json({ success: true, patient: docSnap.data() });
      }
    } catch (dbErr: any) {
      console.warn(`Firestore lookup failed for patient ${id}: ${dbErr.message}`);
    }

    return NextResponse.json({ success: false, message: "Patient not found." }, { status: 404 });
  } catch (error: any) {
    console.error("Mock Patient API failed:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to retrieve patient data.",
      error: error.message || error
    }, { status: 500 });
  }
}
