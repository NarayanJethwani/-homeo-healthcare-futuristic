import assert from "assert";
import { renderCanonicalPrescriptionPdf } from "../../src/features/consultation/server/clinicalPrescriptionPdf.server";

async function runPrescriptionPdfTests() {
  const data = {
    prescriptionId: "rx_test_101",
    revision: 1,
    consultationId: "c_test_99",
    patientId: "p_test_88",
    patientName: "John Doe",
    patientUhid: "UHID-8899",
    prescriberName: "Dr. Jane Smith",
    prescriberTitle: "MD (Homeopathy)",
    prescriberRegistration: "REG-HOMEO-2026",
    remedyName: "Nux Vomica",
    potencyScale: "centesimal",
    potencyValue: "200C",
    dose: "4 pills",
    repetition: "Twice daily after meals",
    duration: "2 weeks",
    instructions: "Take on clean tongue.",
    dietaryAdvice: "Avoid coffee and camphor.",
    issuedAt: new Date().toISOString(),
  };

  const pdfResult = renderCanonicalPrescriptionPdf(data);

  // Verification 1: Uint8Array byte output
  assert.ok(pdfResult.buffer instanceof Uint8Array);
  assert.ok(pdfResult.byteLength > 100);

  // Verification 2: PDF Header Magic Bytes (%PDF-1.4)
  const headerStr = new TextDecoder().decode(pdfResult.buffer.slice(0, 8));
  assert.ok(headerStr.startsWith("%PDF-1.4"));

  // Verification 3: SHA-256 Checksum String
  assert.strictEqual(typeof pdfResult.checksum, "string");
  assert.strictEqual(pdfResult.checksum.length, 64);

  console.log("✅ Server-Only Canonical Prescription PDF Unit Tests Passed.");
}

runPrescriptionPdfTests();
