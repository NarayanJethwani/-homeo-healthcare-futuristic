import { AppointmentId, PatientId, DoctorId } from "../types/branded";

export interface AppointmentDomainModel {
  id: AppointmentId;
  patientId: PatientId;
  patientName: string;
  doctorId: DoctorId;
  doctorName: string;
  /** ISO timestamps are the source of truth; display dates are derived in the UI. */
  startsAt: string;
  endsAt: string;
  timezone: string;
  status: "scheduled" | "checked-in" | "completed" | "cancelled" | "no-show";
  type: "intake" | "follow-up" | "report-review" | "emergency";
  notes?: string;
  room?: string;
  scheduledBy: { id: string; name: string; role: string };
  createdAt: string;
  updatedAt: string;
  source: "dashboard" | "patient-record" | "staff" | "import";
  cancellationReason?: string;
}

export function isUpcomingAppointment(appointment: AppointmentDomainModel, currentDateStr: string): boolean {
  return ["scheduled", "checked-in"].includes(appointment.status) && appointment.startsAt.slice(0, 10) >= currentDateStr;
}

export function requiresUrgentReview(appointment: AppointmentDomainModel): boolean {
  return appointment.type === "emergency" && appointment.status !== "completed";
}
