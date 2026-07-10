export function validateAttachmentUpload(file: { name: string; mimeType: string; sizeBytes: number }) {
  if (!file.name || file.name.trim() === "") {
    throw new Error("Filename cannot be empty.");
  }
  if (file.name.length > 255) {
    throw new Error("Filename exceeds maximum allowed length of 255 characters.");
  }

  // Check path traversal attempts (both plain text and URL-encoded / Unicode-encoded)
  const lowerName = file.name.toLowerCase();
  const decodedName = decodeURIComponent(file.name).toLowerCase();
  if (
    lowerName.includes("..") ||
    lowerName.includes("/") ||
    lowerName.includes("\\") ||
    decodedName.includes("..") ||
    decodedName.includes("/") ||
    decodedName.includes("\\")
  ) {
    throw new Error("Path traversal sequences are strictly prohibited.");
  }

  // Check for double extension containing script or executable patterns
  const parts = lowerName.split(".");
  if (parts.length > 2) {
    const unsafeIntermediateExtensions = ["exe", "bat", "sh", "js", "ts", "html", "htm", "svg", "vbs", "cmd", "scr", "jar", "php", "jsp", "asp", "aspx", "cgi", "pl", "py", "rb"];
    for (let i = 1; i < parts.length - 1; i++) {
      if (unsafeIntermediateExtensions.includes(parts[i])) {
        throw new Error("Unsafe double extensions are prohibited.");
      }
    }
  }

  if (file.sizeBytes === 0) {
    throw new Error("File cannot be empty (0 bytes).");
  }
  if (!isAllowedFileSize(file.sizeBytes)) {
    throw new Error("File exceeds maximum allowed size of 10 MB.");
  }
  if (!isAllowedMimeType(file.mimeType)) {
    throw new Error("Unsupported file type. Only PDF, JPEG, PNG, and WEBP files are allowed.");
  }
  if (isExecutableOrUnsafe(file.name, file.mimeType)) {
    throw new Error("File security check failed: Unsafe or executable content detected.");
  }
}

export function sanitizeFileName(fileName: string): string {
  // Strip path traversal attempts and extract the base file name
  let name = fileName.replace(/^.*[\\\/]/, "");
  // Replace non-alphanumeric characters (except dot, hyphen, underscore) with underscore
  name = name.replace(/[^\w\.\-]/g, "_");
  // Prevent duplicate/consecutive dots
  name = name.replace(/\.{2,}/g, ".");
  return name;
}

export function detectAttachmentType(fileName: string, mimeType: string, userSelectedType?: string): string {
  if (userSelectedType) return userSelectedType;
  const nameLower = fileName.toLowerCase();
  if (
    nameLower.includes("lab") ||
    nameLower.includes("report") ||
    nameLower.includes("blood") ||
    nameLower.includes("cbc") ||
    nameLower.includes("test")
  ) {
    return "lab-report";
  }
  if (nameLower.includes("presc")) {
    return "prescription";
  }
  if (
    nameLower.includes("imaging") ||
    nameLower.includes("scan") ||
    nameLower.includes("xray") ||
    nameLower.includes("mri") ||
    nameLower.includes("ultrasound")
  ) {
    return "imaging-report";
  }
  if (nameLower.includes("discharge") || nameLower.includes("summary")) {
    return "discharge-summary";
  }
  if (nameLower.includes("consent")) {
    return "consent-form";
  }
  return "other";
}

export function isAllowedMimeType(mimeType: string): boolean {
  if (!mimeType) return false;
  const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  return allowed.includes(mimeType);
}

export function isAllowedFileSize(sizeBytes: number): boolean {
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  return sizeBytes <= MAX_SIZE;
}

export function isExecutableOrUnsafe(fileName: string, mimeType: string): boolean {
  const extLower = fileName.split(".").pop()?.toLowerCase();
  const unsafeExtensions = ["exe", "bat", "sh", "js", "ts", "html", "htm", "svg", "vbs", "cmd", "scr", "jar", "php", "jsp", "asp", "aspx", "cgi", "pl", "py", "rb"];
  if (extLower && unsafeExtensions.includes(extLower)) {
    return true;
  }
  if (
    mimeType.includes("javascript") ||
    mimeType.includes("html") ||
    mimeType.includes("svg") ||
    mimeType.includes("xml")
  ) {
    return true;
  }
  return false;
}

export function isSafeFileContent(buffer: Buffer, mimeType: string): boolean {
  if (!mimeType) return false;

  // Check for MZ (PE / EXE) signature (0x4D, 0x5A)
  if (buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a) {
    return false;
  }
  // Check for ELF signature (0x7F, 0x45, 0x4c, 0x46)
  if (buffer.length >= 4 && buffer[0] === 0x7f && buffer[1] === 0x45 && buffer[2] === 0x4c && buffer[3] === 0x46) {
    return false;
  }

  // Check for script tags or HTML/SVG content in the first 8KB of data
  const textSample = buffer.toString("utf8", 0, Math.min(buffer.length, 8192));
  const lowerText = textSample.toLowerCase();
  
  const unsafeSubstrings = [
    "<script",
    "javascript:",
    "<?php",
    "<% ",
    "eval(",
    "<html",
    "<svg"
  ];
  
  for (const pat of unsafeSubstrings) {
    if (lowerText.includes(pat)) {
      return false;
    }
  }

  return true;
}
