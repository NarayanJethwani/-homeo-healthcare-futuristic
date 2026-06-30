import { SmartAlert } from "../types";
import { AlertId, PatientId } from "../types/branded";

export interface AlertDomainModel extends Omit<SmartAlert, "id" | "patientName"> {
  id: AlertId;
  patientId?: PatientId;
  patientName?: string;
}

export function isCriticalAlert(alert: AlertDomainModel): boolean {
  return alert.level === "critical" || alert.level === "high";
}

export function shouldAlertBeMuted(alert: AlertDomainModel, currentMutedIds: string[]): boolean {
  return alert.isMuted || currentMutedIds.includes(alert.id);
}

export function shouldAlertBeVisible(
  alert: AlertDomainModel,
  searchQuery: string,
  severityFilter: string,
  dismissedIds: string[]
): boolean {
  if (dismissedIds.includes(alert.id) || alert.isAcknowledged) {
    return false;
  }
  
  if (severityFilter !== "all" && alert.level !== severityFilter) {
    return false;
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    const messageMatch = alert.message.toLowerCase().includes(q);
    const patientMatch = alert.patientName?.toLowerCase().includes(q) || false;
    const catMatch = alert.category?.toLowerCase().includes(q) || false;
    return messageMatch || patientMatch || catMatch;
  }

  return true;
}
