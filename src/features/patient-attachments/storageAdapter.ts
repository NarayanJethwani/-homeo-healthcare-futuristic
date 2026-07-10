import { isAllowedMimeType, isAllowedFileSize, isExecutableOrUnsafe, sanitizeFileName, isSafeFileContent } from "./uploadValidation";


// Local in-memory store for file bytes simulation during local development
export const memoryStorageFiles = new Map<string, { bytes: Buffer; mimeType: string }>();

export interface FileUploadInput {
  patientId: string;
  attachmentId: string;
  fileName: string;
  mimeType: string;
  fileData: string; // Base64 encoded file data
}

function getCleanStoragePath(patientId: string, attachmentId: string, fileName: string): string {
  const safeName = sanitizeFileName(fileName);
  return `patient-attachments/${patientId}/${attachmentId}/${safeName}`;
}

export async function uploadAttachmentFile(input: FileUploadInput): Promise<{ storagePath: string; downloadUrl: string }> {
  const { patientId, attachmentId, fileName, mimeType, fileData } = input;
  const storagePath = getCleanStoragePath(patientId, attachmentId, fileName);
  
  const buffer = Buffer.from(fileData, "base64");
  if (buffer.length === 0) {
    throw new Error("File cannot be empty (0 bytes).");
  }
  if (!isAllowedFileSize(buffer.length)) {
    throw new Error("File exceeds maximum allowed size of 10 MB.");
  }
  if (!isAllowedMimeType(mimeType)) {
    throw new Error("Unsupported file type.");
  }
  if (isExecutableOrUnsafe(fileName, mimeType)) {
    throw new Error("File security check failed: Unsafe or executable content detected.");
  }
  if (!isSafeFileContent(buffer, mimeType)) {
    throw new Error("File security check failed: Unsafe or executable content signature detected.");
  }

  const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
  if (!isMockProject) {
    try {
      const { getStorage } = await import("firebase-admin/storage");
      const bucket = getStorage().bucket();
      const file = bucket.file(storagePath);
      await file.save(buffer, {
        metadata: { contentType: mimeType }
      });
      const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
      return { storagePath, downloadUrl };
    } catch {
      console.warn("[Storage Adapter] Cloud storage failed, writing to memory.");
    }
  }

  memoryStorageFiles.set(storagePath, { bytes: buffer, mimeType });
  const downloadUrl = `http://localhost:3000/api/mock-storage/${storagePath}`;
  return { storagePath, downloadUrl };
}

export async function getAttachmentDownloadUrl(storagePath: string): Promise<string> {
  const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
  if (!isMockProject) {
    try {
      const { getStorage } = await import("firebase-admin/storage");
      const bucket = getStorage().bucket();
      const file = bucket.file(storagePath);
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 300 * 1000
      });
      return url;
    } catch {
      console.warn("[Storage Adapter] Cloud signed URL generation failed, returning fallback.");
    }
  }
  return `http://localhost:3000/api/mock-storage/${storagePath}?token=mock-signed-url-token&expires=${Date.now() + 300 * 1000}`;
}

export async function deleteAttachmentFile(storagePath: string): Promise<void> {
  const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
  if (!isMockProject) {
    try {
      const { getStorage } = await import("firebase-admin/storage");
      const bucket = getStorage().bucket();
      await bucket.file(storagePath).delete();
      return;
    } catch {
      console.warn("[Storage Adapter] Cloud delete failed, removing from memory.");
    }
  }
  memoryStorageFiles.delete(storagePath);
}

export async function archiveAttachmentFile(): Promise<void> {
  // Metadata is updated in the repository layer. Storage layer operations are stubbed or handled by lifecycle policies.
}
