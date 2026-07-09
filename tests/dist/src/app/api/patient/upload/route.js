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
const patientSession_1 = require("@/lib/patientSession");
const googleDrive_1 = require("@/lib/googleDrive");
exports.dynamic = "force-dynamic";
exports.runtime = "nodejs";
function jsonResponse(body, status = 200) {
    const response = server_1.NextResponse.json(body, { status });
    response.headers.set("Cache-Control", "no-store");
    return response;
}
async function POST(request) {
    try {
        // 1. Authenticate patient session
        const session = await (0, patientSession_1.verifyPatientSessionCookie)(request.cookies.get(patientSession_1.PATIENT_SESSION_COOKIE)?.value);
        if (!session) {
            return jsonResponse({ success: false, message: "Authentication required." }, 401);
        }
        const body = await request.json().catch(() => null);
        if (!body || typeof body !== "object") {
            return jsonResponse({ success: false, message: "Invalid request payload." }, 400);
        }
        const { patientId, fileName, mimeType, fileData } = body;
        if (!patientId || !fileName || !mimeType || !fileData) {
            return jsonResponse({ success: false, message: "Missing required parameters (patientId, fileName, mimeType, fileData)." }, 400);
        }
        // 2. Validate ownership (Enforce patient can only access their own linked case)
        if (!session.patientId || session.patientId !== patientId) {
            return jsonResponse({ success: false, message: "Access denied. Mismatch in linked patient ownership." }, 403);
        }
        let folderId = "mock-folder-id";
        let existingAttachments = [];
        // 3. Fetch patient document from Firestore to get Google Drive folder ID
        const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
        if (!isMockProject) {
            try {
                const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
                const patientSnap = await getAdminDb().collection("patients").doc(patientId).get();
                if (patientSnap.exists) {
                    const patientData = patientSnap.data();
                    folderId = patientData?.folderId || "mock-folder-id";
                    if (Array.isArray(patientData?.attachments)) {
                        existingAttachments = patientData.attachments;
                    }
                }
                else {
                    return jsonResponse({ success: false, message: "Patient clinical record not found." }, 444);
                }
            }
            catch (dbErr) {
                console.error("Firestore lookup failed in patient upload route:", dbErr);
                return jsonResponse({ success: false, message: "Database access error." }, 500);
            }
        }
        // 4. Upload file to patient's Google Drive folder
        const uploadResult = await (0, googleDrive_1.uploadFileToFolder)(folderId, fileName, mimeType, fileData);
        if (!uploadResult.success) {
            return jsonResponse({ success: false, message: "Failed to upload file to Google Drive." }, 500);
        }
        // 5. Construct attachment record
        let category = "Lab Result";
        if (mimeType.startsWith("image/")) {
            category = "Imaging";
        }
        else if (fileName.toLowerCase().includes("report")) {
            category = "Uploaded Report";
        }
        const newAttachment = {
            date: new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
            category,
            target: fileName,
            url: uploadResult.fileUrl
        };
        const updatedAttachments = [newAttachment, ...existingAttachments];
        // 6. Update Firestore patient document
        if (!isMockProject) {
            try {
                const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("@/lib/firebaseAdmin")));
                await getAdminDb().collection("patients").doc(patientId).update({
                    attachments: updatedAttachments,
                    attachmentsUpdated: new Date().toISOString()
                });
            }
            catch (updateErr) {
                console.error("Failed to update attachments in Firestore:", updateErr);
                return jsonResponse({ success: false, message: "Failed to update attachments registry in database." }, 500);
            }
        }
        return jsonResponse({
            success: true,
            message: "File uploaded successfully to your Drive folder.",
            attachment: newAttachment,
            attachments: updatedAttachments
        });
    }
    catch (error) {
        console.error("Patient file upload failed:", error);
        return jsonResponse({ success: false, message: "File upload handler failed.", error: error.message || error }, 500);
    }
}
