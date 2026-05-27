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
  deliveryMode?: string;
  address?: string;
}

/**
 * Creates a patient folder in Google Drive
 */
export async function createPatientFolder(data: PatientIntakeData): Promise<{ folderId: string; folderUrl: string }> {
  const auth = getGoogleAuth();
  if (!auth) {
    return { folderId: "mock-folder-id", folderUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link" };
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
    
    const folderId = response.data.id || "";
    const folderUrl = response.data.webViewLink || "";

    if (folderId) {
      try {
        await drive.permissions.create({
          fileId: folderId,
          requestBody: {
            role: "writer",
            type: "anyone"
          }
        });
      } catch (permError) {
        console.error("Failed to share folder with anyone:", permError);
      }
    }
    
    return {
      folderId,
      folderUrl
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
    return { sheetId: "mock-sheet-id", sheetUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link" };
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

    // Share the spreadsheet so anyone with link can edit (clinicians)
    if (newSheetId) {
      try {
        await drive.permissions.create({
          fileId: newSheetId,
          requestBody: {
            role: "writer",
            type: "anyone"
          }
        });
      } catch (permError) {
        console.error("Failed to share sheet with anyone:", permError);
      }
    }

    // 2. Populate the sheet headers / patient info on sheet load
    if (newSheetId) {
      const locationVal = data.deliveryMode
        ? (data.deliveryMode === "shipping" 
            ? `${data.address || "N/A"}, ${data.city}, ${data.state}, ${data.country}` 
            : data.deliveryMode === "walkin" 
              ? "Walk-in Clinic Pickup (Baner, Pune)" 
              : "Self-Arranged Pickup (Baner Clinic, Pune)")
        : `${data.city}, ${data.state}, ${data.country}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId: newSheetId,
        range: "Sheet1!A1:B11",
        valueInputOption: "RAW",
        requestBody: {
          values: [
            ["PATIENT CLINICAL FILE", ""],
            ["Patient Name", data.name],
            ["Age / Gender", `${data.age} / ${data.gender}`],
            ["Contact Phone", data.phone],
            ["Email Address", data.email],
            ["Delivery Option", data.deliveryMode || "Courier Shipping"],
            ["Location / Address", locationVal],
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
    const locationVal = data.deliveryMode
      ? (data.deliveryMode === "shipping" ? `${data.city}, ${data.state}` : `N/A (${data.deliveryMode})`)
      : `${data.city}, ${data.state}`;

    const rowValues = [
      data.id,
      data.name,
      data.age,
      data.gender,
      data.phone,
      data.email,
      locationVal,
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

/**
 * Appends the AI diagnostics report to the patient's individual clinical sheet
 */
export async function appendAiReportToClinicalSheet(
  sheetId: string,
  aiReport: string
): Promise<void> {
  const auth = getGoogleAuth();
  if (!auth) {
    console.warn("Google API Auth missing. Skipping AI Report export to Google Sheets.");
    return;
  }

  const sheets = google.sheets({ version: "v4", auth });

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "Sheet1!A13:B17",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          ["AI CLINICAL DIAGNOSTICS REPORT", ""],
          ["Generated Engine", "Gemini 3.5 Clinical Synthesis"],
          ["Analysis Timestamp", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
          ["", ""],
          ["Clinical Findings & Repertorization Summary", aiReport]
        ]
      }
    });
  } catch (error) {
    console.error("Error writing AI report to patient Google Sheet:", error);
    throw error;
  }
}

/**
 * Parses and extracts Google Spreadsheet ID from a URL or raw ID
 */
export function extractSpreadsheetId(urlOrId: string): string {
  if (!urlOrId) return "";
  if (urlOrId.includes("docs.google.com/spreadsheets")) {
    const match = urlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : urlOrId;
  }
  return urlOrId.trim();
}

/**
 * Fetches patient rows from an existing Google Sheet on Drive
 */
export async function getPatientRowsFromSheet(spreadsheetId: string): Promise<any[][]> {
  const auth = getGoogleAuth();
  if (!auth || spreadsheetId.startsWith("mock-")) {
    console.warn("Operating in mock mode or mock ID provided. Returning simulated sheet rows.");
    const headers = ["Name", "Age", "Gender", "Email", "Phone", "City", "State", "Complaint", "Rubrics"];
    
    // Simulate specific patient file based on ID or name
    if (spreadsheetId === "mock-file-1" || spreadsheetId.includes("aarav")) {
      return [
        headers,
        ["Aarav Mehta", "45", "Male", "aarav.mehta@example.com", "+91 98765 43210", "Mumbai", "Maharashtra", "Chronic migraine with throbbing pain, worse in sun.", "Headache (3); Migraine (2)"]
      ];
    }
    if (spreadsheetId === "mock-file-2" || spreadsheetId.includes("priya")) {
      return [
        headers,
        ["Priya Sharma", "32", "Female", "priya.sharma@example.com", "+91 87654 32109", "Pune", "Maharashtra", "Acid reflux and bloating after fatty food.", "GERD (3); Bloating (2)"]
      ];
    }
    if (spreadsheetId === "mock-file-3" || spreadsheetId.includes("rohan")) {
      return [
        headers,
        ["Rohan Das", "29", "Male", "rohan.das@example.com", "+91 76543 21098", "Kolkata", "West Bengal", "Dry cough and shortness of breath in morning.", "Cough (3); Asthma (2)"]
      ];
    }
    if (spreadsheetId === "mock-file-4" || spreadsheetId.includes("ananya")) {
      return [
        headers,
        ["Ananya Pandey", "25", "Female", "ananya.pandey@gmail.com", "+91 98888 77777", "Mumbai", "Maharashtra", "Skin acne breakout and eczema with intense itching, worse at night.", "Eczema (3); Acne (2)"]
      ];
    }
    if (spreadsheetId === "mock-file-5" || spreadsheetId.includes("siddharth")) {
      return [
        headers,
        ["Siddharth Malhotra", "34", "Male", "sid.malhotra@gmail.com", "+91 98111 22222", "Delhi", "Delhi", "Chronic knee pain and joint stiffness, worse during wet cold weather.", "Joint stiffness (3); Rheumatism (2)"]
      ];
    }
    if (spreadsheetId === "mock-file-6" || spreadsheetId.includes("kriti")) {
      return [
        headers,
        ["Kriti Sanon", "31", "Female", "kriti.sanon@gmail.com", "+91 98333 44444", "Mumbai", "Maharashtra", "Insomnia, high anxiety, and heart palpitations under stress.", "Insomnia (3); Anxiety (3); Palpitations (2)"]
      ];
    }
    if (spreadsheetId === "mock-file-7" || spreadsheetId.includes("varun")) {
      return [
        headers,
        ["Varun Dhawan", "35", "Male", "varun.dhawan@gmail.com", "+91 98555 66666", "Mumbai", "Maharashtra", "Frequent throat irritation, hoarseness of voice, and dry cough.", "Hoarseness (3); Cough (2)"]
      ];
    }
    if (spreadsheetId === "mock-file-8" || spreadsheetId.includes("deepika")) {
      return [
        headers,
        ["Deepika Padukone", "38", "Female", "deepika.p@gmail.com", "+91 98777 88888", "Bangalore", "Karnataka", "Severe tension headaches, beginning at occiput, spreading forward.", "Headache (3); Tension (2)"]
      ];
    }
    
    // Default fallback list
    return [
      headers,
      ["Aarav Mehta", "45", "Male", "aarav.mehta@example.com", "+91 98765 43210", "Mumbai", "Maharashtra", "Chronic migraine with throbbing pain, worse in sun.", "Headache (3); Migraine (2)"],
      ["Priya Sharma", "32", "Female", "priya.sharma@example.com", "+91 87654 32109", "Pune", "Maharashtra", "Acid reflux and bloating after fatty food.", "GERD (3); Bloating (2)"],
      ["Rohan Das", "29", "Male", "rohan.das@example.com", "+91 76543 21098", "Kolkata", "West Bengal", "Dry cough and shortness of breath in morning.", "Cough (3); Asthma (2)"]
    ];
  }

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:Z200"
    });

    let rows = response.data.values;
    if (!rows || rows.length === 0) {
      // Fallback: try getting first sheet values without specifying sheet name
      const spreadsheetInfo = await sheets.spreadsheets.get({ spreadsheetId });
      const firstSheetName = spreadsheetInfo.data.sheets?.[0]?.properties?.title || "A1:Z200";
      const fallbackResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${firstSheetName}!A1:Z200`
      });
      rows = fallbackResponse.data.values;
    }

    if (!rows || rows.length === 0) {
      throw new Error("No data found in spreadsheet.");
    }
    return rows;
  } catch (error: any) {
    console.error("Error fetching rows from Google Sheet:", error);
    throw new Error(error.message || "Failed to fetch Google Sheet rows. Make sure the ID is correct and shared.");
  }
}

/**
 * Exposes the configured Google Service Account client email for sharing purposes
 */
export function getServiceAccountEmail(): string {
  const serviceAccountKeyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKeyJson) return "";
  try {
    const credentials = JSON.parse(serviceAccountKeyJson);
    return credentials.client_email || "";
  } catch {
    return "";
  }
}

