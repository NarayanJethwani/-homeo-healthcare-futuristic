import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import { buildClinicalWorkspaceReferences } from "./ClinicalKnowledgeReferenceCollectionService";
import { ClinicalKnowledgeReference } from "./ClinicalKnowledgeReferenceService";

export type PatientClinicalKnowledgeReferenceAssignment = ClinicalKnowledgeReference & {
  patientId: string;
  assignedBy: string;
  assignedAt: string;
};

export async function getPatientClinicalKnowledgeReferences(patientId: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId || projectId === "mock-project-id") return [];

  const snapshot = await getAdminDb()
    .collection("clinicalKnowledgeReferenceAssignments")
    .where("patientId", "==", patientId)
    .get();
  const assignments = snapshot.docs.map((doc: { data(): unknown }) => doc.data() as PatientClinicalKnowledgeReferenceAssignment);
  return buildClinicalWorkspaceReferences(assignments);
}
