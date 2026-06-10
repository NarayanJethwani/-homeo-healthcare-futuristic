import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { 
  createPatientFolder, 
  createPatientClinicalSheet, 
  appendPatientToMasterRecord,
  PatientIntakeData 
} from "@/lib/googleDrive";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Extract patient intake data
    const patientData: PatientIntakeData = {
      id: body.id || `P-${Math.floor(100000 + Math.random() * 900000)}`,
      name: body.name,
      age: String(body.age),
      gender: body.gender,
      phone: body.phone,
      email: body.email,
      city: body.city || "N/A",
      state: body.state || "N/A",
      country: body.country || "India",
      complaint: body.complaint,
      careLevel: body.careLevel || "Standard Consultation",
      conditionsCount: Number(body.conditionsCount || 1),
      durationText: body.durationText || "One-Time consultation",
      finalPrice: Number(body.finalPrice || 300),
      deliveryMode: body.deliveryMode || "shipping",
      address: body.address || "",
      receivedAmount: body.receivedAmount !== undefined ? Number(body.receivedAmount) : undefined,
      remainingBalance: body.remainingBalance !== undefined ? Number(body.remainingBalance) : undefined,
      billingCycle: body.billingCycle,
      durationValue: body.durationValue !== undefined ? Number(body.durationValue) : undefined,
      concessionApplied: body.concessionApplied,
      overridePrice: body.overridePrice !== undefined ? Number(body.overridePrice) : undefined,
      medicineAddons: body.medicineAddons !== undefined ? Number(body.medicineAddons) : undefined
    };

    console.log("Processing intake automation for patient:", patientData.name);

    console.log("Registering case intake in Firestore for:", patientData.name);
    
    let folderId = "";
    let folderUrl = "";
    let sheetId = "";
    let sheetUrl = "";
    let status = body.status || "active";
    let createdAt = new Date().toISOString();

    const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id";
    if (isFirebaseConfigured) {
      try {
        const docRef = adminDb.collection("patients").doc(patientData.id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const existingData = docSnap.data() || {};
          folderId = existingData.folderId || "";
          folderUrl = existingData.folderUrl || "";
          sheetId = existingData.sheetId || "";
          sheetUrl = existingData.sheetUrl || "";
          status = body.status || existingData.status || "active";
          createdAt = existingData.createdAt || new Date().toISOString();
        }
      } catch (err) {
        console.warn("Failed to check existing patient document in Firestore:", err);
      }
    }

    // Save to Firestore with empty folder and sheet fields (to be dynamically provisioned on-demand by the doctor)
    const patientDoc = {
      id: patientData.id,
      name: patientData.name,
      age: patientData.age,
      gender: patientData.gender,
      phone: patientData.phone,
      email: patientData.email,
      location: patientData.deliveryMode
        ? (patientData.deliveryMode === "shipping"
            ? `${patientData.address || "N/A"}, ${patientData.city}, ${patientData.state}, ${patientData.country}`
            : patientData.deliveryMode === "walkin"
              ? "Walk-in Clinic Pickup (Baner, Pune)"
              : "Self-Arranged Pickup (Baner Clinic, Pune)")
        : `${patientData.city}, ${patientData.state}, ${patientData.country}`,
      complaint: patientData.complaint,
      careLevel: patientData.careLevel,
      conditionsCount: patientData.conditionsCount,
      durationText: patientData.durationText,
      finalPrice: patientData.finalPrice,
      receivedAmount: Number(body.receivedAmount || patientData.finalPrice),
      remainingBalance: Number(body.remainingBalance || 0),
      deliveryMode: patientData.deliveryMode,
      folderId,
      folderUrl,
      sheetId,
      sheetUrl,
      assignedDoctor: body.assignedDoctor || "unassigned",
      status,
      createdAt,
      billingCycle: patientData.billingCycle || "Monthly",
      concessionApplied: patientData.concessionApplied || "None",
      durationValue: patientData.durationValue || 1
    };

    if (isFirebaseConfigured) {
      await adminDb.collection("patients").doc(patientDoc.id).set(patientDoc, { merge: true });
    } else {
      console.log("Firebase not configured or operating in mock-project-id. Skipping Firestore write.");
    }

    return NextResponse.json({
      success: true,
      message: "Patient case registered successfully in Firestore. Clinical Sheet and Folder will be dynamically provisioned on first doctor access.",
      patientId: patientDoc.id,
      folderUrl: "",
      sheetUrl: ""
    });

  } catch (error: any) {
    console.error("Intake automation failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to complete Google services integration or database sync.", 
        error: error.message || error 
      },
      { status: 500 }
    );
  }
}
