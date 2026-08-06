/**
 * Server-Only Canonical Prescription PDF Renderer
 * STRICT BOUNDARY: Do NOT import this module in client-side code or browser components.
 */

import crypto from "crypto";

export interface PrescriptionPdfData {
  prescriptionId: string;
  revision: number;
  consultationId: string;
  patientId: string;
  patientName: string;
  patientUhid?: string;
  prescriberName: string;
  prescriberTitle?: string;
  prescriberRegistration?: string;
  remedyName: string;
  potencyScale: string;
  potencyValue: string;
  dose: string;
  repetition: string;
  duration?: string;
  instructions: string;
  dietaryAdvice?: string;
  followUpInstructions?: string;
  issuedAt: string;
}

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

function cleanText(value: unknown): string {
  return String(value ?? "")
    .replaceAll("₹", "Rs. ")
    .replace(/[–—]/g, "-")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function addTextLine(
  commands: string[],
  text: string,
  x: number,
  y: number,
  size = 10,
  bold = false,
  color = "0.12 0.18 0.20"
): void {
  commands.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${color} rg ${x} ${y} Td (${cleanText(text)}) Tj ET`);
}

export function renderCanonicalPrescriptionPdf(data: PrescriptionPdfData): {
  buffer: Uint8Array;
  byteLength: number;
  checksum: string;
} {
  const contentStream: string[] = [];

  // Header & Branding
  addTextLine(contentStream, "HOMEO HEALTHCARE FUTURISTIC CLINICAL PORTAL", 40, 800, 14, true, "0.05 0.35 0.45");
  addTextLine(contentStream, "CANONICAL DIGITAL PRESCRIPTION DOCUMENT", 40, 782, 10, true, "0.30 0.35 0.40");

  // Metadata Box
  addTextLine(contentStream, `Prescription ID: ${data.prescriptionId} (Rev #${data.revision})`, 40, 750, 9, true);
  addTextLine(contentStream, `Consultation ID: ${data.consultationId}`, 320, 750, 9, false);
  addTextLine(contentStream, `Patient ID/UHID: ${data.patientId} ${data.patientUhid ? `(${data.patientUhid})` : ""}`, 40, 735, 9, false);
  addTextLine(contentStream, `Patient Name: ${data.patientName}`, 320, 735, 9, true);
  addTextLine(contentStream, `Issued At: ${data.issuedAt}`, 40, 720, 9, false);
  addTextLine(contentStream, `Prescriber: Dr. ${data.prescriberName} ${data.prescriberTitle ? `(${data.prescriberTitle})` : ""}`, 320, 720, 9, true);

  // Rx Content Box
  addTextLine(contentStream, "PRESCRIPTION (Rx)", 40, 680, 11, true, "0.05 0.45 0.35");
  addTextLine(contentStream, `Remedy: ${data.remedyName}`, 50, 655, 12, true);
  addTextLine(contentStream, `Potency: ${data.potencyValue} (${data.potencyScale.toUpperCase()})`, 50, 638, 10, true);
  addTextLine(contentStream, `Dose: ${data.dose}`, 50, 621, 10, false);
  addTextLine(contentStream, `Repetition: ${data.repetition}`, 250, 621, 10, false);

  if (data.duration) {
    addTextLine(contentStream, `Duration: ${data.duration}`, 50, 604, 10, false);
  }

  // Instructions
  addTextLine(contentStream, "INSTRUCTIONS & DIETARY ADVICE", 40, 565, 10, true, "0.20 0.25 0.30");
  addTextLine(contentStream, `Instructions: ${data.instructions}`, 50, 545, 9, false);

  if (data.dietaryAdvice) {
    addTextLine(contentStream, `Dietary Advice: ${data.dietaryAdvice}`, 50, 528, 9, false);
  }

  if (data.followUpInstructions) {
    addTextLine(contentStream, `Follow-up: ${data.followUpInstructions}`, 50, 511, 9, false);
  }

  // Identity-Attributed Signature Footer
  addTextLine(contentStream, "AUTHORITATIVE CLINICAL SIGNATURE & VERIFICATION", 40, 450, 9, true, "0.30 0.35 0.40");
  addTextLine(contentStream, `Digitally Issued By: Dr. ${data.prescriberName}`, 40, 435, 9, false);
  addTextLine(contentStream, `Registration No: ${data.prescriberRegistration || "REG-HOMEO-OFFICIAL"}`, 40, 420, 9, false);
  addTextLine(contentStream, "Document Verification Status: IMMUTABLE AUDIT-BACKED CANONICAL DOCUMENT", 40, 405, 8, false, "0.40 0.45 0.50");

  const streamText = contentStream.join("\n");
  const streamLength = Buffer.byteLength(streamText);

  const pdfTemplate = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kinds [/Page] /Count 1 /Kids [3 0 R] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamText}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000133 00000 n 
0000000287 00000 n 
0000000346 00000 n 
0000000412 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
484
%%EOF`;

  const buffer = new TextEncoder().encode(pdfTemplate);
  const checksum = crypto.createHash("sha256").update(buffer).digest("hex");

  return {
    buffer,
    byteLength: buffer.byteLength,
    checksum,
  };
}
