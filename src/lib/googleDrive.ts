import { google } from "googleapis";


function getDoctorEmails(): string[] {
  const envEmails = process.env.DOCTOR_EMAILS;
  if (envEmails) {
    return envEmails.split(",").map(e => e.trim()).filter(Boolean);
  }
  return ["narayan.jethwani@gmail.com", "narayan.jethwani@homeo.healthcare"];
}

const paymentPhone = process.env.PAYMENT_PHONE || "8446056789";
const paymentUpi = process.env.PAYMENT_UPI || "8446056789@hdfc";
const whatsappDisplay = process.env.WHATSAPP_DISPLAY || "+91 84460 56789";

// Initialize Google Auth client using Service Account credentials
const getGoogleAuth = () => {
  let serviceAccountKeyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKeyJson) {
    console.warn("GOOGLE_SERVICE_ACCOUNT_KEY not set. Operating in mock mode.");
    return null;
  }
  try {
    // Sanitize: strip outer single or double quotes that Vercel env vars sometimes add
    serviceAccountKeyJson = serviceAccountKeyJson.trim();
    if (
      (serviceAccountKeyJson.startsWith("'") && serviceAccountKeyJson.endsWith("'")) ||
      (serviceAccountKeyJson.startsWith('"') && serviceAccountKeyJson.endsWith('"'))
    ) {
      serviceAccountKeyJson = serviceAccountKeyJson.slice(1, -1);
    }
    const credentials = JSON.parse(serviceAccountKeyJson);
    if (!credentials.client_email || !credentials.private_key) {
      console.error("GOOGLE_SERVICE_ACCOUNT_KEY parsed but missing client_email or private_key fields.");
      return null;
    }
    console.log("Google Auth initialized successfully for:", credentials.client_email);
    
    // Replace double-escaped newlines with real newlines for PEM format
    const privateKey = credentials.private_key.replace(/\\n/g, "\n");
    
    return new google.auth.JWT({
      email: credentials.client_email,
      key: privateKey,
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events"
      ]
    });
  } catch (error: any) {
    console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:", error?.message || error);
    console.error("Key starts with:", serviceAccountKeyJson?.substring(0, 30), "... length:", serviceAccountKeyJson?.length);
    return null;
  }
};

const PARENT_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID || "1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb";
const MASTER_SHEET_ID = process.env.GOOGLE_MASTER_SHEET_ID || ""; 
const TEMPLATE_SHEET_ID = process.env.GOOGLE_TEMPLATE_SHEET_ID || ""; // standard clinical template file ID

// ─── Doctor Workspace ─────────────────────────────────────────────────────────

export interface DoctorWorkspaceResult {
  driveFolderId: string;
  driveFolderUrl: string;
  masterSheetId: string;
  masterSheetUrl: string;
  isMock: boolean;
}

/**
 * Provisions a private Google Drive folder + Master Sheet for a new franchisee doctor.
 * Called by /api/onboard-doctor on first doctor setup.
 *
 * @param doctorName   Full name of the doctor (used for folder/sheet naming)
 * @param doctorEmail  Gmail/Workspace email of the doctor (folder is shared with this)
 */
export async function createDoctorWorkspace(
  doctorName: string,
  doctorEmail: string
): Promise<DoctorWorkspaceResult> {
  const auth = getGoogleAuth();

  if (!auth) {
    console.warn("No Google auth — returning mock workspace for doctor:", doctorName);
    return {
      driveFolderId: "mock-doctor-folder-id",
      driveFolderUrl: `https://drive.google.com/drive/folders/${PARENT_DRIVE_FOLDER_ID}`,
      masterSheetId: "mock-doctor-sheet-id",
      masterSheetUrl: "https://docs.google.com/spreadsheets",
      isMock: true,
    };
  }

  const drive = google.drive({ version: "v3", auth });
  const sheets = google.sheets({ version: "v4", auth });

  // 1. Create the doctor's private subfolder inside the master root
  const folderRes = await drive.files.create({
    requestBody: {
      name: `Dr. ${doctorName} — Franchise Workspace`,
      mimeType: "application/vnd.google-apps.folder",
      parents: [PARENT_DRIVE_FOLDER_ID],
    },
    fields: "id,webViewLink",
    supportsAllDrives: true,
  });

  const driveFolderId = folderRes.data.id || "";
  const driveFolderUrl =
    folderRes.data.webViewLink ||
    (driveFolderId ? `https://drive.google.com/drive/folders/${driveFolderId}` : "");

  // 2. Share the folder with the doctor's own email (editor access)
  if (driveFolderId && doctorEmail) {
    await drive.permissions
      .create({
        fileId: driveFolderId,
        sendNotificationEmail: true,
        supportsAllDrives: true,
        requestBody: { role: "writer", type: "user", emailAddress: doctorEmail },
      })
      .catch((err) =>
        console.warn(`Could not share Drive folder with ${doctorEmail}:`, err)
      );
  }

  // 3. Create the doctor's private Master Record Sheet (copy of template or blank)
  let masterSheetId = "";
  let masterSheetUrl = "";

  try {
    if (MASTER_SHEET_ID) {
      // Copy the admin master sheet as a template for this doctor
      const copyRes = await drive.files.copy({
        fileId: MASTER_SHEET_ID,
        requestBody: {
          name: `Master Record — Dr. ${doctorName}`,
          parents: [driveFolderId],
        },
        fields: "id,webViewLink",
        supportsAllDrives: true,
      });
      masterSheetId = copyRes.data.id || "";
      masterSheetUrl =
        copyRes.data.webViewLink ||
        (masterSheetId ? `https://docs.google.com/spreadsheets/d/${masterSheetId}/edit` : "");
    } else {
      // Create a fresh Google Sheet in the doctor's folder
      const sheetRes = await drive.files.create({
        requestBody: {
          name: `Master Record — Dr. ${doctorName}`,
          mimeType: "application/vnd.google-apps.spreadsheet",
          parents: [driveFolderId],
        },
        fields: "id,webViewLink",
        supportsAllDrives: true,
      });
      masterSheetId = sheetRes.data.id || "";
      masterSheetUrl =
        sheetRes.data.webViewLink ||
        (masterSheetId ? `https://docs.google.com/spreadsheets/d/${masterSheetId}/edit` : "");

      // Add column headers to the fresh sheet
      if (masterSheetId) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: masterSheetId,
          range: "Sheet1!A1:H1",
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [
              ["Patient ID", "Name", "Age/Gender", "Complaint", "Care Level", "Date", "Drive Folder", "Clinical Sheet"],
            ],
          },
        }).catch((err) => console.warn("Could not write headers to master sheet:", err));
      }
    }

    // Share master sheet with doctor email too
    if (masterSheetId && doctorEmail) {
      await drive.permissions
        .create({
          fileId: masterSheetId,
          sendNotificationEmail: false,
          supportsAllDrives: true,
          requestBody: { role: "writer", type: "user", emailAddress: doctorEmail },
        })
        .catch((err) =>
          console.warn(`Could not share Master Sheet with ${doctorEmail}:`, err)
        );
    }
  } catch (sheetErr) {
    console.error("Failed to create doctor master sheet:", sheetErr);
  }

  return {
    driveFolderId,
    driveFolderUrl,
    masterSheetId,
    masterSheetUrl,
    isMock: false,
  };
}

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
  date?: string;
  slot?: string;
}

/**
 * Creates an event in Google Calendar for the consultation
 */
export async function addCalendarEvent(data: PatientIntakeData): Promise<{ eventId?: string; eventLink?: string; success: boolean }> {
  const auth = getGoogleAuth();
  if (!auth) {
    console.log("No Google auth available, skipping calendar event creation (mock mode)");
    return { success: false };
  }

  const calendar = google.calendar({ version: "v3", auth });
  
  try {
    const dateStr = data.date;
    const slotStr = data.slot;
    
    if (!dateStr || !slotStr) {
      console.warn("Could not retrieve date or slot from patient intake data for calendar creation:", data);
      return { success: false };
    }
    
    const [year, month, day] = dateStr.split("-").map(Number);
    const match = slotStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) {
      console.warn("Could not parse time format in slotStr:", slotStr);
      return { success: false };
    }
    
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    
    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutes consultation slot
    
    const pad = (n: number) => String(n).padStart(2, '0');
    const startIso = `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00`;
    const endIso = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}T${pad(endDate.getHours())}:${pad(endDate.getMinutes())}:00`;
    
    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
    
    const event = {
      summary: `Homeopathic Consultation - ${data.name}`,
      description: `Patient Details:
- Name: ${data.name}
- Phone: ${data.phone}
- Email: ${data.email || 'N/A'}
- Chief Complaint: ${data.complaint}
- Category: ${data.careLevel}
- Patient ID: ${data.id}

