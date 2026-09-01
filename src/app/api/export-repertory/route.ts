import { NextRequest, NextResponse } from "next/server";
import { syncRepertoryToClinicalSheet } from "@/lib/googleDrive";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function extractSpreadsheetId(input?: string): string {
  if (!input) return "";
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/) || input.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  if (input.startsWith("http")) return "";
  return input;
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminApiSession(request);
    if (!session) return unauthorizedApiResponse();

    const { patientId, rubrics, remedies, sheetId: clientSheetId, sheetUrl: clientSheetUrl } = await request.json();
    if (!patientId || !rubrics || !Array.isArray(rubrics)) {
      return NextResponse.json(
        { success: false, message: "Missing patientId or invalid rubrics parameter." },
        { status: 400 }
      );
    }

    let sheetId = extractSpreadsheetId(clientSheetId) || extractSpreadsheetId(clientSheetUrl) || "";

    // 1. Fetch patient document to get sheetId / sheetUrl if not provided or mock
    if ((!sheetId || sheetId === "mock-sheet-id") && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
      try {
        const { getAdminDb } = await import("@/lib/firebaseAdmin");
        const patientSnap = await getAdminDb().collection("patients").doc(patientId).get();
        if (patientSnap.exists) {
          const patientData = patientSnap.data();
          sheetId = extractSpreadsheetId(patientData?.sheetId) || extractSpreadsheetId(patientData?.sheetUrl) || "mock-sheet-id";
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
            message: "Failed to update Google Sheets. Make sure sheet credentials and tab permissions are correct.", 
            error: sheetErr.message || String(sheetErr) 
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
