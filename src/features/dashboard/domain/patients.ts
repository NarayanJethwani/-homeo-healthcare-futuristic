import { Patient } from "../types";
import { PatientId } from "../types/branded";

export interface PatientDomainModel extends Patient {
  id: PatientId;
}

/**
 * Business rule validations for a Patient Entity
 */
export function isEmergencyPatient(patient: PatientDomainModel): boolean {
  return patient.careLevel === "emergency" || patient.careLevel === "critical";
}

export function hasUnresolvedBalance(patient: PatientDomainModel): boolean {
  const balance = patient.remainingBalance || 0;
  return balance > 0;
}

export function getMiasmaticClassification(complaint: string): "Psoric" | "Sycotic" | "Syphilitic" | "Tubercular" | "Constitutional" {
  const c = complaint.toLowerCase();
  if (c.includes("eczema") || c.includes("psoriasis") || c.includes("skin") || c.includes("itching")) {
    return "Psoric";
  }
  if (c.includes("wart") || c.includes("fibroid") || c.includes("overgrowth") || c.includes("acid")) {
    return "Sycotic";
  }
  if (c.includes("ulcer") || c.includes("destruction") || c.includes("necrosis")) {
    return "Syphilitic";
  }
  if (c.includes("tuberculosis") || c.includes("asthma") || c.includes("weight loss")) {
    return "Tubercular";
  }
  return "Constitutional";
}
