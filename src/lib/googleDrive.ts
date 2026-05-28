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
    const folderUrl = response.data.webViewLink || (folderId ? `https://drive.google.com/drive/folders/${folderId}` : "");

    if (folderId) {
      try {
        const emails = ["narayan.jethwani@gmail.com", "narayan.jethwani@homeo.healthcare"];
        for (const email of emails) {
          try {
            await drive.permissions.create({
              fileId: folderId,
              sendNotificationEmail: false,
              requestBody: {
                role: "writer",
                type: "user",
                emailAddress: email
              }
            });
          } catch (eErr) {
            console.warn(`Failed to share folder with ${email}:`, eErr);
          }
        }
      } catch (permError) {
        console.error("Failed to share folder with doctors:", permError);
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
    const mockUrl = `/admin/mock-sheet?name=${encodeURIComponent(data.name)}&id=${encodeURIComponent(data.id)}&age=${encodeURIComponent(data.age)}&gender=${encodeURIComponent(data.gender)}&phone=${encodeURIComponent(data.phone)}&email=${encodeURIComponent(data.email || "")}&complaint=${encodeURIComponent(data.complaint)}&careLevel=${encodeURIComponent(data.careLevel)}&durationText=${encodeURIComponent(data.durationText)}&finalPrice=${encodeURIComponent(data.finalPrice)}`;
    return { sheetId: "mock-sheet-id", sheetUrl: mockUrl };
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
      newSheetUrl = response.data.webViewLink || (newSheetId ? `https://docs.google.com/spreadsheets/d/${newSheetId}/edit` : "");
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
      newSheetUrl = response.data.webViewLink || (newSheetId ? `https://docs.google.com/spreadsheets/d/${newSheetId}/edit` : "");
    }

    // Share the spreadsheet only with the doctor's accounts (password-equivalent protection)
    if (newSheetId) {
      try {
        const emails = ["narayan.jethwani@gmail.com", "narayan.jethwani@homeo.healthcare"];
        for (const email of emails) {
          try {
            await drive.permissions.create({
              fileId: newSheetId,
              sendNotificationEmail: false,
              requestBody: {
                role: "writer",
                type: "user",
                emailAddress: email
              }
            });
          } catch (eErr) {
            console.warn(`Failed to share sheet with ${email}:`, eErr);
          }
        }
      } catch (permError) {
        console.error("Failed to share sheet with doctors:", permError);
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

      if (TEMPLATE_SHEET_ID) {
        // If template sheet exists, write to the standard template range
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
      } else {
        // Create the newly designed custom case-taking sheet programmatically
        const today = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
        const values = [
          ["RAMKRISHNA HOMEO HEALTHCARE - CLINICAL CASE SHEET", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["1. PATIENT DEMOGRAPHICS", "", "", "", "", ""],
          ["Patient ID", data.id, "Register Date", today, "", ""],
          ["Patient Name", data.name, "Age / Gender", `${data.age} / ${data.gender}`, "", ""],
          ["Contact Phone", data.phone, "Email Address", data.email || "N/A", "", ""],
          ["Delivery Option", data.deliveryMode || "Courier Shipping", "Location / Address", locationVal, "", ""],
          ["Recommended Tier", data.careLevel, "Billing Duration", data.durationText, "", ""],
          ["Payment Status", "Paid (Verified)", "Payment Amount", `INR ${data.finalPrice.toLocaleString("en-IN")}`, "", ""],
          ["", "", "", "", "", ""],
          ["2. CHIEF COMPLAINT & CASE ANALYSIS", "", "", "", "", ""],
          ["Chief Complaint Details", data.complaint, "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["3. CLINICAL REPERTORIZATION & RUBRICS", "", "", "", "", ""],
          ["Rubric Name", "Chapter / Location", "Remedy Grade (1/2/3)", "Clinical Notes & Key Modalities", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["4. PRESCRIPTION & TREATMENT PLAN", "", "", "", "", ""],
          ["Remedy Prescribed", "Potency & Scale", "Dosage & Frequency", "Duration & Schedule", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["5. CLINICAL PROGRESS & FOLLOW-UPS", "", "", "", "", ""],
          ["Date", "Symptom Status & Patient Report", "Prescription Adjustments", "Next Review Date", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["6. INVOICING & BILLING HISTORY", "", "", "", "", ""],
          ["Invoice No", "Date Issued", "Items Description", "Amount Paid (₹)", "Payment Mode", "Status"],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""]
        ];

        await sheets.spreadsheets.values.update({
          spreadsheetId: newSheetId,
          range: "Sheet1!A1:F49",
          valueInputOption: "RAW",
          requestBody: { values }
        });

        // Apply grid formatting, cell styling, background colors, and merges
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: newSheetId,
          requestBody: {
            requests: [
              // Column widths (A: 130px, B: 130px, C: 260px, D: 130px, E: 130px, F: 130px)
              {
                updateDimensionProperties: {
                  range: { sheetId: 0, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
                  properties: { pixelSize: 130 },
                  fields: "pixelSize"
                }
              },
              {
                updateDimensionProperties: {
                  range: { sheetId: 0, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
                  properties: { pixelSize: 130 },
                  fields: "pixelSize"
                }
              },
              {
                updateDimensionProperties: {
                  range: { sheetId: 0, dimension: "COLUMNS", startIndex: 2, endIndex: 3 },
                  properties: { pixelSize: 260 },
                  fields: "pixelSize"
                }
              },
              {
                updateDimensionProperties: {
                  range: { sheetId: 0, dimension: "COLUMNS", startIndex: 3, endIndex: 4 },
                  properties: { pixelSize: 130 },
                  fields: "pixelSize"
                }
              },
              {
                updateDimensionProperties: {
                  range: { sheetId: 0, dimension: "COLUMNS", startIndex: 4, endIndex: 5 },
                  properties: { pixelSize: 130 },
                  fields: "pixelSize"
                }
              },
              {
                updateDimensionProperties: {
                  range: { sheetId: 0, dimension: "COLUMNS", startIndex: 5, endIndex: 6 },
                  properties: { pixelSize: 130 },
                  fields: "pixelSize"
                }
              },
              // Merge cells for title header banner (A1:F1)
              {
                mergeCells: {
                  range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 6 },
                  mergeType: "MERGE_ALL"
                }
              },
              // Merge cells for Section 1 Demographics Header (A3:F3)
              {
                mergeCells: {
                  range: { sheetId: 0, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 6 },
                  mergeType: "MERGE_ALL"
                }
              },
              // Merge cells for Section 2 Complaint Header (A11:F11)
              {
                mergeCells: {
                  range: { sheetId: 0, startRowIndex: 10, endRowIndex: 11, startColumnIndex: 0, endColumnIndex: 6 },
                  mergeType: "MERGE_ALL"
                }
              },
              // Merge B12:F15 for the Chief Complaint details text area
              {
                mergeCells: {
                  range: { sheetId: 0, startRowIndex: 11, endRowIndex: 15, startColumnIndex: 1, endColumnIndex: 6 },
                  mergeType: "MERGE_ALL"
                }
              },
              // Merge cells for Section 3 Repertorization Header (A16:F16)
              {
                mergeCells: {
                  range: { sheetId: 0, startRowIndex: 15, endRowIndex: 16, startColumnIndex: 0, endColumnIndex: 6 },
                  mergeType: "MERGE_ALL"
                }
              },
              // Merge cells for Section 4 Prescription Header (A24:F24)
              {
                mergeCells: {
                  range: { sheetId: 0, startRowIndex: 23, endRowIndex: 24, startColumnIndex: 0, endColumnIndex: 6 },
                  mergeType: "MERGE_ALL"
                }
              },
              // Merge cells for Section 5 Follow-ups Header (A32:F32)
              {
                mergeCells: {
                  range: { sheetId: 0, startRowIndex: 31, endRowIndex: 32, startColumnIndex: 0, endColumnIndex: 6 },
                  mergeType: "MERGE_ALL"
                }
              },
              // Merge cells for Section 6 Billing Header (A41:F41)
              {
                mergeCells: {
                  range: { sheetId: 0, startRowIndex: 40, endRowIndex: 41, startColumnIndex: 0, endColumnIndex: 6 },
                  mergeType: "MERGE_ALL"
                }
              },
              // Styling: Header Banner (Dark Teal background #0f766e, White text, center aligned, bold)
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 15/255, green: 118/255, blue: 110/255 },
                      textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 13, bold: true, fontFamily: "Arial" },
                      horizontalAlignment: "CENTER",
                      verticalAlignment: "MIDDLE"
                    }
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
                }
              },
              // Styling: Section Banners (Light Mint background #ccfbf1, Dark Teal text #0f766e, bold)
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 204/255, green: 251/255, blue: 241/255 },
                      textFormat: { foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 }, fontSize: 10, bold: true, fontFamily: "Arial" },
                      verticalAlignment: "MIDDLE"
                    }
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
                }
              },
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 10, endRowIndex: 11, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 204/255, green: 251/255, blue: 241/255 },
                      textFormat: { foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 }, fontSize: 10, bold: true, fontFamily: "Arial" },
                      verticalAlignment: "MIDDLE"
                    }
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
                }
              },
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 15, endRowIndex: 16, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 204/255, green: 251/255, blue: 241/255 },
                      textFormat: { foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 }, fontSize: 10, bold: true, fontFamily: "Arial" },
                      verticalAlignment: "MIDDLE"
                    }
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
                }
              },
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 23, endRowIndex: 24, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 204/255, green: 251/255, blue: 241/255 },
                      textFormat: { foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 }, fontSize: 10, bold: true, fontFamily: "Arial" },
                      verticalAlignment: "MIDDLE"
                    }
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
                }
              },
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 31, endRowIndex: 32, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 204/255, green: 251/255, blue: 241/255 },
                      textFormat: { foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 }, fontSize: 10, bold: true, fontFamily: "Arial" },
                      verticalAlignment: "MIDDLE"
                    }
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
                }
              },
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 40, endRowIndex: 41, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 204/255, green: 251/255, blue: 241/255 },
                      textFormat: { foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 }, fontSize: 10, bold: true, fontFamily: "Arial" },
                      verticalAlignment: "MIDDLE"
                    }
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
                }
              },
              // Table Header Styles (Row 17, Row 25, Row 33, Row 42): Soft Grey background, bold
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 16, endRowIndex: 17, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 },
                      textFormat: { bold: true, fontSize: 9 }
                    }
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat)"
                }
              },
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 24, endRowIndex: 25, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 },
                      textFormat: { bold: true, fontSize: 9 }
                    }
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat)"
                }
              },
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 32, endRowIndex: 33, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 },
                      textFormat: { bold: true, fontSize: 9 }
                    }
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat)"
                }
              },
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 41, endRowIndex: 42, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 },
                      textFormat: { bold: true, fontSize: 9 }
                    }
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat)"
                }
              },
              // Wrap text & top alignment for chief complaint text box (B12:F15)
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 11, endRowIndex: 15, startColumnIndex: 1, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: { wrapStrategy: "WRAP", verticalAlignment: "TOP" }
                  },
                  fields: "userEnteredFormat(wrapStrategy,verticalAlignment)"
                }
              },
              // Bold label cells for demographics labels (Cols A & C, rows 4-9) and complaint label (Col A, row 12)
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 3, endRowIndex: 9, startColumnIndex: 0, endColumnIndex: 1 },
                  cell: { userEnteredFormat: { textFormat: { bold: true } } },
                  fields: "userEnteredFormat(textFormat(bold))"
                }
              },
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 3, endRowIndex: 9, startColumnIndex: 2, endColumnIndex: 3 },
                  cell: { userEnteredFormat: { textFormat: { bold: true } } },
                  fields: "userEnteredFormat(textFormat(bold))"
                }
              },
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 11, endRowIndex: 12, startColumnIndex: 0, endColumnIndex: 1 },
                  cell: { userEnteredFormat: { textFormat: { bold: true }, verticalAlignment: "TOP" } },
                  fields: "userEnteredFormat(textFormat(bold),verticalAlignment)"
                }
              },
              // Add borders around Demographics block (rows 4-9, cols A-F)
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 3, endRowIndex: 9, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      borders: {
                        top: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        bottom: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        left: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        right: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } }
                      }
                    }
                  },
                  fields: "userEnteredFormat(borders)"
                }
              },
              // Add borders around Complaint block (rows 12-15, cols A-F)
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 11, endRowIndex: 15, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      borders: {
                        top: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        bottom: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        left: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        right: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } }
                      }
                    }
                  },
                  fields: "userEnteredFormat(borders)"
                }
              },
              // Add borders for Rubrics table (rows 17-22)
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 16, endRowIndex: 22, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      borders: {
                        top: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        bottom: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        left: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        right: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } }
                      }
                    }
                  },
                  fields: "userEnteredFormat(borders)"
                }
              },
              // Add borders for Prescription table (rows 25-30)
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 24, endRowIndex: 30, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      borders: {
                        top: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        bottom: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        left: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        right: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } }
                      }
                    }
                  },
                  fields: "userEnteredFormat(borders)"
                }
              },
              // Add borders for Follow-up table (rows 33-40)
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 32, endRowIndex: 40, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      borders: {
                        top: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        bottom: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        left: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        right: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } }
                      }
                    }
                  },
                  fields: "userEnteredFormat(borders)"
                }
              },
              // Add borders for Billing table (rows 42-49)
              {
                repeatCell: {
                  range: { sheetId: 0, startRowIndex: 41, endRowIndex: 49, startColumnIndex: 0, endColumnIndex: 6 },
                  cell: {
                    userEnteredFormat: {
                      borders: {
                        top: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        bottom: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        left: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        right: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } }
                      }
                    }
                  },
                  fields: "userEnteredFormat(borders)"
                }
              }
            ]
          }
        });
      }
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

