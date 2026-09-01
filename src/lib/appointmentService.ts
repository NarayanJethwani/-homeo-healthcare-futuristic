import { randomUUID } from "crypto";

export type AppointmentStatus = "scheduled" | "checked-in" | "completed" | "cancelled" | "no-show";
export type AppointmentType = "intake" | "follow-up" | "report-review" | "emergency";

export type ClinicalAppointment = {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  status: AppointmentStatus;
  type: AppointmentType;
  notes: string;
  room: string;
  scheduledBy: { id: string; name: string; role: string };
  createdAt: string;
  updatedAt: string;
  source: "dashboard" | "patient-record" | "staff" | "import";
  cancellationReason?: string;
};

export function isValidAppointmentWindow(startsAt: string, endsAt: string) {
  const start = Date.parse(startsAt);
  const end = Date.parse(endsAt);
  return Number.isFinite(start) && Number.isFinite(end) && end > start;
}

export function appointmentOverlaps(candidate: Pick<ClinicalAppointment, "startsAt" | "endsAt" | "doctorId" | "room" | "status">, existing: ClinicalAppointment) {
  if (["cancelled", "no-show"].includes(existing.status)) return false;
  if (candidate.doctorId !== existing.doctorId && (!candidate.room || !existing.room || candidate.room !== existing.room)) return false;
  return Date.parse(candidate.startsAt) < Date.parse(existing.endsAt) && Date.parse(candidate.endsAt) > Date.parse(existing.startsAt);
}

export function buildAppointment(input: Omit<ClinicalAppointment, "id" | "createdAt" | "updatedAt">): ClinicalAppointment {
  const now = new Date().toISOString();
  return { ...input, id: `apt-${randomUUID()}`, createdAt: now, updatedAt: now };
}
