import { NextRequest, NextResponse } from "next/server";
import { PATIENT_SESSION_COOKIE, verifyPatientSessionCookie } from "@/lib/patientSession";
import { uploadFileToFolder } from "@/lib/googleDrive";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function jsonResponse(body: Record<string, unknown>, status = 200) {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate patient session
    const session = await verifyPatientSessionCookie(request.cookies.get(PATIENT_SESSION_COOKIE)?.value);
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
    let existingAttachments: any[] = [];

    // 3. Fetch patient document from Firestore to get Google Drive folder ID
    const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
    if (!isMockProject) {
      try {
        const { getAdminDb } = await import("@/lib/firebaseAdmin");
        const patientSnap = await getAdminDb().collection("patients").doc(patientId).get();
        if (patientSnap.exists) {
          const patientData = patientSnap.data();
          folderId = patientData?.folderId || "mock-folder-id";
          if (Array.isArray(patientData?.attachments)) {
            existingAttachments = patientData.attachments;
          }
        } else {
          return jsonResponse({ success: false, message: "Patient clinical record not found." }, 444);
        }
      } catch (dbErr: any) {
        console.error("Firestore lookup failed in patient upload route:", dbErr);
        return jsonResponse({ success: false, message: "Database access error." }, 500);
      }
    }

    // 4. Upload file to patient's Google Drive folder
    const uploadResult = await uploadFileToFolder(folderId, fileName, mimeType, fileData);
    if (!uploadResult.success) {
      return jsonResponse({ success: false, message: "Failed to upload file to Google Drive." }, 500);
    }

    // 5. Construct attachment record
    let category = "Lab Result";
    if (mimeType.startsWith("image/")) {
      category = "Imaging";
    } else if (fileName.toLowerCase().includes("report")) {
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
        const { getAdminDb } = await import("@/lib/firebaseAdmin");
        await getAdminDb().collection("patients").doc(patientId).update({
          attachments: updatedAttachments,
          attachmentsUpdated: new Date().toISOString()
        });
      } catch (updateErr: any) {
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

  } catch (error: any) {
    console.error("Patient file upload failed:", error);
    return jsonResponse({ success: false, message: "File upload handler failed.", error: error.message || error }, 500);
  }
}