export interface InvoiceItem {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNo: string;
  date: string;
  dueDate: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  paymentMode: string;
  status: "Paid" | "Unpaid" | "Pending";
}

/**
 * Creates a beautifully formatted invoice sheet inside the patient folder
 */
export async function createInvoiceSheet(
  folderId: string,
  data: InvoiceData
): Promise<{ sheetId: string; sheetUrl: string }> {
  const auth = getGoogleAuth();
  if (!auth) {
    // Mock URL for offline testing
    const mockUrl = `/admin/invoice-preview?invoiceNo=${encodeURIComponent(data.invoiceNo)}&date=${encodeURIComponent(data.date)}&dueDate=${encodeURIComponent(data.dueDate)}&patientId=${encodeURIComponent(data.patientId)}&patientName=${encodeURIComponent(data.patientName)}&patientPhone=${encodeURIComponent(data.patientPhone || "")}&patientEmail=${encodeURIComponent(data.patientEmail || "")}&patientAddress=${encodeURIComponent(data.patientAddress || "")}&subtotal=${data.subtotal}&discount=${data.discount}&grandTotal=${data.grandTotal}&paymentMode=${encodeURIComponent(data.paymentMode)}&status=${encodeURIComponent(data.status)}&items=${encodeURIComponent(JSON.stringify(data.items))}`;
    return { sheetId: "mock-invoice-id", sheetUrl: mockUrl };
  }

  const drive = google.drive({ version: "v3", auth });
  const sheets = google.sheets({ version: "v4", auth });

  try {
    // 1. Create a brand new Google Sheet in the folder
    const response = await drive.files.create({
      requestBody: {
        name: `Invoice - ${data.invoiceNo}`,
        mimeType: "application/vnd.google-apps.spreadsheet",
        parents: [folderId]
      },
      fields: "id,webViewLink"
    });
    const sheetId = response.data.id || "";
    const sheetUrl = response.data.webViewLink || (sheetId ? `https://docs.google.com/spreadsheets/d/${sheetId}/edit` : "");

    if (!sheetId) throw new Error("Failed to create spreadsheet for invoice");

    // 2. Generate values
    const itemValues = data.items.map((item, idx) => [
      String(idx + 1),
      item.description,
      "", // placeholder for merged column C
      String(item.qty),
      `INR ${item.amount.toLocaleString("en-IN")}`
    ]);

    // Ensure we pad or limit item rows to 5 slots for clean styling
    const maxItems = 5;
    while (itemValues.length < maxItems) {
      itemValues.push([String(itemValues.length + 1), "", "", "", ""]);
    }

    const values = [
      ["RAMKRISHNA HOMEO HEALTHCARE - INVOICE", "", "", "", ""],
      ["", "", "", "", ""],
      ["INVOICE DETAILS", "", "", "PATIENT DETAILS", ""],
      ["Invoice Number", data.invoiceNo, "", "Patient ID", data.patientId],
      ["Invoice Date", data.date, "", "Patient Name", data.patientName],
      ["Due Date", data.dueDate, "", "Contact Phone", data.patientPhone || "N/A"],
      ["Payment Mode", data.paymentMode, "", "Email Address", data.patientEmail || "N/A"],
      ["Payment Status", data.status, "", "Shipping Address", data.patientAddress || "N/A"],
      ["", "", "", "", ""],
      ["Sl No", "Item Description", "", "Qty", "Amount"],
      ...itemValues,
      ["", "", "", "", ""],
      ["", "", "", "Subtotal", `INR ${data.subtotal.toLocaleString("en-IN")}`],
      ["", "", "", "Discount", `INR ${data.discount.toLocaleString("en-IN")}`],
      ["", "", "", "Grand Total", `INR ${data.grandTotal.toLocaleString("en-IN")}`],
      ["", "", "", "", ""],
      ["PAYMENT INSTRUCTIONS", "", "", "", ""],
      ["Please transfer via NEFT/IMPS to Current Account or pay via UPI:", "", "", "", ""],
      ["Bank Name", "HDFC Bank", "", "UPI ID", "ramkrishna@hdfc"],
      ["Account Name", "Ramkrishna Homeo Healthcare", "", "", ""],
      ["Account Number", "50200039742057", "", "", ""],
      ["IFSC Code", "HDFC0004793", "", "", ""],
      ["Branch Name", "Pan Card Club Road Baner, Pune", "", "", ""],
      ["", "", "", "", ""],
      ["Thank you for choosing Ramkrishna Homeo Healthcare for your healing journey.", "", "", "", ""]
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "Sheet1!A1:E27",
      valueInputOption: "RAW",
      requestBody: { values }
    });

    // 3. Style the Invoice Spreadsheet beautifully
    const stylingRequests: any[] = [
      // Column Widths (A: 60px, B: 240px, C: 40px, D: 100px, E: 160px)
      {
        updateDimensionProperties: {
          range: { sheetId: 0, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
          properties: { pixelSize: 60 },
          fields: "pixelSize"
        }
      },
      {
        updateDimensionProperties: {
          range: { sheetId: 0, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
          properties: { pixelSize: 240 },
          fields: "pixelSize"
        }
      },
      {
        updateDimensionProperties: {
          range: { sheetId: 0, dimension: "COLUMNS", startIndex: 2, endIndex: 3 },
          properties: { pixelSize: 40 },
          fields: "pixelSize"
        }
      },
      {
        updateDimensionProperties: {
          range: { sheetId: 0, dimension: "COLUMNS", startIndex: 3, endIndex: 4 },
          properties: { pixelSize: 100 },
          fields: "pixelSize"
        }
      },
      {
        updateDimensionProperties: {
          range: { sheetId: 0, dimension: "COLUMNS", startIndex: 4, endIndex: 5 },
          properties: { pixelSize: 160 },
          fields: "pixelSize"
        }
      },
      // Merges
      {
        mergeCells: {
          range: { sheetId: 0, startRowIndex: 0, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 5 },
          mergeType: "MERGE_ALL"
        }
      },
      {
        mergeCells: {
          range: { sheetId: 0, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 3 },
          mergeType: "MERGE_ALL"
        }
      },
      {
        mergeCells: {
          range: { sheetId: 0, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 3, endColumnIndex: 5 },
          mergeType: "MERGE_ALL"
        }
      },
      {
        mergeCells: {
          range: { sheetId: 0, startRowIndex: 9, endRowIndex: 10, startColumnIndex: 1, endColumnIndex: 3 },
          mergeType: "MERGE_ALL"
        }
      },
      {
        mergeCells: {
          range: { sheetId: 0, startRowIndex: 16, endRowIndex: 17, startColumnIndex: 0, endColumnIndex: 5 },
          mergeType: "MERGE_ALL"
        }
      },
      {
        mergeCells: {
          range: { sheetId: 0, startRowIndex: 17, endRowIndex: 18, startColumnIndex: 0, endColumnIndex: 5 },
          mergeType: "MERGE_ALL"
        }
      },
      {
        mergeCells: {
          range: { sheetId: 0, startRowIndex: 26, endRowIndex: 27, startColumnIndex: 0, endColumnIndex: 5 },
          mergeType: "MERGE_ALL"
        }
      }
    ];

    // Merging columns B & C for items rows (rows 11-15, zero-indexed 10-14)
    for (let i = 10; i < 15; i++) {
      stylingRequests.push({
        mergeCells: {
          range: { sheetId: 0, startRowIndex: i, endRowIndex: i + 1, startColumnIndex: 1, endColumnIndex: 3 },
          mergeType: "MERGE_ALL"
        }
      });
    }

    // Add styles and colors
    stylingRequests.push(
      // Banner row style
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 0, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 5 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 15/255, green: 118/255, blue: 110/255 },
              textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 14, bold: true },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE"
            }
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
        }
      },
      // Headers styling (row 3, indexes 2-3)
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 5 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 204/255, green: 251/255, blue: 241/255 },
              textFormat: { foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 }, bold: true, fontSize: 10 },
              verticalAlignment: "MIDDLE"
            }
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
        }
      },
      // Table Header row (row 10, index 9)
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 9, endRowIndex: 10, startColumnIndex: 0, endColumnIndex: 5 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 },
              textFormat: { bold: true, fontSize: 9 }
            }
          },
          fields: "userEnteredFormat(backgroundColor,textFormat)"
        }
      },
      // Totals section label styling
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 12, endRowIndex: 15, startColumnIndex: 3, endColumnIndex: 5 },
          cell: { userEnteredFormat: { textFormat: { bold: true } } },
          fields: "userEnteredFormat(textFormat(bold))"
        }
      },
      // Grand Total row formatting (index 14)
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 14, endRowIndex: 15, startColumnIndex: 3, endColumnIndex: 5 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 204/255, green: 251/255, blue: 241/255 },
              textFormat: { foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 }, bold: true }
            }
          },
          fields: "userEnteredFormat(backgroundColor,textFormat)"
        }
      },
      // Payment instructions title (row 17, index 16)
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 16, endRowIndex: 17, startColumnIndex: 0, endColumnIndex: 5 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 },
              textFormat: { bold: true, fontSize: 9 }
            }
          },
          fields: "userEnteredFormat(backgroundColor,textFormat)"
        }
      },
      // Bold Labels for metadata fields
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 3, endRowIndex: 8, startColumnIndex: 0, endColumnIndex: 1 },
          cell: { userEnteredFormat: { textFormat: { bold: true } } },
          fields: "userEnteredFormat(textFormat(bold))"
        }
      },
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 3, endRowIndex: 8, startColumnIndex: 3, endColumnIndex: 4 },
          cell: { userEnteredFormat: { textFormat: { bold: true } } },
          fields: "userEnteredFormat(textFormat(bold))"
        }
      },
      // Footer text center and italic
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 26, endRowIndex: 27, startColumnIndex: 0, endColumnIndex: 5 },
          cell: {
            userEnteredFormat: {
              textFormat: { italic: true, fontSize: 9, color: { red: 0.4, green: 0.4, blue: 0.4 } },
              horizontalAlignment: "CENTER"
            }
          },
          fields: "userEnteredFormat(textFormat(fontSize,italic,color),horizontalAlignment)"
        }
      },
      // General borders for items table
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 9, endRowIndex: 15, startColumnIndex: 0, endColumnIndex: 5 },
          cell: {
            userEnteredFormat: {
              borders: {
                top: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                bottom: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                left: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } },
                right: { style: "SOLID", color: { red: 0.8, green: 0.8, blue: 0.8 } }
              }
            }
          },
          fields: "userEnteredFormat(borders)"
        }
      }
    );

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: { requests: stylingRequests }
    });

    // Make the file readable by anyone with the link (so patients can open it directly)
    try {
      await drive.permissions.create({
        fileId: sheetId,
        requestBody: {
          role: "reader",
          type: "anyone"
        }
      });
    } catch (shareErr) {
      console.warn("Failed to share invoice with public read access:", shareErr);
    }

    return { sheetId, sheetUrl };
  } catch (error) {
    console.error("Error creating invoice sheet in drive:", error);
    throw error;
  }
}

