"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUpcomingAppointment = isUpcomingAppointment;
exports.requiresUrgentReview = requiresUrgentReview;
function isUpcomingAppointment(appointment, currentDateStr) {
    return appointment.status === "scheduled" && appointment.date >= currentDateStr;
}
function requiresUrgentReview(appointment) {
    return appointment.type === "emergency" && appointment.status !== "completed";
}
