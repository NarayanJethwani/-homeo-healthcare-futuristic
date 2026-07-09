"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = void 0;
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const workflowManager_1 = require("@/features/knowledge-admin/workflow/workflowManager");
const taskGenerator_1 = require("@/features/knowledge-admin/workflow/taskGenerator");
// TODO: Enforce centralized admin auth before exposing workflow mutations in production.
exports.dynamic = "force-dynamic";
const ALLOWED_STATUSES = ["backlog", "assigned", "in-progress", "blocked", "ready-for-review", "completed", "cancelled"];
const ALLOWED_PRIORITIES = ["low", "medium", "high", "critical"];
const ALLOWED_TYPES = ["clinical-review", "reference-update", "seo-improvement", "ai-readiness"];
const ALLOWED_ENTITY_TYPES = ["disease", "remedy", "symptom", "lab-test"];
// Simple regex filter to block PII/PHI in inputs
function containsPII(text) {
    const normalized = text.toLowerCase();
    // Emails & phone numbers
    if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text))
        return true;
    if (/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(text))
        return true;
    // DOB & SSN patterns
    if (/\b(?:dob|birth|ssn)\b/i.test(normalized))
        return true;
    // Case files or chart records
    if (/\bcase\s*#?\s*\d+\b/i.test(normalized))
        return true;
    if (/\bpatient\s*#?\s*\d+\b/i.test(normalized))
        return true;
    return false;
}
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action");
        const articleId = searchParams.get("articleId") || undefined;
        if (action === "listTasks") {
            const tasks = await (0, workflowManager_1.getEditorialTasks)();
            return server_1.NextResponse.json({ tasks });
        }
        if (action === "listEvents") {
            if (articleId && containsPII(articleId)) {
                return server_1.NextResponse.json({ error: "Invalid parameters detected" }, { status: 400 });
            }
            const events = await (0, workflowManager_1.getWorkflowEvents)(articleId);
            return server_1.NextResponse.json({ events });
        }
        if (action === "checkPersistence") {
            const active = await (0, workflowManager_1.isFirestoreWorkflowActive)();
            return server_1.NextResponse.json({ active });
        }
        return server_1.NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    catch (e) {
        // Sanitize log outputs and responses to protect credentials and private trace logs
        console.error("Workflow API GET Failure: Internal action failed.");
        return server_1.NextResponse.json({ error: "An internal request error occurred." }, { status: 500 });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { action } = body;
        if (!action) {
            return server_1.NextResponse.json({ error: "Missing action in request body" }, { status: 400 });
        }
        if (action === "createTask") {
            const { taskData, actor } = body;
            if (!taskData) {
                return server_1.NextResponse.json({ error: "Missing taskData payload" }, { status: 400 });
            }
            // Check for arbitrary keys in taskData
            const allowedKeys = [
                "articleId", "articleTitle", "entityType", "taskType",
                "status", "priority", "source", "reasons", "notes",
                "dueDate", "assignedTo", "reviewerRole"
            ];
            const taskDataKeys = Object.keys(taskData);
            const extraKeys = taskDataKeys.filter(k => !allowedKeys.includes(k));
            if (extraKeys.length > 0) {
                return server_1.NextResponse.json({ error: `Rejected arbitrary payload fields: ${extraKeys.join(", ")}` }, { status: 400 });
            }
            // Payload validations
            if (!taskData.articleId || typeof taskData.articleId !== "string") {
                return server_1.NextResponse.json({ error: "Invalid articleId" }, { status: 400 });
            }
            if (!taskData.articleTitle || typeof taskData.articleTitle !== "string") {
                return server_1.NextResponse.json({ error: "Invalid articleTitle" }, { status: 400 });
            }
            if (!ALLOWED_ENTITY_TYPES.includes(taskData.entityType)) {
                return server_1.NextResponse.json({ error: "Invalid entityType" }, { status: 400 });
            }
            if (!ALLOWED_TYPES.includes(taskData.taskType)) {
                return server_1.NextResponse.json({ error: "Invalid taskType" }, { status: 400 });
            }
            if (!ALLOWED_STATUSES.includes(taskData.status)) {
                return server_1.NextResponse.json({ error: "Invalid status" }, { status: 400 });
            }
            if (!ALLOWED_PRIORITIES.includes(taskData.priority)) {
                return server_1.NextResponse.json({ error: "Invalid priority" }, { status: 400 });
            }
            // Check PII/PHI
            if (containsPII(taskData.articleId) || containsPII(taskData.articleTitle) || (taskData.notes && containsPII(taskData.notes))) {
                return server_1.NextResponse.json({ error: "Payload contains potential PII/PHI" }, { status: 400 });
            }
            const task = await (0, workflowManager_1.createEditorialTask)(taskData, actor);
            return server_1.NextResponse.json({ task });
        }
        if (action === "assignTask") {
            const { taskId, assignee, reviewerRole, actor } = body;
            if (!taskId || typeof taskId !== "string") {
                return server_1.NextResponse.json({ error: "Invalid taskId" }, { status: 400 });
            }
            if (!assignee || typeof assignee !== "string") {
                return server_1.NextResponse.json({ error: "Invalid assignee" }, { status: 400 });
            }
            if (containsPII(assignee) || (actor && containsPII(actor))) {
                return server_1.NextResponse.json({ error: "Payload contains potential PII/PHI" }, { status: 400 });
            }
            const success = await (0, workflowManager_1.assignEditorialTask)(taskId, assignee, reviewerRole, actor);
            return server_1.NextResponse.json({ success });
        }
        if (action === "transitionStatus") {
            const { taskId, status, actor, note } = body;
            if (!taskId || typeof taskId !== "string") {
                return server_1.NextResponse.json({ error: "Invalid taskId" }, { status: 400 });
            }
            if (!ALLOWED_STATUSES.includes(status)) {
                return server_1.NextResponse.json({ error: "Invalid target status transition" }, { status: 400 });
            }
            if ((actor && containsPII(actor)) || (note && containsPII(note))) {
                return server_1.NextResponse.json({ error: "Payload contains potential PII/PHI" }, { status: 400 });
            }
            const success = await (0, workflowManager_1.transitionTaskStatus)(taskId, status, actor, note);
            return server_1.NextResponse.json({ success });
        }
        if (action === "generateTasks") {
            const { entities, actor } = body;
            if (!Array.isArray(entities)) {
                return server_1.NextResponse.json({ error: "Invalid entities list" }, { status: 400 });
            }
            if (actor && containsPII(actor)) {
                return server_1.NextResponse.json({ error: "Actor name contains potential PII" }, { status: 400 });
            }
            const tasks = await (0, taskGenerator_1.generateAutomaticCurationTasks)(entities, actor);
            return server_1.NextResponse.json({ tasks });
        }
        return server_1.NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    catch (e) {
        // Sanitize log outputs and responses to protect credentials and private trace logs
        console.error("Workflow API POST Failure: Internal action failed.");
        return server_1.NextResponse.json({ error: "An internal request error occurred." }, { status: 500 });
    }
}
