import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { syncConfigDbToClinicalSheet } from "@/lib/googleDrive";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    if (!patientId) {
      return NextResponse.json(
        { success: false, message: "Missing patientId parameter." },
        { status: 400 }
      );
    }

    // Default configuration database if not found in Firestore or in mock mode
    let configDb = {
      remedies: [
        "Nux Vomica", "Arsenicum Album", "Lycopodium Clavatum", "Pulsatilla Pratensis", 
        "Sulphur", "Rhus Toxicodendron", "Bryonia Alba", "Calcarea Carbonica", 
        "Silicea", "Natrum Muriaticum", "Ignatia Amara", "Sepia Officinalis"
      ],
      potencies: ["6C", "30C", "200C", "1M", "10M", "50M", "CM", "LM1", "LM2", "LM5", "LM10", "LM30"],
      miasms: ["Psora", "Sycosis", "Syphilis", "Tubercular", "Cancerinic"],
      locations: ["Baner Clinic, Pune", "Koregaon Park Clinic, Pune", "Mumbai OPD"],
      doctors: ["Dr. Narayan Jethwani", "Dr. R. Jethwani"],
      packages: [
        { name: "Standard Consult", price: 300 },
        { name: "Acute Care Plan", price: 1500 },
        { name: "3-Month Chronic", price: 4500 },
        { name: "6-Month Advanced", price: 8500 },
        { name: "1-Year Premium", price: 15000 }
      ]
    };

    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
      try {
        const patientSnap = await adminDb.collection("patients").doc(patientId).get();
        if (patientSnap.exists) {
          const patientData = patientSnap.data();
          if (patientData?.configDb) {
            configDb = patientData.configDb;
          }
        }
      } catch (dbErr: any) {
        console.error("Firestore patient configDb fetch failed:", dbErr);
      }
    }

    return NextResponse.json({ success: true, configDb });
  } catch (error: any) {
    console.error("Fetch Config DB failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch Config DB.", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { patientId, configDb, sheetId: clientSheetId } = await request.json();
    if (!patientId || !configDb) {
      return NextResponse.json(
        { success: false, message: "Missing patientId or configDb parameter." },
        { status: 400 }
      );
    }

    let sheetId = clientSheetId || "mock-sheet-id";

    // 1. Fetch patient document to get sheetId only if not provided by client
    if ((!sheetId || sheetId === "mock-sheet-id") && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
      try {
        const patientSnap = await adminDb.collection("patients").doc(patientId).get();
        if (patientSnap.exists) {
          const patientData = patientSnap.data();
          sheetId = patientData?.sheetId || "mock-sheet-id";
        }
      } catch (dbErr: any) {
        console.error("Firestore patient fetch failed in export-config:", dbErr);
      }
    }

    // 2. If sheetId exists, push the config values to the patient's Google Sheet
    if (sheetId && sheetId !== "mock-sheet-id" && sheetId !== "mock-sheet") {
      try {
        await syncConfigDbToClinicalSheet(sheetId, configDb);
      } catch (sheetErr: any) {
        console.warn("Failed to push Config DB to Google Sheets, falling back to Firestore only:", sheetErr);
      }
    }

    // 3. Update Firestore with the configDb object
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
      try {
        await adminDb.collection("patients").doc(patientId).update({
          configDb: configDb,
          configDbUpdated: new Date().toISOString()
        });
      } catch (dbUpdateErr: any) {
        console.error("Firestore configDb update failed in export-config:", dbUpdateErr);
      }
    } else {
      console.log("Firebase not configured or operating in mock-project-id. Skipping Firestore update.");
    }

    return NextResponse.json({
      success: true,
      message: "Config DB updated in Firestore and Google Sheet successfully."
    });

  } catch (error: any) {
    console.error("Export Config DB failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to export Config DB.", 
        error: error.message || error 
      },
      { status: 500 }
    );
  }
}
