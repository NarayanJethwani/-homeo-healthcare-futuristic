import assert from "assert";
import crypto from "crypto";
import { clinicalDocumentRepository, ClinicalDocumentRecord } from "../../src/features/consultation/repositories/consultationRepositories";

async function runClinicalDocumentChecksumTests() {
  const bytes = new TextEncoder().encode("Canonical PDF Content Test Stream");
  const checksum = crypto.createHash("sha256").update(bytes).digest("hex");

  const record: ClinicalDocumentRecord = {
    id: "doc_test_checksum_1",
    patientId: "p1",
    consultationId: "c1",
    prescriptionId: "rx1",
    prescriptionRevision: 1,
    documentType: "prescription",
    status: "available",
    storageProvider: "Local Repository Storage",
    storagePath: "/documents/rx1.pdf",
    contentType: "application/pdf",
    byteLength: bytes.byteLength,
    checksumAlgorithm: "sha256",
    checksum,
    generatedAt: new Date().toISOString(),
    generatedBy: "doc_101",
    immutable: true,
  };

  // Test 1: Save and Retrieve Valid Document
  await clinicalDocumentRepository.saveDocument(record, bytes);
  const retrieved = await clinicalDocumentRepository.getDocument("doc_test_checksum_1");
  assert.ok(retrieved !== null);
  assert.strictEqual(retrieved?.record.status, "available");
  assert.strictEqual(retrieved?.record.checksum, checksum);

  // Test 2: Checksum Mismatch Detection on Save
  const invalidRecord = { ...record, id: "doc_invalid_1", checksum: "bad_checksum_hash" };
  await assert.rejects(
    async () => {
      await clinicalDocumentRepository.saveDocument(invalidRecord, bytes);
    },
    /Document integrity mismatch/
  );

  console.log("✅ Clinical Document Checksum & Integrity Unit Tests Passed.");
}

runClinicalDocumentChecksumTests();
