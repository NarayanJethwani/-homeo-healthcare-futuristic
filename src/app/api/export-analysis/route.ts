import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { appendAiReportToClinicalSheet } from "@/lib/googleDrive";

export async function POST(request: Request) {
  try {
    const { patientId, aiReport } = await request.json();
    if (!patientId || !aiReport) {
      return NextResponse.json(
        { success: false, message: "Missing patientId or aiReport parameter." },
        { status: 400 }
      );
    }

    let sheetId = "mock-sheet-id";

    // 1. Fetch patient document to get sheetId using client-side SDK configuration
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
      const patientRef = doc(db, "patients", patientId);
      const patientSnap = await getDoc(patientRef);
      if (patientSnap.exists()) {
        const patientData = patientSnap.data();
        sheetId = patientData?.sheetId || "mock-sheet-id";
      }
    }

    // 2. If sheetId exists, push the AI Report to their Google Sheet
    if (sheetId && sheetId !== "mock-sheet-id" && sheetId !== "mock-sheet") {
      try {
        await appendAiReportToClinicalSheet(sheetId, aiReport);
      } catch (sheetErr: any) {
        console.warn("Failed to push report to Google Sheets, falling back to Firestore only:", sheetErr);
      }
    }

    // 3. Update Firestore with the AI report
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
      const patientRef = doc(db, "patients", patientId);
      await updateDoc(patientRef, {
        aiReport: aiReport,
        aiReportUpdated: new Date().toISOString()
      });
    } else {
      console.log("Firebase not configured or operating in mock-project-id. Skipping Firestore update.");
    }

    return NextResponse.json({
      success: true,
      message: "AI Clinical report exported to Firestore and linked Google Sheet successfully."
    });

  } catch (error: any) {
    console.error("Export analysis failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to export AI report.", 
        error: error.message || error 
      },
      { status: 500 }
    );
  }
}
