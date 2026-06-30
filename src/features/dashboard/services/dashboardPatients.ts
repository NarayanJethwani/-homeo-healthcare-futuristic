import { Patient } from "../types";
import { toPatientId } from "../types/branded";
import { PatientDomainModel } from "../domain/patients";

/**
 * Service to process and normalize raw patient list data retrieved from Firebase
 */
export function normalizePatients(rawList: any[]): PatientDomainModel[] {
  return rawList.map((p) => ({
    id: toPatientId(p.id || p.uid || ""),
    name: p.name || "Unknown Patient",
    age: p.age || "N/A",
    gender: p.gender || "U",
    phone: p.phone || "",
    email: p.email || "",
    location: p.location || "",
    complaint: p.complaint || "No chief complaint recorded",
    careLevel: p.careLevel || "routine",
    durationText: p.durationText || "",
    finalPrice: p.finalPrice || 0,
    folderUrl: p.folderUrl || "",
    folderId: p.folderId || "",
    sheetUrl: p.sheetUrl || "",
    assignedDoctor: p.assignedDoctor || "Dr. Narayan Jethwani",
    status: p.status || "active",
    createdAt: p.createdAt || new Date().toISOString(),
    receivedAmount: p.receivedAmount || 0,
    remainingBalance: p.remainingBalance || 0,
    lastSeen: p.lastSeen || "",
    attachments: p.attachments || [],
    attachmentsUpdated: p.attachmentsUpdated || "",
    billingCycle: p.billingCycle || "monthly",
    concessionApplied: p.concessionApplied || "",
    conditionsCount: p.conditionsCount || 0,
    durationValue: p.durationValue || 0,
    medicineAddons: p.medicineAddons || []
  }));
}
