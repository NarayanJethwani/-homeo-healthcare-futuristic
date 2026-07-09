"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapReportExtractionToState = mapReportExtractionToState;
function mapReportExtractionToState(result) {
    // Validate and clean miasm indicators
    const allowedMiasms = ["Psora", "Sycosis", "Syphilis", "Tubercular", "Cancer"];
    const sanitizedMiasms = (result.miasm || []).filter(m => allowedMiasms.includes(m));
    // Validate thermal state
    const allowedThermals = ["Chilly", "Hot", "Ambithermal", "Chilly & Chafed"];
    const sanitizedThermal = result.thermal && allowedThermals.includes(result.thermal)
        ? result.thermal
        : null;
    return {
        clinicalImpressions: result.clinicalImpressions || "",
        labs: result.labs || "",
        imaging: result.imaging || "",
        currentMeds: result.currentMeds || "",
        pastTreatments: result.pastTreatments || "",
        thermal: sanitizedThermal,
        miasm: sanitizedMiasms,
        energy: typeof result.energy === "number" ? Math.max(1, Math.min(10, result.energy)) : null,
        confidenceLevels: result.confidenceLevels || {},
        sourceEvidence: result.sourceEvidence || {},
        reportType: result.reportType,
        fileNameHash: result.fileNameHash
    };
}
