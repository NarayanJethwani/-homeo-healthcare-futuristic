import { EditorialTask, EditorialWorkflowEvent, EditorialTaskStatus, EditorialTaskPriority, EditorialTaskType } from "./types";

// In-memory collections for fallback or local simulation
const memoryTasks: EditorialTask[] = [];
const memoryEvents: EditorialWorkflowEvent[] = [];

/**
 * Dynamically acquires the Firebase Firestore database if available.
 */
async function getFirestoreDb() {
  try {
    const { getAdminDb } = await import("../../../lib/firebaseAdmin");
    const db = getAdminDb();
    if (db) return db;
  } catch (e) {
    // Graceful degradation when Firebase Admin is unavailable or unconfigured
  }
  return null;
}

/**
 * Generates a random alphanumeric ID for local tasks and logs.
 */
function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Fetches all editorial tasks from Firestore (or fallback in-memory store).
 */
export async function getEditorialTasks(): Promise<EditorialTask[]> {
  const db = await getFirestoreDb();
  if (db) {
    try {
      const snap = await db.collection("knowledge_editorial_tasks").get();
      const list: EditorialTask[] = [];
      snap.forEach((doc: any) => {
        list.push({ id: doc.id, ...doc.data() } as EditorialTask);
      });
      // Merge memory cache tasks to ensure unsaved mock writes are visible
      for (const m of memoryTasks) {
        if (!list.some(l => l.id === m.id)) {
          list.push(m);
        }
      }
      return list;
    } catch (e) {
      console.warn("WorkflowManager: Firestore get failed, returning memory fallback tasks.");
    }
  }
  return [...memoryTasks];
}

/**
 * Creates a new editorial task. Ensures no duplicate active task (non-completed)
 * exists for the same articleId and taskType.
 */
export async function createEditorialTask(taskData: Omit<EditorialTask, "id" | "createdAt" | "updatedAt">, actor?: string): Promise<EditorialTask> {
  const now = new Date().toISOString();
  const id = generateUniqueId();
  
  const newTask: EditorialTask = {
    ...taskData,
    id,
    createdAt: now,
    updatedAt: now
  };

  // Check duplicate in local cache to fail fast or prevent duplicate generation
  const activeTasks = await getEditorialTasks();
  const duplicate = activeTasks.find(
    t => t.articleId === taskData.articleId &&
         t.taskType === taskData.taskType &&
         t.status !== "completed" &&
         t.status !== "cancelled"
  );
  if (duplicate) {
    return duplicate;
  }

  const db = await getFirestoreDb();
  if (db) {
    try {
      await db.collection("knowledge_editorial_tasks").doc(id).set(newTask);
      await logWorkflowEvent({
        id: generateUniqueId(),
        articleId: newTask.articleId,
        taskId: id,
        eventType: "task-created",
        actor,
        createdAt: now,
        after: newTask
      });
      return newTask;
    } catch (e) {
      console.warn("WorkflowManager: Failed to save task to Firestore, adding to memory.");
    }
  }

  memoryTasks.push(newTask);
  memoryEvents.push({
    id: generateUniqueId(),
    articleId: newTask.articleId,
    taskId: id,
    eventType: "task-created",
    actor,
    createdAt: now,
    after: newTask
  });
  return newTask;
}

/**
 * Updates a task assignee or reviewer role.
 */
export async function assignEditorialTask(taskId: string, assignee: string, role?: string, actor?: string): Promise<boolean> {
  const now = new Date().toISOString();
  const tasks = await getEditorialTasks();
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1 && !memoryTasks.some(t => t.id === taskId)) {
    return false;
  }

  const beforeTask = tasks.find(t => t.id === taskId) || memoryTasks.find(t => t.id === taskId);
  const updatedTask = {
    ...beforeTask!,
    assignedTo: assignee,
    reviewerRole: role,
    status: (beforeTask!.status === "backlog") ? ("assigned" as EditorialTaskStatus) : beforeTask!.status,
    updatedAt: now
  };

  const db = await getFirestoreDb();
  if (db) {
    try {
      await db.collection("knowledge_editorial_tasks").doc(taskId).set(updatedTask, { merge: true });
      await logWorkflowEvent({
        id: generateUniqueId(),
        articleId: updatedTask.articleId,
        taskId: taskId,
        eventType: "task-assigned",
        actor,
        createdAt: now,
        before: { assignedTo: beforeTask!.assignedTo },
        after: { assignedTo: assignee, reviewerRole: role }
      });
      return true;
    } catch (e) {
      console.warn("WorkflowManager: Firestore update failed, writing to memory.");
    }
  }

  const memIndex = memoryTasks.findIndex(t => t.id === taskId);
  if (memIndex !== -1) {
    memoryTasks[memIndex] = updatedTask;
  } else {
    memoryTasks.push(updatedTask);
  }

  memoryEvents.push({
    id: generateUniqueId(),
    articleId: updatedTask.articleId,
    taskId: taskId,
    eventType: "task-assigned",
    actor,
    createdAt: now,
    before: { assignedTo: beforeTask?.assignedTo },
    after: { assignedTo: assignee, reviewerRole: role }
  });
  return true;
}