/**
 * Detects if a URL or ID is a Google Drive Folder
 */
export function isGoogleDriveFolder(urlOrId: string): boolean {
  if (!urlOrId) return false;
  return urlOrId.includes("drive.google.com/drive/folders") || urlOrId.includes("drive.google.com/drive/u/0/folders") || urlOrId.includes("drive.google.com/open?id=");
}

/**
 * Extracts folder ID from a URL or raw ID
 */
export function extractFolderId(urlOrId: string): string {
  if (!urlOrId) return "";
  if (urlOrId.includes("drive.google.com/drive/folders") || urlOrId.includes("drive.google.com/drive/u/0/folders")) {
    const match = urlOrId.match(/\/folders\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : urlOrId;
  }
  return urlOrId.trim();
}

/**
 * Lists all files in a Google Drive folder
 */
export async function listFilesInFolder(folderId: string): Promise<any[]> {
  const auth = getGoogleAuth();
  if (!auth) {
    console.warn("Google API Auth missing. Returning mock folder files.");
    // Return a rich mock file list representing a full folder with 8 patients
    return [
      { id: "mock-file-1", name: "Aarav Mehta - Clinical Record", mimeType: "application/vnd.google-apps.spreadsheet" },
      { id: "mock-file-2", name: "Priya Sharma - Clinical Record", mimeType: "application/vnd.google-apps.spreadsheet" },
      { id: "mock-file-3", name: "Rohan Das - Clinical Record", mimeType: "application/vnd.google-apps.spreadsheet" },
      { id: "mock-file-4", name: "Ananya Pandey - Case Sheet", mimeType: "application/vnd.google-apps.spreadsheet" },
      { id: "mock-file-5", name: "Siddharth Malhotra - Homeopathy File", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
      { id: "mock-file-6", name: "Kriti Sanon - Intake Details", mimeType: "text/plain" },
      { id: "mock-file-7", name: "Varun Dhawan - Case File", mimeType: "application/pdf" },
      { id: "mock-file-8", name: "Deepika Padukone - Consultation", mimeType: "application/vnd.google-apps.document" }
    ];
  }

  const drive = google.drive({ version: "v3", auth });

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id, name, mimeType, webViewLink)",
      pageSize: 100
    });
    return response.data.files || [];
  } catch (error: any) {
    console.error("Error listing files in Google Drive folder:", error);
    throw new Error(error.message || "Failed to list folder files. Make sure the folder ID is correct and shared.");
  }
}



