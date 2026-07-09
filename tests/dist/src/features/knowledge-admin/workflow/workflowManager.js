"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEditorialTasks = getEditorialTasks;
exports.createEditorialTask = createEditorialTask;
exports.assignEditorialTask = assignEditorialTask;
exports.transitionTaskStatus = transitionTaskStatus;
exports.logWorkflowEvent = logWorkflowEvent;
exports.getWorkflowEvents = getWorkflowEvents;
exports.clearWorkflowMemoryStore = clearWorkflowMemoryStore;
exports.isFirestoreWorkflowActive = isFirestoreWorkflowActive;
// In-memory collections for fallback or local simulation
const memoryTasks = [];
const memoryEvents = [];
/**
 * Dynamically acquires the Firebase Firestore database if available.
 */
async function getFirestoreDb() {
    try {
        const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("../../../lib/firebaseAdmin")));
        const db = getAdminDb();
        if (db)
            return db;
    }
    catch (e) {
        // Graceful degradation when Firebase Admin is unavailable or unconfigured
    }
    return null;
}
/**
 * Generates a random alphanumeric ID for local tasks and logs.
 */
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
/**
 * Fetches all editorial tasks from Firestore (or fallback in-memory store).
 */
async function getEditorialTasks() {
    const db = await getFirestoreDb();
    if (db) {
        try {
            const snap = await db.collection("knowledge_editorial_tasks").get();
            const list = [];
            snap.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            // Merge memory cache tasks to ensure unsaved mock writes are visible
            for (const m of memoryTasks) {
                if (!list.some(l => l.id === m.id)) {
                    list.push(m);
                }
            }
            return list;
        }
        catch (e) {
            console.warn("WorkflowManager: Firestore get failed, returning memory fallback tasks.");
        }
    }
    return [...memoryTasks];
}
/**
 * Creates a new editorial task. Ensures no duplicate active task (non-completed)
 * exists for the same articleId and taskType.
 */
async function createEditorialTask(taskData, actor) {
    const now = new Date().toISOString();
    const id = generateUniqueId();
    const newTask = {
        ...taskData,
        id,
        createdAt: now,
        updatedAt: now
    };
    // Check duplicate in local cache to fail fast or prevent duplicate generation
    const activeTasks = await getEditorialTasks();
    const duplicate = activeTasks.find(t => t.articleId === taskData.articleId &&
        t.taskType === taskData.taskType &&
        t.status !== "completed" &&
        t.status !== "cancelled");
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
        }
        catch (e) {
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
async function assignEditorialTask(taskId, assignee, role, actor) {
    const now = new Date().toISOString();
    const tasks = await getEditorialTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1 && !memoryTasks.some(t => t.id === taskId)) {
        return false;
    }
    const beforeTask = tasks.find(t => t.id === taskId) || memoryTasks.find(t => t.id === taskId);
    const updatedTask = {
        ...beforeTask,
        assignedTo: assignee,
        reviewerRole: role,
        status: (beforeTask.status === "backlog") ? "assigned" : beforeTask.status,
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
                before: { assignedTo: beforeTask.assignedTo },
                after: { assignedTo: assignee, reviewerRole: role }
            });
            return true;
        }
        catch (e) {
            console.warn("WorkflowManager: Firestore update failed, writing to memory.");
        }
    }
    const memIndex = memoryTasks.findIndex(t => t.id === taskId);
    if (memIndex !== -1) {
        memoryTasks[memIndex] = updatedTask;
    }
    else {
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
async function transitionTaskStatus(taskId, status, actor, note) {
    const now = new Date().toISOString();
    const tasks = await getEditorialTasks();
    const task = tasks.find(t => t.id === taskId) || memoryTasks.find(t => t.id === taskId);
    if (!task)
        return false;
    const beforeStatus = task.status;
    // Workflow completion is operational and must not imply clinical review unless explicitly confirmed.
    const updatedTask = {
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
        }
        catch (e) {
            console.warn("WorkflowManager: Firestore update status failed, writing to memory.");
        }
    }
    const memIndex = memoryTasks.findIndex(t => t.id === taskId);
    if (memIndex !== -1) {
        memoryTasks[memIndex] = updatedTask;
    }
    else {
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
async function logWorkflowEvent(event) {
    const db = await getFirestoreDb();
    if (db) {
        try {
            await db.collection("knowledge_editorial_events").doc(event.id).set(event);
            return;
        }
        catch (e) {
            // Degrade to memory silently
        }
    }
    memoryEvents.push(event);
}
/**
 * Fetches all workflow logs and audit trail events.
 */
async function getWorkflowEvents(articleId) {
    const db = await getFirestoreDb();
    if (db) {
        try {
            let query = db.collection("knowledge_editorial_events");
            if (articleId) {
                query = query.where("articleId", "==", articleId);
            }
            const snap = await query.get();
            const list = [];
            snap.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            // Merge memory cache events to ensure unsaved mock writes are visible
            for (const m of memoryEvents) {
                if (!list.some(l => l.id === m.id) && (!articleId || m.articleId === articleId)) {
                    list.push(m);
                }
            }
            return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        }
        catch (e) {
            console.warn("WorkflowManager: Firestore events fetch failed, using memory.");
        }
    }
    const filtered = articleId ? memoryEvents.filter(e => e.articleId === articleId) : memoryEvents;
    return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
/**
 * Clears the in-memory workflow data (primarily for testing purposes).
 */
function clearWorkflowMemoryStore() {
    memoryTasks.length = 0;
    memoryEvents.length = 0;
}
/**
 * Checks if Firestore is active.
 */
async function isFirestoreWorkflowActive() {
    const db = await getFirestoreDb();
    return !!db;
}
