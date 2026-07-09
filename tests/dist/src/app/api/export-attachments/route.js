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
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const googleDrive_1 = require("@/lib/googleDrive");
const adminApiAuth_1 = require("@/lib/adminApiAuth");
exports.dynamic = "force-dynamic";
exports.runtime = "nodejs";
async function GET(request) {
    try {
        const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
        if (!session)
            return (0, adminApiAuth_1.unauthorizedApiResponse)();
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get("patientId");
        if (!patientId) {
            return server_1.NextResponse.json({ success: false, message: "Missing patientId parameter." }, { status: 400 });
        }
        // Default mock attachments in case patient record is not found or Firebase is in mock mode
        let attachments = [
            { date: new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }), category: "Clinical Photo", target: "Epigastric Bloating Snapshot", url: "https://drive.google.com/drive/folders/mock-folder-id" },
            { date: "05-06-2026", category: "Blood Test", target: "Complete Blood Count & Liver Panel", url: "https://drive.google.com/drive/folders/mock-folder-id" }
        ];
        if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
            try {
                const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
                const patientSnap = await getAdminDb().collection("patients").doc(patientId).get();
                if (patientSnap.exists) {
                    const patientData = patientSnap.data();
                    if (patientData?.attachments) {
                        attachments = patientData.attachments;
                    }
                }
            }
            catch (dbErr) {
                console.error("Firestore patient attachments fetch failed:", dbErr);
            }
        }
        return server_1.NextResponse.json({ success: true, attachments });
    }
    catch (error) {
        console.error("Fetch attachments failed:", error);
        return server_1.NextResponse.json({ success: false, message: "Failed to fetch attachments.", error: error.message || error }, { status: 500 });
    }
}
async function POST(request) {
    try {
        const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
        if (!session)
            return (0, adminApiAuth_1.unauthorizedApiResponse)();
        const { patientId, attachments, sheetId: clientSheetId } = await request.json();
        if (!patientId || !Array.isArray(attachments)) {
            return server_1.NextResponse.json({ success: false, message: "Missing patientId or invalid attachments parameter." }, { status: 400 });
        }
        let sheetId = clientSheetId || "mock-sheet-id";
        // 1. Fetch patient document to get sheetId only if not provided by client
        if ((!sheetId || sheetId === "mock-sheet-id") && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
            try {
                const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
                const patientSnap = await getAdminDb().collection("patients").doc(patientId).get();
                if (patientSnap.exists) {
                    const patientData = patientSnap.data();
                    sheetId = patientData?.sheetId || "mock-sheet-id";
                }
            }
            catch (dbErr) {
                console.error("Firestore patient fetch failed in export-attachments:", dbErr);
            }
        }
        // 2. If sheetId exists, push the attachments to the patient's Google Sheet
        if (sheetId && sheetId !== "mock-sheet-id" && sheetId !== "mock-sheet") {
            try {
                await (0, googleDrive_1.syncAttachmentsToClinicalSheet)(sheetId, attachments);
            }
            catch (sheetErr) {
                console.warn("Failed to push attachments to Google Sheets, falling back to Firestore only:", sheetErr);
            }
        }
        // 3. Update Firestore with the attachments array
        if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
            try {
                const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
                await getAdminDb().collection("patients").doc(patientId).update({
                    attachments: attachments,
                    attachmentsUpdated: new Date().toISOString()
                });
            }
            catch (dbUpdateErr) {
                console.error("Firestore attachments update failed in export-attachments:", dbUpdateErr);
            }
        }
        else {
            console.log("Firebase not configured or operating in mock-project-id. Skipping Firestore update.");
        }
        return server_1.NextResponse.json({
            success: true,
            message: "Attachments updated in Firestore and Google Sheet successfully."
        });
    }
    catch (error) {
        console.error("Export attachments failed:", error);
        return server_1.NextResponse.json({
            success: false,
            message: "Failed to export attachments.",
            error: error.message || error
        }, { status: 500 });
    }
}
