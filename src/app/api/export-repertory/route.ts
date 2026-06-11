import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { syncRepertoryToClinicalSheet, RepertoryExportRubric } from "@/lib/googleDrive";

export async function POST(request: Request) {
  try {
    const { patientId, rubrics, remedies, sheetId: clientSheetId } = await request.json();
    if (!patientId || !rubrics || !Array.isArray(rubrics)) {
      return NextResponse.json(
        { success: false, message: "Missing patientId or invalid rubrics parameter." },
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
        console.error("Firestore patient fetch failed in export-repertory:", dbErr);
      }
    }

    // 2. If it is a real Google Sheet, push the repertory matrix values to the sheet
    if (sheetId && sheetId !== "mock-sheet-id" && sheetId !== "mock-sheet") {
      try {
        await syncRepertoryToClinicalSheet(sheetId, rubrics, remedies);
      } catch (sheetErr: any) {
        console.error("Failed to push repertory rubrics to Google Sheets:", sheetErr);
        return NextResponse.json(
          { 
            success: false, 
            message: "Failed to update Google Sheets. Make sure credentials are correct.", 
            error: sheetErr.message || sheetErr 
          },
          { status: 500 }
        );
      }
    } else {
      console.log("No real Google Sheet associated with this patient. Operating in mock mode.");
    }

    return NextResponse.json({
      success: true,
      message: "Repertory rubrics synchronized to Google Sheet successfully."
    });

  } catch (error: any) {
    console.error("Export repertory failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to export repertory rubrics.", 
        error: error.message || error 
      },
      { status: 500 }
    );
  }
}
