import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/adminSession";
import { appointmentOverlaps, buildAppointment, isValidAppointmentWindow, type ClinicalAppointment } from "@/lib/appointmentService";

const json = (body: Record<string, unknown>, status = 200) => {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "no-store");
  return response;
};

async function requireStaff(request: NextRequest) {
  const session = await verifyAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session || !["admin", "doctor", "super-admin", "operations"].includes(session.role)) return null;
  return session;
}

async function listAppointments() {
  const { getAdminDb } = await import("@/lib/firebaseAdmin");
  const snapshot = await getAdminDb().collection("appointments").get();
  return snapshot.docs.map((item: any) => item.data() as ClinicalAppointment);
}

export async function GET(request: NextRequest) {
  const session = await requireStaff(request);
  if (!session) return json({ success: false, message: "Authentication required." }, 401);
  try {
    const from = request.nextUrl.searchParams.get("from");
    const to = request.nextUrl.searchParams.get("to");
    const appointments: ClinicalAppointment[] = (await listAppointments())
      .filter((appointment: ClinicalAppointment) => (!from || appointment.startsAt >= from) && (!to || appointment.startsAt < to))
      .filter((appointment: ClinicalAppointment) => session.role === "admin" || session.role === "super-admin" || appointment.doctorId === session.uid)
      .sort((a: ClinicalAppointment, b: ClinicalAppointment) => a.startsAt.localeCompare(b.startsAt));
    return json({ success: true, appointments });
  } catch (error) {
    console.error("Appointment lookup failed", error);
    return json({ success: false, message: "Unable to load appointments." }, 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await requireStaff(request);
  if (!session) return json({ success: false, message: "Authentication required." }, 401);
  try {
    const body = await request.json();
    const patientId = typeof body.patientId === "string" ? body.patientId.trim() : "";
    const patientName = typeof body.patientName === "string" ? body.patientName.trim() : "";
    const startsAt = typeof body.startsAt === "string" ? body.startsAt : "";
    const endsAt = typeof body.endsAt === "string" ? body.endsAt : "";
    if (!patientId || !patientName || !isValidAppointmentWindow(startsAt, endsAt)) {
      return json({ success: false, message: "Choose a patient and a valid appointment time." }, 400);
    }
    const appointment = buildAppointment({
      patientId, patientName, startsAt, endsAt,
      doctorId: typeof body.doctorId === "string" && body.doctorId ? body.doctorId : session.uid,
      doctorName: typeof body.doctorName === "string" && body.doctorName ? body.doctorName : (session.name || "Clinician"),
      timezone: typeof body.timezone === "string" && body.timezone ? body.timezone : "Asia/Kolkata",
      status: "scheduled",
      type: ["intake", "follow-up", "report-review", "emergency"].includes(body.type) ? body.type : "follow-up",
      notes: typeof body.notes === "string" ? body.notes.trim() : "",
      room: typeof body.room === "string" ? body.room.trim() : "",
      scheduledBy: { id: session.uid, name: session.name || "Clinician", role: session.role },
      source: "dashboard",
    });
    const appointments = await listAppointments();
    if (appointments.some((existing: ClinicalAppointment) => appointmentOverlaps(appointment, existing))) {
      return json({ success: false, message: "This clinician or room already has an overlapping appointment." }, 409);
    }
    const { getAdminDb } = await import("@/lib/firebaseAdmin");
    await getAdminDb().collection("appointments").doc(appointment.id).set(appointment);
    const { recordClinicalActivity } = await import("@/lib/clinicalOperations");
    await recordClinicalActivity({ type: "appointment.created", title: "Visit scheduled", detail: `${appointment.patientName} · ${appointment.startsAt}`, patientId: appointment.patientId, patientName: appointment.patientName, actor: appointment.scheduledBy });
    return json({ success: true, appointment }, 201);
  } catch (error) {
    console.error("Appointment creation failed", error);
    return json({ success: false, message: "Unable to schedule this visit." }, 500);
  }
}

export async function PATCH(request: NextRequest) {
  const session = await requireStaff(request);
  if (!session) return json({ success: false, message: "Authentication required." }, 401);
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) return json({ success: false, message: "Provide an appointment." }, 400);
    const { getAdminDb } = await import("@/lib/firebaseAdmin");
    const reference = getAdminDb().collection("appointments").doc(id);
    const existing = await reference.get();
    if (!existing.exists) return json({ success: false, message: "Appointment not found." }, 404);
    const appointment = existing.data() as ClinicalAppointment;
    if (!["admin", "super-admin"].includes(session.role) && appointment.doctorId !== session.uid) return json({ success: false, message: "Not permitted." }, 403);
    if (body.action === "reschedule") {
      const startsAt = typeof body.startsAt === "string" ? body.startsAt : "";
      const endsAt = typeof body.endsAt === "string" ? body.endsAt : "";
      if (!isValidAppointmentWindow(startsAt, endsAt)) return json({ success: false, message: "Choose a valid new time." }, 400);
      const candidate = { ...appointment, startsAt, endsAt, room: typeof body.room === "string" ? body.room.trim() : appointment.room, notes: typeof body.notes === "string" ? body.notes.trim() : appointment.notes };
      const allAppointments = await listAppointments();
      if (allAppointments.some((existing: ClinicalAppointment) => existing.id !== appointment.id && appointmentOverlaps(candidate, existing))) return json({ success: false, message: "This clinician or room already has an overlapping appointment." }, 409);
      await reference.update({ startsAt, endsAt, room: candidate.room, notes: candidate.notes, updatedAt: new Date().toISOString() });
      const { recordClinicalActivity } = await import("@/lib/clinicalOperations");
      await recordClinicalActivity({ type: "appointment.updated", title: "Visit rescheduled", detail: `${appointment.patientName} · ${startsAt}`, patientId: appointment.patientId, patientName: appointment.patientName, actor: { id: session.uid, name: session.name || "Clinician", role: session.role } });
      return json({ success: true });
    }
    if (!["checked-in", "completed", "cancelled", "no-show"].includes(body.status)) return json({ success: false, message: "Provide a valid status." }, 400);
    if (body.status === "cancelled" && String(body.cancellationReason || "").trim().length < 3) return json({ success: false, message: "Record a cancellation reason." }, 400);
    await reference.update({ status: body.status, cancellationReason: body.status === "cancelled" ? String(body.cancellationReason || "").trim() : "", updatedAt: new Date().toISOString() });
    const { recordClinicalActivity } = await import("@/lib/clinicalOperations");
    await recordClinicalActivity({ type: "appointment.updated", title: `Visit ${body.status}`, detail: `${appointment.patientName} · ${appointment.startsAt}`, patientId: appointment.patientId, patientName: appointment.patientName, actor: { id: session.uid, name: session.name || "Clinician", role: session.role } });
    return json({ success: true });
  } catch (error) {
    console.error("Appointment update failed", error);
    return json({ success: false, message: "Unable to update appointment." }, 500);
  }
}
