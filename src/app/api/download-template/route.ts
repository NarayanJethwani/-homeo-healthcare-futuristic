import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { createPatientClinicalSheet } from "@/lib/googleDrive";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const getGoogleAuth = () => {
  let serviceAccountKeyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKeyJson) return null;
  try {
    serviceAccountKeyJson = serviceAccountKeyJson.trim();
    if (
      (serviceAccountKeyJson.startsWith("'") && serviceAccountKeyJson.endsWith("'")) ||
      (serviceAccountKeyJson.startsWith('"') && serviceAccountKeyJson.endsWith('"'))
    ) {
      serviceAccountKeyJson = serviceAccountKeyJson.slice(1, -1);
    }
    const credentials = JSON.parse(serviceAccountKeyJson);
    
    // Replace double-escaped newlines with real newlines for PEM format
    const privateKey = credentials.private_key.replace(/\\n/g, "\n");
    
    return new google.auth.JWT({
      email: credentials.client_email,
      key: privateKey,
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets"
      ]
    });
  } catch (error) {
    console.error("Auth error in download route:", error);
    return null;
  }
};

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdminApiSession(request);
    if (!session) return unauthorizedApiResponse();

    const auth = getGoogleAuth();
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Google Drive API Auth credentials not configured." },
        { status: 500 }
      );
    }

    const drive = google.drive({ version: "v3", auth });

    // 1. Determine the template spreadsheet ID
    let spreadsheetId = process.env.GOOGLE_TEMPLATE_SHEET_ID || "";
    let isCached = !!spreadsheetId;

    const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";

    // 2. If not in env, check Firestore cache
    if (!spreadsheetId && !isMockProject) {
      try {
        const { getAdminDb } = await import("@/lib/firebaseAdmin");
        const settingsSnap = await getAdminDb().collection("settings").doc("google_sheets").get();
        if (settingsSnap.exists) {
          spreadsheetId = settingsSnap.data()?.templateSheetId || "";
          if (spreadsheetId) {
            console.log("Using template spreadsheet ID cached in Firestore:", spreadsheetId);
            isCached = true;
          }
        }
      } catch (fErr) {
        console.warn("Could not read from settings collection in Firestore:", fErr);
      }
    }

    // 3. If still no spreadsheetId, generate a template on-the-fly and cache it
    if (!spreadsheetId) {
      console.log("No template sheet found. Generating a new template clinical sheet in Google Drive...");
      
      const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID || "1vQY0-CEAPtRHdXd4tiBdb5mDV-APxsWE";
      
      // Override template env temporarily to bypass copy mechanism
      const origTemplateId = process.env.GOOGLE_TEMPLATE_SHEET_ID;
      process.env.GOOGLE_TEMPLATE_SHEET_ID = "";

      const templateData = {
        id: "P-TEMPLATE",
        name: "Clinical Record Template",
        age: "30",
        gender: "Male",
        phone: "+91 00000 00000",
        email: "template@homeo.healthcare",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        complaint: "Template patient complaint. Modalities, generals, physicals, and diagnoses will be filled here.",
        careLevel: "Core Chronic Care",
        conditionsCount: 1,
        durationText: "3-Month Plan",
        finalPrice: 4500,
        receivedAmount: 4500,
        remainingBalance: 0,
        deliveryMode: "pickup"
      };

      try {
        const result = await createPatientClinicalSheet(parentFolderId, templateData);
        spreadsheetId = result.sheetId;

        // Restore original env variable
        process.env.GOOGLE_TEMPLATE_SHEET_ID = origTemplateId;

        // Save to Firestore settings
        if (!isMockProject && spreadsheetId) {
          try {
            const { getAdminDb } = await import("@/lib/firebaseAdmin");
            await getAdminDb().collection("settings").doc("google_sheets").set({
              templateSheetId: spreadsheetId,
              createdAt: new Date().toISOString()
            }, { merge: true });
            console.log("Cached generated template sheet ID in Firestore:", spreadsheetId);
          } catch (sErr) {
            console.warn("Could not cache template sheet ID in Firestore settings:", sErr);
          }
        }
      } catch (createErr: any) {
        console.error("Failed to generate template sheet on-the-fly:", createErr);
        return NextResponse.json(
          { success: false, message: "Failed to generate template sheet on-the-fly.", error: createErr.message || createErr },
          { status: 500 }
        );
      }
    }

    if (!spreadsheetId) {
      return NextResponse.json(
        { success: false, message: "Template spreadsheet ID could not be resolved." },
        { status: 500 }
      );
    }

    console.log(`Exporting Google Sheet ID: ${spreadsheetId} to Excel (.xlsx)...`);

    // 4. Export the Google Sheet to Microsoft Excel format (.xlsx)
    const response = await drive.files.export({
      fileId: spreadsheetId,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }, {
      responseType: "arraybuffer"
    });

    const fileBuffer = response.data as ArrayBuffer;

    // 5. Stream the response back as a download
    const headers = new Headers();
    headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    headers.set("Content-Disposition", `attachment; filename="clinical_record_template.xlsx"`);
    
    // Add extra headers to help client save/understand state
    headers.set("X-Template-ID", spreadsheetId);
    headers.set("X-Template-Source", isCached ? "cached" : "generated");

    return new Response(fileBuffer, {
      status: 200,
      headers
    });

  } catch (error: any) {
    console.error("Failed to export template sheet:", error);
    return NextResponse.json(
      { success: false, message: "Failed to export Excel template.", error: error.message || error },
      { status: 500 }
    );
  }
}
