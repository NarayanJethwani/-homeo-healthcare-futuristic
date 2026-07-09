"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.dynamic = void 0;
exports.POST = POST;
exports.GET = GET;
const server_1 = require("next/server");
const adminApiAuth_1 = require("@/lib/adminApiAuth");
const googleDrive_1 = require("@/lib/googleDrive");
exports.dynamic = "force-dynamic";
exports.runtime = "nodejs";
// Helper to parse sheet rows (supporting vertical single patient and horizontal tabular format)
function parseSheetDataRows(rows) {
    if (rows.length === 0)
        return [];
    // 1. Check if it's an individual patient clinical sheet (vertical key-value format)
    // Look for cells in col A like "Patient Name", "Chief Complaint"
    const getRowValue = (keyPattern) => {
        const found = rows.find(r => r[0] && String(r[0]).toLowerCase().includes(keyPattern.toLowerCase()));
        return found && found.length > 1 ? String(found[1]).trim() : "";
    };
    const name = getRowValue("patient name");
    const complaint = getRowValue("chief complaint") || getRowValue("symptoms");
    if (name && complaint) {
        const ageGender = getRowValue("age / gender");
        const [age, gender] = ageGender ? ageGender.split("/").map(s => s.trim()) : ["", ""];
        const phone = getRowValue("contact phone") || getRowValue("phone");
        const email = getRowValue("email");
        const location = getRowValue("location") || getRowValue("address");
        const rubrics = getRowValue("clinical findings") || getRowValue("rubrics") || getRowValue("rubric") || getRowValue("symptom rubrics") || getRowValue("symptom rubric") || getRowValue("repertory rubric") || getRowValue("repertory rubrics");
        return [{
                name,
                age: age || "30",
                gender: gender || "Male",
                email: email || "",
                phone: phone || "",
                city: location || "",
                state: "",
                complaint,
                rubrics
            }];
    }
    // 2. Otherwise assume standard horizontal multiple patients tabular list
    const headers = rows[0].map(h => String(h).toLowerCase().trim());
    const patientsList = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0 || row.every(val => !val || String(val).trim() === "")) {
            continue;
        }
        const getVal = (fieldNames) => {
            const index = headers.findIndex(h => fieldNames.includes(h));
            return index !== -1 && index < row.length ? String(row[index]).trim() : "";
        };
        const patientName = getVal(["name", "patient name", "fullname", "patient"]);
        const patientComplaint = getVal(["complaint", "symptoms", "history", "chief complaint"]);
        if (patientName && patientComplaint) {
            const age = getVal(["age", "patient age", "yrs"]);
            const gender = getVal(["gender", "sex", "gender"]);
            const email = getVal(["email", "mail", "email address"]);
            const phone = getVal(["phone", "contact", "mobile", "tel"]);
            const city = getVal(["city", "location", "town"]);
            const state = getVal(["state", "province"]);
            const rubrics = getVal(["rubric", "rubrics", "repertory", "symptom rubric", "symptom rubrics", "repertory rubric", "repertory rubrics", "clinical findings"]);
            patientsList.push({
                name: patientName,
                age: age || "30",
                gender: gender || "Male",
                email: email || "",
                phone: phone || "",
                city: city || "",
                state: state || "",
                complaint: patientComplaint,
                rubrics
            });
        }
    }
    return patientsList;
}
async function POST(request) {
    try {
        const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
        if (!session)
            return (0, adminApiAuth_1.unauthorizedApiResponse)();
        const { urlOrId } = await request.json();
        if (!urlOrId) {
            return server_1.NextResponse.json({ success: false, message: "Spreadsheet/Folder URL or ID is required." }, { status: 400 });
        }
        // 1. Check if the input is a Google Drive Folder link or folder ID
        if ((0, googleDrive_1.isGoogleDriveFolder)(urlOrId)) {
            const folderId = (0, googleDrive_1.extractFolderId)(urlOrId);
            if (!folderId) {
                return server_1.NextResponse.json({ success: false, message: "Invalid Folder ID." }, { status: 400 });
            }
            console.log("Listing files in Google Drive folder ID:", folderId);
            const files = await (0, googleDrive_1.listFilesInFolder)(folderId);
            return server_1.NextResponse.json({
                success: true,
                isFolder: true,
                files: files.map(f => ({
                    id: f.id,
                    name: f.name,
                    mimeType: f.mimeType,
                    webViewLink: f.webViewLink
                }))
            });
        }
        // 2. Otherwise assume it is a single Google Sheet Spreadsheet ID
        const spreadsheetId = (0, googleDrive_1.extractSpreadsheetId)(urlOrId);
        if (!spreadsheetId) {
            return server_1.NextResponse.json({ success: false, message: "Invalid Spreadsheet ID." }, { status: 400 });
        }
        console.log("Fetching patient sheet from Google Drive ID:", spreadsheetId);
        const rows = await (0, googleDrive_1.getPatientRowsFromSheet)(spreadsheetId);
        const parsedPatients = parseSheetDataRows(rows);
        if (parsedPatients.length === 0) {
            return server_1.NextResponse.json({
                success: false,
                message: "No valid patient data found in sheet. Make sure headers contain 'Name' and 'Complaint' or 'Symptoms'."
            }, { status: 400 });
        }
        return server_1.NextResponse.json({
            success: true,
            isFolder: false,
            patients: parsedPatients
        });
    }
    catch (error) {
        console.error("Failed to import from Google Drive/Sheets:", error);
        return server_1.NextResponse.json({
            success: false,
            message: error.message || "Failed to read Google Drive folder or sheet. Make sure permissions are correct."
        }, { status: 500 });
    }
}
async function GET(request) {
    const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
    if (!session)
        return (0, adminApiAuth_1.unauthorizedApiResponse)();
    const email = (0, googleDrive_1.getServiceAccountEmail)();
    return server_1.NextResponse.json({
        success: true,
        serviceAccountEmail: email || "homeo-healthcare-service-acc@clinic-portal.iam.gserviceaccount.com"
    });
}
