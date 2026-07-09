"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEditorialTasks = getEditorialTasks;
exports.getWorkflowEvents = getWorkflowEvents;
exports.createEditorialTask = createEditorialTask;
exports.assignEditorialTask = assignEditorialTask;
exports.transitionTaskStatus = transitionTaskStatus;
exports.generateAutomaticCurationTasks = generateAutomaticCurationTasks;
exports.isFirestoreWorkflowActive = isFirestoreWorkflowActive;
async function getEditorialTasks() {
    const res = await fetch("/api/admin/workflow?action=listTasks");
    if (!res.ok)
        throw new Error("Failed to get editorial tasks");
    const data = await res.json();
    return data.tasks || [];
}
async function getWorkflowEvents(articleId) {
    const url = articleId
        ? `/api/admin/workflow?action=listEvents&articleId=${encodeURIComponent(articleId)}`
        : "/api/admin/workflow?action=listEvents";
    const res = await fetch(url);
    if (!res.ok)
        throw new Error("Failed to get workflow events");
    const data = await res.json();
    return data.events || [];
}
async function createEditorialTask(taskData, actor) {
    const res = await fetch("/api/admin/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createTask", taskData, actor })
    });
    if (!res.ok)
        throw new Error("Failed to create editorial task");
    const data = await res.json();
    return data.task;
}
async function assignEditorialTask(taskId, assignee, reviewerRole, actor) {
    const res = await fetch("/api/admin/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assignTask", taskId, assignee, reviewerRole, actor })
    });
    if (!res.ok)
        return false;
    const data = await res.json();
    return !!data.success;
}
async function transitionTaskStatus(taskId, status, actor, note) {
    const res = await fetch("/api/admin/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "transitionStatus", taskId, status, actor, note })
    });
    if (!res.ok)
        return false;
    const data = await res.json();
    return !!data.success;
}
async function generateAutomaticCurationTasks(entities, actor) {
    const res = await fetch("/api/admin/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generateTasks", entities, actor })
    });
    if (!res.ok)
        throw new Error("Failed to auto-generate tasks");
    const data = await res.json();
    return data.tasks || [];
}
async function isFirestoreWorkflowActive() {
    try {
        const res = await fetch("/api/admin/workflow?action=checkPersistence");
        if (!res.ok)
            return false;
        const data = await res.json();
        return !!data.active;
    }
    catch {
        return false;
    }
}
