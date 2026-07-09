"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmergencyPatient = isEmergencyPatient;
exports.hasUnresolvedBalance = hasUnresolvedBalance;
exports.getMiasmaticClassification = getMiasmaticClassification;
/**
 * Business rule validations for a Patient Entity
 */
function isEmergencyPatient(patient) {
    return patient.careLevel === "emergency" || patient.careLevel === "critical";
}
function hasUnresolvedBalance(patient) {
    const balance = patient.remainingBalance || 0;
    return balance > 0;
}
function getMiasmaticClassification(complaint) {
    const c = complaint.toLowerCase();
    if (c.includes("eczema") || c.includes("psoriasis") || c.includes("skin") || c.includes("itching")) {
        return "Psoric";
    }
    if (c.includes("wart") || c.includes("fibroid") || c.includes("overgrowth") || c.includes("acid")) {
        return "Sycotic";
    }
    if (c.includes("ulcer") || c.includes("destruction") || c.includes("necrosis")) {
        return "Syphilitic";
    }
    if (c.includes("tuberculosis") || c.includes("asthma") || c.includes("weight loss")) {
        return "Tubercular";
    }
    return "Constitutional";
}
