import { EditorialTask, EditorialWorkflowEvent, EditorialTaskStatus } from "./types";
import { KmsKnowledgeEntity } from "../types";

export async function getEditorialTasks(): Promise<EditorialTask[]> {
  const res = await fetch("/api/admin/workflow?action=listTasks");
  if (!res.ok) throw new Error("Failed to get editorial tasks");
  const data = await res.json();
  return data.tasks || [];
}

export async function getWorkflowEvents(articleId?: string): Promise<EditorialWorkflowEvent[]> {
  const url = articleId 
    ? `/api/admin/workflow?action=listEvents&articleId=${encodeURIComponent(articleId)}`
    : "/api/admin/workflow?action=listEvents";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to get workflow events");
  const data = await res.json();
  return data.events || [];
}

export async function createEditorialTask(
  taskData: Omit<EditorialTask, "id" | "createdAt" | "updatedAt">,
  actor?: string
): Promise<EditorialTask> {
  const res = await fetch("/api/admin/workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "createTask", taskData, actor })
  });
  if (!res.ok) throw new Error("Failed to create editorial task");
  const data = await res.json();
  return data.task;
}

export async function assignEditorialTask(
  taskId: string,
  assignee: string,
  reviewerRole: string,
  actor?: string
): Promise<boolean> {
  const res = await fetch("/api/admin/workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "assignTask", taskId, assignee, reviewerRole, actor })
  });
  if (!res.ok) return false;
  const data = await res.json();
  return !!data.success;
}

export async function transitionTaskStatus(
  taskId: string,
  status: EditorialTaskStatus,
  actor?: string,
  note?: string
): Promise<boolean> {
  const res = await fetch("/api/admin/workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "transitionStatus", taskId, status, actor, note })
  });
  if (!res.ok) return false;
  const data = await res.json();
  return !!data.success;
}

export async function generateAutomaticCurationTasks(
  entities: KmsKnowledgeEntity[],
  actor?: string
): Promise<EditorialTask[]> {
  const res = await fetch("/api/admin/workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "generateTasks", entities, actor })
  });
  if (!res.ok) throw new Error("Failed to auto-generate tasks");
  const data = await res.json();
  return data.tasks || [];
}

export async function isFirestoreWorkflowActive(): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/workflow?action=checkPersistence");
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.active;
  } catch {
    return false;
  }
}
