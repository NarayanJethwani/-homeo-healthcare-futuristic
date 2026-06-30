import { AppointmentId, PatientId, DoctorId } from "../types/branded";

export interface AppointmentDomainModel {
  id: AppointmentId;
  patientId: PatientId;
  patientName: string;
  doctorId: DoctorId;
  doctorName: string;
  time: string;
  date: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  type: "intake" | "follow-up" | "report-review" | "emergency";
  notes?: string;
}

export function isUpcomingAppointment(appointment: AppointmentDomainModel, currentDateStr: string): boolean {
  return appointment.status === "scheduled" && appointment.date >= currentDateStr;
}

export function requiresUrgentReview(appointment: AppointmentDomainModel): boolean {
  return appointment.type === "emergency" && appointment.status !== "completed";
}
