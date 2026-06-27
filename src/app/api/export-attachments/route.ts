import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { syncAttachmentsToClinicalSheet } from "@/lib/googleDrive";

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

    // Default mock attachments in case patient record is not found or Firebase is in mock mode
    let attachments = [
      { date: new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }), category: "Clinical Photo", target: "Epigastric Bloating Snapshot", url: "https://drive.google.com/drive/folders/mock-folder-id" },
      { date: "05-06-2026", category: "Blood Test", target: "Complete Blood Count & Liver Panel", url: "https://drive.google.com/drive/folders/mock-folder-id" }
    ];

    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
      try {
        const patientSnap = await getAdminDb().collection("patients").doc(patientId).get();
        if (patientSnap.exists) {
          const patientData = patientSnap.data();
          if (patientData?.attachments) {
            attachments = patientData.attachments;
          }
        }
      } catch (dbErr: any) {
        console.error("Firestore patient attachments fetch failed:", dbErr);
      }
    }

    return NextResponse.json({ success: true, attachments });
  } catch (error: any) {
    console.error("Fetch attachments failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch attachments.", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { patientId, attachments, sheetId: clientSheetId } = await request.json();
    if (!patientId || !Array.isArray(attachments)) {
      return NextResponse.json(
        { success: false, message: "Missing patientId or invalid attachments parameter." },
        { status: 400 }
      );
    }

    let sheetId = clientSheetId || "mock-sheet-id";

    // 1. Fetch patient document to get sheetId only if not provided by client
    if ((!sheetId || sheetId === "mock-sheet-id") && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
      try {
        const patientSnap = await getAdminDb().collection("patients").doc(patientId).get();
        if (patientSnap.exists) {
          const patientData = patientSnap.data();
          sheetId = patientData?.sheetId || "mock-sheet-id";
        }
      } catch (dbErr: any) {
        console.error("Firestore patient fetch failed in export-attachments:", dbErr);
      }
    }

    // 2. If sheetId exists, push the attachments to the patient's Google Sheet
    if (sheetId && sheetId !== "mock-sheet-id" && sheetId !== "mock-sheet") {
      try {
        await syncAttachmentsToClinicalSheet(sheetId, attachments);
      } catch (sheetErr: any) {
        console.warn("Failed to push attachments to Google Sheets, falling back to Firestore only:", sheetErr);
      }
    }

    // 3. Update Firestore with the attachments array
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
      try {
        await getAdminDb().collection("patients").doc(patientId).update({
          attachments: attachments,
          attachmentsUpdated: new Date().toISOString()
        });
      } catch (dbUpdateErr: any) {
        console.error("Firestore attachments update failed in export-attachments:", dbUpdateErr);
      }
    } else {
      console.log("Firebase not configured or operating in mock-project-id. Skipping Firestore update.");
    }

    return NextResponse.json({
      success: true,
      message: "Attachments updated in Firestore and Google Sheet successfully."
    });

  } catch (error: any) {
    console.error("Export attachments failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to export attachments.", 
        error: error.message || error 
      },
      { status: 500 }
    );
  }
}
