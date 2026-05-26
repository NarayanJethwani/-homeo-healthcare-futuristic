import { google } from "googleapis";

// Initialize Google Auth client using Service Account credentials
const getGoogleAuth = () => {
  const serviceAccountKeyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKeyJson) {
    console.warn("GOOGLE_SERVICE_ACCOUNT_KEY not set. Operating in mock mode.");
    return null;
  }
  try {
    const credentials = JSON.parse(serviceAccountKeyJson);
    return new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets"
      ]
    });
  } catch (error) {
    console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:", error);
    return null;
  }
};

const PARENT_DRIVE_FOLDER_ID = "1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb";
const MASTER_SHEET_ID = process.env.GOOGLE_MASTER_SHEET_ID || ""; 
const TEMPLATE_SHEET_ID = process.env.GOOGLE_TEMPLATE_SHEET_ID || ""; // standard clinical template file ID

export interface PatientIntakeData {
  id: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  country: string;
  complaint: string;
  careLevel: string;
  conditionsCount: number;
  durationText: string;
  finalPrice: number;
}

/**
 * Creates a patient folder in Google Drive
 */
export async function createPatientFolder(data: PatientIntakeData): Promise<{ folderId: string; folderUrl: string }> {
  const auth = getGoogleAuth();
  if (!auth) {
    return { folderId: "mock-folder-id", folderUrl: "https://drive.google.com/drive/folders/mock-folder" };
  }

  const drive = google.drive({ version: "v3", auth });
  
  try {
    const fileMetadata = {
      name: `${data.name} - ID ${data.id}`,
      mimeType: "application/vnd.google-apps.folder",
      parents: [PARENT_DRIVE_FOLDER_ID]
    };
    
    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id,webViewLink"
    });
    
    return {
      folderId: response.data.id || "",
      folderUrl: response.data.webViewLink || ""
    };
  } catch (error) {
    console.error("Error creating Google Drive folder:", error);
    throw error;
  }
}

/**
 * Copies the template clinical sheet into the patient's new folder
 */
export async function createPatientClinicalSheet(
  folderId: string,
  data: PatientIntakeData
): Promise<{ sheetId: string; sheetUrl: string }> {
  const auth = getGoogleAuth();
  if (!auth) {
    return { sheetId: "mock-sheet-id", sheetUrl: "https://docs.google.com/spreadsheets/d/mock-sheet" };
  }

  const drive = google.drive({ version: "v3", auth });
  const sheets = google.sheets({ version: "v4", auth });

  try {
    let newSheetId = "";
    let newSheetUrl = "";

    if (TEMPLATE_SHEET_ID) {
      // 1. Copy the template clinical sheet
      const response = await drive.files.copy({
        fileId: TEMPLATE_SHEET_ID,
        requestBody: {
          name: `${data.name} - Clinical Record`,
          parents: [folderId]
        },
        fields: "id,webViewLink"
      });
      newSheetId = response.data.id || "";
      newSheetUrl = response.data.webViewLink || "";
    } else {
      // Create a brand new empty Google Sheet inside the folder
      const response = await drive.files.create({
        requestBody: {
          name: `${data.name} - Clinical Record`,
          mimeType: "application/vnd.google-apps.spreadsheet",
          parents: [folderId]
        },
        fields: "id,webViewLink"
      });
      newSheetId = response.data.id || "";
      newSheetUrl = response.data.webViewLink || "";
    }

    // 2. Populate the sheet headers / patient info on sheet load
    if (newSheetId) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: newSheetId,
        range: "Sheet1!A1:B10",
        valueInputOption: "RAW",
        requestBody: {
          values: [
            ["PATIENT CLINICAL FILE", ""],
            ["Patient Name", data.name],
            ["Age / Gender", `${data.age} / ${data.gender}`],
            ["Contact Phone", data.phone],
            ["Email Address", data.email],
            ["Location", `${data.city}, ${data.state}, ${data.country}`],
            ["Chief Complaint", data.complaint],
            ["Recommended Tier", data.careLevel],
            ["Billing Plan Duration", data.durationText],
            ["Payment Amount", `INR ${data.finalPrice.toLocaleString("en-IN")}`]
          ]
        }
      });
    }

    return { sheetId: newSheetId, sheetUrl: newSheetUrl };
  } catch (error) {
    console.error("Error creating clinical sheet:", error);
    throw error;
  }
}

/**
 * Appends registration info to the centralized Master Record sheet
 */
export async function appendPatientToMasterRecord(
  data: PatientIntakeData,
  folderUrl: string,
  sheetUrl: string
): Promise<void> {
  const auth = getGoogleAuth();
  if (!auth || !MASTER_SHEET_ID) {
    console.warn("Google API Auth or Master Sheet ID missing. Skipping Master Record sync.");
    return;
  }

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const today = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
    const rowValues = [
      data.id,
      data.name,
      data.age,
      data.gender,
      data.phone,
      data.email,
      `${data.city}, ${data.state}`,
      data.complaint,
      data.careLevel,
      data.durationText,
      `₹${data.finalPrice.toLocaleString("en-IN")}`,
      today,
      folderUrl,
      sheetUrl,
      "Registered - Awaiting Consult"
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: MASTER_SHEET_ID,
      range: "Sheet1!A2",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [rowValues]
      }
    });
  } catch (error) {
    console.error("Error appending to Master Google Sheet:", error);
    throw error;
  }
}
