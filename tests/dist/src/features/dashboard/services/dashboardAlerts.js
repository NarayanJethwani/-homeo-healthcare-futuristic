"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileDashboardAlerts = compileDashboardAlerts;
const branded_1 = require("../types/branded");
/**
 * Compiles a list of smart alerts based on raw patients telemetry data
 */
function compileDashboardAlerts(patients) {
    const alerts = [];
    // 1. Critical cases alerts
    const criticalPatients = patients.filter(p => p.careLevel === "emergency" || p.careLevel === "critical");
    criticalPatients.forEach(p => {
        alerts.push({
            id: (0, branded_1.toAlertId)(`alert-crit-${p.id}`),
            patientId: (0, branded_1.toPatientId)(p.id),
            patientName: p.name,
            message: `Critical alert: ${p.name} has emergency care level: "${p.complaint}". Immediate outreach required.`,
            level: "critical",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAcknowledged: false,
            isPinned: true,
            isMuted: false,
            category: "Critical Alert"
        });
    });
    // 2. Suppressed pathology warnings
    const suppressedPatients = patients.filter(p => p.complaint?.toLowerCase().includes("eczema") || p.complaint?.toLowerCase().includes("skin"));
    suppressedPatients.forEach(p => {
        alerts.push({
            id: (0, branded_1.toAlertId)(`alert-supp-${p.id}`),
            patientId: (0, branded_1.toPatientId)(p.id),
            patientName: p.name,
            message: `Pathological Risk: ${p.name} shows skin suppression markers (eczema). Evaluate potential pulmonary progression.`,
            level: "high",
            timestamp: "10:30 AM",
            isAcknowledged: false,
            isPinned: false,
            isMuted: false,
            category: "Suppression Warning"
        });
    });
    // 3. Fallback alerts if empty
    if (alerts.length === 0) {
        alerts.push({
            id: (0, branded_1.toAlertId)("alert-default-1"),
            patientName: "Meera Jethwani",
            message: "TSH Axis abnormal: 8.4 uIU/mL (High). Scheduled consult tomorrow requires thyroid pathology review.",
            level: "high",
            timestamp: "09:15 AM",
            isAcknowledged: false,
            isPinned: true,
            isMuted: false,
            category: "Thyroid Axis"
        });
        alerts.push({
            id: (0, branded_1.toAlertId)("alert-default-2"),
            patientName: "Rahul Sharma",
            message: "Suppressive Eczema flare-up alongside asthma symptoms. Repertory check suggests Psoric miasm dominance.",
            level: "medium",
            timestamp: "Yesterday",
            isAcknowledged: false,
            isPinned: false,
            isMuted: false,
            category: "Miasmatic Audit"
        });
        alerts.push({
            id: (0, branded_1.toAlertId)("alert-default-3"),
            patientName: "Dr. Sarah",
            message: "System sync status warning: 2 files failed to upload to Google Drive attachments. Auto-retry pending.",
            level: "info",
            timestamp: "1 hour ago",
            isAcknowledged: false,
            isPinned: false,
            isMuted: false,
            category: "Drive Sync"
        });
    }
    return alerts;
}
