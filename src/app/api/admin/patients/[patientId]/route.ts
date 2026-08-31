import { NextRequest, NextResponse } from "next/server";
import type { DocumentReference } from "firebase-admin/firestore";
import {
  forbiddenApiResponse,
  requireAdminApiSession,
  unauthorizedApiResponse,
} from "@/lib/adminApiAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { mockPatientCache } from "@/lib/mockStore";
import { normalizeRole } from "@/lib/security/rbac";
import { deleteDriveResource } from "@/lib/googleDrive";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const session = await requireAdminApiSession(request, ["admin", "doctor"]);
  if (!session) return unauthorizedApiResponse();

  const { patientId } = await params;
  if (!patientId || patientId.includes("/")) {
    return NextResponse.json(
      { success: false, message: "A valid patient ID is required." },
      { status: 400 }
    );
  }

  const deleteSheetParam = request.nextUrl.searchParams.get("deleteSheet");
  const deleteFilesParam = request.nextUrl.searchParams.get("deleteFiles");
  const shouldDeleteDriveFiles =
    deleteSheetParam === "true" ||
    deleteSheetParam === "1" ||
    deleteFilesParam === "true" ||
    deleteFilesParam === "1";

  try {
    const firebaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id"
    );
    let patient: Record<string, unknown> | undefined;
    let patientRef: DocumentReference | null = null;

    if (firebaseConfigured) {
      const firestorePatientRef = getAdminDb().collection("patients").doc(patientId);
      patientRef = firestorePatientRef;
      const snapshot = await firestorePatientRef.get();

      if (!snapshot.exists) {
        return NextResponse.json(
          { success: false, message: "Patient record not found." },
          { status: 404 }
        );
      }

      patient = snapshot.data() || {};
    } else {
      patient = mockPatientCache.get(patientId);
      if (!patient) {
        return NextResponse.json(
          { success: false, message: "Patient record not found." },
          { status: 404 }
        );
      }
    }

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient record not found." },
        { status: 404 }
      );
    }

    const isSuperAdmin = normalizeRole(session.role) === "super-admin";

    if (!isSuperAdmin && patient.assignedDoctor !== session.uid) {
      return forbiddenApiResponse("You can delete only cases assigned to you.");
    }

    // If deleting Google Drive files / clinical sheet is requested
    let driveFilesDeleted = false;
    if (shouldDeleteDriveFiles) {
      const sheetUrl =
        (patient.sheetUrl as string) ||
        (patient.clinicalSheetUrl as string) ||
        (patient.masterSheetUrl as string) ||
        "";
      const folderUrl =
        (patient.folderUrl as string) ||
        (patient.driveFolderUrl as string) ||
        "";
      const folderId =
        (patient.folderId as string) ||
        (patient.driveFolderId as string) ||
        "";

      // 1. Delete the clinical sheet
      if (sheetUrl) {
        await deleteDriveResource(sheetUrl).catch((err) =>
          console.warn("Could not delete clinical sheet:", err)
        );
      }

      // 2. Delete the patient drive folder (which also purges all nested sheets & attachments)
      if (folderId || folderUrl) {
        await deleteDriveResource(folderId || folderUrl).catch((err) =>
          console.warn("Could not delete patient folder:", err)
        );
      }

      driveFilesDeleted = true;
    }

    if (patientRef) {
      await patientRef.delete();
    }

    mockPatientCache.delete(patientId);

    return NextResponse.json({
      success: true,
      patientId,
      workspaceRetained: !shouldDeleteDriveFiles,
      driveFilesDeleted,
      message: shouldDeleteDriveFiles
        ? "Patient case, Google clinical sheet, and patient folder were permanently deleted."
        : "Patient case record deleted. Google clinical files were retained for recovery."
    });
  } catch (error: any) {
    console.error("Failed to delete patient record:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete patient record." },
      { status: 500 }
    );
  }
}
