"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.dynamic = void 0;
exports.POST = POST;
const server_1 = require("next/server");
const adminApiAuth_1 = require("@/lib/adminApiAuth");
const googleDrive_1 = require("@/lib/googleDrive");
exports.dynamic = "force-dynamic";
exports.runtime = "nodejs";
async function POST(request) {
    try {
        const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
        if (!session)
            return (0, adminApiAuth_1.unauthorizedApiResponse)();
        const body = await request.json();
        const { id, name, age, gender, phone, email, location, complaint, careLevel, durationText, finalPrice } = body;
        if (!id || !name) {
            return server_1.NextResponse.json({ success: false, message: "Patient ID and Name are required." }, { status: 400 });
        }
        const patientData = {
            id,
            name,
            age: String(age || "30"),
            gender: gender || "Male",
            phone: phone || "",
            email: email || "",
            city: location || "N/A",
            state: "N/A",
            country: "India",
            complaint: complaint || "N/A",
            careLevel: careLevel || "Standard Consultation",
            conditionsCount: 1,
            durationText: durationText || "One-Time consultation",
            finalPrice: Number(finalPrice || 3500)
        };
        console.log("Dynamically provisioning Google Workspace for patient:", name);
        // Check if the service account credentials exist
        const hasCredentials = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
        if (!hasCredentials) {
            const mockSheetUrl = `/admin/mock-sheet?mockId=${encodeURIComponent(id)}`;
            return server_1.NextResponse.json({
                success: true,
                isMock: true,
                folderUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link",
                sheetUrl: mockSheetUrl
            });
        }
        // 1. Create Patient Folder in Google Drive
        const folderResult = await (0, googleDrive_1.createPatientFolder)(patientData);
        // 2. Create Patient Clinical Sheet inside Folder
        const sheetResult = await (0, googleDrive_1.createPatientClinicalSheet)(folderResult.folderId, patientData);
        // 3. Try to append to Master Record Sheet if possible
        try {
            await (0, googleDrive_1.appendPatientToMasterRecord)(patientData, folderResult.folderUrl, sheetResult.sheetUrl);
        }
        catch (mErr) {
            console.warn("Could not sync dynamically provisioned patient to Master Record Sheet:", mErr);
        }
        // 4. Update the patient document in Firestore
        const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
        if (!isMockProject) {
            const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
            await getAdminDb().collection("patients").doc(id).update({
                folderId: folderResult.folderId,
                folderUrl: folderResult.folderUrl,
                sheetId: sheetResult.sheetId,
                sheetUrl: sheetResult.sheetUrl
            });
        }
        return server_1.NextResponse.json({
            success: true,
            isMock: false,
            folderUrl: folderResult.folderUrl,
            sheetUrl: sheetResult.sheetUrl
        });
    }
    catch (error) {
        console.error("Dynamic workspace provisioning failed:", error);
        return server_1.NextResponse.json({
            success: false,
            message: "Workspace provisioning failed.",
            error: error.message || error
        }, { status: 500 });
    }
}
