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
const googleDrive_1 = require("@/lib/googleDrive");
const adminApiAuth_1 = require("@/lib/adminApiAuth");
exports.dynamic = "force-dynamic";
exports.runtime = "nodejs";
async function POST(request) {
    try {
        const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
        if (!session)
            return (0, adminApiAuth_1.unauthorizedApiResponse)();
        const { patientId, rubrics, remedies, sheetId: clientSheetId } = await request.json();
        if (!patientId || !rubrics || !Array.isArray(rubrics)) {
            return server_1.NextResponse.json({ success: false, message: "Missing patientId or invalid rubrics parameter." }, { status: 400 });
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
                console.error("Firestore patient fetch failed in export-repertory:", dbErr);
            }
        }
        // 2. If it is a real Google Sheet, push the repertory matrix values to the sheet
        if (sheetId && sheetId !== "mock-sheet-id" && sheetId !== "mock-sheet") {
            try {
                await (0, googleDrive_1.syncRepertoryToClinicalSheet)(sheetId, rubrics, remedies);
            }
            catch (sheetErr) {
                console.error("Failed to push repertory rubrics to Google Sheets:", sheetErr);
                return server_1.NextResponse.json({
                    success: false,
                    message: "Failed to update Google Sheets. Make sure credentials are correct.",
                    error: sheetErr.message || sheetErr
                }, { status: 500 });
            }
        }
        else {
            console.log("No real Google Sheet associated with this patient. Operating in mock mode.");
        }
        return server_1.NextResponse.json({
            success: true,
            message: "Repertory rubrics synchronized to Google Sheet successfully."
        });
    }
    catch (error) {
        console.error("Export repertory failed:", error);
        return server_1.NextResponse.json({
            success: false,
            message: "Failed to export repertory rubrics.",
            error: error.message || error
        }, { status: 500 });
    }
}