/**
 * Transitions task status. Appends workflow events accordingly.
 */
export async function transitionTaskStatus(taskId: string, status: EditorialTaskStatus, actor?: string, note?: string): Promise<boolean> {
  const now = new Date().toISOString();
  const tasks = await getEditorialTasks();
  const task = tasks.find(t => t.id === taskId) || memoryTasks.find(t => t.id === taskId);
  if (!task) return false;

  const beforeStatus = task.status;
  // Workflow completion is operational and must not imply clinical review unless explicitly confirmed.
  const updatedTask: EditorialTask = {
    ...task,
    status,
    updatedAt: now,
    completedAt: status === "completed" ? now : task.completedAt,
    notes: note ? note : task.notes
  };

  const db = await getFirestoreDb();
  if (db) {
    try {
      await db.collection("knowledge_editorial_tasks").doc(taskId).set(updatedTask, { merge: true });
      await logWorkflowEvent({
        id: generateUniqueId(),
        articleId: task.articleId,
        taskId: taskId,
        eventType: "task-status-changed",
        actor,
        createdAt: now,
        before: { status: beforeStatus },
        after: { status },
        note
      });
      return true;
    } catch (e) {
      console.warn("WorkflowManager: Firestore update status failed, writing to memory.");
    }
  }

  const memIndex = memoryTasks.findIndex(t => t.id === taskId);
  if (memIndex !== -1) {
    memoryTasks[memIndex] = updatedTask;
  } else {
    memoryTasks.push(updatedTask);
  }

  memoryEvents.push({
    id: generateUniqueId(),
    articleId: task.articleId,
    taskId: taskId,
    eventType: "task-status-changed",
    actor,
    createdAt: now,
    before: { status: beforeStatus },
    after: { status },
    note
  });
  return true;
}

/**
 * Logs a workflow audit event.
 */
export async function logWorkflowEvent(event: EditorialWorkflowEvent): Promise<void> {
  const db = await getFirestoreDb();
  if (db) {
    try {
      await db.collection("knowledge_editorial_events").doc(event.id).set(event);
      return;
    } catch (e) {
      // Degrade to memory silently
    }
  }
  memoryEvents.push(event);
}

/**
 * Fetches all workflow logs and audit trail events.
 */
export async function getWorkflowEvents(articleId?: string): Promise<EditorialWorkflowEvent[]> {
  const db = await getFirestoreDb();
  if (db) {
    try {
      let query: any = db.collection("knowledge_editorial_events");
      if (articleId) {
        query = query.where("articleId", "==", articleId);
      }
      const snap = await query.get();
      const list: EditorialWorkflowEvent[] = [];
      snap.forEach((doc: any) => {
        list.push({ id: doc.id, ...doc.data() } as EditorialWorkflowEvent);
      });
      // Merge memory cache events to ensure unsaved mock writes are visible
      for (const m of memoryEvents) {
        if (!list.some(l => l.id === m.id) && (!articleId || m.articleId === articleId)) {
          list.push(m);
        }
      }
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch (e) {
      console.warn("WorkflowManager: Firestore events fetch failed, using memory.");
    }
  }
  const filtered = articleId ? memoryEvents.filter(e => e.articleId === articleId) : memoryEvents;
  return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Clears the in-memory workflow data (primarily for testing purposes).
 */
export function clearWorkflowMemoryStore(): void {
  memoryTasks.length = 0;
  memoryEvents.length = 0;
}

/**
 * Checks if Firestore is active.
 */
export async function isFirestoreWorkflowActive(): Promise<boolean> {
  const db = await getFirestoreDb();
  return !!db;
}
