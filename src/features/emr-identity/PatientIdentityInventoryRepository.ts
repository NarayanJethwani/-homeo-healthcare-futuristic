import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import { buildPatientIdentityInventoryReport } from "./PatientIdentityInventoryService";
import {
  PatientIdentityCandidate,
  PatientIdentityInventoryReport,
  PatientLinkedRecordReference,
  PatientPortalLinkReference,
} from "./types";
import {
  LINKED_RECORD_METADATA_FIELDS,
  PATIENT_IDENTITY_INVENTORY_SCAN_LIMIT,
  PATIENT_IDENTITY_METADATA_FIELDS,
  PORTAL_IDENTITY_METADATA_FIELDS,
} from "./PatientIdentityInventoryQueryPolicy";

const LINKED_COLLECTIONS = [
  "invoices",
  "patient_attachments",
  "extracted_lab_parameters",
  "reviewed_lab_results",
  "clinicalKnowledgeReferenceAssignments",
] as const;

type FirestoreDocument = {
  id: string;
  data(): Record<string, unknown> | undefined;
};

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/**
 * Reads identity metadata only. It never reads complaint, notes, prescriptions,
 * laboratory values, attachment content, invoice amounts, or AI output.
 */
export async function loadPatientIdentityInventoryReport(): Promise<PatientIdentityInventoryReport> {
  const db = getAdminDb();
  const patientSnapshot = await db.collection("patients")
    .select(...PATIENT_IDENTITY_METADATA_FIELDS)
    .limit(PATIENT_IDENTITY_INVENTORY_SCAN_LIMIT)
    .get();
  const patients: PatientIdentityCandidate[] = patientSnapshot.docs.map((document: FirestoreDocument) => {
    const data = document.data() ?? {};
    return {
      sourceSystem: "firestore-patients",
      sourcePatientId: document.id,
      organizationId: optionalString(data.organizationId),
      clinicId: optionalString(data.clinicId),
      uhid: optionalString(data.uhid),
      name: optionalString(data.name),
      dateOfBirth: optionalString(data.dateOfBirth),
      phone: optionalString(data.phone),
      email: optionalString(data.email),
    };
  });

  const portalSnapshot = await db.collection("users")
    .where("role", "==", "patient")
    .select(...PORTAL_IDENTITY_METADATA_FIELDS)
    .limit(PATIENT_IDENTITY_INVENTORY_SCAN_LIMIT)
    .get();
  const portalLinks: PatientPortalLinkReference[] = portalSnapshot.docs.map((document: FirestoreDocument) => ({
    userId: document.id,
    patientId: optionalString((document.data() ?? {}).patientId),
  }));

  const linkedRecords: PatientLinkedRecordReference[] = [];
  const truncatedCollections: string[] = [];
  if (patientSnapshot.size >= PATIENT_IDENTITY_INVENTORY_SCAN_LIMIT) truncatedCollections.push("patients");
  if (portalSnapshot.size >= PATIENT_IDENTITY_INVENTORY_SCAN_LIMIT) truncatedCollections.push("users");
  for (const collectionName of LINKED_COLLECTIONS) {
    const snapshot = await db.collection(collectionName)
      .select(...LINKED_RECORD_METADATA_FIELDS)
      .limit(PATIENT_IDENTITY_INVENTORY_SCAN_LIMIT)
      .get();
    if (snapshot.size >= PATIENT_IDENTITY_INVENTORY_SCAN_LIMIT) truncatedCollections.push(collectionName);
    for (const document of snapshot.docs as FirestoreDocument[]) {
      linkedRecords.push({
        collection: collectionName,
        recordId: document.id,
        patientId: optionalString((document.data() ?? {}).patientId),
      });
    }
  }

  return buildPatientIdentityInventoryReport({
    patients,
    portalLinks,
    linkedRecords,
    truncatedCollections,
  });
}
