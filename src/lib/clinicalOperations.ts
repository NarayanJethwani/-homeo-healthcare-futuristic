import { randomUUID } from "crypto";

export type ClinicalActivity = {
  id: string;
  type: "appointment.created" | "appointment.updated" | "payment.recorded" | "payment.reversed" | "task.created" | "task.completed";
  title: string;
  detail: string;
  patientId?: string;
  patientName?: string;
  actor: { id: string; name: string; role: string };
  createdAt: string;
};

export type ClinicalTask = {
  id: string;
  title: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "completed";
  assignedTo: { id: string; name: string };
  patientId?: string;
  createdAt: string;
  completedAt?: string;
  completedBy?: string;
};

export async function recordClinicalActivity(event: Omit<ClinicalActivity, "id" | "createdAt">) {
  const { getAdminDb } = await import("@/lib/firebaseAdmin");
  const activity: ClinicalActivity = { ...event, id: `act-${randomUUID()}`, createdAt: new Date().toISOString() };
  await getAdminDb().collection("clinicalActivity").doc(activity.id).set(activity);
  return activity;
}
