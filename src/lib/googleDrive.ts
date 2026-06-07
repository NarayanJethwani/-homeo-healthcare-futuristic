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

const PARENT_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID || "1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb";
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
  receivedAmount?: number;
  remainingBalance?: number;
  billingCycle?: "weekly" | "monthly";
  durationValue?: number;
  concessionApplied?: string;
  overridePrice?: number;
  medicineAddons?: number;
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
      fields: "id,webViewLink",
      supportsAllDrives: true
    });
    
    const folderId = response.data.id || "";
    const folderUrl = response.data.webViewLink || (folderId ? `https://drive.google.com/drive/folders/${folderId}` : "");

    if (folderId) {
      try {
        const emails = ["narayan.jethwani@gmail.com", "narayan.jethwani@homeo.healthcare"];
        const sharePromises = emails.map(email =>
          drive.permissions.create({
            fileId: folderId,
            sendNotificationEmail: false,
            supportsAllDrives: true,
            requestBody: {
              role: "writer",
              type: "user",
              emailAddress: email
            }
          }).catch(eErr => {
            console.warn(`Failed to share folder with ${email}:`, eErr);
          })
        );
        await Promise.all(sharePromises);
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
        fields: "id,webViewLink",
        supportsAllDrives: true
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
        fields: "id,webViewLink",
        supportsAllDrives: true
      });
      newSheetId = response.data.id || "";
      newSheetUrl = response.data.webViewLink || (newSheetId ? `https://docs.google.com/spreadsheets/d/${newSheetId}/edit` : "");
    }

    // Share the spreadsheet only with the doctor's accounts (password-equivalent protection)
    if (newSheetId) {
      try {
        const emails = ["narayan.jethwani@gmail.com", "narayan.jethwani@homeo.healthcare"];
        const sharePromises = emails.map(email =>
          drive.permissions.create({
            fileId: newSheetId,
            sendNotificationEmail: false,
            supportsAllDrives: true,
            requestBody: {
              role: "writer",
              type: "user",
              emailAddress: email
            }
          }).catch(eErr => {
            console.warn(`Failed to share sheet with ${email}:`, eErr);
          })
        );
        await Promise.all(sharePromises);
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
        // If template sheet exists, write to standard template tabs
        try {
          await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: newSheetId,
            requestBody: {
              valueInputOption: "USER_ENTERED",
              data: [
                {
                  range: "'Dashboard'!B5:B11",
                  values: [
                    [data.id],
                    [data.name],
                    [`${data.age} / ${data.gender}`],
                    ["Active"],
                    [data.phone],
                    [data.email],
                    [locationVal]
                  ]
                },
                {
                  range: "'Case Taking'!B4:B9",
                  values: [
                    [data.id],
                    [data.name],
                    [`${data.age} / ${data.gender}`],
                    [data.phone],
                    [data.email],
                    [locationVal]
                  ]
                }
              ]
            }
          });
        } catch (err) {
          console.warn("Failed to populate template sheet, writing fallback to Sheet1:", err);
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
      } else {
        // Create the newly designed custom case-taking tabs programmatically
        // 1. Rename Sheet1 to Dashboard, and add the remaining 8 sheets
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: newSheetId,
          requestBody: {
            requests: [
              {
                updateSheetProperties: {
                  properties: {
                    sheetId: 0,
                    title: "Dashboard"
                  },
                  fields: "title"
                }
              },
              { addSheet: { properties: { sheetId: 1, title: "Case Taking" } } },
              { addSheet: { properties: { sheetId: 2, title: "Follow-Up Tracker" } } },
              { addSheet: { properties: { sheetId: 3, title: "Repertorization" } } },
              { addSheet: { properties: { sheetId: 4, title: "Treatment Planner" } } },
              { addSheet: { properties: { sheetId: 7, title: "Finance" } } },
              { addSheet: { properties: { sheetId: 8, title: "AI Repertory Lab" } } },
              { addSheet: { properties: { sheetId: 5, title: "Reports & Attachments" } } },
              { addSheet: { properties: { sheetId: 6, title: "Config DB" } } }
            ]
          }
        });

        // Define sheet ids mapping directly without spreadsheets.get call to optimize performance
        const sheetsMap: { [title: string]: number } = {
          "Dashboard": 0,
          "Case Taking": 1,
          "Follow-Up Tracker": 2,
          "Repertorization": 3,
          "Treatment Planner": 4,
          "Finance": 7,
          "AI Repertory Lab": 8,
          "Reports & Attachments": 5,
          "Config DB": 6
        };

        // 2. Populate values across different tabs
        const today = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });

        // values for Dashboard (formatted as columns: A-B for Demographics, C spacing, D-E for Active Treatment, F spacing, G-H for Outcomes & Ledger)
        const dashboardValues = [
          ["HOMEO HEALTHCARE - PATIENT CLINICAL DASHBOARD", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", ""],
          ["PATIENT DEMOGRAPHICS", "", "", "ACTIVE TREATMENT", "", "", "OUTCOMES & LEDGER", ""],
          ["Patient ID", data.id, "", "Diagnosis", "='Case Taking'!B112", "", "Progress Score (%)", "=IFERROR(INDEX('Follow-Up Tracker'!C:C, MATCH(9.99999999999999E+307, 'Follow-Up Tracker'!A:A)), \"0%\")"],
          ["Patient Name", data.name, "", "Current Remedy", "='Case Taking'!B137", "", "Balance Due (₹)", "='Finance'!C4"],
          ["Age / Gender", `${data.age} / ${data.gender}`, "", "Last Visit Date", "=IFERROR(MAX('Follow-Up Tracker'!A4:A), \"N/A\")", "", "Top Totality Remedy", "='Repertorization'!B16"],
          ["Contact Phone", data.phone, "", "Next Scheduled Review", "=IFERROR(INDEX('Follow-Up Tracker'!G:G, MATCH(9.99999999999999E+307, 'Follow-Up Tracker'!A:A)), \"Not Scheduled\")", "", "Miasmatic Summary", "=IFERROR('AI Repertory Lab'!B4, \"Psora\")"],
          ["Email Address", data.email || "N/A", "", "Consulting Doctor", "Dr. Narayan Jethwani", "", "Psora Count", "='Case Taking'!B117"],
          ["Location / Address", locationVal, "", "Clinic Branch", "Baner Clinic, Pune", "", "Sycosis Count", "='Case Taking'!B118"],
          ["", "", "", "", "", "", "Syphilis Count", "='Case Taking'!B119"],
          ["", "", "", "", "", "", "Tubercular Count", "='Case Taking'!B120"],
          ["", "", "", "", "", "", "Cancerinic Count", "='Case Taking'!B121"]
        ];

        // values for Case Taking
        const caseTakingValues = Array(151).fill(null).map(() => Array(4).fill(""));
        caseTakingValues[0][0] = "CLINICAL CASE SHEET (MAIN INTENDED WORKING DOCUMENT)";
        // Section 1 Patient Details
        caseTakingValues[2][0] = "SECTION 1 – PATIENT DETAILS (COLLAPSIBLE)";
        caseTakingValues[3][0] = "Patient ID"; caseTakingValues[3][1] = data.id;
        caseTakingValues[4][0] = "Patient Name"; caseTakingValues[4][1] = data.name;
        caseTakingValues[5][0] = "Age / Gender"; caseTakingValues[5][1] = `${data.age} / ${data.gender}`;
        caseTakingValues[6][0] = "Contact Phone"; caseTakingValues[6][1] = data.phone;
        caseTakingValues[7][0] = "Email Address"; caseTakingValues[7][1] = data.email || "N/A";
        caseTakingValues[8][0] = "Location / Address"; caseTakingValues[8][1] = locationVal;
        caseTakingValues[9][0] = "Register Date"; caseTakingValues[9][1] = today;

        // Section 2 Chief Complaints
        caseTakingValues[14][0] = "SECTION 2 – CHIEF COMPLAINTS";
        caseTakingValues[15][0] = "Main Complaint"; caseTakingValues[15][1] = data.complaint;
        caseTakingValues[16][0] = "Duration"; caseTakingValues[16][1] = data.durationText || "Chronic";
        caseTakingValues[17][0] = "Onset Mode"; caseTakingValues[17][1] = "Gradual";
        caseTakingValues[18][0] = "Progress"; caseTakingValues[18][1] = "Progressive";

        // Section 3 Presenting Symptoms
        caseTakingValues[25][0] = "SECTION 3 – PRESENTING SYMPTOMS (TOTALITY OF SYMPTOMS)";
        caseTakingValues[26][0] = "Location / Extension"; caseTakingValues[26][1] = "";
        caseTakingValues[27][0] = "Sensation / Character"; caseTakingValues[27][1] = "";
        caseTakingValues[28][0] = "Modalities Better (Ameliorations)"; caseTakingValues[28][1] = "";
        caseTakingValues[29][0] = "Modalities Worse (Aggravations)"; caseTakingValues[29][1] = "";
        caseTakingValues[30][0] = "Concomitant Symptoms"; caseTakingValues[30][1] = "";
        caseTakingValues[31][0] = "Etiology / Causes"; caseTakingValues[31][1] = "";
        caseTakingValues[32][0] = "Maintaining Causes"; caseTakingValues[32][1] = "";

        // Section 4 Mental Generals
        caseTakingValues[35][0] = "SECTION 4 – MENTAL GENERALS";
        caseTakingValues[36][0] = "Temperament Type"; caseTakingValues[36][1] = "Choleretic";
        caseTakingValues[37][0] = "Fears / Phobias"; caseTakingValues[37][1] = "Fears dark, heights [Psora]";
        caseTakingValues[38][0] = "Anxiety levels"; caseTakingValues[38][1] = "High anticipatory anxiety [Psora]";
        caseTakingValues[39][0] = "Anger & Reaction"; caseTakingValues[39][1] = "Suppressed anger, turns silent [Sycosis]";
        caseTakingValues[40][0] = "Grief / Depression"; caseTakingValues[40][1] = "Long-term grief, does not weep [Sycosis]";
        caseTakingValues[41][0] = "Memory & Concentration"; caseTakingValues[41][1] = "Forgetful, loses thread [Psora]";

        // Section 5 Physical Generals
        caseTakingValues[50][0] = "SECTION 5 – PHYSICAL GENERALS";
        caseTakingValues[51][0] = "Appetite & Hunger"; caseTakingValues[51][1] = "Good, eats fast";
        caseTakingValues[52][0] = "Thirst"; caseTakingValues[52][1] = "Thirsty for small quantities [Ars]";
        caseTakingValues[53][0] = "Food Desires"; caseTakingValues[53][1] = "Sweets, spicy foods [Psora]";
        caseTakingValues[54][0] = "Food Aversions"; caseTakingValues[54][1] = "Milk [Psora]";
        caseTakingValues[55][0] = "Thermal State"; caseTakingValues[55][1] = "Very Chilly [Psora]";
        caseTakingValues[56][0] = "Perspiration"; caseTakingValues[56][1] = "Profuse on forehead [Psora]";
        caseTakingValues[57][0] = "Sleep & Dreams"; caseTakingValues[57][1] = "Restless sleep, dreams of falling [Psora]";
        caseTakingValues[58][0] = "Energy Levels"; caseTakingValues[58][1] = "Worse in morning";

        // Section 6 Past History
        caseTakingValues[70][0] = "SECTION 6 – PAST MEDICAL HISTORY";
        caseTakingValues[71][0] = "Major Illnesses"; caseTakingValues[71][1] = "Typhoid in childhood";
        caseTakingValues[72][0] = "Surgeries / Hospitalizations"; caseTakingValues[72][1] = "Appendectomy at age 22";
        caseTakingValues[73][0] = "Allergies / Drug Reactions"; caseTakingValues[73][1] = "Allergic to Penicillin";

        // Section 7 Family History
        caseTakingValues[85][0] = "SECTION 7 – FAMILY HISTORY";
        caseTakingValues[86][0] = "Maternal Side"; caseTakingValues[86][1] = "Mother has Diabetes";
        caseTakingValues[87][0] = "Paternal Side"; caseTakingValues[87][1] = "Father has Hypertension";

        // Section 8 Investigations
        caseTakingValues[100][0] = "SECTION 8 – LABORATORY & IMAGING INVESTIGATIONS";
        caseTakingValues[101][0] = "HbA1c"; caseTakingValues[101][1] = "";
        caseTakingValues[102][0] = "Thyroid Panel (TSH)"; caseTakingValues[102][1] = "";
        caseTakingValues[103][0] = "Other Key Findings"; caseTakingValues[103][1] = "";

        // Section 9 Clinical Diagnosis
        caseTakingValues[110][0] = "SECTION 9 – CLINICAL DIAGNOSIS";
        caseTakingValues[111][0] = "Primary Clinical Diagnosis"; caseTakingValues[111][1] = "Chronic GERD / Acidity";

        // Section 10 Miasmatic Assessment
        caseTakingValues[115][0] = "SECTION 10 – MIASMATIC ASSESSMENT";
        caseTakingValues[116][0] = "Psora Score"; caseTakingValues[116][1] = "=COUNTIF(A3:D110, \"*[Psora]*\")";
        caseTakingValues[117][0] = "Sycosis Score"; caseTakingValues[117][1] = "=COUNTIF(A3:D110, \"*[Sycosis]*\")";
        caseTakingValues[118][0] = "Syphilis Score"; caseTakingValues[118][1] = "=COUNTIF(A3:D110, \"*[Syphilis]*\")";
        caseTakingValues[119][0] = "Tubercular Score"; caseTakingValues[119][1] = "=COUNTIF(A3:D110, \"*[Tubercular]*\")";
        caseTakingValues[120][0] = "Cancerinic Score"; caseTakingValues[120][1] = "=COUNTIF(A3:D110, \"*[Cancerinic]*\")";

        // Section 11 Totality Summary
        caseTakingValues[125][0] = "SECTION 11 – TOTALITY SUMMARY & AI SYNTHESIS";
        caseTakingValues[126][0] = "Constitutional Totality"; caseTakingValues[126][1] = "Chilly patient, stomach complaints worse after food, anxious temperament.";

        // Section 12 Prescription
        caseTakingValues[135][0] = "SECTION 12 – PRESCRIPTION & ADVICE";
        caseTakingValues[136][0] = "Remedy Prescribed"; caseTakingValues[136][1] = "Nux Vomica";
        caseTakingValues[137][0] = "Potency & Scale"; caseTakingValues[137][1] = "30C";
        caseTakingValues[138][0] = "Dosage & Frequency"; caseTakingValues[138][1] = "4 pills, twice daily";
        caseTakingValues[139][0] = "Duration"; caseTakingValues[139][1] = "14 Days";
        caseTakingValues[140][0] = "Dietary Advice"; caseTakingValues[140][1] = "Avoid coffee and camphor";

        // values for Follow-Up Tracker
        const followUpValues = [
          ["CLINICAL FOLLOW-UP TRACKER", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["Date", "Symptoms & Patient Report", "Improvement %", "Remedy Prescribed", "Potency", "Assessment & Pathology", "Next Follow-up"],
          [today, "Case initialized. Demographics and baseline complaint registered.", "0%", "Nux Vomica", "30C", "Baseline status. Patient is very chilly with severe post-meal burning.", "2 weeks later"]
        ];

        // values for Repertorization
        const repertoryValues = [
          ["REPERTORY GRID & Dynamic ANALYSIS MATRIX", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["Rubric Name", "Chapter / Location", "Source", "Importance Weight", "Nux-v", "Lyc", "Ars", "Puls", "Sulph", "Rhus-t", "Calc", "Sil", "Nat-m", "Ign", "Sep", "Totality Score"],
          ["Acidity - eating, post", "Stomach", "Kent", 3, 3, 2, 3, 1, 2, 1, 1, 0, 0, 0, 0, "=$D4*SUM(E4:O4)"],
          ["Irritability - eating, post", "Mind", "Kent", 2, 2, 3, 1, 2, 2, 1, 0, 0, 0, 0, 0, "=$D5*SUM(E5:O5)"],
          ["Generalities - Chilly", "Generalities", "Kent", 3, 3, 1, 3, 0, 1, 3, 3, 2, 1, 0, 1, "=$D6*SUM(E6:O6)"],
          ["Clinical - Burnout / Adrenal Fatigue [Sycosis]", "Clinical", "Jethwani", 3, 3, 2, 2, 1, 2, 1, 3, 2, 2, 2, 2, "=$D7*SUM(E7:O7)"],
          ["Mind - Hurry - constant", "Mind", "Custom", 2, 2, 1, 3, 1, 1, 2, 1, 1, 2, 3, 1, "=$D8*SUM(E8:O8)"],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["Symptom Coverage", "", "", "", "=COUNTIFS(E4:E8, \">0\") / 5", "=COUNTIFS(F4:F8, \">0\") / 5", "=COUNTIFS(G4:G8, \">0\") / 5", "=COUNTIFS(H4:H8, \">0\") / 5", "=COUNTIFS(I4:I8, \">0\") / 5", "=COUNTIFS(J4:J8, \">0\") / 5", "=COUNTIFS(K4:K8, \">0\") / 5", "=COUNTIFS(L4:L8, \">0\") / 5", "=COUNTIFS(M4:M8, \">0\") / 5", "=COUNTIFS(N4:N8, \">0\") / 5", "=COUNTIFS(O4:O8, \">0\") / 5"],
          ["Sum of Grades", "", "", "", "=SUMPRODUCT(E4:E8, $D$4:$D$8)", "=SUMPRODUCT(F4:F8, $D$4:$D$8)", "=SUMPRODUCT(G4:G8, $D$4:$D$8)", "=SUMPRODUCT(H4:H8, $D$4:$D$8)", "=SUMPRODUCT(I4:I8, $D$4:$D$8)", "=SUMPRODUCT(J4:J8, $D$4:$D$8)", "=SUMPRODUCT(K4:K8, $D$4:$D$8)", "=SUMPRODUCT(L4:L8, $D$4:$D$8)", "=SUMPRODUCT(M4:M8, $D$4:$D$8)", "=SUMPRODUCT(N4:N8, $D$4:$D$8)", "=SUMPRODUCT(O4:O8, $D$4:$D$8)"],
          ["Totality Rank Score", "", "", "", "=(E11*100) + E12", "=(F11*100) + F12", "=(G11*100) + G12", "=(H11*100) + H12", "=(I11*100) + I12", "=(J11*100) + J12", "=(K11*100) + K12", "=(L11*100) + L12", "=(M11*100) + M12", "=(N11*100) + N12", "=(O11*100) + O12"],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["Top Remedy Ranking", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["Rank 1", "=INDEX($E$3:$O$3, MATCH(MAX(E13:O13), E13:O13, 0))", "Score", "=MAX(E13:O13)", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["Rank 2", "=INDEX($E$3:$O$3, MATCH(LARGE(E13:O13, 2), E13:O13, 0))", "Score", "=LARGE(E13:O13, 2)", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["Rank 3", "=INDEX($E$3:$O$3, MATCH(LARGE(E13:O13, 3), E13:O13, 0))", "Score", "=LARGE(E13:O13, 3)", "", "", "", "", "", "", "", "", "", "", "", ""]
        ];

        // values for Treatment Planner (adjusted for exact row indices to prevent circular references)
        const plannerValues = [
          ["TREATMENT COMPLEXITY & FINANCIAL PLANNER", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["Care Level", "Billing Cycle", "Duration Value", "Conditions Count", "Concession Applied", "Override Price (₹)", "Medicine Add-ons (₹)"],
          [data.careLevel || "Deep Systemic Care", data.billingCycle || "monthly", data.durationValue || 1, data.conditionsCount || 1, data.concessionApplied || "None", data.overridePrice || 0, data.medicineAddons || 0],
          ["", "", "", "", "", "", ""],
          ["PRICING BREAKDOWN", "", "", "", "", "", ""],
          ["Component", "Rate / Amount (₹)", "Calculation Description", "", "", "", ""],
          ["Base Rate", `=IF(ISNUMBER(SEARCH("Acute", A4)), IF(B4="Weekly", 1000, 3500), IF(ISNUMBER(SEARCH("Standard", A4)), IF(B4="Weekly", 2000, 7500), IF(ISNUMBER(SEARCH("Deep", A4)), IF(B4="Weekly", 3500, 12500), IF(ISNUMBER(SEARCH("Advanced", A4)), IF(B4="Weekly", 5000, 18500), IF(ISNUMBER(SEARCH("Multisystem", A4)), IF(B4="Weekly", 7000, 25000), 3500)))))`, "Base rate based on Care Level and Billing Cycle", "", "", ""],
          ["Conditions Surcharge", `=IF(D4<=1, 0, IF(ISNUMBER(SEARCH("Acute", A4)), IF(B4="Weekly", IF(D4=2, 300, 600), IF(D4=2, 1000, 2000)), IF(ISNUMBER(SEARCH("Standard", A4)), IF(B4="Weekly", IF(D4=2, 500, 1000), IF(D4=2, 1500, 3000)), IF(ISNUMBER(SEARCH("Deep", A4)), IF(B4="Weekly", IF(D4=2, 800, 1600), IF(D4=2, 2500, 5000)), IF(ISNUMBER(SEARCH("Advanced", A4)), IF(B4="Weekly", IF(D4=2, 1200, 2400), IF(D4=2, 3500, 7000)), IF(B4="Weekly", IF(D4=2, 1500, 3000), IF(D4=2, 4500, 9000)))))))`, "Surcharge for co-existing chronic conditions", "", "", ""],
          ["Gross Subtotal", "=(B8+B9)*C4", "Adjusted base rate multiplied by duration", "", "", "", ""],
          ["Duration Discount %", `=IF(IF(B4="Weekly", C4, C4*4)>=48, 0.30, IF(IF(B4="Weekly", C4, C4*4)>=24, 0.25, IF(IF(B4="Weekly", C4, C4*4)>=12, 0.20, IF(IF(B4="Weekly", C4, C4*4)>=8, 0.15, IF(IF(B4="Weekly", C4, C4*4)>=4, 0.10, IF(IF(B4="Weekly", C4, C4*4)>=2, 0.05, 0))))))`, "Duration loyalty discount percentage", "", "", "", ""],
          ["Duration Discount Amount", "=B10*B11", "Total savings from duration discount", "", "", "", ""],
          ["Concession Discount Amount", `=IF(ISNUMBER(SEARCH("Senior", E4)), (B10-B12)*0.15, IF(ISNUMBER(SEARCH("Socio", E4)), (B10-B12)*0.30, IF(ISNUMBER(SEARCH("Override", E4)), MAX(0, (B10-B12) - F4), 0)))`, "Compassionate, Senior, or Override concession", "", "", "", ""],
          ["Medicine Add-ons", "=G4", "Medicine charges and dynamic add-on scripts", "", "", "", ""],
          ["Total Program Cost", "=B10-B12-B13+B14", "Final package cost taking all factors into consideration", "", "", "", ""],
          ["Amount Received", data.receivedAmount !== undefined ? data.receivedAmount : data.finalPrice, "Amount collected from patient for this plan", "", "", "", ""],
          ["Balance Due", "=B15-B16", "Outstanding dues for this treatment plan", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["WhatsApp Invoice Message", `="Dear " & 'Case Taking'!B5 & ", thank you for consulting Homeo Healthcare. Your treatment package is: " & A4 & " (" & C4 & " " & IF(B4="Weekly","weeks","months") & " commit, " & D4 & " condition(s) " & IF(E4="None","", "[" & E4 & "]") & "). Total Cost: ₹" & B15 & ". Amount Paid: ₹" & B16 & ". Balance Due: ₹" & B17 & ". Please pay using UPI: narayan.jethwani@homeo.healthcare. Clinic Branch: Baner, Pune."`, "", "", "", "", ""]
        ];

        // values for Finance
        const financeValues = [
          ["PATIENT ACCOUNT FINANCE LEDGER & REVENUE SUMMARY", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", ""],
          ["Total Billed (₹)", "Total Collected (₹)", "Outstanding Balance (₹)", "", "", "", "", ""],
          ["=SUM(D8:D100)", "=SUM(E8:E100)", "=A4-B4", "", "", "", "", ""],
          ["", "", "", "", "", "", "", ""],
          ["TRANSACTION HISTORY RECORD", "", "", "", "", "", "", ""],
          ["Date", "Description / Event", "Reference ID", "Amount Charged (₹)", "Amount Received (₹)", "Outstanding Balance (₹)", "Payment Method", "Payment Status"],
          [today, "Initial package setup charge", "Tx-Plan-" + data.id, "='Treatment Planner'!B15", "='Treatment Planner'!B16", "=D8-E8", "UPI", `=IF(F8<=0, "Paid", IF(E8>0, "Partially Paid", "Unpaid"))`],
          ["", "Follow-up Consultation / Refill", "FU-Refill", 0, 0, "=D9-E9", "", ""],
          ["", "", "", "", "", "", "", ""]
        ];

        // values for AI Repertory Lab
        const aiRepertoryValues = [
          ["AI REPERTORY LAB & NEURAL TOTALITY MATCHING MATRIX", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", ""],
          ["SPREADSHEET REPERTORY PAYLOAD & MIASM VECTORS", "", "", "", "CLINICAL DIAGNOSTIC SYNTHESIS VERDICT", "", "", ""],
          ["Dominant Miasm", `=IF('Case Taking'!B118>MAX('Case Taking'!B117,'Case Taking'!B119,'Case Taking'!B120,'Case Taking'!B121),"Sycosis",IF('Case Taking'!B117>MAX('Case Taking'!B118,'Case Taking'!B119,'Case Taking'!B120,'Case Taking'!B121),"Psora",IF('Case Taking'!B119>MAX('Case Taking'!B117,'Case Taking'!B118,'Case Taking'!B120,'Case Taking'!B121),"Syphilis",IF('Case Taking'!B120>MAX('Case Taking'!B117,'Case Taking'!B118,'Case Taking'!B119,'Case Taking'!B121),"Tubercular","Cancerinic"))))`, "", "", "AI Constitutional Justification & Totality Synthesis Report", "", "", ""],
          ["Psora Count", "='Case Taking'!B117", "", "", `=IFERROR('Case Taking'!B131, "No AI Analysis Run yet. Transmit from portal to generate.")`, "", "", ""],
          ["Sycosis Count", "='Case Taking'!B118", "", "", "", "", "", ""],
          ["Syphilis Count", "='Case Taking'!B119", "", "", "", "", "", ""],
          ["Tubercular Count", "='Case Taking'!B120", "", "", "", "", "", ""],
          ["Cancerinic Count", "='Case Taking'!B121", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", ""],
          ["TOP REMEDY RANKINGS FROM SPREADSHEET MATRIX", "", "", "", "MATERIA MEDICA KEYNOTE VERIFICATIONS", "", "", ""],
          ["Rank 1 Remedy", "='Repertorization'!B16", "Score", "='Repertorization'!D16", "Nux Vomica:", "Chilly, irritable, stomach complaints worse after eating.", "", ""],
          ["Rank 2 Remedy", "='Repertorization'!B17", "Score", "='Repertorization'!D17", "Arsenicum Album:", "Great anxiety, restlessness, chilly, worse at midnight.", "", ""],
          ["Rank 3 Remedy", "='Repertorization'!B18", "Score", "='Repertorization'!D18", "Lycopodium Clavatum:", "Right-sided, flatulence, gas, warm food cravings.", "", ""]
        ];

        // values for Reports & Attachments
        const attachmentsValues = [
          ["INVESTIGATION REPORTS & CLINICAL FILE ATTACHMENTS", "", "", ""],
          ["", "", "", ""],
          ["Report Date", "Report Category", "Investigation Target", "Report Hyperlink"],
          [today, "Clinical Photo", "Initial Skin / Face Snapshot", `https://drive.google.com/drive/folders/${folderId}`]
        ];

        // values for Config DB
        const configValues = [
          ["REFERENCE METADATA DATABASE", "", "", "", "PACKAGES", "PRICE"],
          ["", "", "", "", "", ""],
          ["REMEDIES", "POTENCIES", "MIASMS", "DOCTORS", "Standard Consult", 300],
          ["Nux Vomica", "6C", "Psora", "Dr. Narayan Jethwani", "Acute Care Plan", 1500],
          ["Arsenicum Album", "30C", "Sycosis", "Dr. R. Jethwani", "3-Month Chronic", 4500],
          ["Lycopodium Clavatum", "200C", "Syphilis", "", "6-Month Advanced", 8500],
          ["Pulsatilla Pratensis", "1M", "Tubercular", "", "1-Year Premium", 15000],
          ["Sulphur", "10M", "Cancerinic", "", "", ""],
          ["Rhus Toxicodendron", "50M", "", "", "", ""],
          ["Bryonia Alba", "CM", "", "", "", ""],
          ["Calcarea Carbonica", "LM1", "", "", "", ""],
          ["Silicea", "LM2", "", "", "", ""],
          ["Natrum Muriaticum", "LM5", "", "", "", ""],
          ["Ignatia Amara", "LM10", "", "", "", ""],
          ["Sepia Officinalis", "LM30", "", "", "", ""]
        ];

        // Batch update sheet values
        await sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: newSheetId,
          requestBody: {
            valueInputOption: "USER_ENTERED",
            data: [
              { range: "'Dashboard'!A1:H12", values: dashboardValues },
              { range: "'Case Taking'!A1:D151", values: caseTakingValues },
              { range: "'Follow-Up Tracker'!A1:G4", values: followUpValues },
              { range: "'Repertorization'!A1:P18", values: repertoryValues },
              { range: "'Treatment Planner'!A1:G21", values: plannerValues },
              { range: "'Finance'!A1:H10", values: financeValues },
              { range: "'AI Repertory Lab'!A1:H14", values: aiRepertoryValues },
              { range: "'Reports & Attachments'!A1:D4", values: attachmentsValues },
              { range: "'Config DB'!A1:F15", values: configValues }
            ]
          }
        });

        // Apply grid formatting for columns, borders, merges across all tabs
        const requests = [];

        // Formatting for Dashboard (sheetId = Dashboard)
        const dashId = sheetsMap["Dashboard"] || 0;
        requests.push(
          // Hide gridlines
          {
            updateSheetProperties: {
              properties: {
                sheetId: dashId,
                gridProperties: {
                  hideGridlines: true
                }
              },
              fields: "gridProperties.hideGridlines"
            }
          },
          // Canvas background color (#F1F5F9)
          {
            repeatCell: {
              range: {
                sheetId: dashId,
                startRowIndex: 0,
                endRowIndex: 100,
                startColumnIndex: 0,
                endColumnIndex: 8
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 }
                }
              },
              fields: "userEnteredFormat.backgroundColor"
            }
          },
          // Update dimension properties for A-H columns
          {
            updateDimensionProperties: {
              range: { sheetId: dashId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
              properties: { pixelSize: 140 }, fields: "pixelSize"
            }
          },
          {
            updateDimensionProperties: {
              range: { sheetId: dashId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
              properties: { pixelSize: 190 }, fields: "pixelSize"
            }
          },
          {
            updateDimensionProperties: {
              range: { sheetId: dashId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 },
              properties: { pixelSize: 20 }, fields: "pixelSize" // Spacing C
            }
          },
          {
            updateDimensionProperties: {
              range: { sheetId: dashId, dimension: "COLUMNS", startIndex: 3, endIndex: 4 },
              properties: { pixelSize: 140 }, fields: "pixelSize"
            }
          },
          {
            updateDimensionProperties: {
              range: { sheetId: dashId, dimension: "COLUMNS", startIndex: 4, endIndex: 5 },
              properties: { pixelSize: 190 }, fields: "pixelSize"
            }
          },
          {
            updateDimensionProperties: {
              range: { sheetId: dashId, dimension: "COLUMNS", startIndex: 5, endIndex: 6 },
              properties: { pixelSize: 20 }, fields: "pixelSize" // Spacing F
            }
          },
          {
            updateDimensionProperties: {
              range: { sheetId: dashId, dimension: "COLUMNS", startIndex: 6, endIndex: 7 },
              properties: { pixelSize: 140 }, fields: "pixelSize"
            }
          },
          {
            updateDimensionProperties: {
              range: { sheetId: dashId, dimension: "COLUMNS", startIndex: 7, endIndex: 8 },
              properties: { pixelSize: 190 }, fields: "pixelSize"
            }
          },
          // Merge Title Header A1:H1
          {
            mergeCells: {
              range: { sheetId: dashId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
              mergeType: "MERGE_ALL"
            }
          },
          // Header style
          {
            repeatCell: {
              range: { sheetId: dashId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 15/255, green: 76/255, blue: 129/255 }, // Medical Blue #0F4C81
                  textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 13, bold: true },
                  horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                }
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
            }
          },
          // Merge Card Headers: PATIENT DEMOGRAPHICS (A3:B3), ACTIVE TREATMENT (D3:E3), OUTCOMES & LEDGER (G3:H3)
          {
            mergeCells: {
              range: { sheetId: dashId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 2 },
              mergeType: "MERGE_ALL"
            }
          },
          {
            mergeCells: {
              range: { sheetId: dashId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 3, endColumnIndex: 5 },
              mergeType: "MERGE_ALL"
            }
          },
          {
            mergeCells: {
              range: { sheetId: dashId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 6, endColumnIndex: 8 },
              mergeType: "MERGE_ALL"
            }
          },
          // Format Card Headers
          {
            repeatCell: {
              range: { sheetId: dashId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 8 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 }, // Slate-200 #E2E8F0
                  textFormat: { foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 }, fontSize: 10, bold: true },
                  horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                }
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
            }
          },
          // Card 1 Keys (Col A, rows 4-9)
          {
            repeatCell: {
              range: { sheetId: dashId, startRowIndex: 3, endRowIndex: 9, startColumnIndex: 0, endColumnIndex: 1 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 }, // slate-50 #F8FAFC
                  textFormat: { foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 }, fontSize: 9, bold: true },
                  horizontalAlignment: "LEFT", verticalAlignment: "MIDDLE"
                }
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
            }
          },
          // Card 1 Values (Col B, rows 4-9)
          {
            repeatCell: {
              range: { sheetId: dashId, startRowIndex: 3, endRowIndex: 9, startColumnIndex: 1, endColumnIndex: 2 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 1, green: 1, blue: 1 }, // white #FFFFFF
                  textFormat: { foregroundColor: { red: 15/255, green: 23/255, blue: 42/255 }, fontSize: 10, bold: true },
                  horizontalAlignment: "LEFT", verticalAlignment: "MIDDLE"
                }
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
            }
          },
          // Card 2 Keys (Col D, rows 4-9)
          {
            repeatCell: {
              range: { sheetId: dashId, startRowIndex: 3, endRowIndex: 9, startColumnIndex: 3, endColumnIndex: 4 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                  textFormat: { foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 }, fontSize: 9, bold: true },
                  horizontalAlignment: "LEFT", verticalAlignment: "MIDDLE"
                }
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
            }
          },
          // Card 2 Values (Col E, rows 4-9)
          {
            repeatCell: {
              range: { sheetId: dashId, startRowIndex: 3, endRowIndex: 9, startColumnIndex: 4, endColumnIndex: 5 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 1, green: 1, blue: 1 },
                  textFormat: { foregroundColor: { red: 15/255, green: 23/255, blue: 42/255 }, fontSize: 10, bold: true },
                  horizontalAlignment: "LEFT", verticalAlignment: "MIDDLE"
                }
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
            }
          },
          // Card 3 Keys (Col G, rows 4-12)
          {
            repeatCell: {
              range: { sheetId: dashId, startRowIndex: 3, endRowIndex: 12, startColumnIndex: 6, endColumnIndex: 7 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                  textFormat: { foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 }, fontSize: 9, bold: true },
                  horizontalAlignment: "LEFT", verticalAlignment: "MIDDLE"
                }
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
            }
          },
          // Card 3 Values (Col H, rows 4-12)
          {
            repeatCell: {
              range: { sheetId: dashId, startRowIndex: 3, endRowIndex: 12, startColumnIndex: 7, endColumnIndex: 8 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 1, green: 1, blue: 1 },
                  textFormat: { foregroundColor: { red: 15/255, green: 23/255, blue: 42/255 }, fontSize: 10, bold: true },
                  horizontalAlignment: "LEFT", verticalAlignment: "MIDDLE"
                }
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
            }
          },
          // Card Borders (Card 1: A3:B9, Card 2: D3:E9, Card 3: G3:H12)
          {
            updateBorders: {
              range: { sheetId: dashId, startRowIndex: 2, endRowIndex: 9, startColumnIndex: 0, endColumnIndex: 2 },
              top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }, // slate-300
              bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
              left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
              right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
            }
          },
          {
            updateBorders: {
              range: { sheetId: dashId, startRowIndex: 2, endRowIndex: 9, startColumnIndex: 3, endColumnIndex: 5 },
              top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
              bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
              left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
              right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
            }
          },
          {
            updateBorders: {
              range: { sheetId: dashId, startRowIndex: 2, endRowIndex: 12, startColumnIndex: 6, endColumnIndex: 8 },
              top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
              bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
              left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
              right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
            }
          }
        );

        // Formatting for Case Taking
        const caseTakingId = sheetsMap["Case Taking"];
        if (caseTakingId !== undefined) {
          requests.push(
            // Hide gridlines
            {
              updateSheetProperties: {
                properties: {
                  sheetId: caseTakingId,
                  gridProperties: { hideGridlines: true }
                },
                fields: "gridProperties.hideGridlines"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: caseTakingId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
                properties: { pixelSize: 240 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: caseTakingId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
                properties: { pixelSize: 450 }, fields: "pixelSize"
              }
            },
            // Title block
            {
              mergeCells: {
                range: { sheetId: caseTakingId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: caseTakingId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 15/255, green: 76/255, blue: 129/255 },
                    textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 12, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            }
          );

          // Add Collapsible Groups for Case Taking
          const groups = [
            { start: 3, end: 13 },   // Section 1: Patient Details (0-indexed rows: 3 to 13)
            { start: 14, end: 24 },  // Section 2: Chief Complaints
            { start: 25, end: 34 },  // Section 3: Presenting Symptoms
            { start: 35, end: 49 },  // Section 4: Mental Generals
            { start: 50, end: 69 },  // Section 5: Physical Generals
            { start: 70, end: 84 },  // Section 6: Past History
            { start: 85, end: 99 },  // Section 7: Family History
            { start: 100, end: 109 }, // Section 8: Investigations
            { start: 110, end: 114 }, // Section 9: Diagnosis
            { start: 115, end: 124 }, // Section 10: Miasmatic
            { start: 125, end: 134 }, // Section 11: Totality
            { start: 135, end: 149 }  // Section 12: Prescription
          ];

          for (const g of groups) {
            requests.push({
              addDimensionGroup: {
                range: {
                  sheetId: caseTakingId,
                  dimension: "ROWS",
                  startIndex: g.start,
                  endIndex: g.end
                }
              }
            });
            // Also format section headers as soft blue banners
            requests.push({
              repeatCell: {
                range: {
                  sheetId: caseTakingId,
                  startRowIndex: g.start - 1,
                  endRowIndex: g.start,
                  startColumnIndex: 0,
                  endColumnIndex: 4
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 242/255, blue: 253/255 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            });
          }
        }

        // Formatting for Follow-Up Tracker
        const followUpId = sheetsMap["Follow-Up Tracker"];
        if (followUpId !== undefined) {
          requests.push(
            // Hide gridlines
            {
              updateSheetProperties: {
                properties: {
                  sheetId: followUpId,
                  gridProperties: { hideGridlines: true }
                },
                fields: "gridProperties.hideGridlines"
              }
            },
            // Column widths
            {
              updateDimensionProperties: {
                range: { sheetId: followUpId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
                properties: { pixelSize: 120 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: followUpId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
                properties: { pixelSize: 400 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: followUpId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 },
                properties: { pixelSize: 120 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: followUpId, dimension: "COLUMNS", startIndex: 3, endIndex: 4 },
                properties: { pixelSize: 140 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: followUpId, dimension: "COLUMNS", startIndex: 4, endIndex: 5 },
                properties: { pixelSize: 100 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: followUpId, dimension: "COLUMNS", startIndex: 5, endIndex: 6 },
                properties: { pixelSize: 200 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: followUpId, dimension: "COLUMNS", startIndex: 6, endIndex: 7 },
                properties: { pixelSize: 140 }, fields: "pixelSize"
              }
            },
            // Merge Title Banner
            {
              mergeCells: {
                range: { sheetId: followUpId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 7 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: followUpId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 7 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 15/255, green: 76/255, blue: 129/255 },
                    textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 12, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Table headers
            {
              repeatCell: {
                range: { sheetId: followUpId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 7 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            }
          );
        }

        // Formatting for Repertorization
        const repertoryId = sheetsMap["Repertorization"];
        if (repertoryId !== undefined) {
          requests.push(
            // Hide gridlines
            {
              updateSheetProperties: {
                properties: {
                  sheetId: repertoryId,
                  gridProperties: { hideGridlines: true }
                },
                fields: "gridProperties.hideGridlines"
              }
            },
            // Column widths
            {
              updateDimensionProperties: {
                range: { sheetId: repertoryId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
                properties: { pixelSize: 240 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: repertoryId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
                properties: { pixelSize: 140 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: repertoryId, dimension: "COLUMNS", startIndex: 2, endIndex: 4 },
                properties: { pixelSize: 80 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: repertoryId, dimension: "COLUMNS", startIndex: 4, endIndex: 15 },
                properties: { pixelSize: 65 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: repertoryId, dimension: "COLUMNS", startIndex: 15, endIndex: 16 },
                properties: { pixelSize: 100 }, fields: "pixelSize"
              }
            },
            // Merge Title Header
            {
              mergeCells: {
                range: { sheetId: repertoryId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 16 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 16 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 15/255, green: 76/255, blue: 129/255 },
                    textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 13, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Table headers (Rubric, Chapter, etc.)
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 16 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 },
                    textFormat: { foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 }, fontSize: 10, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Alternate matrix rows background
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 0, endColumnIndex: 16 },
                cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 1, blue: 1 } } },
                fields: "userEnteredFormat.backgroundColor"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 4, endRowIndex: 5, startColumnIndex: 0, endColumnIndex: 16 },
                cell: { userEnteredFormat: { backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 } } },
                fields: "userEnteredFormat.backgroundColor"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 5, endRowIndex: 6, startColumnIndex: 0, endColumnIndex: 16 },
                cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 1, blue: 1 } } },
                fields: "userEnteredFormat.backgroundColor"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 6, endRowIndex: 7, startColumnIndex: 0, endColumnIndex: 16 },
                cell: { userEnteredFormat: { backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 } } },
                fields: "userEnteredFormat.backgroundColor"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 7, endRowIndex: 8, startColumnIndex: 0, endColumnIndex: 16 },
                cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 1, blue: 1 } } },
                fields: "userEnteredFormat.backgroundColor"
              }
            },
            // Grid borders for the matrix range (A3:P8)
            {
              updateBorders: {
                range: { sheetId: repertoryId, startRowIndex: 2, endRowIndex: 8, startColumnIndex: 0, endColumnIndex: 16 },
                top: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
                bottom: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
                left: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
                right: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
                innerHorizontal: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } },
                innerVertical: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } }
              }
            },
            // Centering Remedy Grades (E4:O8) and Totality Scores
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 3, endRowIndex: 8, startColumnIndex: 4, endColumnIndex: 16 },
                cell: { userEnteredFormat: { horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE" } },
                fields: "userEnteredFormat.horizontalAlignment,userEnteredFormat.verticalAlignment"
              }
            },
            // Bold Totality Score text
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 3, endRowIndex: 8, startColumnIndex: 15, endColumnIndex: 16 },
                cell: { userEnteredFormat: { textFormat: { bold: true, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } } } },
                fields: "userEnteredFormat.textFormat.bold,userEnteredFormat.textFormat.foregroundColor"
              }
            },
            // Symptom Coverage styling (Row 11, index 10)
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 10, endRowIndex: 11, startColumnIndex: 0, endColumnIndex: 16 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            {
              updateBorders: {
                range: { sheetId: repertoryId, startRowIndex: 10, endRowIndex: 11, startColumnIndex: 0, endColumnIndex: 16 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
              }
            },
            // Sum of Grades styling (Row 12, index 11)
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 11, endRowIndex: 12, startColumnIndex: 0, endColumnIndex: 16 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            {
              updateBorders: {
                range: { sheetId: repertoryId, startRowIndex: 11, endRowIndex: 12, startColumnIndex: 0, endColumnIndex: 16 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
              }
            },
            // Totality Rank Score styling (Row 13, index 12)
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 12, endRowIndex: 13, startColumnIndex: 0, endColumnIndex: 16 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 251/255, blue: 247/255 }, // #E2FBF7
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 } }, // #0F766E
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            {
              updateBorders: {
                range: { sheetId: repertoryId, startRowIndex: 12, endRowIndex: 13, startColumnIndex: 0, endColumnIndex: 16 },
                top: { style: "SOLID", color: { red: 15/255, green: 118/255, blue: 110/255 } },
                bottom: { style: "SOLID", color: { red: 15/255, green: 118/255, blue: 110/255 } }
              }
            },
            // Top Remedy Ranking header (Row 15, index 14)
            {
              mergeCells: {
                range: { sheetId: repertoryId, startRowIndex: 14, endRowIndex: 15, startColumnIndex: 0, endColumnIndex: 4 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 14, endRowIndex: 15, startColumnIndex: 0, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Rank Cards Rows 16-18 (indices 15-17)
            // Rank 1
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 15, endRowIndex: 16, startColumnIndex: 0, endColumnIndex: 1 },
                cell: { userEnteredFormat: { backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 }, textFormat: { bold: true, foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } } } },
                fields: "userEnteredFormat(backgroundColor,textFormat)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 15, endRowIndex: 16, startColumnIndex: 1, endColumnIndex: 2 },
                cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 1, blue: 1 }, textFormat: { bold: true, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } }, horizontalAlignment: "CENTER" } },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 15, endRowIndex: 16, startColumnIndex: 2, endColumnIndex: 3 },
                cell: { userEnteredFormat: { backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 }, textFormat: { foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } } } },
                fields: "userEnteredFormat(backgroundColor,textFormat)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 15, endRowIndex: 16, startColumnIndex: 3, endColumnIndex: 4 },
                cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 1, blue: 1 }, textFormat: { bold: true, foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 } }, horizontalAlignment: "CENTER" } },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
              }
            },
            // Rank 2
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 16, endRowIndex: 17, startColumnIndex: 0, endColumnIndex: 1 },
                cell: { userEnteredFormat: { backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 }, textFormat: { bold: true, foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } } } },
                fields: "userEnteredFormat(backgroundColor,textFormat)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 16, endRowIndex: 17, startColumnIndex: 1, endColumnIndex: 2 },
                cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 1, blue: 1 }, textFormat: { bold: true, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } }, horizontalAlignment: "CENTER" } },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 16, endRowIndex: 17, startColumnIndex: 2, endColumnIndex: 3 },
                cell: { userEnteredFormat: { backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 }, textFormat: { foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } } } },
                fields: "userEnteredFormat(backgroundColor,textFormat)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 16, endRowIndex: 17, startColumnIndex: 3, endColumnIndex: 4 },
                cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 1, blue: 1 }, textFormat: { bold: true, foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 } }, horizontalAlignment: "CENTER" } },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
              }
            },
            // Rank 3
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 17, endRowIndex: 18, startColumnIndex: 0, endColumnIndex: 1 },
                cell: { userEnteredFormat: { backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 }, textFormat: { bold: true, foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } } } },
                fields: "userEnteredFormat(backgroundColor,textFormat)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 17, endRowIndex: 18, startColumnIndex: 1, endColumnIndex: 2 },
                cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 1, blue: 1 }, textFormat: { bold: true, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } }, horizontalAlignment: "CENTER" } },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 17, endRowIndex: 18, startColumnIndex: 2, endColumnIndex: 3 },
                cell: { userEnteredFormat: { backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 }, textFormat: { foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } } } },
                fields: "userEnteredFormat(backgroundColor,textFormat)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: repertoryId, startRowIndex: 17, endRowIndex: 18, startColumnIndex: 3, endColumnIndex: 4 },
                cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 1, blue: 1 }, textFormat: { bold: true, foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 } }, horizontalAlignment: "CENTER" } },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
              }
            },
            // Outline border for Rank cards A15:D18
            {
              updateBorders: {
                range: { sheetId: repertoryId, startRowIndex: 14, endRowIndex: 18, startColumnIndex: 0, endColumnIndex: 4 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                innerHorizontal: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
                innerVertical: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } }
              }
            }
          );
        }

        // Formatting for Treatment Planner
        const plannerId = sheetsMap["Treatment Planner"];
        if (plannerId !== undefined) {
          requests.push(
            // Hide gridlines
            {
              updateSheetProperties: {
                properties: {
                  sheetId: plannerId,
                  gridProperties: { hideGridlines: true }
                },
                fields: "gridProperties.hideGridlines"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
                properties: { pixelSize: 180 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
                properties: { pixelSize: 150 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 },
                properties: { pixelSize: 300 }, fields: "pixelSize"
              }
            },
            {
              mergeCells: {
                range: { sheetId: plannerId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 7 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 7 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 15/255, green: 76/255, blue: 129/255 },
                    textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 13, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 7 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            {
              mergeCells: {
                range: { sheetId: plannerId, startRowIndex: 5, endRowIndex: 6, startColumnIndex: 0, endColumnIndex: 3 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 5, endRowIndex: 6, startColumnIndex: 0, endColumnIndex: 3 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 242/255, blue: 253/255 },
                    textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 6, endRowIndex: 7, startColumnIndex: 0, endColumnIndex: 3 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { bold: true, fontSize: 10 },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            }
          );
        }

        // Formatting for Finance
        const financeId = sheetsMap["Finance"];
        if (financeId !== undefined) {
          requests.push(
            // Hide gridlines
            {
              updateSheetProperties: {
                properties: {
                  sheetId: financeId,
                  gridProperties: { hideGridlines: true }
                },
                fields: "gridProperties.hideGridlines"
              }
            },
            // Column widths
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
                properties: { pixelSize: 100 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
                properties: { pixelSize: 220 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "COLUMNS", startIndex: 2, endIndex: 5 },
                properties: { pixelSize: 120 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "COLUMNS", startIndex: 5, endIndex: 6 },
                properties: { pixelSize: 140 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "COLUMNS", startIndex: 6, endIndex: 8 },
                properties: { pixelSize: 120 }, fields: "pixelSize"
              }
            },
            // Title Header Merged A1:H1
            {
              mergeCells: {
                range: { sheetId: financeId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 15/255, green: 76/255, blue: 129/255 },
                    textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 13, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Card 1 (A3:A4) Total Billed
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 1 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { bold: true, fontSize: 9, foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 0, endColumnIndex: 1 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { bold: true, fontSize: 13, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              updateBorders: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 4, startColumnIndex: 0, endColumnIndex: 1 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
              }
            },
            // Card 2 (B3:B4) Total Collected
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 1, endColumnIndex: 2 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { bold: true, fontSize: 9, foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 1, endColumnIndex: 2 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { bold: true, fontSize: 13, foregroundColor: { red: 46/255, green: 139/255, blue: 87/255 } }, // SeaGreen #2E8B57
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              updateBorders: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 4, startColumnIndex: 1, endColumnIndex: 2 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
              }
            },
            // Card 3 (C3:C4) Outstanding Balance
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 2, endColumnIndex: 3 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { bold: true, fontSize: 9, foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 2, endColumnIndex: 3 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { bold: true, fontSize: 13, foregroundColor: { red: 139/255, green: 46/255, blue: 46/255 } }, // Deep Red #8B2E2E
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              updateBorders: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 4, startColumnIndex: 2, endColumnIndex: 3 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
              }
            },
            // Table Section Header Merged A6:H6
            {
              mergeCells: {
                range: { sheetId: financeId, startRowIndex: 5, endRowIndex: 6, startColumnIndex: 0, endColumnIndex: 8 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 5, endRowIndex: 6, startColumnIndex: 0, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 242/255, blue: 253/255 },
                    textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            // Transaction History Table Headers (Row 7, index 6)
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 6, endRowIndex: 7, startColumnIndex: 0, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 }, // slate-200
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            }
          );
        }

        // Formatting for Reports & Attachments
        const attachmentsId = sheetsMap["Reports & Attachments"];
        if (attachmentsId !== undefined) {
          requests.push(
            // Hide gridlines
            {
              updateSheetProperties: {
                properties: {
                  sheetId: attachmentsId,
                  gridProperties: { hideGridlines: true }
                },
                fields: "gridProperties.hideGridlines"
              }
            },
            // Column widths
            {
              updateDimensionProperties: {
                range: { sheetId: attachmentsId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
                properties: { pixelSize: 120 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: attachmentsId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
                properties: { pixelSize: 160 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: attachmentsId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 },
                properties: { pixelSize: 250 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: attachmentsId, dimension: "COLUMNS", startIndex: 3, endIndex: 4 },
                properties: { pixelSize: 350 }, fields: "pixelSize"
              }
            },
            // Merge Title
            {
              mergeCells: {
                range: { sheetId: attachmentsId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: attachmentsId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 15/255, green: 76/255, blue: 129/255 },
                    textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 12, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Table Headers
            {
              repeatCell: {
                range: { sheetId: attachmentsId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            }
          );
        }

        // Formatting for Config DB
        const configId = sheetsMap["Config DB"];
        if (configId !== undefined) {
          requests.push(
            // Hide gridlines
            {
              updateSheetProperties: {
                properties: {
                  sheetId: configId,
                  gridProperties: { hideGridlines: true }
                },
                fields: "gridProperties.hideGridlines"
              }
            },
            // Column widths
            {
              updateDimensionProperties: {
                range: { sheetId: configId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
                properties: { pixelSize: 180 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: configId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
                properties: { pixelSize: 100 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: configId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 },
                properties: { pixelSize: 120 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: configId, dimension: "COLUMNS", startIndex: 3, endIndex: 4 },
                properties: { pixelSize: 160 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: configId, dimension: "COLUMNS", startIndex: 4, endIndex: 5 },
                properties: { pixelSize: 180 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: configId, dimension: "COLUMNS", startIndex: 5, endIndex: 6 },
                properties: { pixelSize: 100 }, fields: "pixelSize"
              }
            },
            // Merge A1:D1
            {
              mergeCells: {
                range: { sheetId: configId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: configId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 15/255, green: 76/255, blue: 129/255 },
                    textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 12, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Style E1:F1
            {
              repeatCell: {
                range: { sheetId: configId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 4, endColumnIndex: 6 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Style table headers (Row 3, index 2) Cols A-D
            {
              repeatCell: {
                range: { sheetId: configId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            }
          );
        }

        // Formatting for AI Repertory Lab
        const aiRepertoryId = sheetsMap["AI Repertory Lab"];
        if (aiRepertoryId !== undefined) {
          requests.push(
            // Hide gridlines
            {
              updateSheetProperties: {
                properties: {
                  sheetId: aiRepertoryId,
                  gridProperties: { hideGridlines: true }
                },
                fields: "gridProperties.hideGridlines"
              }
            },
            // Column widths
            {
              updateDimensionProperties: {
                range: { sheetId: aiRepertoryId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
                properties: { pixelSize: 150 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: aiRepertoryId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
                properties: { pixelSize: 150 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: aiRepertoryId, dimension: "COLUMNS", startIndex: 2, endIndex: 4 },
                properties: { pixelSize: 80 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: aiRepertoryId, dimension: "COLUMNS", startIndex: 4, endIndex: 5 },
                properties: { pixelSize: 160 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: aiRepertoryId, dimension: "COLUMNS", startIndex: 5, endIndex: 6 },
                properties: { pixelSize: 350 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: aiRepertoryId, dimension: "COLUMNS", startIndex: 6, endIndex: 8 },
                properties: { pixelSize: 80 }, fields: "pixelSize"
              }
            },
            // Title Header Merged A1:H1
            {
              mergeCells: {
                range: { sheetId: aiRepertoryId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 15/255, green: 76/255, blue: 129/255 },
                    textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 13, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Left Card Section Header Merged A3:D3
            {
              mergeCells: {
                range: { sheetId: aiRepertoryId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 4 },
                mergeType: "MERGE_ALL"
              }
            },
            // Right Card Section Header Merged E3:H3
            {
              mergeCells: {
                range: { sheetId: aiRepertoryId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 4, endColumnIndex: 8 },
                mergeType: "MERGE_ALL"
              }
            },
            // Left Card Section Header style
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 }, // slate-200
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Right Card Subheader E4:H4
            {
              mergeCells: {
                range: { sheetId: aiRepertoryId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 4, endColumnIndex: 8 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 4, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 }, // slate-100
                    textFormat: { bold: true, fontSize: 9, foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Synthesis Text Area Merged E5:H9
            {
              mergeCells: {
                range: { sheetId: aiRepertoryId, startRowIndex: 4, endRowIndex: 9, startColumnIndex: 4, endColumnIndex: 8 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 4, endRowIndex: 9, startColumnIndex: 4, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { fontSize: 10, foregroundColor: { red: 15/255, green: 23/255, blue: 42/255 } },
                    verticalAlignment: "TOP",
                    wrapStrategy: "WRAP"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment,wrapStrategy)"
              }
            },
            // Left Card Keys (Col A, rows 4-9)
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 3, endRowIndex: 9, startColumnIndex: 0, endColumnIndex: 1 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { bold: true, fontSize: 9, foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 } },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            // Left Card Values (Col B, rows 4-9)
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 3, endRowIndex: 9, startColumnIndex: 1, endColumnIndex: 2 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Left Card Spacers (Col C-D, rows 4-9)
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 3, endRowIndex: 9, startColumnIndex: 2, endColumnIndex: 4 },
                cell: { userEnteredFormat: { backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 } } },
                fields: "userEnteredFormat.backgroundColor"
              }
            },
            // Card borders for Left & Right top widgets
            {
              updateBorders: {
                range: { sheetId: aiRepertoryId, startRowIndex: 2, endRowIndex: 9, startColumnIndex: 0, endColumnIndex: 4 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                innerHorizontal: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } },
                innerVertical: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } }
              }
            },
            {
              updateBorders: {
                range: { sheetId: aiRepertoryId, startRowIndex: 2, endRowIndex: 9, startColumnIndex: 4, endColumnIndex: 8 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
              }
            },
            // Left Card 2 Section Header Merged A11:D11
            {
              mergeCells: {
                range: { sheetId: aiRepertoryId, startRowIndex: 10, endRowIndex: 11, startColumnIndex: 0, endColumnIndex: 4 },
                mergeType: "MERGE_ALL"
              }
            },
            // Right Card 2 Section Header Merged E11:H11
            {
              mergeCells: {
                range: { sheetId: aiRepertoryId, startRowIndex: 10, endRowIndex: 11, startColumnIndex: 4, endColumnIndex: 8 },
                mergeType: "MERGE_ALL"
              }
            },
            // Card 2 Section Headers style
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 10, endRowIndex: 11, startColumnIndex: 0, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Left Card 2 Rows 12-14 (indices 11-13)
            // Keys Col A, C
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 11, endRowIndex: 14, startColumnIndex: 0, endColumnIndex: 1 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { bold: true, fontSize: 9, foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 } },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 11, endRowIndex: 14, startColumnIndex: 2, endColumnIndex: 3 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { fontSize: 9, foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            // Values Col B, D
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 11, endRowIndex: 14, startColumnIndex: 1, endColumnIndex: 2 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 11, endRowIndex: 14, startColumnIndex: 3, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Right Card 2 (Materia Medica) Rows 12-14
            // Keys Col E
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 11, endRowIndex: 14, startColumnIndex: 4, endColumnIndex: 5 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 },
                    textFormat: { bold: true, fontSize: 9, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            // Values Col F Merged F12:H12, F13:H13, F14:H14
            {
              mergeCells: {
                range: { sheetId: aiRepertoryId, startRowIndex: 11, endRowIndex: 12, startColumnIndex: 5, endColumnIndex: 8 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              mergeCells: {
                range: { sheetId: aiRepertoryId, startRowIndex: 12, endRowIndex: 13, startColumnIndex: 5, endColumnIndex: 8 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              mergeCells: {
                range: { sheetId: aiRepertoryId, startRowIndex: 13, endRowIndex: 14, startColumnIndex: 5, endColumnIndex: 8 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 11, endRowIndex: 14, startColumnIndex: 5, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { fontSize: 9, foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 } },
                    verticalAlignment: "MIDDLE",
                    wrapStrategy: "WRAP"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment,wrapStrategy)"
              }
            },
            // Card borders for Left & Right bottom widgets
            {
              updateBorders: {
                range: { sheetId: aiRepertoryId, startRowIndex: 10, endRowIndex: 14, startColumnIndex: 0, endColumnIndex: 4 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                innerHorizontal: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } },
                innerVertical: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } }
              }
            },
            {
              updateBorders: {
                range: { sheetId: aiRepertoryId, startRowIndex: 10, endRowIndex: 14, startColumnIndex: 4, endColumnIndex: 8 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                innerHorizontal: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } },
                innerVertical: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } }
              }
            }
          );
        }

        // Apply all formats synchronously in one single API roundtrip
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: newSheetId,
          requestBody: { requests }
        });
      }
    }

    return { sheetId: newSheetId, sheetUrl: newSheetUrl };
  } catch (error) {
    console.error("Error creating clinical sheet:", error);
    throw error;
  }
}

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
      range: "'Case Taking'!A128:B131",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          ["AI CLINICAL DIAGNOSTICS REPORT", ""],
          ["Generated Engine", "Gemini 3.5 Clinical Synthesis"],
          ["Analysis Timestamp", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
          ["Clinical Findings & Totality Analysis", aiReport]
        ]
      }
    });
  } catch (error) {
    console.error("Error writing AI report to patient Google Sheet:", error);
    throw error;
  }
}

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
      pageSize: 100,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true
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
      fields: "id,webViewLink",
      supportsAllDrives: true
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
      ["HOMEO HEALTHCARE - INVOICE", "", "", "", ""],
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
      ["Bank Name", "HDFC Bank Ltd", "", "UPI ID", "8446056789@hdfc"],
      ["Account Name", "Dr. Narayan Jethwani", "", "", ""],
      ["Account Number", "50200039742057", "", "", ""],
      ["IFSC Code", "HDFC0004793", "", "", ""],
      ["Branch Name", "PAN Card Club Road Baner, Pune", "", "", ""],
      ["", "", "", "", ""],
      ["Thank you for choosing Homeo Healthcare for your healing journey.", "", "", "", ""]
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
        supportsAllDrives: true,
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

/**
 * Downloads a file from Google Drive and saves it to the local filesystem
 */
export async function downloadFileFromGoogleDrive(fileId: string, destPath: string): Promise<boolean> {
  const auth = getGoogleAuth();
  if (!auth) {
    console.warn("Google API Auth missing. Skipping Google Drive download.");
    return false;
  }
  
  const drive = google.drive({ version: "v3", auth });
  
  try {
    const fs = await import("fs");
    const path = await import("path");
    
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    const destStream = fs.createWriteStream(destPath);
    
    const res = await drive.files.get(
      { fileId, alt: "media", supportsAllDrives: true },
      { responseType: "stream" }
    );
    
    return new Promise((resolve, reject) => {
      res.data
        .on("end", () => {
          console.log(`Successfully downloaded file from Google Drive to ${destPath}`);
          resolve(true);
        })
        .on("error", (err: any) => {
          console.error("Error downloading file stream:", err);
          reject(err);
        })
        .pipe(destStream);
    });
  } catch (error) {
    console.error("Error fetching file from Google Drive:", error);
    return false;
  }
}



