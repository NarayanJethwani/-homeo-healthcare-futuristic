"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.dynamic = void 0;
exports.POST = POST;
const server_1 = require("next/server");
const firebaseAdmin_1 = require("@/lib/firebaseAdmin");
const googleDrive_1 = require("@/lib/googleDrive");
const adminApiAuth_1 = require("@/lib/adminApiAuth");
exports.dynamic = "force-dynamic";
exports.runtime = "nodejs";
async function POST(request) {
    try {
        const session = await (0, adminApiAuth_1.requireAdminApiSession)(request);
        if (!session)
            return (0, adminApiAuth_1.unauthorizedApiResponse)();
        const { patientId, folderId, fileName, fileMimeType, fileData } = await request.json();
        if (!patientId || !folderId || !fileName || !fileMimeType || !fileData) {
            return server_1.NextResponse.json({
                success: false,
                message: "Missing required parameters: patientId, folderId, fileName, fileMimeType, fileData are required."
            }, { status: 400 });
        }
        console.log(`Starting file upload for patient ${patientId} to Google Drive folder ${folderId}...`);
        // 1. Upload to Google Drive using existing drive wrapper
        const uploadResult = await (0, googleDrive_1.uploadFileToFolder)(folderId, fileName, fileMimeType, fileData);
        // 2. Append metadata to Firestore patient document
        const db = (0, firebaseAdmin_1.getAdminDb)();
        if (!db) {
            console.warn("Firestore Admin DB unavailable. Operating in mock mode.");
            return server_1.NextResponse.json({
                success: true,
                attachment: {
                    id: uploadResult.fileId,
                    name: fileName,
                    url: uploadResult.fileUrl,
                    uploadedAt: new Date().toISOString()
                }
            });
        }
        const patientRef = db.collection("patients").doc(patientId);
        const docSnap = await patientRef.get();
        if (!docSnap.exists) {
            return server_1.NextResponse.json({
                success: false,
                message: `Patient with ID ${patientId} not found in Firestore.`
            }, { status: 404 });
        }
        const currentData = docSnap.data() || {};
        const attachments = currentData.attachments || [];
        const newAttachment = {
            id: uploadResult.fileId,
            name: fileName,
            url: uploadResult.fileUrl,
            uploadedAt: new Date().toISOString()
        };
        attachments.push(newAttachment);
        await patientRef.update({ attachments });
        console.log(`Successfully uploaded attachment and updated Firestore for patient ${patientId}`);
        return server_1.NextResponse.json({
            success: true,
            attachment: newAttachment
        });
    }
    catch (error) {
        console.error("Error uploading patient file attachment:", error);
        return server_1.NextResponse.json({
            success: false,
            message: "An error occurred during file upload.",
            error: error.message || String(error)
        }, { status: 500 });
    }
}
