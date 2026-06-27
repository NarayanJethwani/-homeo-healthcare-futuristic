import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { mockPatientCache } from "@/lib/mockStore";

function sanitizePatientData(raw: any) {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    age: raw.age,
    gender: raw.gender,
    phone: raw.phone,
    email: raw.email,
    location: raw.location || raw.address || "",
    complaint: raw.complaint,
    careLevel: raw.careLevel,
    billingCycle: raw.billingCycle,
    durationText: raw.durationText,
    durationValue: raw.durationValue,
    conditionsCount: raw.conditionsCount,
    concessionApplied: raw.concessionApplied,
    finalPrice: raw.finalPrice,
    receivedAmount: raw.receivedAmount,
    remainingBalance: raw.remainingBalance
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !/^P-\d{6}$/.test(id)) {
      return NextResponse.json({ success: false, message: "Invalid Patient ID format." }, { status: 400 });
    }

    const headers = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
    };

    // 1. Check in-memory store (local demo mode fallback)
    if (mockPatientCache.has(id)) {
      console.log(`Serving patient ${id} from in-memory cache`);
      const patientData = mockPatientCache.get(id);
      return NextResponse.json(
        { success: true, patient: sanitizePatientData(patientData) },
        { headers }
      );
    }

    // 2. Query Firestore if configured
    try {
      const db = getAdminDb();
      const docRef = db.collection("patients").doc(id);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const patientData = docSnap.data();
        if (patientData && patientData.isMock === true) {
          console.log(`Serving patient ${id} from Firestore`);
          return NextResponse.json(
            { success: true, patient: sanitizePatientData(patientData) },
            { headers }
          );
        } else {
          return NextResponse.json(
            { success: false, message: "Access denied. Real patient records cannot be retrieved via this endpoint." },
            { status: 403 }
          );
        }
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