/**
 * Appends the invoice billing record directly inside the patient's Clinical case sheet
 */
export async function appendInvoiceToClinicalSheet(
  sheetId: string,
  data: InvoiceData
): Promise<void> {
  const auth = getGoogleAuth();
  if (!auth) {
    console.warn("Google API Auth missing. Skipping clinical sheet invoice sync.");
    return;
  }

  const sheets = google.sheets({ version: "v4", auth });

  try {
    // 1. Fetch current values of Sheet1 to find where section 6 starts
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1!A1:F100"
    });
    
    const rows = response.data.values || [];
    let targetHeaderRowIndex = -1; // index in 0-indexed rows array
    
    for (let i = 0; i < rows.length; i++) {
      const cellVal = String(rows[i][0] || "").trim();
      if (cellVal.includes("6. INVOICING & BILLING HISTORY")) {
        targetHeaderRowIndex = i;
        break;
      }
    }

    if (targetHeaderRowIndex === -1) {
      // Fallback: If section 6 is not found, append to the bottom of the sheet
      console.warn("Section 6 not found in sheet. Appending to bottom.");
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "Sheet1!A1",
        valueInputOption: "RAW",
        requestBody: {
          values: [[
            data.invoiceNo,
            data.date,
            data.items.map(it => it.description).join(", "),
            `INR ${data.grandTotal.toLocaleString("en-IN")}`,
            data.paymentMode,
            data.status
          ]]
        }
      });
      return;
    }

    // Locate the first empty row below the headers (which start at targetHeaderRowIndex + 1)
    let insertRowIndex = targetHeaderRowIndex + 2; // Row immediately following the labels row
    
    while (insertRowIndex < rows.length) {
      const isRowEmpty = !rows[insertRowIndex] || (!rows[insertRowIndex][0] && !rows[insertRowIndex][1]);
      if (isRowEmpty) {
        break;
      }
      insertRowIndex++;
    }

    // Row numbers are 1-indexed, so insertRowIndex + 1 is the spreadsheet row index
    const sheetRange = `Sheet1!A${insertRowIndex + 1}:F${insertRowIndex + 1}`;
    const descSummary = data.items.map(it => it.description).join(", ");
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: sheetRange,
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          data.invoiceNo,
          data.date,
          descSummary,
          `INR ${data.grandTotal.toLocaleString("en-IN")}`,
          data.paymentMode,
          data.status
        ]]
      }
    });

    console.log(`Successfully synced invoice ${data.invoiceNo} into clinical sheet at range ${sheetRange}`);
  } catch (error) {
    console.error("Error appending invoice to clinical sheet:", error);
  }
}



