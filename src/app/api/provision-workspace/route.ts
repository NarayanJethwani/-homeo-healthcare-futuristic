import { NextRequest, NextResponse } from "next/server";
import {
  forbiddenApiResponse,
  requireAdminApiSession,
  unauthorizedApiResponse,
} from "@/lib/adminApiAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import {
  createPatientFolder,
  createPatientClinicalSheet,
  appendPatientToMasterRecord,
  PatientIntakeData,
} from "@/lib/googleDrive";
import { normalizeRole } from "@/lib/security/rbac";
import {
  buildDeferredPatientWorkspace,
  classifyWorkspaceProvisioningError,
  isPatientDriveProvisioningEnabled,
  type WorkspaceProvisioningIssue,
} from "@/features/clinical-os/application/workspaceProvisioningPolicy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function saveDeferredWorkspace(
  patientId: string,
  issue: WorkspaceProvisioningIssue,
  folderUrl?: string,
) {
  const workspace = buildDeferredPatientWorkspace(patientId, folderUrl);
  await getAdminDb().collection("patients").doc(patientId).set(
    {
      folderId: workspace.folderId,
      folderUrl: workspace.folderUrl,
      sheetId: workspace.sheetId,
      sheetUrl: workspace.sheetUrl,
      isMock: true,
    },
    { merge: true },
  );

  return NextResponse.json({
    success: true,
    isMock: true,
    workspaceStatus: workspace.workspaceStatus,
    workspaceIssue: issue,
    message:
      "Patient record is saved. Google Drive workspace is temporarily deferred; the secure local clinical sheet is available.",
    folderUrl: workspace.folderUrl,
    sheetUrl: workspace.sheetUrl,
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminApiSession(request);
    if (!session) return unauthorizedApiResponse();

    const body = await request.json().catch(() => null);
    const id = body && typeof body.id === "string" ? body.id.trim() : "";
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Patient ID is required." },
        { status: 400 },
      );
    }

    const patientRef = getAdminDb().collection("patients").doc(id);
    const patientSnapshot = await patientRef.get();
    if (!patientSnapshot.exists) {
      return NextResponse.json(
        { success: false, message: "Patient record was not found." },
        { status: 404 },
      );
    }

    const patient = patientSnapshot.data() || {};
    const isDoctor = normalizeRole(session.role) === "read-only-admin";
    if (isDoctor && patient.assignedDoctor !== session.uid) {
      return forbiddenApiResponse("This patient is assigned to another practitioner.");
    }

    const patientData: PatientIntakeData = {
      id,
      name: String(patient.name || "Patient"),
      age: String(patient.age || "30"),
      gender: String(patient.gender || "Not specified"),
      phone: String(patient.phone || ""),
      email: String(patient.email || ""),
      city: String(patient.location || "N/A"),
      state: "N/A",
      country: "India",
      complaint: String(patient.complaint || "N/A"),
      careLevel: String(patient.careLevel || "Standard Consultation"),
      conditionsCount: Number(patient.conditionsCount || 1),
      durationText: String(patient.durationText || "One-Time consultation"),
      finalPrice: Number(patient.finalPrice || 0),
    };

    const fallbackFolderUrl =
      typeof patient.folderUrl === "string" && patient.folderUrl.startsWith("https://")
        ? patient.folderUrl
        : undefined;

    if (
      !isPatientDriveProvisioningEnabled() ||
      !process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    ) {
      return saveDeferredWorkspace(
        id,
        isPatientDriveProvisioningEnabled()
          ? "temporarily-unavailable"
          : "disabled",
        fallbackFolderUrl,
      );
    }

    try {
      const folderResult = await createPatientFolder(patientData);
      const sheetResult = await createPatientClinicalSheet(
        folderResult.folderId,
        patientData,
      );

      try {
        await appendPatientToMasterRecord(
          patientData,
          folderResult.folderUrl,
          sheetResult.sheetUrl,
        );
      } catch {
        console.warn("Patient workspace created; master record sync was deferred.");
      }

      await patientRef.set(
        {
          folderId: folderResult.folderId,
          folderUrl: folderResult.folderUrl,
          sheetId: sheetResult.sheetId,
          sheetUrl: sheetResult.sheetUrl,
          isMock: false,
        },
        { merge: true },
      );

      return NextResponse.json({
        success: true,
        isMock: false,
        workspaceStatus: "ready",
        folderUrl: folderResult.folderUrl,
        sheetUrl: sheetResult.sheetUrl,
      });
    } catch (error) {
      const issue = classifyWorkspaceProvisioningError(error);
      console.error("Dynamic workspace provisioning deferred:", issue);
      return saveDeferredWorkspace(id, issue, fallbackFolderUrl);
    }
  } catch {
    console.error("Dynamic workspace provisioning failed safely.");
    return NextResponse.json(
      {
        success: false,
        message: "Workspace provisioning could not be completed.",
      },
      { status: 500 },
    );
  }
}
