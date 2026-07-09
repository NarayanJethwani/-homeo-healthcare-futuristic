"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCriticalAlert = isCriticalAlert;
exports.shouldAlertBeMuted = shouldAlertBeMuted;
exports.shouldAlertBeVisible = shouldAlertBeVisible;
function isCriticalAlert(alert) {
    return alert.level === "critical" || alert.level === "high";
}
function shouldAlertBeMuted(alert, currentMutedIds) {
    return alert.isMuted || currentMutedIds.includes(alert.id);
}
function shouldAlertBeVisible(alert, searchQuery, severityFilter, dismissedIds) {
    if (dismissedIds.includes(alert.id) || alert.isAcknowledged) {
        return false;
    }
    if (severityFilter !== "all" && alert.level !== severityFilter) {
        return false;
    }
    if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const messageMatch = alert.message.toLowerCase().includes(q);
        const patientMatch = alert.patientName?.toLowerCase().includes(q) || false;
        const catMatch = alert.category?.toLowerCase().includes(q) || false;
        return messageMatch || patientMatch || catMatch;
    }
    return true;
}
