export type WorkspaceProvisioningIssue =
  | "drive-quota-exceeded"
  | "permission-denied"
  | "temporarily-unavailable"
  | "disabled";

export const DEFAULT_PATIENT_WORKSPACE_FOLDER_URL =
  "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link";

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message.toLowerCase();
  if (typeof error === "string") return error.toLowerCase();
  return "";
}

export function classifyWorkspaceProvisioningError(
  error: unknown,
): WorkspaceProvisioningIssue {
  const message = errorMessage(error);

  if (message.includes("quota") || message.includes("storage limit")) {
    return "drive-quota-exceeded";
  }

  if (
    message.includes("permission") ||
    message.includes("forbidden") ||
    message.includes("not authorized")
  ) {
    return "permission-denied";
  }

  return "temporarily-unavailable";
}

export function buildDeferredPatientWorkspace(
  patientId: string,
  folderUrl = DEFAULT_PATIENT_WORKSPACE_FOLDER_URL,
) {
  return {
    folderId: "",
    folderUrl,
    sheetId: "",
    sheetUrl: `/admin/mock-sheet?mockId=${encodeURIComponent(patientId)}`,
    isMock: true,
    workspaceStatus: "deferred" as const,
  };
}

export function isPatientDriveProvisioningEnabled(): boolean {
  return process.env.GOOGLE_DRIVE_PATIENT_PROVISIONING_ENABLED !== "false";
}