Instructions: Patient to confirm on WhatsApp or call ${whatsappDisplay} to be added.`,
      start: {
        dateTime: startIso,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endIso,
        timeZone: "Asia/Kolkata",
      },
      attendees: getDoctorEmails().map(email => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    };
    
    if (data.email) {
      event.attendees.push({ email: data.email });
    }
    
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: "all",
    });
    
    console.log("Google Calendar event created successfully:", response.data.id);
    return {
      eventId: response.data.id || undefined,
      eventLink: response.data.htmlLink || undefined,
      success: true
    };
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    return { success: false };
  }
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
        const emails = getDoctorEmails();
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
    const mockUrl = `/admin/mock-sheet?name=${encodeURIComponent(data.name)}` +
      `&id=${encodeURIComponent(data.id)}` +
      `&age=${encodeURIComponent(data.age)}` +
      `&gender=${encodeURIComponent(data.gender)}` +
      `&phone=${encodeURIComponent(data.phone)}` +
      `&email=${encodeURIComponent(data.email || "")}` +
      `&complaint=${encodeURIComponent(data.complaint)}` +
      `&careLevel=${encodeURIComponent(data.careLevel)}` +
      `&durationText=${encodeURIComponent(data.durationText)}` +
      `&finalPrice=${encodeURIComponent(String(data.finalPrice))}` +
      `&receivedAmount=${encodeURIComponent(String(data.receivedAmount !== undefined ? data.receivedAmount : data.finalPrice))}` +
      `&remainingBalance=${encodeURIComponent(String(data.remainingBalance || 0))}` +
      `&billingCycle=${encodeURIComponent(data.billingCycle || "Monthly")}` +
      `&concessionApplied=${encodeURIComponent(data.concessionApplied || "None")}` +
      `&conditionsCount=${encodeURIComponent(String(data.conditionsCount || 1))}` +
      `&durationValue=${encodeURIComponent(String(data.durationValue || 1))}`;
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
        const emails = getDoctorEmails();
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
          const today = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });

          // Normalize and map inputs to align with mock and premium options
          const normalizedCareLevel = data.careLevel ? data.careLevel.toLowerCase().trim() : "";
          let resolvedCareLevel = data.careLevel || "🎯 Deep Systemic Care";
          if (normalizedCareLevel.includes("critical") || normalizedCareLevel.includes("emergency")) {
            resolvedCareLevel = "🚨 Acute Critical Care";
          } else if (normalizedCareLevel === "mild" || normalizedCareLevel.includes("acute") || normalizedCareLevel.includes("wellness")) {
            resolvedCareLevel = "🌱 Acute & Wellness Care";
          } else if (normalizedCareLevel === "moderate" || normalizedCareLevel.includes("standard") || normalizedCareLevel.includes("chronic")) {
            resolvedCareLevel = "⚡ Standard Chronic Care";
          } else if (normalizedCareLevel === "focused" || normalizedCareLevel.includes("deep") || normalizedCareLevel.includes("systemic")) {
            resolvedCareLevel = "🎯 Deep Systemic Care";
          } else if (normalizedCareLevel === "organ" || normalizedCareLevel.includes("advanced") || normalizedCareLevel.includes("pathological")) {
            resolvedCareLevel = "🫁 Advanced Pathological Care";
          } else if (normalizedCareLevel === "comprehensive" || normalizedCareLevel.includes("multisystem") || normalizedCareLevel.includes("integrative")) {
            resolvedCareLevel = "🔮 Multisystem Integrative Care";
          }

          const rawCycle = data.billingCycle ? data.billingCycle.toLowerCase().trim() : "";
          const resolvedBillingCycle = rawCycle === "weekly" ? "Weekly" : "Monthly";

          const rawConcession = data.concessionApplied ? data.concessionApplied.toLowerCase().trim() : "";
          let resolvedConcession = "None";
          if (rawConcession.includes("senior")) {
            resolvedConcession = "Senior 15%";
          } else if (rawConcession.includes("socio") || rawConcession.includes("compassionate")) {
            resolvedConcession = "Socio-Economic 30%";
          } else if (rawConcession.includes("override")) {
            resolvedConcession = "Override";
          }

          await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: newSheetId,
            requestBody: {
              valueInputOption: "USER_ENTERED",
              data: [
                {
                  range: "'Dashboard'!B4:B6",
                  values: [
                    [data.id],
                    [data.name],
                    [`${data.age} / ${data.gender}`]
                  ]
                },
                {
                  range: "'Dashboard'!B9",
                  values: [
                    [data.careLevel.toLowerCase().includes("acute") ? "Acute" : "Chronic"]
                  ]
                },
                {
                  range: "'Case Taking'!B3:B9",
                  values: [
                    [data.id],
                    [data.name],
                    [`${data.age} / ${data.gender}`],
                    [data.phone],
                    [data.email || "N/A"],
                    [locationVal],
                    [today]
                  ]
                },
                {
                  range: "'Case Taking'!B11:B12",
                  values: [
                    [data.complaint],
                    [data.durationText || "Chronic"]
                  ]
                },
                {
                  range: "'Treatment Planner'!A4:G4",
                  values: [
                    [resolvedCareLevel, resolvedBillingCycle, data.durationValue || 1, data.conditionsCount || 1, resolvedConcession, data.overridePrice || 0, data.medicineAddons || 0]
                  ]
                },
                {
                  range: "'Treatment Planner'!A8:C15",
                  values: [
                    ["Base Rate", `=IF(ISNUMBER(SEARCH("Critical", A4)), IF(B4="Weekly", 5000, 20000), IF(ISNUMBER(SEARCH("Wellness", A4)), IF(B4="Weekly", 1200, 4800), IF(ISNUMBER(SEARCH("Standard", A4)), IF(B4="Weekly", 2400, 9600), IF(ISNUMBER(SEARCH("Deep", A4)), IF(B4="Weekly", 4200, 16800), IF(ISNUMBER(SEARCH("Advanced", A4)), IF(B4="Weekly", 6000, 24000), IF(ISNUMBER(SEARCH("Multisystem", A4)), IF(B4="Weekly", 8400, 33600), 4800))))))`, "Base rate based on Care Level and Billing Cycle"],
                    ["Conditions Surcharge", `=IF(D4<=1, 0, (D4-1)*IF(ISNUMBER(SEARCH("Critical", A4)), IF(B4="Weekly", 1000, 4000), IF(ISNUMBER(SEARCH("Wellness", A4)), IF(B4="Weekly", 300, 1200), IF(ISNUMBER(SEARCH("Standard", A4)), IF(B4="Weekly", 450, 1800), IF(ISNUMBER(SEARCH("Deep", A4)), IF(B4="Weekly", 750, 3000), IF(ISNUMBER(SEARCH("Advanced", A4)), IF(B4="Weekly", 1050, 4200), IF(ISNUMBER(SEARCH("Multisystem", A4)), IF(B4="Weekly", 1350, 5400), 0)))))))`, "Surcharge for co-existing chronic conditions"],
                    ["Gross Subtotal", "=(B8+B9)*C4", "Adjusted base rate multiplied by duration"],
                    ["Duration Discount %", `=IF(IF(B4="Weekly", C4, C4*4)>=48, 0.30, IF(IF(B4="Weekly", C4, C4*4)>=24, 0.25, IF(IF(B4="Weekly", C4, C4*4)>=12, 0.20, IF(IF(B4="Weekly", C4, C4*4)>=8, 0.15, IF(IF(B4="Weekly", C4, C4*4)>=4, 0.10, IF(IF(B4="Weekly", C4, C4*4)>=2, 0.05, 0))))))`, "Duration loyalty discount percentage"],
                    ["Duration Discount Amount", "=B10*B11", "Total savings from duration discount"],
                    ["Concession Discount Amount", `=IF(ISNUMBER(SEARCH("Senior", E4)), (B10-B12)*0.15, IF(ISNUMBER(SEARCH("Socio", E4)), (B10-B12)*0.30, IF(ISNUMBER(SEARCH("Override", E4)), MAX(0, (B10-B12) - F4), 0)))`, "Compassionate, Senior, or Override concession"],
                    ["Medicine Add-ons", "=G4", "Medicine charges and dynamic add-on scripts"],
                    ["Total Program Cost", "=B10-B12-B13+B14", "Final package cost taking all factors into consideration"]
                  ]
                },
                {
                  range: "'Treatment Planner'!B16",
                  values: [
                    [data.receivedAmount !== undefined ? data.receivedAmount : data.finalPrice]
                  ]
                },
                {
                  range: "'Treatment Planner'!A17:C17",
                  values: [
                    ["Balance Due", "=B15-B16", "Outstanding dues for this treatment plan"]
                  ]
                },
                {
                  range: "'Treatment Planner'!A19:B19",
                  values: [
                    ["WhatsApp Invoice Message", `="Dear " & 'Case Taking'!B4 & ", thank you for consulting Homeo Healthcare. Your treatment package is: " & A4 & " (" & IF(D4=1, "1 condition", D4 & " conditions") & ", " & C4 & " " & IF(B4="Weekly", IF(C4=1, "week", "weeks"), IF(C4=1, "month", "months")) & IF(E4="None", "", " [" & E4 & "]") & "). Total Cost: ₹" & TEXT(B15, "#,##0") & ". Balance Due: ₹" & TEXT(B17, "#,##0") & ". Please pay using Gpay: ${paymentPhone}. Clinic Branch: Homeo Healthcare."`]
                  ]
                },
                {
                  range: "'Finance'!A9:H9",
                  values: [
                    [today, `${resolvedCareLevel} - Initial Package Setup`, `Tx-Plan-${data.id}`, "='Treatment Planner'!B15", "='Treatment Planner'!B16", "=D9-E9", "UPI", `=IF(F9<=0, "PAID", IF(E9>0, "PARTIALLY PAID", "UNPAID"))`]
                  ]
                },
                {
                  range: "'Reports & Attachments'!D4:D5",
                  values: [
                    [`https://drive.google.com/drive/folders/${folderId}`],
                    [`https://drive.google.com/drive/folders/${folderId}`]
                  ]
                },
                {
                  range: "'Case Taking'!B24:B29",
                  values: [
                    [""],
                    [""],
                    [""],
                    [""],
                    [""],
                    [""]
                  ]
                },
                {
                  range: "'Case Taking'!B31:B36",
                  values: [
                    [""],
                    [""],
                    [""],
                    [""],
                    [""],
                    [""]
                  ]
                },
                {
                  range: "'Case Taking'!B38:B39",
                  values: [
                    [""],
                    [""]
                  ]
                },
                {
                  range: "'Case Taking'!B47:B51",
                  values: [
                    [""],
                    [""],
                    [""],
                    [""],
                    [""]
                  ]
                },
                {
                  range: "'Repertorization'!A4:O12",
                  values: Array(9).fill(null).map(() => Array(15).fill(""))
                },
                {
                  range: "'Repertorization'!P4:P12",
                  values: [
                    ["=IF(D4=\"\", \"\", D4*SUM(E4:O4))"],
                    ["=IF(D5=\"\", \"\", D5*SUM(E5:O5))"],
                    ["=IF(D6=\"\", \"\", D6*SUM(E6:O6))"],
                    ["=IF(D7=\"\", \"\", D7*SUM(E7:O7))"],
                    ["=IF(D8=\"\", \"\", D8*SUM(E8:O8))"],
                    ["=IF(D9=\"\", \"\", D9*SUM(E9:O9))"],
                    ["=IF(D10=\"\", \"\", D10*SUM(E10:O10))"],
                    ["=IF(D11=\"\", \"\", D11*SUM(E11:O11))"],
                    ["=IF(D12=\"\", \"\", D12*SUM(E12:O12))"]
                  ]
                },
                {
                  range: "'Repertorization'!E16:O18",
                  values: [
                    [
                      "=COUNTIFS(E4:E12, \">0\") / MAX(1, COUNTA($D$4:$D$12))",
                      "=COUNTIFS(F4:F12, \">0\") / MAX(1, COUNTA($D$4:$D$12))",
                      "=COUNTIFS(G4:G12, \">0\") / MAX(1, COUNTA($D$4:$D$12))",
                      "=COUNTIFS(H4:H12, \">0\") / MAX(1, COUNTA($D$4:$D$12))",
                      "=COUNTIFS(I4:I12, \">0\") / MAX(1, COUNTA($D$4:$D$12))",
                      "=COUNTIFS(J4:J12, \">0\") / MAX(1, COUNTA($D$4:$D$12))",
                      "=COUNTIFS(K4:K12, \">0\") / MAX(1, COUNTA($D$4:$D$12))",
                      "=COUNTIFS(L4:L12, \">0\") / MAX(1, COUNTA($D$4:$D$12))",
                      "=COUNTIFS(M4:M12, \">0\") / MAX(1, COUNTA($D$4:$D$12))",
                      "=COUNTIFS(N4:N12, \">0\") / MAX(1, COUNTA($D$4:$D$12))",
                      "=COUNTIFS(O4:O12, \">0\") / MAX(1, COUNTA($D$4:$D$12))"
                    ],
                    [
                      "=SUMPRODUCT(E4:E12, $D$4:$D$12)",
                      "=SUMPRODUCT(F4:F12, $D$4:$D$12)",
                      "=SUMPRODUCT(G4:G12, $D$4:$D$12)",
                      "=SUMPRODUCT(H4:H12, $D$4:$D$12)",
                      "=SUMPRODUCT(I4:I12, $D$4:$D$12)",
                      "=SUMPRODUCT(J4:J12, $D$4:$D$12)",
                      "=SUMPRODUCT(K4:K12, $D$4:$D$12)",
                      "=SUMPRODUCT(L4:L12, $D$4:$D$12)",
                      "=SUMPRODUCT(M4:M12, $D$4:$D$12)",
                      "=SUMPRODUCT(N4:N12, $D$4:$D$12)",
                      "=SUMPRODUCT(O4:O12, $D$4:$D$12)"
                    ],
                    [
                      "=(E16*100) + E17",
                      "=(F16*100) + F17",
                      "=(G16*100) + G17",
                      "=(H16*100) + H17",
                      "=(I16*100) + I17",
                      "=(J16*100) + J17",
                      "=(K16*100) + K17",
                      "=(L16*100) + L17",
                      "=(M16*100) + M17",
                      "=(N16*100) + N17",
                      "=(O16*100) + O17"
                    ]
                  ]
                },
                {
                  range: "'Repertorization'!A16:D18",
                  values: [
                    ["Rank 1", `=IF(D16>0, INDEX($E$3:$O$3, MATCH(D16, E18:O18, 0)), "N/A")`, "Score", "=MAX(E18:O18)"],
                    ["Rank 2", `=IF(D17>0, INDEX($E$3:$O$3, MATCH(D17, E18:O18, 0)), "N/A")`, "Score", "=IFERROR(LARGE(E18:O18, 2), 0)"],
                    ["Rank 3", `=IF(D18>0, INDEX($E$3:$O$3, MATCH(D18, E18:O18, 0)), "N/A")`, "Score", "=IFERROR(LARGE(E18:O18, 3), 0)"]
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
                updateSpreadsheetProperties: {
                  properties: {
                    defaultFormat: {
                      textFormat: {
                        fontFamily: "Inter"
                      }
                    }
                  },
                  fields: "defaultFormat.textFormat.fontFamily"
                }
              },
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
          ["Patient ID", data.id, "", "Diagnosis", "='Case Taking'!B38", "", "Progress Score (%)", "=IFERROR(INDEX('Follow-Up Tracker'!C:C, MATCH(9.99999999999999E+307, 'Follow-Up Tracker'!A:A)), \"0%\")"],
          ["Full Name", data.name, "", "Active Remedy", "='Case Taking'!B47 & \" \" & 'Case Taking'!B48", "", "Balance Due (₹)", "='Finance'!E4"],
          ["Age / Gender", `${data.age} / ${data.gender}`, "", "Last Visit Date", "=IFERROR(MAX('Follow-Up Tracker'!A4:A), \"N/A\")", "", "Top Totality Remedy", "=INDEX('Repertorization'!B:B, MATCH(\"Rank 1\", 'Repertorization'!A:A, 0)) & \" (\" & INDEX('Repertorization'!D:D, MATCH(\"Rank 1\", 'Repertorization'!A:A, 0)) & \" pts)\""],
          ["Blood Group", "O+ Pos", "", "Next Review", "=IFERROR(INDEX('Follow-Up Tracker'!G:G, MATCH(9.99999999999999E+307, 'Follow-Up Tracker'!A:A)), \"Not Scheduled\")", "", "Miasmatic Summary", "=IFERROR('AI Repertory Lab'!B4, \"Psora\")"],
          ["Clinic Branch", "Baner Clinic", "", "Consulting Doctor", "Dr. Narayan Jethwani", "", "Primary Doctor", "Dr. Narayan Jethwani"],
          ["Patient Status", data.careLevel.toLowerCase().includes("acute") ? "Acute" : "Chronic", "", "Clinic Branch", "Baner Clinic, Pune", "", "Account Status", "=IF('Finance'!E4<=0, \"Paid\", \"Balance Pending\")"]
        ];

        // values for Case Taking
        const caseTakingValues = Array(55).fill(null).map(() => Array(4).fill(""));
        caseTakingValues[0][0] = "CLINICAL CASE SHEET (MAIN INTENDED WORKING DOCUMENT)";
        
        // Section 1 Patient Details
        caseTakingValues[1][0] = "SECTION 1 – PATIENT DETAILS (COLLAPSIBLE)";
        caseTakingValues[2][0] = "Patient ID"; caseTakingValues[2][1] = data.id;
        caseTakingValues[3][0] = "Full Patient Name"; caseTakingValues[3][1] = data.name;
        caseTakingValues[4][0] = "Age / Gender"; caseTakingValues[4][1] = `${data.age} / ${data.gender}`;
        caseTakingValues[5][0] = "Contact Phone"; caseTakingValues[5][1] = data.phone;
        caseTakingValues[6][0] = "Email Address"; caseTakingValues[6][1] = data.email || "N/A";
        caseTakingValues[7][0] = "Address / Location"; caseTakingValues[7][1] = locationVal;
        caseTakingValues[8][0] = "Register Date"; caseTakingValues[8][1] = today;

        // Section 2 Chief Complaints
        caseTakingValues[9][0] = "SECTION 2 – CHIEF COMPLAINT ANALYSIS";
        caseTakingValues[10][0] = "Primary Case Complaint"; caseTakingValues[10][1] = data.complaint;
        caseTakingValues[11][0] = "Duration"; caseTakingValues[11][1] = data.durationText || "Chronic";
        caseTakingValues[12][0] = "Onset (Sudden / Gradual)"; caseTakingValues[12][1] = "Gradual";
        caseTakingValues[13][0] = "Complaint Severity (1-10)"; caseTakingValues[13][1] = "8";

        // Section 3 Presenting Symptoms
        caseTakingValues[14][0] = "SECTION 3 – PRESENTING SYMPTOMS (REPERTORY TOTALITY)";
        caseTakingValues[15][0] = "Location / Extension"; caseTakingValues[15][1] = "";
        caseTakingValues[16][0] = "Sensation / Pain Character"; caseTakingValues[16][1] = "";
        caseTakingValues[17][0] = "Modalities Better (Amelioration)"; caseTakingValues[17][1] = "";
        caseTakingValues[18][0] = "Modalities Worse (Aggravation)"; caseTakingValues[18][1] = "";
        caseTakingValues[19][0] = "Concomitants"; caseTakingValues[19][1] = "";
        caseTakingValues[20][0] = "Etiology / Causes"; caseTakingValues[20][1] = "";
        caseTakingValues[21][0] = "Maintaining Causes"; caseTakingValues[21][1] = "";

        // Section 4 Mental Generals
        caseTakingValues[22][0] = "SECTION 4 – MENTAL GENERALS";
        caseTakingValues[23][0] = "Temperament"; caseTakingValues[23][1] = "";
        caseTakingValues[24][0] = "Fears & Phobias"; caseTakingValues[24][1] = "";
        caseTakingValues[25][0] = "Anxiety States"; caseTakingValues[25][1] = "";
        caseTakingValues[26][0] = "Anger & Reactions"; caseTakingValues[26][1] = "";
        caseTakingValues[27][0] = "Grief / Suppressions"; caseTakingValues[27][1] = "";
        caseTakingValues[28][0] = "Personality Traits / Attributes"; caseTakingValues[28][1] = "";

        // Section 5 Physical Generals
        caseTakingValues[29][0] = "SECTION 5 – PHYSICAL GENERALS";
        caseTakingValues[30][0] = "Appetite / Hunger"; caseTakingValues[30][1] = "";
        caseTakingValues[31][0] = "Thirst Quality"; caseTakingValues[31][1] = "";
        caseTakingValues[32][0] = "Food Desires"; caseTakingValues[32][1] = "";
        caseTakingValues[33][0] = "Food Aversions"; caseTakingValues[33][1] = "";
        caseTakingValues[34][0] = "Thermal State (Chilly / Hot)"; caseTakingValues[34][1] = "";
        caseTakingValues[35][0] = "Sleep Cycles & Dreams"; caseTakingValues[35][1] = "";

        // Section 9 Clinical Diagnosis
        caseTakingValues[36][0] = "SECTION 9 – CLINICAL DIAGNOSIS";
        caseTakingValues[37][0] = "Clinical Diagnosis"; caseTakingValues[37][1] = "";
        caseTakingValues[38][0] = "Case Complexity"; caseTakingValues[38][1] = "";

        // Section 10 Miasmatic Assessment
        caseTakingValues[39][0] = "SECTION 10 – MIASMATIC ASSESSMENT (FORMULA DRIVEN)";
        caseTakingValues[40][0] = "Psora Miasm Score"; caseTakingValues[40][1] = "=COUNTIF(B3:B39, \"*[Psora]*\")";
        caseTakingValues[41][0] = "Sycosis Miasm Score"; caseTakingValues[41][1] = "=COUNTIF(B3:B39, \"*[Sycosis]*\")";
        caseTakingValues[42][0] = "Syphilis Miasm Score"; caseTakingValues[42][1] = "=COUNTIF(B3:B39, \"*[Syphilis]*\")";
        caseTakingValues[43][0] = "Tubercular Miasm Score"; caseTakingValues[43][1] = "=COUNTIF(B3:B39, \"*[Tubercular]*\")";
        caseTakingValues[44][0] = "Cancerinic Miasm Score"; caseTakingValues[44][1] = "=COUNTIF(B3:B39, \"*[Cancerinic]*\")";

        // Section 12 Prescription
        caseTakingValues[45][0] = "SECTION 12 – CURRENT PRESCRIPTION & ADVICE";
        caseTakingValues[46][0] = "Remedy Name"; caseTakingValues[46][1] = "";
        caseTakingValues[47][0] = "Potency / Scale"; caseTakingValues[47][1] = "";
        caseTakingValues[48][0] = "Dosage & Frequency"; caseTakingValues[48][1] = "";
        caseTakingValues[49][0] = "Duration"; caseTakingValues[49][1] = "";
        caseTakingValues[50][0] = "Dietary & lifestyle advice"; caseTakingValues[50][1] = "";

        // Section 13 AI Diagnostics (to be populated by portal)
        caseTakingValues[51][0] = "SECTION 13 – AI CLINICAL SYNTHESIS VERDICT";
        caseTakingValues[52][0] = "AI Analysis Engine"; caseTakingValues[52][1] = "Gemini 3.5 Clinical Synthesis";
        caseTakingValues[53][0] = "Analysis Timestamp"; caseTakingValues[53][1] = "";
        caseTakingValues[54][0] = "AI Constitutional Justification"; caseTakingValues[54][1] = "";

        // values for Follow-Up Tracker
        const followUpValues = [
          ["CLINICAL FOLLOW-UP TRACKER", "", "", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["Date", "Symptoms & Patient Report (Db-Click)", "Improvement %", "Remedy (Click to edit)", "Potency / Dose", "Assessment / Notes (Db-Click)", "Next Follow-up"],
          [today, "Case initialized. Demographics and baseline complaint registered.", 0, "", "", "Plan initialized.", ""]
        ];

        // values for Repertorization
        const repertoryValues = [
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["REPERTORY GRID & Dynamic ANALYSIS MATRIX", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["Rubric Name", "Chapter / Location", "Source", "Importance Weight", "Nux-v", "Lyc", "Ars", "Puls", "Sulph", "Rhus-t", "Calc", "Sil", "Nat-m", "Ign", "Sep", "Totality Score"],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "=IF(D4=\"\", \"\", D4*SUM(E4:O4))"],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "=IF(D5=\"\", \"\", D5*SUM(E5:O5))"],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "=IF(D6=\"\", \"\", D6*SUM(E6:O6))"],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "=IF(D7=\"\", \"\", D7*SUM(E7:O7))"],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "=IF(D8=\"\", \"\", D8*SUM(E8:O8))"],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "=IF(D9=\"\", \"\", D9*SUM(E9:O9))"],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "=IF(D10=\"\", \"\", D10*SUM(E10:O10))"],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "=IF(D11=\"\", \"\", D11*SUM(E11:O11))"],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "=IF(D12=\"\", \"\", D12*SUM(E12:O12))"],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "=IF(D13=\"\", \"\", D13*SUM(E13:O13))"],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["Symptom Coverage", "", "", "", 
            "=COUNTIFS(E4:E13, \">0\") / MAX(1, COUNTA($D$4:$D$13))", 
            "=COUNTIFS(F4:F13, \">0\") / MAX(1, COUNTA($D$4:$D$13))", 
            "=COUNTIFS(G4:G13, \">0\") / MAX(1, COUNTA($D$4:$D$13))", 
            "=COUNTIFS(H4:H13, \">0\") / MAX(1, COUNTA($D$4:$D$13))", 
            "=COUNTIFS(I4:I13, \">0\") / MAX(1, COUNTA($D$4:$D$13))", 
            "=COUNTIFS(J4:J13, \">0\") / MAX(1, COUNTA($D$4:$D$13))", 
            "=COUNTIFS(K4:K13, \">0\") / MAX(1, COUNTA($D$4:$D$13))", 
            "=COUNTIFS(L4:L13, \">0\") / MAX(1, COUNTA($D$4:$D$13))", 
            "=COUNTIFS(M4:M13, \">0\") / MAX(1, COUNTA($D$4:$D$13))", 
            "=COUNTIFS(N4:N13, \">0\") / MAX(1, COUNTA($D$4:$D$13))", 
            "=COUNTIFS(O4:O13, \">0\") / MAX(1, COUNTA($D$4:$D$13))", ""],
          ["Sum of Grades", "", "", "", 
            "=SUMPRODUCT(E4:E13, $D$4:$D$13)", 
            "=SUMPRODUCT(F4:F13, $D$4:$D$13)", 
            "=SUMPRODUCT(G4:G13, $D$4:$D$13)", 
            "=SUMPRODUCT(H4:H13, $D$4:$D$13)", 
            "=SUMPRODUCT(I4:I13, $D$4:$D$13)", 
            "=SUMPRODUCT(J4:J13, $D$4:$D$13)", 
            "=SUMPRODUCT(K4:K13, $D$4:$D$13)", 
            "=SUMPRODUCT(L4:L13, $D$4:$D$13)", 
            "=SUMPRODUCT(M4:M13, $D$4:$D$13)", 
            "=SUMPRODUCT(N4:N13, $D$4:$D$13)", 
            "=SUMPRODUCT(O4:O13, $D$4:$D$13)", ""],
          ["Totality Rank Score", "", "", "", 
            "=(E16*100) + E17", 
            "=(F16*100) + F17", 
            "=(G16*100) + G17", 
            "=(H16*100) + H17", 
            "=(I16*100) + I17", 
            "=(J16*100) + J17", 
            "=(K16*100) + K17", 
            "=(L16*100) + L17", 
            "=(M16*100) + M17", 
            "=(N16*100) + N17", 
            "=(O16*100) + O17", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["Top Remedy Ranking", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["Rank 1", `=IF(D21>0, INDEX($E$3:$O$3, MATCH(D21, E18:O18, 0)), "N/A")`, "Score", "=MAX(E18:O18)", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["Rank 2", `=IF(D22>0, INDEX($E$3:$O$3, MATCH(D22, E18:O18, 0)), "N/A")`, "Score", "=IFERROR(LARGE(E18:O18, 2), 0)", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["Rank 3", `=IF(D23>0, INDEX($E$3:$O$3, MATCH(D23, E18:O18, 0)), "N/A")`, "Score", "=IFERROR(LARGE(E18:O18, 3), 0)", "", "", "", "", "", "", "", "", "", "", "", ""]
        ];

        // Normalize and map inputs to align with mock and premium options
        const normalizedCareLevel = data.careLevel ? data.careLevel.toLowerCase().trim() : "";
        let resolvedCareLevel = data.careLevel || "🎯 Deep Systemic Care";
        if (normalizedCareLevel.includes("critical") || normalizedCareLevel.includes("emergency")) {
          resolvedCareLevel = "🚨 Acute Critical Care";
        } else if (normalizedCareLevel === "mild" || normalizedCareLevel.includes("acute") || normalizedCareLevel.includes("wellness")) {
          resolvedCareLevel = "🌱 Acute & Wellness Care";
        } else if (normalizedCareLevel === "moderate" || normalizedCareLevel.includes("standard") || normalizedCareLevel.includes("chronic")) {
          resolvedCareLevel = "⚡ Standard Chronic Care";
        } else if (normalizedCareLevel === "focused" || normalizedCareLevel.includes("deep") || normalizedCareLevel.includes("systemic")) {
          resolvedCareLevel = "🎯 Deep Systemic Care";
        } else if (normalizedCareLevel === "organ" || normalizedCareLevel.includes("advanced") || normalizedCareLevel.includes("pathological")) {
          resolvedCareLevel = "🫁 Advanced Pathological Care";
        } else if (normalizedCareLevel === "comprehensive" || normalizedCareLevel.includes("multisystem") || normalizedCareLevel.includes("integrative")) {
          resolvedCareLevel = "🔮 Multisystem Integrative Care";
        }

        const rawCycle = data.billingCycle ? data.billingCycle.toLowerCase().trim() : "";
        const resolvedBillingCycle = rawCycle === "weekly" ? "Weekly" : "Monthly";

        const rawConcession = data.concessionApplied ? data.concessionApplied.toLowerCase().trim() : "";
        let resolvedConcession = "None";
        if (rawConcession.includes("senior")) {
          resolvedConcession = "Senior 15%";
        } else if (rawConcession.includes("socio") || rawConcession.includes("compassionate")) {
          resolvedConcession = "Socio-Economic 30%";
        } else if (rawConcession.includes("override")) {
          resolvedConcession = "Override";
        }

        // values for Treatment Planner (adjusted for exact row indices to prevent circular references)
        const plannerValues = [
          ["", "", "", "", "", "", ""],
          ["TREATMENT COMPLEXITY & FINANCIAL PLANNER", "", "", "", "", "", ""],
          ["Care Level", "Billing Cycle", "Duration Value", "Conditions Count", "Concession Applied", "Override Price (₹)", "Medicine Add-ons (₹)"],
          [resolvedCareLevel, resolvedBillingCycle, data.durationValue || 1, data.conditionsCount || 1, resolvedConcession, data.overridePrice || 0, data.medicineAddons || 0],
          ["", "", "", "", "", "", ""],
          ["PRICING BREAKDOWN", "", "", "", "", "", ""],
          ["Component", "Rate / Amount (₹)", "Calculation Description", "", "", "", ""],
          ["Base Rate", `=IF(ISNUMBER(SEARCH("Critical", A4)), IF(B4="Weekly", 5000, 20000), IF(ISNUMBER(SEARCH("Wellness", A4)), IF(B4="Weekly", 1200, 4800), IF(ISNUMBER(SEARCH("Standard", A4)), IF(B4="Weekly", 2400, 9600), IF(ISNUMBER(SEARCH("Deep", A4)), IF(B4="Weekly", 4200, 16800), IF(ISNUMBER(SEARCH("Advanced", A4)), IF(B4="Weekly", 6000, 24000), IF(ISNUMBER(SEARCH("Multisystem", A4)), IF(B4="Weekly", 8400, 33600), 4800))))))`, "Base rate based on Care Level and Billing Cycle", "", "", ""],
          ["Conditions Surcharge", `=IF(D4<=1, 0, (D4-1)*IF(ISNUMBER(SEARCH("Critical", A4)), IF(B4="Weekly", 1000, 4000), IF(ISNUMBER(SEARCH("Wellness", A4)), IF(B4="Weekly", 300, 1200), IF(ISNUMBER(SEARCH("Standard", A4)), IF(B4="Weekly", 450, 1800), IF(ISNUMBER(SEARCH("Deep", A4)), IF(B4="Weekly", 750, 3000), IF(ISNUMBER(SEARCH("Advanced", A4)), IF(B4="Weekly", 1050, 4200), IF(ISNUMBER(SEARCH("Multisystem", A4)), IF(B4="Weekly", 1350, 5400), 0)))))))`, "Surcharge for co-existing chronic conditions", "", "", ""],
          ["Gross Subtotal", "=(B8+B9)*C4", "Adjusted base rate multiplied by duration", "", "", "", ""],
          ["Duration Discount %", `=IF(IF(B4="Weekly", C4, C4*4)>=48, 0.30, IF(IF(B4="Weekly", C4, C4*4)>=24, 0.25, IF(IF(B4="Weekly", C4, C4*4)>=12, 0.20, IF(IF(B4="Weekly", C4, C4*4)>=8, 0.15, IF(IF(B4="Weekly", C4, C4*4)>=4, 0.10, IF(IF(B4="Weekly", C4, C4*4)>=2, 0.05, 0))))))`, "Duration loyalty discount percentage", "", "", "", ""],
          ["Duration Discount Amount", "=B10*B11", "Total savings from duration discount", "", "", "", ""],
          ["Concession Discount Amount", `=IF(ISNUMBER(SEARCH("Senior", E4)), (B10-B12)*0.15, IF(ISNUMBER(SEARCH("Socio", E4)), (B10-B12)*0.30, IF(ISNUMBER(SEARCH("Override", E4)), MAX(0, (B10-B12) - F4), 0)))`, "Compassionate, Senior, or Override concession", "", "", "", ""],
          ["Medicine Add-ons", "=G4", "Medicine charges and dynamic add-on scripts", "", "", "", ""],
          ["Total Program Cost", "=B10-B12-B13+B14", "Final package cost taking all factors into consideration", "", "", "", ""],
          ["Amount Received", data.receivedAmount !== undefined ? data.receivedAmount : data.finalPrice, "Amount collected from patient for this plan", "", "", "", ""],
          ["Balance Due", "=B15-B16", "Outstanding dues for this treatment plan", "", "", "", ""],
          ["", "", "", "", "", "", ""],
          ["WhatsApp Invoice Message", `="Dear " & 'Case Taking'!B4 & ", thank you for consulting Homeo Healthcare. Your treatment package is: " & A4 & " (" & IF(D4=1, "1 condition", D4 & " conditions") & ", " & C4 & " " & IF(B4="Weekly", IF(C4=1, "week", "weeks"), IF(C4=1, "month", "months")) & IF(E4="None", "", " [" & E4 & "]") & "). Total Cost: ₹" & TEXT(B15, "#,##0") & ". Balance Due: ₹" & TEXT(B17, "#,##0") & ". Please pay using Gpay: ${paymentPhone}. Clinic Branch: Homeo Healthcare."`, "", "", "", "", ""]
        ];

        // values for Finance
        const financeValues = [
          ["", "", "", "", "", "", "", ""],
          ["PATIENT FINANCIAL LEDGER & REVENUE HISTORY", "", "", "", "", "", "", ""],
          ["TOTAL AMOUNT BILLED", "", "TOTAL REVENUE COLLECTED", "", "OUTSTANDING BALANCE", "", "", ""],
          ["=SUM(D9:D100)", "", "=SUM(E9:E100)", "", "=A4-C4", "", "", ""],
          ["INITIAL PLAN + SURCHARGES + ADD-ONS", "", "DIRECT PAYMENTS RECEIVED TILL DATE", "", "REMAINING RECEIVABLE AMOUNTS", "", "", ""],
          ["", "", "", "", "", "", "", ""],
          ["TRANSACTION HISTORY RECORD", "", "", "", "", "", "", ""],
          ["DATE", "DESCRIPTION / EVENT", "REFERENCE ID", "AMOUNT CHARGED", "AMOUNT RECEIVED", "OUTSTANDING BALANCE", "PAYMENT MODE", "STATUS"],
          [today, `${data.careLevel} - Initial Package Setup`, "Tx-Plan-" + data.id, "='Treatment Planner'!B15", "='Treatment Planner'!B16", "=D9-E9", "UPI", `=IF(F9<=0, "PAID", IF(E9>0, "PARTIALLY PAID", "UNPAID"))`],
          ["05-06-2026", "First Consultation Check-in", "FU-01", 0, 0, "=D10-E10", "N/A", "PAID"],
          ["", "", "", "", "", "", "", ""]
        ];

        // values for AI Repertory Lab
        const aiRepertoryValues = [
          ["AI REPERTORY LAB • HIGH-FIDELITY NEURAL TOTALITY MATCHING ENGINE", "", "", "", "CLINICAL DIAGNOSTIC SYNTHESIS VERDICT", "", "", ""],
          ["", "", "", "", "", "", "", ""],
          ["SPREADSHEET REPERTORY PAYLOAD", "", "", "", "CLINICAL DIAGNOSTIC SYNTHESIS VERDICT", "", "", ""],
          ["Dominant Miasm", `=IF('Case Taking'!B42>MAX('Case Taking'!B41,'Case Taking'!B43,'Case Taking'!B44,'Case Taking'!B45),"Sycosis",IF('Case Taking'!B41>MAX('Case Taking'!B42,'Case Taking'!B43,'Case Taking'!B44,'Case Taking'!B45),"Psora",IF('Case Taking'!B43>MAX('Case Taking'!B41,'Case Taking'!B42,'Case Taking'!B44,'Case Taking'!B45),"Syphilis",IF('Case Taking'!B44>MAX('Case Taking'!B41,'Case Taking'!B42,'Case Taking'!B43,'Case Taking'!B45),"Tubercular","Cancerinic"))))`, "", "", "AI Constitutional Justification & Totality Synthesis Report", "", "", ""],
          ["Psora Count", "='Case Taking'!B41", "", "", `=IFERROR('Case Taking'!B55, "No AI Analysis Run yet. Transmit from portal to generate.")`, "", "", ""],
          ["Sycosis Count", "='Case Taking'!B42", "", "", "", "", "", ""],
          ["Syphilis Count", "='Case Taking'!B43", "", "", "", "", "", ""],
          ["Tubercular Count", "='Case Taking'!B44", "", "", "", "", "", ""],
          ["Cancerinic Count", "='Case Taking'!B45", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", ""],
          ["TOP REMEDY RANKINGS FROM SPREADSHEET MATRIX", "", "", "", "MATERIA MEDICA KEYNOTE VERIFICATIONS", "", "", ""],
          ["Rank 1 Remedy", `=IFERROR(INDEX('Repertorization'!B:B, MATCH("Rank 1", 'Repertorization'!A:A, 0)), "N/A")`, "Score", `=IFERROR(INDEX('Repertorization'!D:D, MATCH("Rank 1", 'Repertorization'!A:A, 0)), 0)`, `=IFERROR(INDEX('Config DB'!I$4:I$100, MATCH(B12, 'Config DB'!H$4:H$100, 0)) & ":", B12 & ":")`, `=IFERROR(INDEX('Config DB'!J$4:J$100, MATCH(B12, 'Config DB'!H$4:H$100, 0)), "Verify modalities, thermal response, and characteristic generals.")`, "", ""],
          ["Rank 2 Remedy", `=IFERROR(INDEX('Repertorization'!B:B, MATCH("Rank 2", 'Repertorization'!A:A, 0)), "N/A")`, "Score", `=IFERROR(INDEX('Repertorization'!D:D, MATCH("Rank 2", 'Repertorization'!A:A, 0)), 0)`, `=IFERROR(INDEX('Config DB'!I$4:I$100, MATCH(B13, 'Config DB'!H$4:H$100, 0)) & ":", B13 & ":")`, `=IFERROR(INDEX('Config DB'!J$4:J$100, MATCH(B13, 'Config DB'!H$4:H$100, 0)), "Verify modalities, thermal response, and characteristic generals.")`, "", ""],
          ["Rank 3 Remedy", `=IFERROR(INDEX('Repertorization'!B:B, MATCH("Rank 3", 'Repertorization'!A:A, 0)), "N/A")`, "Score", `=IFERROR(INDEX('Repertorization'!D:D, MATCH("Rank 3", 'Repertorization'!A:A, 0)), 0)`, `=IFERROR(INDEX('Config DB'!I$4:I$100, MATCH(B14, 'Config DB'!H$4:H$100, 0)) & ":", B14 & ":")`, `=IFERROR(INDEX('Config DB'!J$4:J$100, MATCH(B14, 'Config DB'!H$4:H$100, 0)), "Verify modalities, thermal response, and characteristic generals.")`, "", ""]
        ];

        // values for Reports & Attachments
        const attachmentsValues = [
          ["INVESTIGATION REPORTS & CLINICAL FILE ATTACHMENTS", "", "", ""],
          ["", "", "", ""],
          ["Report Date", "Report Category", "Investigation Target", "Report Hyperlink"],
          ["", "", "", ""],
          ["", "", "", ""]
        ];

        // values for Config DB
        const configValues = [
          ["REFERENCE METADATA DATABASE", "", "", "", "", "PACKAGES", "PRICE", "REMEDY KEYNOTE DIRECTORY", "", ""],
          ["", "", "", "", "", "", "", "", "", ""],
          ["REMEDIES", "POTENCIES", "MIASMS", "CLINIC BRANCHES", "DOCTORS", "Standard Consult", 300, "ABBREVIATION", "REMEDY FULL NAME", "KEYNOTES"],
          ["Nux Vomica", "6C", "Psora", "Baner Clinic, Pune", "Dr. Narayan Jethwani", "Acute Care Plan", 1500, "Nux-v", "Nux Vomica", "Chilly, irritable, stomach complaints worse after eating."],
          ["Arsenicum Album", "30C", "Sycosis", "Koregaon Park Clinic, Pune", "Dr. R. Jethwani", "3-Month Chronic", 4500, "Ars", "Arsenicum Album", "Great anxiety, restlessness, chilly, worse at midnight."],
          ["Lycopodium Clavatum", "200C", "Syphilis", "Mumbai OPD", "", "6-Month Advanced", 8500, "Lyc", "Lycopodium Clavatum", "Right-sided, flatulence, gas, warm food cravings."],
          ["Pulsatilla Pratensis", "1M", "Tubercular", "", "", "1-Year Premium", 15000, "Puls", "Pulsatilla Pratensis", "Mild, yielding disposition, desires open air and consolation, thirstless."],
          ["Sulphur", "10M", "Cancerinic", "", "", "", "", "Sulph", "Sulphur", "Warm-blooded, desires sweets, empty sinking at 11 AM, red orifices."],
          ["Rhus Toxicodendron", "50M", "", "", "", "", "", "Rhus-t", "Rhus Toxicodendron", "Restless, joints stiff on first motion, improves with continuous motion, worse damp cold."],
          ["Bryonia Alba", "CM", "", "", "", "", "", "Bry", "Bryonia Alba", "Worse from least motion, better from absolute rest, stitching pains, dry mouth, great thirst."],
          ["Calcarea Carbonica", "LM1", "", "", "", "", "", "Calc", "Calcarea Carbonica", "Chilly, sluggish metabolism, tendency to obesity, sweaty head, desires eggs."],
          ["Silicea", "LM2", "", "", "", "", "", "Sil", "Silicea", "Chilly, lacks grit, sensitive to cold drafts, sweaty feet (offensive), slow healing."],
          ["Natrum Muriaticum", "LM5", "", "", "", "", "", "Nat-m", "Natrum Muriaticum", "Reserved, silent grief, craves salt, worse warmth of sun, mapped emotional tension."],
          ["Ignatia Amara", "LM10", "", "", "", "", "", "Ign", "Ignatia Amara", "Ailments from recent grief or shock, sighing, contradictory symptoms."],
          ["Sepia Officinalis", "LM30", "", "", "", "", "", "Sep", "Sepia Officinalis", "Indifferent to loved ones, dragging down sensation, better from vigorous exercise."]
        ];

        // Batch update sheet values
        await sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: newSheetId,
          requestBody: {
            valueInputOption: "USER_ENTERED",
            data: [
              { range: "'Dashboard'!A1:H9", values: dashboardValues },
              { range: "'Case Taking'!A1:D55", values: caseTakingValues },
              { range: "'Follow-Up Tracker'!A1:G4", values: followUpValues },
              { range: "'Repertorization'!A1:P23", values: repertoryValues },
              { range: "'Treatment Planner'!A1:G21", values: plannerValues },
              { range: "'Finance'!A1:H11", values: financeValues },
              { range: "'AI Repertory Lab'!A1:H14", values: aiRepertoryValues },
              { range: "'Reports & Attachments'!A1:D5", values: attachmentsValues },
              { range: "'Config DB'!A1:J15", values: configValues }
            ]
          }
        });

        // Apply grid formatting for columns, borders, merges across all tabs
        const requests = [];

        // Formatting for Dashboard (sheetId = Dashboard)
        const dashId = sheetsMap["Dashboard"] || 0;
        const caseTakingId = sheetsMap["Case Taking"];
        const followUpId = sheetsMap["Follow-Up Tracker"];
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
                  backgroundColor: { red: 15/255, green: 118/255, blue: 110/255 }, // Brand Teal #0F766E
                  textFormat: { fontFamily: "Inter", foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 13, bold: true },
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
                  textFormat: { fontFamily: "Inter", foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 }, fontSize: 10, bold: true }, // Brand Teal #0F766E
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
                  textFormat: { fontFamily: "Inter", foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 }, fontSize: 9, bold: true },
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
                  textFormat: { fontFamily: "Inter", foregroundColor: { red: 15/255, green: 23/255, blue: 42/255 }, fontSize: 10, bold: true },
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
                  textFormat: { fontFamily: "Inter", foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 }, fontSize: 9, bold: true },
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
                  textFormat: { fontFamily: "Inter", foregroundColor: { red: 15/255, green: 23/255, blue: 42/255 }, fontSize: 10, bold: true },
                  horizontalAlignment: "LEFT", verticalAlignment: "MIDDLE"
                }
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
            }
          },
          // Card 3 Keys (Col G, rows 4-9)
          {
            repeatCell: {
              range: { sheetId: dashId, startRowIndex: 3, endRowIndex: 9, startColumnIndex: 6, endColumnIndex: 7 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                  textFormat: { fontFamily: "Inter", foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 }, fontSize: 9, bold: true },
                  horizontalAlignment: "LEFT", verticalAlignment: "MIDDLE"
                }
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
            }
          },
          // Card 3 Values (Col H, rows 4-9)
          {
            repeatCell: {
              range: { sheetId: dashId, startRowIndex: 3, endRowIndex: 9, startColumnIndex: 7, endColumnIndex: 8 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 1, green: 1, blue: 1 },
                  textFormat: { fontFamily: "Inter", foregroundColor: { red: 15/255, green: 23/255, blue: 42/255 }, fontSize: 10, bold: true },
                  horizontalAlignment: "LEFT", verticalAlignment: "MIDDLE"
                }
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
            }
          },
          // Card Borders (Card 1: A3:B9, Card 2: D3:E9, Card 3: G3:H9)
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
              range: { sheetId: dashId, startRowIndex: 2, endRowIndex: 9, startColumnIndex: 6, endColumnIndex: 8 },
              top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
              bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
              left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
              right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
            }
          }
        );

        // Format H4 (Progress Score), H5 (Balance Due), and E6 (Last Visit Date) on Dashboard
        requests.push(
          {
            repeatCell: {
              range: {
                sheetId: dashId,
                startRowIndex: 3,
                endRowIndex: 4,
                startColumnIndex: 7,
                endColumnIndex: 8
              },
              cell: {
                userEnteredFormat: {
                  numberFormat: {
                    type: "NUMBER",
                    pattern: "0%\" Improvement\""
                  },
                  textFormat: {
                    fontFamily: "Inter",bold: true,
                    foregroundColor: { red: 46/255, green: 139/255, blue: 87/255 } // SeaGreen
                  }
                }
              },
              fields: "userEnteredFormat(numberFormat,textFormat(bold,foregroundColor))"
            }
          },
          // Currency formatting for H5 (Balance Due) - colors set via conditional formatting below
          {
            repeatCell: {
              range: {
                sheetId: dashId,
                startRowIndex: 4,
                endRowIndex: 5,
                startColumnIndex: 7,
                endColumnIndex: 8
              },
              cell: {
                userEnteredFormat: {
                  numberFormat: {
                    type: "CURRENCY",
                    pattern: "\"₹\"#,##0"
                  }
                }
              },
              fields: "userEnteredFormat(numberFormat)"
            }
          },
          // Balance Due H5 conditional formatting (green if <= 0, red if > 0)
          {
            addConditionalFormatRule: {
              rule: {
                ranges: [
                  { sheetId: dashId, startRowIndex: 4, endRowIndex: 5, startColumnIndex: 7, endColumnIndex: 8 }
                ],
                booleanRule: {
                  condition: { type: "NUMBER_GREATER", values: [{ userEnteredValue: "0" }] },
                  format: {
                    textFormat: {  foregroundColor: { red: 225/255, green: 29/255, blue: 72/255 }, bold: true } // rose-600
                  }
                }
              },
              index: 0
            }
          },
          {
            addConditionalFormatRule: {
              rule: {
                ranges: [
                  { sheetId: dashId, startRowIndex: 4, endRowIndex: 5, startColumnIndex: 7, endColumnIndex: 8 }
                ],
                booleanRule: {
                  condition: { type: "NUMBER_LESS_THAN_EQ", values: [{ userEnteredValue: "0" }] },
                  format: {
                    textFormat: {  foregroundColor: { red: 4/255, green: 120/255, blue: 87/255 }, bold: true } // emerald-700
                  }
                }
              },
              index: 1
            }
          },
          // Format E5 (Active Remedy) in bold emerald green
          {
            repeatCell: {
              range: {
                sheetId: dashId,
                startRowIndex: 4,
                endRowIndex: 5,
                startColumnIndex: 4,
                endColumnIndex: 5
              },
              cell: {
                userEnteredFormat: {
                  textFormat: {
                    fontFamily: "Inter",bold: true,
                    foregroundColor: { red: 4/255, green: 120/255, blue: 87/255 } // emerald-700
                  }
                }
              },
              fields: "userEnteredFormat.textFormat(bold,foregroundColor)"
            }
          },
          // Format E6 (Last Visit Date)
          {
            repeatCell: {
              range: {
                sheetId: dashId,
                startRowIndex: 5,
                endRowIndex: 6,
                startColumnIndex: 4,
                endColumnIndex: 5
              },
              cell: {
                userEnteredFormat: {
                  numberFormat: {
                    type: "DATE",
                    pattern: "dd-mm-yyyy"
                  }
                }
              },
              fields: "userEnteredFormat.numberFormat"
            }
          }
        );

        // Add Miasmatic Profile COLUMN Chart to Dashboard
        requests.push({
          addChart: {
            chart: {
              spec: {
                title: "MIASMATIC PROFILE (TOTALITY TAGS)",
                basicChart: {
                  chartType: "COLUMN",
                  legendPosition: "NO_LEGEND",
                  domains: [
                    {
                      domain: {
                        sourceRange: {
                          sources: [
                            {
                              sheetId: caseTakingId,
                              startRowIndex: 42, // Row 43 (Psora Count)
                              endRowIndex: 47,  // Row 47 (Cancerinic Count)
                              startColumnIndex: 0, // Column A (labels)
                              endColumnIndex: 1
                            }
                          ]
                        }
                      }
                    }
                  ],
                  series: [
                    {
                      series: {
                        sourceRange: {
                          sources: [
                            {
                              sheetId: caseTakingId,
                              startRowIndex: 42, // Row 43
                              endRowIndex: 47,  // Row 47
                              startColumnIndex: 1, // Column B (scores)
                              endColumnIndex: 2
                            }
                          ]
                        }
                      },
                      targetAxis: "LEFT_AXIS"
                    }
                  ]
                }
              },
              position: {
                overlayPosition: {
                  anchorCell: {
                    sheetId: dashId,
                    rowIndex: 10, // Row 11 (starting compact layout below cards ending at Row 9)
                    columnIndex: 0 // Column A
                  },
                  offsetXPixels: 10,
                  offsetYPixels: 15,
                  widthPixels: 420,
                  heightPixels: 300
                }
              }
            }
          }
        });

        // Add Symptom Severity & Improvement Trend LINE Chart to Dashboard
        if (followUpId !== undefined) {
          requests.push({
            addChart: {
              chart: {
                spec: {
                  title: "SYMPTOM SEVERITY & IMPROVEMENT TREND",
                  basicChart: {
                    chartType: "LINE",
                    legendPosition: "NO_LEGEND",
                    domains: [
                      {
                        domain: {
                          sourceRange: {
                            sources: [
                              {
                                sheetId: followUpId,
                                startRowIndex: 2, // Row 3 (header "Date")
                                endRowIndex: 15,  // Row 15
                                startColumnIndex: 0, // Column A (Date)
                                endColumnIndex: 1
                              }
                            ]
                          }
                        }
                      }
                    ],
                    series: [
                      {
                        series: {
                          sourceRange: {
                            sources: [
                              {
                                sheetId: followUpId,
                                startRowIndex: 2, // Row 3 (header "Improvement %")
                                endRowIndex: 15,  // Row 15
                                startColumnIndex: 2, // Column C (Improvement %)
                                endColumnIndex: 3
                              }
                            ]
                          }
                        },
                        targetAxis: "LEFT_AXIS"
                      }
                    ]
                  }
                },
                position: {
                  overlayPosition: {
                    anchorCell: {
                      sheetId: dashId,
                      rowIndex: 10, // Row 11 (starting compact layout below cards ending at Row 9)
                      columnIndex: 4 // Column E
                    },
                    offsetXPixels: 10,
                    offsetYPixels: 15,
                    widthPixels: 420,
                    heightPixels: 300
                  }
                }
              }
            }
          });
        }

        // Formatting for Case Taking
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
            // Column widths
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
            // Grid borders for the Case Taking range (A2:B55)
            {
              updateBorders: {
                range: {
                  sheetId: caseTakingId,
                  startRowIndex: 1,
                  endRowIndex: 55,
                  startColumnIndex: 0,
                  endColumnIndex: 2
                },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                innerHorizontal: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } },
                innerVertical: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } }
              }
            },
            // Style Column A labels (Col A, rows 3-55)
            {
              repeatCell: {
                range: {
                  sheetId: caseTakingId,
                  startRowIndex: 2,
                  endRowIndex: 55,
                  startColumnIndex: 0,
                  endColumnIndex: 1
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { fontFamily: "Inter", foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 }, fontSize: 9, bold: true },
                    horizontalAlignment: "LEFT",
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Style Column B values (Col B, rows 3-55, left-aligned)
            {
              repeatCell: {
                range: {
                  sheetId: caseTakingId,
                  startRowIndex: 2,
                  endRowIndex: 55,
                  startColumnIndex: 1,
                  endColumnIndex: 2
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { fontFamily: "Inter", foregroundColor: { red: 15/255, green: 23/255, blue: 42/255 }, fontSize: 10, bold: true },
                    horizontalAlignment: "LEFT",
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
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
                    backgroundColor: { red: 15/255, green: 118/255, blue: 110/255 }, // Brand Teal #0F766E
                    textFormat: { fontFamily: "Inter", foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 12, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            }
          );

          // Add Collapsible Groups for Case Taking (new contiguous coordinates)
          const groups = [
            { start: 2, end: 9 },    // Section 1: Patient Details (rows 3 to 9, indices 2 to 8)
            { start: 10, end: 14 },  // Section 2: Chief Complaints (rows 11 to 14, indices 10 to 13)
            { start: 15, end: 22 },  // Section 3: Presenting Symptoms (rows 16 to 22, indices 15 to 21)
            { start: 23, end: 29 },  // Section 4: Mental Generals (rows 24 to 29, indices 23 to 28)
            { start: 30, end: 36 },  // Section 5: Physical Generals (rows 31 to 36, indices 30 to 35)
            { start: 37, end: 39 },  // Section 9: Clinical Diagnosis (rows 38 to 39, indices 37 to 38)
            { start: 40, end: 45 },  // Section 10: Miasmatic Assessment (rows 41 to 45, indices 40 to 44)
            { start: 46, end: 51 },  // Section 12: Prescription & Advice (rows 47 to 51, indices 46 to 50)
            { start: 52, end: 55 }   // Section 13: AI Diagnostics Verdict (rows 53 to 55, indices 52 to 54)
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
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 } }, // Brand Teal #0F766E
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            });
          }
        }

        // Formatting for Follow-Up Tracker
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
                properties: { pixelSize: 110 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: followUpId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
                properties: { pixelSize: 300 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: followUpId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 },
                properties: { pixelSize: 100 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: followUpId, dimension: "COLUMNS", startIndex: 3, endIndex: 4 },
                properties: { pixelSize: 200 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: followUpId, dimension: "COLUMNS", startIndex: 4, endIndex: 5 },
                properties: { pixelSize: 130 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: followUpId, dimension: "COLUMNS", startIndex: 5, endIndex: 6 },
                properties: { pixelSize: 280 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: followUpId, dimension: "COLUMNS", startIndex: 6, endIndex: 7 },
                properties: { pixelSize: 120 }, fields: "pixelSize"
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
                    textFormat: { fontFamily: "Inter", foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 12, bold: true },
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
                    backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Table Borders A3:G100
            {
              updateBorders: {
                range: { sheetId: followUpId, startRowIndex: 2, endRowIndex: 100, startColumnIndex: 0, endColumnIndex: 7 },
                top: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
                bottom: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
                left: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
                right: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
                innerHorizontal: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } },
                innerVertical: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } }
              }
            },
            // Date format for Column A (Row 4 onwards) + align CENTER + bold blue text
            {
              repeatCell: {
                range: { sheetId: followUpId, startRowIndex: 3, endRowIndex: 100, startColumnIndex: 0, endColumnIndex: 1 },
                cell: {
                  userEnteredFormat: {
                    numberFormat: { type: "DATE", pattern: "dd-mm-yyyy" },
                    textFormat: { fontFamily: "Inter", bold: true, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(numberFormat,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Percentage format for Column C (Row 4 onwards) + bold green + bg ECFDF5
            {
              repeatCell: {
                range: { sheetId: followUpId, startRowIndex: 3, endRowIndex: 100, startColumnIndex: 2, endColumnIndex: 3 },
                cell: {
                  userEnteredFormat: {
                    numberFormat: { type: "NUMBER", pattern: "0%" },
                    textFormat: { fontFamily: "Inter", bold: true, foregroundColor: { red: 4/255, green: 120/255, blue: 87/255 } },
                    backgroundColor: { red: 236/255, green: 253/255, blue: 245/255 },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(numberFormat,textFormat,backgroundColor,horizontalAlignment,verticalAlignment)"
              }
            },
            // Remedy Column D (Row 4 onwards) - left align + bold
            {
              repeatCell: {
                range: { sheetId: followUpId, startRowIndex: 3, endRowIndex: 100, startColumnIndex: 3, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", bold: true },
                    horizontalAlignment: "LEFT", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Potency / Dose Column E (Row 4 onwards) - center align + bold
            {
              repeatCell: {
                range: { sheetId: followUpId, startRowIndex: 3, endRowIndex: 100, startColumnIndex: 4, endColumnIndex: 5 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Next Follow-up Column G (Row 4 onwards) - bold amber text
            {
              repeatCell: {
                range: { sheetId: followUpId, startRowIndex: 3, endRowIndex: 100, startColumnIndex: 6, endColumnIndex: 7 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", bold: true, foregroundColor: { red: 180/255, green: 83/255, blue: 9/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment)"
              }
            }
          );
        }

        // Formatting for Repertorization
        const repertoryId = sheetsMap["Repertorization"];
        if (repertoryId !== undefined) {
          requests.push(...getRepertoryFormattingRequests(repertoryId, 10));
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
            // Row heights
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "ROWS", startIndex: 0, endIndex: 1 },
                properties: { pixelSize: 15 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "ROWS", startIndex: 1, endIndex: 2 },
                properties: { pixelSize: 35 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "ROWS", startIndex: 2, endIndex: 4 },
                properties: { pixelSize: 26 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "ROWS", startIndex: 4, endIndex: 5 },
                properties: { pixelSize: 15 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "ROWS", startIndex: 5, endIndex: 6 },
                properties: { pixelSize: 28 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "ROWS", startIndex: 6, endIndex: 7 },
                properties: { pixelSize: 24 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "ROWS", startIndex: 7, endIndex: 17 },
                properties: { pixelSize: 22 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "ROWS", startIndex: 17, endIndex: 18 },
                properties: { pixelSize: 15 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "ROWS", startIndex: 18, endIndex: 19 },
                properties: { pixelSize: 50 }, fields: "pixelSize"
              }
            },
            // Column widths
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
                properties: { pixelSize: 240 }, fields: "pixelSize"
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
                properties: { pixelSize: 350 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "COLUMNS", startIndex: 3, endIndex: 4 },
                properties: { pixelSize: 120 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "COLUMNS", startIndex: 4, endIndex: 5 },
                properties: { pixelSize: 130 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "COLUMNS", startIndex: 5, endIndex: 6 },
                properties: { pixelSize: 130 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: plannerId, dimension: "COLUMNS", startIndex: 6, endIndex: 7 },
                properties: { pixelSize: 150 }, fields: "pixelSize"
              }
            },
            // Merge & format Title Banner on Row 2
            {
              mergeCells: {
                range: { sheetId: plannerId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 7 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 7 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 15/255, green: 76/255, blue: 129/255 },
                    textFormat: { fontFamily: "Inter", foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 13, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Format upper table headers (Row 3)
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 7 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 241/255, green: 245/255, blue: 249/255 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 1, endColumnIndex: 5 },
                cell: { userEnteredFormat: { horizontalAlignment: "CENTER" } },
                fields: "userEnteredFormat.horizontalAlignment"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 5, endColumnIndex: 7 },
                cell: { userEnteredFormat: { horizontalAlignment: "RIGHT" } },
                fields: "userEnteredFormat.horizontalAlignment"
              }
            },
            // Format upper table data row (Row 4)
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 0, endColumnIndex: 1 },
                cell: {
                  userEnteredFormat: {
                    horizontalAlignment: "LEFT",
                    verticalAlignment: "MIDDLE",
                    textFormat: { fontFamily: "Inter", fontSize: 10 }
                  }
                },
                fields: "userEnteredFormat(horizontalAlignment,verticalAlignment,textFormat.fontSize)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 1, endColumnIndex: 5 },
                cell: {
                  userEnteredFormat: {
                    horizontalAlignment: "CENTER",
                    verticalAlignment: "MIDDLE",
                    textFormat: { fontFamily: "Inter", fontSize: 10 }
                  }
                },
                fields: "userEnteredFormat(horizontalAlignment,verticalAlignment,textFormat.fontSize)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 5, endColumnIndex: 7 },
                cell: {
                  userEnteredFormat: {
                    horizontalAlignment: "RIGHT",
                    verticalAlignment: "MIDDLE",
                    textFormat: { fontFamily: "Inter", fontSize: 10 },
                    numberFormat: { type: "NUMBER", pattern: "#,##0" }
                  }
                },
                fields: "userEnteredFormat(horizontalAlignment,verticalAlignment,textFormat.fontSize,numberFormat)"
              }
            },
            // Merge & format Pricing Breakdown Subheader (Row 6)
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
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 11, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            // Format Pricing Breakdown headers (Row 7)
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 6, endRowIndex: 7, startColumnIndex: 0, endColumnIndex: 3 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10 },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 6, endRowIndex: 7, startColumnIndex: 1, endColumnIndex: 2 },
                cell: { userEnteredFormat: { horizontalAlignment: "RIGHT" } },
                fields: "userEnteredFormat.horizontalAlignment"
              }
            },
            // Format Pricing Breakdown Data Rows (Rows 8-17)
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 7, endRowIndex: 17, startColumnIndex: 0, endColumnIndex: 3 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", fontSize: 10 },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(textFormat.fontSize,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 7, endRowIndex: 17, startColumnIndex: 0, endColumnIndex: 1 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", bold: true }
                  }
                },
                fields: "userEnteredFormat.textFormat.bold"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 7, endRowIndex: 17, startColumnIndex: 1, endColumnIndex: 2 },
                cell: {
                  userEnteredFormat: {
                    horizontalAlignment: "RIGHT",
                    numberFormat: { type: "NUMBER", pattern: "#,##0" }
                  }
                },
                fields: "userEnteredFormat(horizontalAlignment,numberFormat)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 10, endRowIndex: 11, startColumnIndex: 1, endColumnIndex: 2 },
                cell: {
                  userEnteredFormat: {
                    numberFormat: { type: "NUMBER", pattern: "0%" }
                  }
                },
                fields: "userEnteredFormat.numberFormat"
              }
            },
            // Merge & Format WhatsApp Invoice Message (Row 19)
            {
              mergeCells: {
                range: { sheetId: plannerId, startRowIndex: 18, endRowIndex: 19, startColumnIndex: 1, endColumnIndex: 7 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 18, endRowIndex: 19, startColumnIndex: 0, endColumnIndex: 1 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10 },
                    verticalAlignment: "MIDDLE",
                    horizontalAlignment: "LEFT"
                  }
                },
                fields: "userEnteredFormat(textFormat,verticalAlignment,horizontalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 18, endRowIndex: 19, startColumnIndex: 1, endColumnIndex: 7 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", fontSize: 10 },
                    verticalAlignment: "MIDDLE",
                    horizontalAlignment: "LEFT",
                    wrapStrategy: "WRAP"
                  }
                },
                fields: "userEnteredFormat(textFormat,verticalAlignment,horizontalAlignment,wrapStrategy)"
              }
            },
            // Format B15 (Total Program Cost) - bold & brand blue color (#0F4C81)
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 14, endRowIndex: 15, startColumnIndex: 1, endColumnIndex: 2 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", bold: true, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } }
                  }
                },
                fields: "userEnteredFormat.textFormat(bold,foregroundColor)"
              }
            },
            // Format B16 (Amount Received) - bold
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 15, endRowIndex: 16, startColumnIndex: 1, endColumnIndex: 2 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", bold: true }
                  }
                },
                fields: "userEnteredFormat.textFormat.bold"
              }
            },
            // Format B17 (Balance Due) - bold
            {
              repeatCell: {
                range: { sheetId: plannerId, startRowIndex: 16, endRowIndex: 17, startColumnIndex: 1, endColumnIndex: 2 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", bold: true }
                  }
                },
                fields: "userEnteredFormat.textFormat.bold"
              }
            },
            // Conditional formatting for B17 (Balance Due): green if <= 0, red if > 0
            {
              addConditionalFormatRule: {
                rule: {
                  ranges: [
                    { sheetId: plannerId, startRowIndex: 16, endRowIndex: 17, startColumnIndex: 1, endColumnIndex: 2 }
                  ],
                  booleanRule: {
                    condition: { type: "NUMBER_GREATER", values: [{ userEnteredValue: "0" }] },
                    format: {
                      textFormat: {  foregroundColor: { red: 225/255, green: 29/255, blue: 72/255 }, bold: true } // rose-600
                    }
                  }
                },
                index: 0
              }
            },
            {
              addConditionalFormatRule: {
                rule: {
                  ranges: [
                    { sheetId: plannerId, startRowIndex: 16, endRowIndex: 17, startColumnIndex: 1, endColumnIndex: 2 }
                  ],
                  booleanRule: {
                    condition: { type: "NUMBER_LESS_THAN_EQ", values: [{ userEnteredValue: "0" }] },
                    format: {
                      textFormat: {  foregroundColor: { red: 4/255, green: 120/255, blue: 87/255 }, bold: true } // emerald-700
                    }
                  }
                },
                index: 1
              }
            },
            // Apply solid thin borders to tables and cards
            {
              updateBorders: {
                range: { sheetId: plannerId, startRowIndex: 2, endRowIndex: 4, startColumnIndex: 0, endColumnIndex: 7 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                innerHorizontal: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
                innerVertical: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } }
              }
            },
            {
              updateBorders: {
                range: { sheetId: plannerId, startRowIndex: 6, endRowIndex: 17, startColumnIndex: 0, endColumnIndex: 3 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                innerHorizontal: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
                innerVertical: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } }
              }
            },
            {
              updateBorders: {
                range: { sheetId: plannerId, startRowIndex: 18, endRowIndex: 19, startColumnIndex: 0, endColumnIndex: 7 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
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
            // Row heights
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "ROWS", startIndex: 0, endIndex: 1 },
                properties: { pixelSize: 15 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "ROWS", startIndex: 1, endIndex: 2 },
                properties: { pixelSize: 35 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "ROWS", startIndex: 2, endIndex: 3 },
                properties: { pixelSize: 24 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "ROWS", startIndex: 3, endIndex: 4 },
                properties: { pixelSize: 30 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "ROWS", startIndex: 4, endIndex: 5 }, // Subtitle Row
                properties: { pixelSize: 20 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "ROWS", startIndex: 5, endIndex: 6 }, // Spacer Row
                properties: { pixelSize: 15 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "ROWS", startIndex: 6, endIndex: 7 }, // Section Header Row
                properties: { pixelSize: 28 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "ROWS", startIndex: 7, endIndex: 8 }, // Table Header Row
                properties: { pixelSize: 26 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "ROWS", startIndex: 8, endIndex: 100 }, // Table Data Rows
                properties: { pixelSize: 22 }, fields: "pixelSize"
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
                properties: { pixelSize: 250 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 },
                properties: { pixelSize: 150 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "COLUMNS", startIndex: 3, endIndex: 4 },
                properties: { pixelSize: 140 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "COLUMNS", startIndex: 4, endIndex: 5 },
                properties: { pixelSize: 140 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "COLUMNS", startIndex: 5, endIndex: 6 },
                properties: { pixelSize: 160 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "COLUMNS", startIndex: 6, endIndex: 7 },
                properties: { pixelSize: 130 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: financeId, dimension: "COLUMNS", startIndex: 7, endIndex: 8 },
                properties: { pixelSize: 125 }, fields: "pixelSize"
              }
            },
            // Title Header Merged on Row 2
            {
              mergeCells: {
                range: { sheetId: financeId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 8 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 15/255, green: 76/255, blue: 129/255 },
                    textFormat: { fontFamily: "Inter", foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 13, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Merge Summary KPI Cards
            // Card 1
            {
              mergeCells: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 2 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              mergeCells: {
                range: { sheetId: financeId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 0, endColumnIndex: 2 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              mergeCells: {
                range: { sheetId: financeId, startRowIndex: 4, endRowIndex: 5, startColumnIndex: 0, endColumnIndex: 2 },
                mergeType: "MERGE_ALL"
              }
            },
            // Card 2
            {
              mergeCells: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 2, endColumnIndex: 4 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              mergeCells: {
                range: { sheetId: financeId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 2, endColumnIndex: 4 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              mergeCells: {
                range: { sheetId: financeId, startRowIndex: 4, endRowIndex: 5, startColumnIndex: 2, endColumnIndex: 4 },
                mergeType: "MERGE_ALL"
              }
            },
            // Card 3
            {
              mergeCells: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 4, endColumnIndex: 6 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              mergeCells: {
                range: { sheetId: financeId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 4, endColumnIndex: 6 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              mergeCells: {
                range: { sheetId: financeId, startRowIndex: 4, endRowIndex: 5, startColumnIndex: 4, endColumnIndex: 6 },
                mergeType: "MERGE_ALL"
              }
            },
            // Format Summary KPI Cards
            // Card 1 Format: Total Billed
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 2 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 9, foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 0, endColumnIndex: 2 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 13, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE",
                    numberFormat: { type: "CURRENCY", pattern: "\"₹\"#,##0" }
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,numberFormat)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 4, endRowIndex: 5, startColumnIndex: 0, endColumnIndex: 2 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { fontFamily: "Inter", fontSize: 8, foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              updateBorders: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 5, startColumnIndex: 0, endColumnIndex: 2 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
              }
            },
            // Card 2 Format: Total Collected
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 2, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 9, foregroundColor: { red: 46/255, green: 139/255, blue: 87/255 } }, // SeaGreen text for Collected header
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 2, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 13, foregroundColor: { red: 46/255, green: 139/255, blue: 87/255 } }, // SeaGreen #2E8B57
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE",
                    numberFormat: { type: "CURRENCY", pattern: "\"₹\"#,##0" }
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,numberFormat)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 4, endRowIndex: 5, startColumnIndex: 2, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { fontFamily: "Inter", fontSize: 8, foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              updateBorders: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 5, startColumnIndex: 2, endColumnIndex: 4 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
              }
            },
            // Card 3 Format: Outstanding Balance
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 4, endColumnIndex: 6 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 9, foregroundColor: { red: 139/255, green: 46/255, blue: 46/255 } }, // Deep Red text for Outstanding header
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 4, endColumnIndex: 6 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 13, foregroundColor: { red: 139/255, green: 46/255, blue: 46/255 } }, // Deep Red #8B2E2E
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE",
                    numberFormat: { type: "CURRENCY", pattern: "\"₹\"#,##0" }
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,numberFormat)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 4, endRowIndex: 5, startColumnIndex: 4, endColumnIndex: 6 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { fontFamily: "Inter", fontSize: 8, foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              updateBorders: {
                range: { sheetId: financeId, startRowIndex: 2, endRowIndex: 5, startColumnIndex: 4, endColumnIndex: 6 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
              }
            },
            // Table Section Header Merged A7:H7
            {
              mergeCells: {
                range: { sheetId: financeId, startRowIndex: 6, endRowIndex: 7, startColumnIndex: 0, endColumnIndex: 8 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 6, endRowIndex: 7, startColumnIndex: 0, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 242/255, blue: 253/255 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 11, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
              }
            },
            // Transaction History Table Headers (Row 8, index 7)
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 7, endRowIndex: 8, startColumnIndex: 0, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 }, // slate-200
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 7, endRowIndex: 8, startColumnIndex: 1, endColumnIndex: 2 },
                cell: { userEnteredFormat: { horizontalAlignment: "LEFT" } },
                fields: "userEnteredFormat.horizontalAlignment"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 7, endRowIndex: 8, startColumnIndex: 3, endColumnIndex: 6 },
                cell: { userEnteredFormat: { horizontalAlignment: "RIGHT" } },
                fields: "userEnteredFormat.horizontalAlignment"
              }
            },
            // Transaction data row alignments and fonts (Rows 9-100)
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 8, endRowIndex: 100, startColumnIndex: 0, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", fontSize: 10 },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(textFormat.fontSize,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 8, endRowIndex: 100, startColumnIndex: 0, endColumnIndex: 1 },
                cell: { userEnteredFormat: { horizontalAlignment: "CENTER" } },
                fields: "userEnteredFormat.horizontalAlignment"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 8, endRowIndex: 100, startColumnIndex: 2, endColumnIndex: 3 },
                cell: { userEnteredFormat: { horizontalAlignment: "CENTER" } },
                fields: "userEnteredFormat.horizontalAlignment"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 8, endRowIndex: 100, startColumnIndex: 3, endColumnIndex: 6 },
                cell: {
                  userEnteredFormat: {
                    horizontalAlignment: "RIGHT",
                    numberFormat: { type: "CURRENCY", pattern: "\"₹\"#,##0" }
                  }
                },
                fields: "userEnteredFormat(horizontalAlignment,numberFormat)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 8, endRowIndex: 100, startColumnIndex: 6, endColumnIndex: 8 },
                cell: { userEnteredFormat: { horizontalAlignment: "CENTER" } },
                fields: "userEnteredFormat.horizontalAlignment"
              }
            },
            {
              repeatCell: {
                range: { sheetId: financeId, startRowIndex: 8, endRowIndex: 100, startColumnIndex: 7, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", bold: true }
                  }
                },
                fields: "userEnteredFormat.textFormat.bold"
              }
            },
            // Table outline and inner grid borders
            {
              updateBorders: {
                range: { sheetId: financeId, startRowIndex: 7, endRowIndex: 100, startColumnIndex: 0, endColumnIndex: 8 },
                top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
                innerHorizontal: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } },
                innerVertical: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } }
              }
            },
            // Status column conditional formatting rules (PAID, PARTIALLY PAID, UNPAID)
            {
              addConditionalFormatRule: {
                rule: {
                  ranges: [
                    { sheetId: financeId, startRowIndex: 8, endRowIndex: 100, startColumnIndex: 7, endColumnIndex: 8 }
                  ],
                  booleanRule: {
                    condition: { type: "TEXT_EQ", values: [{ userEnteredValue: "PAID" }] },
                    format: {
                      textFormat: {  foregroundColor: { red: 4/255, green: 120/255, blue: 87/255 }, bold: true },
                      backgroundColor: { red: 236/255, green: 253/255, blue: 245/255 }
                    }
                  }
                },
                index: 0
              }
            },
            {
              addConditionalFormatRule: {
                rule: {
                  ranges: [
                    { sheetId: financeId, startRowIndex: 8, endRowIndex: 100, startColumnIndex: 7, endColumnIndex: 8 }
                  ],
                  booleanRule: {
                    condition: { type: "TEXT_EQ", values: [{ userEnteredValue: "PARTIALLY PAID" }] },
                    format: {
                      textFormat: {  foregroundColor: { red: 67/255, green: 56/255, blue: 202/255 }, bold: true },
                      backgroundColor: { red: 238/255, green: 242/255, blue: 255/255 }
                    }
                  }
                },
                index: 1
              }
            },
            {
              addConditionalFormatRule: {
                rule: {
                  ranges: [
                    { sheetId: financeId, startRowIndex: 8, endRowIndex: 100, startColumnIndex: 7, endColumnIndex: 8 }
                  ],
                  booleanRule: {
                    condition: { type: "TEXT_EQ", values: [{ userEnteredValue: "UNPAID" }] },
                    format: {
                      textFormat: {  foregroundColor: { red: 190/255, green: 24/255, blue: 74/255 }, bold: true },
                      backgroundColor: { red: 255/255, green: 241/255, blue: 242/255 }
                    }
                  }
                },
                index: 2
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
                    textFormat: { fontFamily: "Inter", foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 12, bold: true },
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
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Row heights
            {
              updateDimensionProperties: {
                range: { sheetId: attachmentsId, dimension: "ROWS", startIndex: 0, endIndex: 1 },
                properties: { pixelSize: 35 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: attachmentsId, dimension: "ROWS", startIndex: 1, endIndex: 2 },
                properties: { pixelSize: 15 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: attachmentsId, dimension: "ROWS", startIndex: 2, endIndex: 3 },
                properties: { pixelSize: 26 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: attachmentsId, dimension: "ROWS", startIndex: 3, endIndex: 33 },
                properties: { pixelSize: 22 }, fields: "pixelSize"
              }
            },
            // Format data rows (Rows 4 to 33, indices 3 to 33)
            {
              repeatCell: {
                range: { sheetId: attachmentsId, startRowIndex: 3, endRowIndex: 33, startColumnIndex: 0, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", fontSize: 10 },
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(textFormat.fontSize,verticalAlignment)"
              }
            },
            // Alignment for Columns A (Report Date) and B (Report Category)
            {
              repeatCell: {
                range: { sheetId: attachmentsId, startRowIndex: 3, endRowIndex: 33, startColumnIndex: 0, endColumnIndex: 2 },
                cell: {
                  userEnteredFormat: {
                    horizontalAlignment: "CENTER"
                  }
                },
                fields: "userEnteredFormat.horizontalAlignment"
              }
            },
            // Alignment for Columns C (Investigation Target) and D (Report Hyperlink)
            {
              repeatCell: {
                range: { sheetId: attachmentsId, startRowIndex: 3, endRowIndex: 33, startColumnIndex: 2, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    horizontalAlignment: "LEFT"
                  }
                },
                fields: "userEnteredFormat.horizontalAlignment"
              }
            },
            // Grid borders (outer and inner)
            {
              updateBorders: {
                range: { sheetId: attachmentsId, startRowIndex: 2, endRowIndex: 33, startColumnIndex: 0, endColumnIndex: 4 },
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
            {
              updateDimensionProperties: {
                range: { sheetId: configId, dimension: "COLUMNS", startIndex: 6, endIndex: 7 },
                properties: { pixelSize: 100 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: configId, dimension: "COLUMNS", startIndex: 7, endIndex: 8 },
                properties: { pixelSize: 100 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: configId, dimension: "COLUMNS", startIndex: 8, endIndex: 9 },
                properties: { pixelSize: 160 }, fields: "pixelSize"
              }
            },
            {
              updateDimensionProperties: {
                range: { sheetId: configId, dimension: "COLUMNS", startIndex: 9, endIndex: 10 },
                properties: { pixelSize: 385 }, fields: "pixelSize"
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
                    textFormat: { fontFamily: "Inter", foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 12, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Style E1:F1 (Actually E1:G1)
            {
              mergeCells: {
                range: { sheetId: configId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 5, endColumnIndex: 7 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: configId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 5, endColumnIndex: 7 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Merge and style H1:J1 (Remedy Directory Banner)
            {
              mergeCells: {
                range: { sheetId: configId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 7, endColumnIndex: 10 },
                mergeType: "MERGE_ALL"
              }
            },
            {
              repeatCell: {
                range: { sheetId: configId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 7, endColumnIndex: 10 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 15/255, green: 76/255, blue: 129/255 },
                    textFormat: { fontFamily: "Inter", foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 11, bold: true },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Style table headers (Row 3, index 2) Cols A-E
            {
              repeatCell: {
                range: { sheetId: configId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 5 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Style table headers Cols F-G (Packages)
            {
              repeatCell: {
                range: { sheetId: configId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 5, endColumnIndex: 7 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Style table headers Cols H-J (Remedy Keynote Directory)
            {
              repeatCell: {
                range: { sheetId: configId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 7, endColumnIndex: 10 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 },
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Format Keynote descriptions data range (H4:J14)
            {
              repeatCell: {
                range: { sheetId: configId, startRowIndex: 3, endRowIndex: 14, startColumnIndex: 7, endColumnIndex: 9 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", fontSize: 9 },
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: configId, startRowIndex: 3, endRowIndex: 14, startColumnIndex: 9, endColumnIndex: 10 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { fontFamily: "Inter", fontSize: 9 },
                    horizontalAlignment: "LEFT", verticalAlignment: "MIDDLE",
                    wrapStrategy: "WRAP"
                  }
                },
                fields: "userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)"
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
                    backgroundColor: { red: 236/255, green: 72/255, blue: 153/255 }, // pink-500 #EC4899
                    textFormat: { fontFamily: "Inter", foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 13, bold: true },
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
            // Left Card Section Header style (Repertory Payload)
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 }, // slate-200
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } }, // navy
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            // Right Card Section Header style (AI Verdict)
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 4, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 243/255, green: 232/255, blue: 255/255 }, // violet-100
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 109/255, green: 40/255, blue: 217/255 } }, // violet-700
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
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 9, foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 } },
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
                    textFormat: { fontFamily: "Inter", fontSize: 10, foregroundColor: { red: 15/255, green: 23/255, blue: 42/255 } },
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
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 9, foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 } },
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
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
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
            // Card 2 Section Headers style (Left: Remedy Rankings, Right: Materia Medica Keynotes)
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 10, endRowIndex: 11, startColumnIndex: 0, endColumnIndex: 4 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 }, // slate-200
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } }, // navy
                    horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            },
            {
              repeatCell: {
                range: { sheetId: aiRepertoryId, startRowIndex: 10, endRowIndex: 11, startColumnIndex: 4, endColumnIndex: 8 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 253/255, green: 242/255, blue: 248/255 }, // pink-50 #FDF2F8
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 190/255, green: 24/255, blue: 74/255 } }, // pink-700 #BE185D
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
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 9, foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 } },
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
                    textFormat: { fontFamily: "Inter", fontSize: 9, foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } },
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
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
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
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 } },
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
                    textFormat: { fontFamily: "Inter", bold: true, fontSize: 9, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
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
                    textFormat: { fontFamily: "Inter", fontSize: 9, foregroundColor: { red: 71/255, green: 85/255, blue: 105/255 } },
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
  sheetUrl: string,
  assignedDoctorName?: string
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

    // Columns: A=Patient ID, B=Name, C=Age, D=Gender, E=Phone, F=Email,
    //          G=Location, H=Complaint, I=Care Level, J=Duration,
    //          K=Fee, L=Date, M=Assigned Doctor, N=Drive Folder, O=Clinical Sheet, P=Status
    const rowValues = [
      data.id,
      data.name,
      data.age,
      data.gender,
      data.phone,
      data.email || "",
      locationVal,
      data.complaint,
      data.careLevel,
      data.durationText,
      `₹${data.finalPrice.toLocaleString("en-IN")}`,
      today,
      assignedDoctorName || "Unassigned",
      folderUrl,
      sheetUrl,
      "Registered - Awaiting Consult"
    ];

    // ── Upsert: check if patient ID already exists in column A ───────────────
    let existingRowIndex = -1;
    try {
      const readRes = await sheets.spreadsheets.values.get({
        spreadsheetId: MASTER_SHEET_ID,
        range: "Sheet1!A:A"
      });
      const colA = readRes.data.values || [];
      for (let i = 1; i < colA.length; i++) {         // skip header (row 0)
        if (colA[i] && colA[i][0] === data.id) {
          existingRowIndex = i + 1;                    // Sheets rows are 1-indexed
          break;
        }
      }
    } catch {
      // If we can't read, just fall through to append
    }

    if (existingRowIndex > 1) {
      // Update existing row
      await sheets.spreadsheets.values.update({
        spreadsheetId: MASTER_SHEET_ID,
        range: `Sheet1!A${existingRowIndex}:P${existingRowIndex}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [rowValues] }
      });
      console.log(`Master sheet: updated row ${existingRowIndex} for patient ${data.id}`);
    } else {
      // Ensure header row exists on the very first write
      const headerCheck = await sheets.spreadsheets.values.get({
        spreadsheetId: MASTER_SHEET_ID,
        range: "Sheet1!A1:P1"
      });
      if (!headerCheck.data.values?.length) {
        const headers = [
          "Patient ID", "Name", "Age", "Gender", "Phone", "Email",
          "Location", "Chief Complaint", "Care Level", "Duration",
          "Fee (₹)", "Registration Date", "Assigned Doctor",
          "Drive Folder", "Clinical Sheet", "Status"
        ];
        await sheets.spreadsheets.values.update({
          spreadsheetId: MASTER_SHEET_ID,
          range: "Sheet1!A1:P1",
          valueInputOption: "RAW",
          requestBody: { values: [headers] }
        });
      }
      // Append new row
      await sheets.spreadsheets.values.append({
        spreadsheetId: MASTER_SHEET_ID,
        range: "Sheet1!A2",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [rowValues] }
      });
      console.log(`Master sheet: appended new row for patient ${data.id}`);
    }
  } catch (error) {
    console.error("Error upserting patient in Master Google Sheet:", error);
    throw error;
  }
}

/**
 * Standard keynote definitions for core repertory remedies
 */
const REMEDY_DETAILS_LOOKUP: Record<string, { fullName: string; keynotes: string }> = {
  "Nux-v": { fullName: "Nux Vomica", keynotes: "Chilly, irritable, stomach complaints worse after eating." },
  "Lyc": { fullName: "Lycopodium Clavatum", keynotes: "Right-sided, flatulence, gas, warm food cravings." },
  "Ars": { fullName: "Arsenicum Album", keynotes: "Great anxiety, restlessness, chilly, worse at midnight." },
  "Puls": { fullName: "Pulsatilla Pratensis", keynotes: "Mild, yielding disposition, desires open air and consolation, thirstless." },
  "Sulph": { fullName: "Sulphur", keynotes: "Warm-blooded, desires sweets, empty sinking at 11 AM, red orifices." },
  "Rhus-t": { fullName: "Rhus Toxicodendron", keynotes: "Restless, joints stiff on first motion, improves with continuous motion, worse damp cold." },
  "Bry": { fullName: "Bryonia Alba", keynotes: "Worse from least motion, better from absolute rest, stitching pains, dry mouth, great thirst." },
  "Calc": { fullName: "Calcarea Carbonica", keynotes: "Chilly, sluggish metabolism, tendency to obesity, sweaty head, desires eggs." },
  "Sil": { fullName: "Silicea", keynotes: "Chilly, lacks grit, sensitive to cold drafts, sweaty feet (offensive), slow healing." },
  "Nat-m": { fullName: "Natrum Muriaticum", keynotes: "Reserved, silent grief, craves salt, worse warmth of sun, mapped emotional tension." },
  "Ign": { fullName: "Ignatia Amara", keynotes: "Ailments from recent grief or shock, sighing, contradictory symptoms." },
  "Sep": { fullName: "Sepia Officinalis", keynotes: "Indifferent to loved ones, dragging down sensation, better from vigorous exercise." }
};

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
    // 1. Write the main AI diagnostics report to Case Taking tab (which will populate E5 on AI Repertory Lab dynamically via formula)
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "'Case Taking'!A52:B55",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          ["SECTION 13 – AI CLINICAL SYNTHESIS VERDICT", ""],
          ["AI Analysis Engine", "Gemini 3.5 Clinical Synthesis"],
          ["Analysis Timestamp", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
          ["AI Constitutional Justification", aiReport]
        ]
      }
    });

    // 2. Ensure the top rankings formulas are written in AI Repertory Lab Col B and D (just in case)
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "'AI Repertory Lab'!A12:D14",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          ["Rank 1 Remedy", `=IFERROR(INDEX('Repertorization'!B:B, MATCH("Rank 1", 'Repertorization'!A:A, 0)), "N/A")`, "Score", `=IFERROR(INDEX('Repertorization'!D:D, MATCH("Rank 1", 'Repertorization'!A:A, 0)), 0)`],
          ["Rank 2 Remedy", `=IFERROR(INDEX('Repertorization'!B:B, MATCH("Rank 2", 'Repertorization'!A:A, 0)), "N/A")`, "Score", `=IFERROR(INDEX('Repertorization'!D:D, MATCH("Rank 2", 'Repertorization'!A:A, 0)), 0)`],
          ["Rank 3 Remedy", `=IFERROR(INDEX('Repertorization'!B:B, MATCH("Rank 3", 'Repertorization'!A:A, 0)), "N/A")`, "Score", `=IFERROR(INDEX('Repertorization'!D:D, MATCH("Rank 3", 'Repertorization'!A:A, 0)), 0)`],
        ]
      }
    });

    // 3. Read back the calculated Rank 1, 2, 3 remedy abbreviations from AI Repertory Lab B12:B14
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "'AI Repertory Lab'!B12:B14"
    });

    const rows = response.data.values || [];
    const remedyRanks = [
      rows[0]?.[0] || "N/A",
      rows[1]?.[0] || "N/A",
      rows[2]?.[0] || "N/A"
    ];

    // 4. Try parsing the aiReport string if it is a JSON representation from the AI Diagnostics
    let aiTopRemedies: any[] = [];
    try {
      const trimmed = aiReport.trim();
      if (trimmed.startsWith("{")) {
        const parsed = JSON.parse(trimmed);
        aiTopRemedies = parsed?.top_remedies || parsed?.analysis?.top_remedies || [];
      }
    } catch (e) {
      console.warn("Could not parse aiReport as JSON, using standard keynote fallbacks:", e);
    }

    // 5. Look up the full name and keynotes for each of the 3 remedies
    const updateValues: string[][] = [];

    remedyRanks.forEach((abbrev) => {
      let fullName = "";
      let keynotes = "";

      // Try matching with AI-generated top remedies first
      const matchedAiRem = aiTopRemedies.find(r => {
        const rName = (r?.name || "").toLowerCase();
        const abbrevLower = abbrev.toLowerCase();
        return rName.includes(abbrevLower) || abbrevLower.includes(rName);
      });

      if (matchedAiRem) {
        fullName = matchedAiRem.name;
        keynotes = matchedAiRem.brief_keynotes || matchedAiRem.why_selected || "Constitutional simillimum keynote verification.";
      } else {
        // Fallback to standard lookup
        const lookup = REMEDY_DETAILS_LOOKUP[abbrev];
        if (lookup) {
          fullName = lookup.fullName;
          keynotes = lookup.keynotes;
        } else {
          fullName = abbrev !== "N/A" ? abbrev : "";
          keynotes = abbrev !== "N/A" ? "Verify modalities, thermal response, and characteristic generals." : "";
        }
      }

      const formattedName = fullName ? `${fullName}:` : "";
      updateValues.push([formattedName, keynotes]);
    });

    // 6. Write the dynamic lookup formulas to AI Repertory Lab E12:F14 to preserve live update capability
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "'AI Repertory Lab'!E12:F14",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          ["=IFERROR(INDEX('Config DB'!I$4:I$100, MATCH(B12, 'Config DB'!H$4:H$100, 0)) & \":\", B12 & \":\")", "=IFERROR(INDEX('Config DB'!J$4:J$100, MATCH(B12, 'Config DB'!H$4:H$100, 0)), \"Verify modalities, thermal response, and characteristic generals.\")"],
          ["=IFERROR(INDEX('Config DB'!I$4:I$100, MATCH(B13, 'Config DB'!H$4:H$100, 0)) & \":\", B13 & \":\")", "=IFERROR(INDEX('Config DB'!J$4:J$100, MATCH(B13, 'Config DB'!H$4:H$100, 0)), \"Verify modalities, thermal response, and characteristic generals.\")"],
          ["=IFERROR(INDEX('Config DB'!I$4:I$100, MATCH(B14, 'Config DB'!H$4:H$100, 0)) & \":\", B14 & \":\")", "=IFERROR(INDEX('Config DB'!J$4:J$100, MATCH(B14, 'Config DB'!H$4:H$100, 0)), \"Verify modalities, thermal response, and characteristic generals.\")"]
        ]
      }
    });

  } catch (error) {
    console.error("Error writing AI report to patient Google Sheet:", error);
    throw error;
  }
}

/**
 * Synchronizes the list of reports and attachments to the patient's individual clinical sheet
 */
export async function syncAttachmentsToClinicalSheet(
  sheetId: string,
  attachments: Array<{ date: string; category: string; target: string; url: string }>
): Promise<void> {
  const auth = getGoogleAuth();
  if (!auth) {
    console.warn("Google API Auth missing. Skipping Attachments sync to Google Sheets.");
    return;
  }

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const rows = [];
    for (let i = 0; i < 30; i++) {
      if (i < attachments.length) {
        const att = attachments[i];
        rows.push([
          att.date || "",
          att.category || "",
          att.target || "",
          att.url || ""
        ]);
      } else {
        rows.push(["", "", "", ""]);
      }
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "'Reports & Attachments'!A4:D33",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: rows
      }
    });
  } catch (error) {
    console.error("Error writing attachments to patient Google Sheet:", error);
    throw error;
  }
}

/**
 * Synchronizes the configuration database to the patient's individual clinical sheet
 */
export async function syncConfigDbToClinicalSheet(
  sheetId: string,
  configDb: {
    remedies: string[];
    potencies: string[];
    miasms: string[];
    locations: string[];
    doctors?: string[];
    packages: Array<{ name: string; price: number }>;
  }
): Promise<void> {
  const auth = getGoogleAuth();
  if (!auth) {
    console.warn("Google API Auth missing. Skipping Config DB sync to Google Sheets.");
    return;
  }

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const maxRows = Math.max(
      configDb.remedies.length,
      configDb.potencies.length,
      configDb.miasms.length,
      configDb.locations.length,
      (configDb.doctors || []).length,
      configDb.packages.length
    );

    const rows = [];
    
    // Row 0 corresponds to headers A-E and the first package in F-G
    const firstPkg = configDb.packages[0] || { name: "", price: 0 };
    rows.push([
      "REMEDIES",
      "POTENCIES",
      "MIASMS",
      "CLINIC BRANCHES",
      "DOCTORS",
      firstPkg.name || "",
      firstPkg.price || ""
    ]);

    // Format the rest of the config rows
    const totalRowsToUpdate = Math.max(50, maxRows + 5);
    for (let i = 0; i < totalRowsToUpdate; i++) {
      const remedy = configDb.remedies[i] || "";
      const potency = configDb.potencies[i] || "";
      const miasm = configDb.miasms[i] || "";
      const loc = configDb.locations[i] || "";
      const doc = configDb.doctors?.[i] || "";
      const pkg = configDb.packages[i + 1] || { name: "", price: "" };

      rows.push([remedy, potency, miasm, loc, doc, pkg.name || "", pkg.price || ""]);
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "'Config DB'!A3:G100",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: rows
      }
    });
  } catch (error) {
    console.error("Error writing Config DB to patient Google Sheet:", error);
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
    const mockUrl = `/admin/invoice-preview?invoiceNo=${encodeURIComponent(data.invoiceNo)}`;
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
      ["Bank Name", "HDFC Bank Ltd", "", "UPI ID", paymentUpi],
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
              textFormat: { fontFamily: "Inter", foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 14, bold: true },
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
              textFormat: { fontFamily: "Inter", foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 }, bold: true, fontSize: 10 },
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
              textFormat: { fontFamily: "Inter", bold: true, fontSize: 9 }
            }
          },
          fields: "userEnteredFormat(backgroundColor,textFormat)"
        }
      },
      // Totals section label styling
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 12, endRowIndex: 15, startColumnIndex: 3, endColumnIndex: 5 },
          cell: { userEnteredFormat: { textFormat: { fontFamily: "Inter", bold: true } } },
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
              textFormat: { fontFamily: "Inter", foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 }, bold: true }
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
              textFormat: { fontFamily: "Inter", bold: true, fontSize: 9 }
            }
          },
          fields: "userEnteredFormat(backgroundColor,textFormat)"
        }
      },
      // Bold Labels for metadata fields
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 3, endRowIndex: 8, startColumnIndex: 0, endColumnIndex: 1 },
          cell: { userEnteredFormat: { textFormat: { fontFamily: "Inter", bold: true } } },
          fields: "userEnteredFormat(textFormat(bold))"
        }
      },
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 3, endRowIndex: 8, startColumnIndex: 3, endColumnIndex: 4 },
          cell: { userEnteredFormat: { textFormat: { fontFamily: "Inter", bold: true } } },
          fields: "userEnteredFormat(textFormat(bold))"
        }
      },
      // Footer text center and italic
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 26, endRowIndex: 27, startColumnIndex: 0, endColumnIndex: 5 },
          cell: {
            userEnteredFormat: {
              textFormat: { fontFamily: "Inter", italic: true, fontSize: 9, color: { red: 0.4, green: 0.4, blue: 0.4 } },
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

export interface RepertoryExportRubric {
  name: string;
  chapter: string;
  source: string;
  weight: number;
  grades: Record<string, number>;
}

/**
 * Helper to convert a column index to Excel column label (0 -> A, 27 -> AB, etc.)
 */
export function getColumnLetter(colIndex: number): string {
  let letter = "";
  let temp = colIndex;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

/**
 * Helper to generate formatting requests for the Repertorization tab dynamically based on the number of rubrics (N).
 */
export function getRepertoryFormattingRequests(
  repertoryId: number,
  N: number,
  existingRules: any[] = [],
  remediesCount: number = 11
): any[] {
  const requests: any[] = [];
  const totalCols = 5 + remediesCount;

  // Clear existing conditional format rules
  existingRules.forEach(() => {
    requests.push({
      deleteConditionalFormatRule: {
        index: 0,
        sheetId: repertoryId
      }
    });
  });

  // Unmerge all cells in the matrix area (to clear old merges from different rubric sizes)
  requests.push({
    unmergeCells: {
      range: {
        sheetId: repertoryId,
        startRowIndex: 3,
        endRowIndex: 50,
        startColumnIndex: 0,
        endColumnIndex: totalCols
      }
    }
  });

  // Hide gridlines
  requests.push({
    updateSheetProperties: {
      properties: {
        sheetId: repertoryId,
        gridProperties: { hideGridlines: true }
      },
      fields: "gridProperties.hideGridlines"
    }
  });

  // Column widths
  requests.push(
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
        range: { sheetId: repertoryId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 },
        properties: { pixelSize: 80 }, fields: "pixelSize"
      }
    },
    {
      updateDimensionProperties: {
        range: { sheetId: repertoryId, dimension: "COLUMNS", startIndex: 3, endIndex: 4 },
        properties: { pixelSize: 120 }, fields: "pixelSize"
      }
    },
    {
      updateDimensionProperties: {
        range: { sheetId: repertoryId, dimension: "COLUMNS", startIndex: 4, endIndex: 4 + remediesCount },
        properties: { pixelSize: 65 }, fields: "pixelSize"
      }
    },
    {
      updateDimensionProperties: {
        range: { sheetId: repertoryId, dimension: "COLUMNS", startIndex: 4 + remediesCount, endIndex: 5 + remediesCount },
        properties: { pixelSize: 90 }, fields: "pixelSize"
      }
    }
  );

  // Row Heights
  requests.push(
    {
      updateDimensionProperties: {
        range: { sheetId: repertoryId, dimension: "ROWS", startIndex: 0, endIndex: 1 },
        properties: { pixelSize: 15 }, fields: "pixelSize"
      }
    },
    {
      updateDimensionProperties: {
        range: { sheetId: repertoryId, dimension: "ROWS", startIndex: 1, endIndex: 2 },
        properties: { pixelSize: 35 }, fields: "pixelSize"
      }
    }
  );

  // Merge Title Header (Cols A to Totality Score)
  requests.push(
    {
      mergeCells: {
        range: { sheetId: repertoryId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: totalCols },
        mergeType: "MERGE_ALL"
      }
    },
    {
      repeatCell: {
        range: { sheetId: repertoryId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: totalCols },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 15/255, green: 76/255, blue: 129/255 },
            textFormat: { fontFamily: "Inter", foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 13, bold: true },
            horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
          }
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
      }
    }
  );

  // Table headers (Rubric, Chapter, etc. A3 to Totality Score)
  requests.push({
    repeatCell: {
      range: { sheetId: repertoryId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: totalCols },
      cell: {
        userEnteredFormat: {
          backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 },
          textFormat: { fontFamily: "Inter", foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 }, fontSize: 10, bold: true },
          horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
        }
      },
      fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
    }
  });

  // Alternate matrix rows background (A4 to Totality Score)
  for (let i = 0; i < N; i++) {
    const rIdx = 3 + i;
    const isOdd = i % 2 !== 0;
    requests.push({
      repeatCell: {
        range: { sheetId: repertoryId, startRowIndex: rIdx, endRowIndex: rIdx + 1, startColumnIndex: 0, endColumnIndex: totalCols },
        cell: {
          userEnteredFormat: {
            backgroundColor: isOdd 
              ? { red: 248/255, green: 250/255, blue: 252/255 }
              : { red: 1, green: 1, blue: 1 }
          }
        },
        fields: "userEnteredFormat.backgroundColor"
      }
    });
  }

  // Grid borders for the matrix range (A3 to Totality Score)
  requests.push({
    updateBorders: {
      range: { sheetId: repertoryId, startRowIndex: 2, endRowIndex: 3 + N, startColumnIndex: 0, endColumnIndex: totalCols },
      top: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
      bottom: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
      left: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
      right: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
      innerHorizontal: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } },
      innerVertical: { style: "SOLID", color: { red: 241/255, green: 245/255, blue: 249/255 } }
    }
  });

  // Centering Remedy Grades (E4 to last remedy)
  requests.push({
    repeatCell: {
      range: { sheetId: repertoryId, startRowIndex: 3, endRowIndex: 3 + N, startColumnIndex: 4, endColumnIndex: 4 + remediesCount },
      cell: { userEnteredFormat: { horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE" } },
      fields: "userEnteredFormat.horizontalAlignment,userEnteredFormat.verticalAlignment"
    }
  });

  // Centering and bold blue styling for Totality Score column values (Last column)
  requests.push({
    repeatCell: {
      range: { sheetId: repertoryId, startRowIndex: 3, endRowIndex: 3 + N, startColumnIndex: 4 + remediesCount, endColumnIndex: 5 + remediesCount },
      cell: {
        userEnteredFormat: {
          textFormat: { fontFamily: "Inter", bold: true, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
          horizontalAlignment: "CENTER",
          verticalAlignment: "MIDDLE"
        }
      },
      fields: "userEnteredFormat.textFormat,userEnteredFormat.horizontalAlignment,userEnteredFormat.verticalAlignment"
    }
  });

  // Conditional formatting for grades in the matrix range
  requests.push(
    {
      addConditionalFormatRule: {
        rule: {
          ranges: [
            { sheetId: repertoryId, startRowIndex: 3, endRowIndex: 3 + N, startColumnIndex: 4, endColumnIndex: 4 + remediesCount }
          ],
          booleanRule: {
            condition: { type: "NUMBER_GREATER", values: [{ userEnteredValue: "0" }] },
            format: {
              backgroundColor: { red: 236/255, green: 253/255, blue: 245/255 },
              textFormat: {  foregroundColor: { red: 4/255, green: 120/255, blue: 87/255 }, bold: true }
            }
          }
        },
        index: 0
      }
    },
    {
      addConditionalFormatRule: {
        rule: {
          ranges: [
            { sheetId: repertoryId, startRowIndex: 3, endRowIndex: 3 + N, startColumnIndex: 4, endColumnIndex: 4 + remediesCount }
          ],
          booleanRule: {
            condition: { type: "NUMBER_EQ", values: [{ userEnteredValue: "0" }] },
            format: {
              textFormat: {  foregroundColor: { red: 203/255, green: 213/255, blue: 225/255 } }
            }
          }
        },
        index: 1
      }
    }
  );

  // Clear formatting and borders for spacer rows (from 3+N to 5+N)
  requests.push(
    {
      repeatCell: {
        range: { sheetId: repertoryId, startRowIndex: 3 + N, endRowIndex: 5 + N, startColumnIndex: 0, endColumnIndex: totalCols },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 1, green: 1, blue: 1 },
            textFormat: { fontFamily: "Inter", bold: false, italic: false, fontSize: 10, foregroundColor: { red: 0, green: 0, blue: 0 } }
          }
        },
        fields: "userEnteredFormat(backgroundColor,textFormat)"
      }
    },
    {
      updateBorders: {
        range: { sheetId: repertoryId, startRowIndex: 3 + N, endRowIndex: 5 + N, startColumnIndex: 0, endColumnIndex: totalCols },
        top: { style: "NONE" },
        bottom: { style: "NONE" },
        left: { style: "NONE" },
        right: { style: "NONE" },
        innerHorizontal: { style: "NONE" },
        innerVertical: { style: "NONE" }
      }
    }
  );

  // Symptom Coverage styling (Row 11, index 5+N, Cols A to Totality Score)
  requests.push(
    {
      repeatCell: {
        range: { sheetId: repertoryId, startRowIndex: 5 + N, endRowIndex: 6 + N, startColumnIndex: 0, endColumnIndex: totalCols },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
            textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } },
            verticalAlignment: "MIDDLE"
          }
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
      }
    },
    {
      updateBorders: {
        range: { sheetId: repertoryId, startRowIndex: 5 + N, endRowIndex: 6 + N, startColumnIndex: 0, endColumnIndex: totalCols },
        top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 226/255 } },
        bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 226/255 } }
      }
    },
    // Decimal format for Coverage row (Columns E to last remedy)
    {
      repeatCell: {
        range: { sheetId: repertoryId, startRowIndex: 5 + N, endRowIndex: 6 + N, startColumnIndex: 4, endColumnIndex: 4 + remediesCount },
        cell: {
          userEnteredFormat: {
            numberFormat: { type: "NUMBER", pattern: "0.0" },
            horizontalAlignment: "CENTER"
          }
        },
        fields: "userEnteredFormat.numberFormat,userEnteredFormat.horizontalAlignment"
      }
    }
  );

  // Sum of Grades styling (Row 12, index 6+N, Cols A to Totality Score)
  requests.push(
    {
      repeatCell: {
        range: { sheetId: repertoryId, startRowIndex: 6 + N, endRowIndex: 7 + N, startColumnIndex: 0, endColumnIndex: totalCols },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 },
            textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
            verticalAlignment: "MIDDLE"
          }
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
      }
    },
    {
      repeatCell: {
        range: { sheetId: repertoryId, startRowIndex: 6 + N, endRowIndex: 7 + N, startColumnIndex: 4, endColumnIndex: 4 + remediesCount },
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "CENTER"
          }
        },
        fields: "userEnteredFormat.horizontalAlignment"
      }
    },
    {
      updateBorders: {
        range: { sheetId: repertoryId, startRowIndex: 6 + N, endRowIndex: 7 + N, startColumnIndex: 0, endColumnIndex: totalCols },
        top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
        bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } }
      }
    }
  );

  // Totality Rank Score styling (Row 13, index 7+N, Cols A to Totality Score)
  requests.push(
    {
      repeatCell: {
        range: { sheetId: repertoryId, startRowIndex: 7 + N, endRowIndex: 8 + N, startColumnIndex: 0, endColumnIndex: totalCols },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 226/255, green: 251/255, blue: 247/255 },
            textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 118/255, blue: 110/255 } },
            verticalAlignment: "MIDDLE"
          }
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
      }
    },
    {
      repeatCell: {
        range: { sheetId: repertoryId, startRowIndex: 7 + N, endRowIndex: 8 + N, startColumnIndex: 4, endColumnIndex: 4 + remediesCount },
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "CENTER"
          }
        },
        fields: "userEnteredFormat.horizontalAlignment"
      }
    },
    {
      updateBorders: {
        range: { sheetId: repertoryId, startRowIndex: 7 + N, endRowIndex: 8 + N, startColumnIndex: 0, endColumnIndex: totalCols },
        top: { style: "SOLID", color: { red: 15/255, green: 118/255, blue: 110/255 } },
        bottom: { style: "SOLID", color: { red: 15/255, green: 118/255, blue: 110/255 } }
      }
    }
  );

  // Clear spacer at index 8+N
  requests.push(
    {
      repeatCell: {
        range: { sheetId: repertoryId, startRowIndex: 8 + N, endRowIndex: 9 + N, startColumnIndex: 0, endColumnIndex: totalCols },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 1, green: 1, blue: 1 },
            textFormat: { fontFamily: "Inter", bold: false, italic: false, fontSize: 10, foregroundColor: { red: 0, green: 0, blue: 0 } }
          }
        },
        fields: "userEnteredFormat(backgroundColor,textFormat)"
      }
    },
    {
      updateBorders: {
        range: { sheetId: repertoryId, startRowIndex: 8 + N, endRowIndex: 9 + N, startColumnIndex: 0, endColumnIndex: totalCols },
        top: { style: "NONE" },
        bottom: { style: "NONE" },
        left: { style: "NONE" },
        right: { style: "NONE" },
        innerHorizontal: { style: "NONE" },
        innerVertical: { style: "NONE" }
      }
    }
  );

  // Top Remedy Ranking header (Row 15, index 9+N)
  requests.push(
    {
      mergeCells: {
        range: { sheetId: repertoryId, startRowIndex: 9 + N, endRowIndex: 10 + N, startColumnIndex: 0, endColumnIndex: 4 },
        mergeType: "MERGE_ALL"
      }
    },
    {
      repeatCell: {
        range: { sheetId: repertoryId, startRowIndex: 9 + N, endRowIndex: 10 + N, startColumnIndex: 0, endColumnIndex: 4 },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 226/255, green: 232/255, blue: 240/255 },
            textFormat: { fontFamily: "Inter", bold: true, fontSize: 10, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } },
            horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE"
          }
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
      }
    }
  );

  // Rank Cards (Rows 16-18, indices 10+N to 13+N)
  for (let r = 0; r < 3; r++) {
    const cardRow = 10 + N + r;
    const scoreColor = r === 0 
      ? { red: 15/255, green: 118/255, blue: 110/255 } // Rank 1 teal
      : r === 1
        ? { red: 217/255, green: 119/255, blue: 6/255 } // Rank 2 amber
        : { red: 79/255, green: 70/255, blue: 229/255 }; // Rank 3 indigo

    requests.push(
      {
        repeatCell: {
          range: { sheetId: repertoryId, startRowIndex: cardRow, endRowIndex: cardRow + 1, startColumnIndex: 0, endColumnIndex: 1 },
          cell: { userEnteredFormat: { backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 }, textFormat: { fontFamily: "Inter", bold: true, foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } } } },
          fields: "userEnteredFormat(backgroundColor,textFormat)"
        }
      },
      {
        repeatCell: {
          range: { sheetId: repertoryId, startRowIndex: cardRow, endRowIndex: cardRow + 1, startColumnIndex: 1, endColumnIndex: 2 },
          cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 1, blue: 1 }, textFormat: { fontFamily: "Inter", bold: true, foregroundColor: { red: 15/255, green: 76/255, blue: 129/255 } }, horizontalAlignment: "CENTER" } },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
        }
      },
      {
        repeatCell: {
          range: { sheetId: repertoryId, startRowIndex: cardRow, endRowIndex: cardRow + 1, startColumnIndex: 2, endColumnIndex: 3 },
          cell: { userEnteredFormat: { backgroundColor: { red: 248/255, green: 250/255, blue: 252/255 }, textFormat: { fontFamily: "Inter", foregroundColor: { red: 100/255, green: 116/255, blue: 139/255 } } } },
          fields: "userEnteredFormat(backgroundColor,textFormat)"
        }
      },
      {
        repeatCell: {
          range: { sheetId: repertoryId, startRowIndex: cardRow, endRowIndex: cardRow + 1, startColumnIndex: 3, endColumnIndex: 4 },
          cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 1, blue: 1 }, textFormat: { fontFamily: "Inter", bold: true, foregroundColor: scoreColor }, horizontalAlignment: "CENTER" } },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
        }
      }
    );
  }

  // Outline border for Rank cards (Rows 15-18, indices 9+N to 13+N)
  requests.push({
    updateBorders: {
      range: { sheetId: repertoryId, startRowIndex: 9 + N, endRowIndex: 13 + N, startColumnIndex: 0, endColumnIndex: 4 },
      top: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
      bottom: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
      left: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
      right: { style: "SOLID", color: { red: 203/255, green: 213/255, blue: 225/255 } },
      innerHorizontal: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } },
      innerVertical: { style: "SOLID", color: { red: 226/255, green: 232/255, blue: 240/255 } }
    }
  });

  // Clear borders and styles below rank cards (up to row 50)
  requests.push(
    {
      repeatCell: {
        range: { sheetId: repertoryId, startRowIndex: 13 + N, endRowIndex: 50, startColumnIndex: 0, endColumnIndex: totalCols },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 1, green: 1, blue: 1 },
            textFormat: { fontFamily: "Inter", bold: false, italic: false, fontSize: 10, foregroundColor: { red: 0, green: 0, blue: 0 } }
          }
        },
        fields: "userEnteredFormat(backgroundColor,textFormat)"
      }
    },
    {
      updateBorders: {
        range: { sheetId: repertoryId, startRowIndex: 13 + N, endRowIndex: 50, startColumnIndex: 0, endColumnIndex: totalCols },
        top: { style: "NONE" },
        bottom: { style: "NONE" },
        left: { style: "NONE" },
        right: { style: "NONE" },
        innerHorizontal: { style: "NONE" },
        innerVertical: { style: "NONE" }
      }
    }
  );

  return requests;
}

/**
 * Synchronizes selected repertory rubrics directly to the patient's clinical sheet 'Repertorization' tab
 */
export async function syncRepertoryToClinicalSheet(
  sheetId: string,
  rubrics: RepertoryExportRubric[],
  remedies: string[] = ["Nux-v", "Lyc", "Ars", "Puls", "Sulph", "Rhus-t", "Calc", "Sil", "Nat-m", "Ign", "Sep"]
): Promise<void> {
  const auth = getGoogleAuth();
  if (!auth) {
    console.warn("Google API Auth missing. Skipping Repertory sync to Google Sheets.");
    return;
  }

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const N = rubrics.length;
    const M = remedies.length;
    const totalCols = 5 + M; // 4 initial columns (A,B,C,D) + M remedies + 1 Totality Score column

    // Fetch spreadsheet metadata to get the sheetId and existing conditional formatting rules of "Repertorization"
    const spreadsheetInfo = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const repertorySheet = spreadsheetInfo.data.sheets?.find(s => s.properties?.title === "Repertorization");
    if (!repertorySheet) {
      throw new Error("Repertorization tab not found in the spreadsheet.");
    }
    const repertoryId = repertorySheet.properties?.sheetId ?? 3;
    const existingRules = repertorySheet.conditionalFormats || [];

    // In case N is 0, we just clear the sheet (or write default headers)
    if (N === 0) {
      const emptyRow = Array(totalCols).fill("");
      const titleRow = [...emptyRow];
      titleRow[0] = "REPERTORY GRID & Dynamic ANALYSIS MATRIX";
      const headerRow = ["Rubric Name", "Chapter / Location", "Source", "Importance Weight", ...remedies, "Totality Score"];
      const emptyRows = [
        emptyRow,
        titleRow,
        headerRow
      ];
      for (let i = 3; i < 50; i++) {
        emptyRows.push(Array(totalCols).fill(""));
      }
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `'Repertorization'!A1:${getColumnLetter(totalCols - 1)}50`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: emptyRows
        }
      });
      return;
    }

    const numRubrics = Math.max(10, N);
    const lastRubricRow = 4 + numRubrics - 1;

    const rows: any[][] = [
      Array(totalCols).fill(""),
      ["REPERTORY GRID & Dynamic ANALYSIS MATRIX", ...Array(totalCols - 1).fill("")],
      ["Rubric Name", "Chapter / Location", "Source", "Importance Weight", ...remedies, "Totality Score"]
    ];

    // Add rubric rows
    rubrics.forEach((r, idx) => {
      const rowNum = 4 + idx;
      const rowValues = [
        r.name,
        r.chapter,
        r.source || "Kent",
        r.weight || 1
      ];
      remedies.forEach(rem => {
        rowValues.push(r.grades[rem] || 0);
      });
      
      // Totality Score formula: e.g. "=D4*SUM(E4:O4)"
      const firstRemCol = getColumnLetter(4);
      const lastRemCol = getColumnLetter(4 + M - 1);
      rowValues.push(`=IF(D${rowNum}="", "", D${rowNum}*SUM(${firstRemCol}${rowNum}:${lastRemCol}${rowNum}))`);
      rows.push(rowValues);
    });

    // Pad remaining rows up to numRubrics
    for (let idx = N; idx < numRubrics; idx++) {
      const rowNum = 4 + idx;
      const rowValues = [
        "", // Rubric Name
        "", // Chapter / Location
        "", // Source
        ""  // Importance Weight
      ];
      remedies.forEach(() => {
        rowValues.push("");
      });
      
      const firstRemCol = getColumnLetter(4);
      const lastRemCol = getColumnLetter(4 + M - 1);
      rowValues.push(`=IF(D${rowNum}="", "", D${rowNum}*SUM(${firstRemCol}${rowNum}:${lastRemCol}${rowNum}))`);
      rows.push(rowValues);
    }

    // Add spacer rows
    rows.push(Array(totalCols).fill(""));
    rows.push(Array(totalCols).fill(""));

    // Formula row indices (1-indexed for sheets)
    const coverageRowIndex = lastRubricRow + 3;
    const sumGradesRowIndex = lastRubricRow + 4;
    const totalityRankRowIndex = lastRubricRow + 5;

    // Symptom Coverage row
    const coverageRow = ["Symptom Coverage", "", "", ""];
    remedies.forEach((rem, idx) => {
      const colLetter = getColumnLetter(4 + idx);
      coverageRow.push(`=COUNTIFS(${colLetter}4:${colLetter}${lastRubricRow}, ">0") / MAX(1, COUNTA($D$4:$D$${lastRubricRow}))`);
    });
    coverageRow.push("");
    rows.push(coverageRow);

    // Sum of Grades row
    const sumGradesRow = ["Sum of Grades", "", "", ""];
    remedies.forEach((rem, idx) => {
      const colLetter = getColumnLetter(4 + idx);
      sumGradesRow.push(`=SUMPRODUCT(${colLetter}4:${colLetter}${lastRubricRow}, $D$4:$D$${lastRubricRow})`);
    });
    sumGradesRow.push("");
    rows.push(sumGradesRow);

    // Totality Rank Score row
    const totalityRankRow = ["Totality Rank Score", "", "", ""];
    remedies.forEach((rem, idx) => {
      const colLetter = getColumnLetter(4 + idx);
      totalityRankRow.push(`=(${colLetter}${coverageRowIndex}*100) + ${colLetter}${sumGradesRowIndex}`);
    });
    totalityRankRow.push("");
    rows.push(totalityRankRow);

    // Spacer
    rows.push(Array(totalCols).fill(""));

    // Top Remedy Ranking label
    rows.push(["Top Remedy Ranking", ...Array(totalCols - 1).fill("")]);

    const firstRemCol = getColumnLetter(4);
    const lastRemCol = getColumnLetter(4 + M - 1);

    // Rank 1
    rows.push([
      "Rank 1",
      `=INDEX($${firstRemCol}$3:$${lastRemCol}$3, MATCH(MAX(${firstRemCol}${totalityRankRowIndex}:${lastRemCol}${totalityRankRowIndex}), ${firstRemCol}${totalityRankRowIndex}:${lastRemCol}${totalityRankRowIndex}, 0))`,
      "Score",
      `=MAX(${firstRemCol}${totalityRankRowIndex}:${lastRemCol}${totalityRankRowIndex})`,
      ...Array(totalCols - 4).fill("")
    ]);

    // Rank 2
    rows.push([
      "Rank 2",
      `=INDEX($${firstRemCol}$3:$${lastRemCol}$3, MATCH(LARGE(${firstRemCol}${totalityRankRowIndex}:${lastRemCol}${totalityRankRowIndex}, 2), ${firstRemCol}${totalityRankRowIndex}:${lastRemCol}${totalityRankRowIndex}, 0))`,
      "Score",
      `=LARGE(${firstRemCol}${totalityRankRowIndex}:${lastRemCol}${totalityRankRowIndex}, 2)`,
      ...Array(totalCols - 4).fill("")
    ]);

    // Rank 3
    rows.push([
      "Rank 3",
      `=INDEX($${firstRemCol}$3:$${lastRemCol}$3, MATCH(LARGE(${firstRemCol}${totalityRankRowIndex}:${lastRemCol}${totalityRankRowIndex}, 3), ${firstRemCol}${totalityRankRowIndex}:${lastRemCol}${totalityRankRowIndex}, 0))`,
      "Score",
      `=LARGE(${firstRemCol}${totalityRankRowIndex}:${lastRemCol}${totalityRankRowIndex}, 3)`,
      ...Array(totalCols - 4).fill("")
    ]);

    // Fill up to 50 rows with blank rows to clear any previous data
    const currentLength = rows.length;
    for (let i = currentLength; i < 50; i++) {
      rows.push(Array(totalCols).fill(""));
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `'Repertorization'!A1:${getColumnLetter(totalCols - 1)}50`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: rows
      }
    });

    // Apply dynamic formatting to match the number of rubrics (numRubrics) and remedies (M)
    const formattingRequests = getRepertoryFormattingRequests(repertoryId, numRubrics, existingRules, M);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: formattingRequests
      }
    });

  } catch (error) {
    console.error("Error writing repertory rubrics to patient Google Sheet:", error);
    throw error;
  }
}
