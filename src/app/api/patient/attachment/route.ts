import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { uploadFileToFolder } from "@/lib/googleDrive";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminApiSession(request);
    if (!session) return unauthorizedApiResponse();

    const { patientId, folderId, fileName, fileMimeType, fileData } = await request.json();

    if (!patientId || !folderId || !fileName || !fileMimeType || !fileData) {
      return NextResponse.json({
        success: false,
        message: "Missing required parameters: patientId, folderId, fileName, fileMimeType, fileData are required."
      }, { status: 400 });
    }

    console.log(`Starting file upload for patient ${patientId} to Google Drive folder ${folderId}...`);

    // 1. Upload to Google Drive using existing drive wrapper
    const uploadResult = await uploadFileToFolder(folderId, fileName, fileMimeType, fileData);
    
    // 2. Append metadata to Firestore patient document
    const db = getAdminDb();
    if (!db) {
      console.warn("Firestore Admin DB unavailable. Operating in mock mode.");
      return NextResponse.json({
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
      return NextResponse.json({
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

    return NextResponse.json({
      success: true,
      attachment: newAttachment
    });

  } catch (error: any) {
    console.error("Error uploading patient file attachment:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred during file upload.",
      error: error.message || String(error)
    }, { status: 500 });
  }
}
