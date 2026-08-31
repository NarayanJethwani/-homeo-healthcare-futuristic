import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/adminSession";
import { recordClinicalActivity, type ClinicalTask } from "@/lib/clinicalOperations";

const json = (body: Record<string, unknown>, status = 200) => { const response = NextResponse.json(body, { status }); response.headers.set("Cache-Control", "no-store"); return response; };
async function staff(request: NextRequest) { const session = await verifyAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE)?.value); return session && ["admin", "doctor", "super-admin", "operations"].includes(session.role) ? session : null; }

export async function GET(request: NextRequest) {
  const session = await staff(request); if (!session) return json({ success: false, message: "Authentication required." }, 401);
  try {
    const { getAdminDb } = await import("@/lib/firebaseAdmin");
    const snapshot = await getAdminDb().collection("clinicalTasks").get();
    const tasks = snapshot.docs.map((item: any) => item.data() as ClinicalTask).filter((task: ClinicalTask) => ["admin", "super-admin"].includes(session.role) || task.assignedTo.id === session.uid).sort((a: ClinicalTask, b: ClinicalTask) => b.createdAt.localeCompare(a.createdAt));
    return json({ success: true, tasks });
  } catch (error) { console.error("Task lookup failed", error); return json({ success: false, message: "Unable to load tasks." }, 500); }
}

export async function POST(request: NextRequest) {
  const session = await staff(request); if (!session) return json({ success: false, message: "Authentication required." }, 401);
  try {
    const body = await request.json(); const title = typeof body.title === "string" ? body.title.trim() : "";
    if (title.length < 3) return json({ success: false, message: "Enter a clear task title." }, 400);
    const now = new Date().toISOString();
    const task: ClinicalTask = { id: `task-${randomUUID()}`, title, priority: ["low", "medium", "high", "critical"].includes(body.priority) ? body.priority : "medium", status: "open", assignedTo: { id: session.uid, name: session.name || "Clinician" }, patientId: typeof body.patientId === "string" ? body.patientId : undefined, createdAt: now };
    const { getAdminDb } = await import("@/lib/firebaseAdmin"); await getAdminDb().collection("clinicalTasks").doc(task.id).set(task);
    await recordClinicalActivity({ type: "task.created", title: "Task created", detail: task.title, patientId: task.patientId, actor: { id: session.uid, name: session.name || "Clinician", role: session.role } });
    return json({ success: true, task }, 201);
  } catch (error) { console.error("Task creation failed", error); return json({ success: false, message: "Unable to create task." }, 500); }
}

export async function PATCH(request: NextRequest) {
  const session = await staff(request); if (!session) return json({ success: false, message: "Authentication required." }, 401);
  try {
    const body = await request.json(); const id = typeof body.id === "string" ? body.id : "";
    if (!id || body.status !== "completed") return json({ success: false, message: "Provide a task to complete." }, 400);
    const { getAdminDb } = await import("@/lib/firebaseAdmin"); const reference = getAdminDb().collection("clinicalTasks").doc(id); const existing = await reference.get();
    if (!existing.exists) return json({ success: false, message: "Task not found." }, 404);
    const task = existing.data() as ClinicalTask; if (!["admin", "super-admin"].includes(session.role) && task.assignedTo.id !== session.uid) return json({ success: false, message: "Not permitted." }, 403);
    const completedAt = new Date().toISOString(); await reference.update({ status: "completed", completedAt, completedBy: session.uid });
    await recordClinicalActivity({ type: "task.completed", title: "Task completed", detail: task.title, patientId: task.patientId, actor: { id: session.uid, name: session.name || "Clinician", role: session.role } });
    return json({ success: true });
  } catch (error) { console.error("Task update failed", error); return json({ success: false, message: "Unable to update task." }, 500); }
}
