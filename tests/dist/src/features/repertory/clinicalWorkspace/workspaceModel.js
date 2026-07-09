"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLINICAL_REPERTORY_WORKSPACE_SECTIONS = void 0;
exports.getClinicalWorkspaceSection = getClinicalWorkspaceSection;
exports.CLINICAL_REPERTORY_WORKSPACE_SECTIONS = [
    {
        id: "intake",
        title: "Patient AI Intake",
        stage: "collect",
        capabilityIds: ["text_intake", "voice_intake", "ocr_intake"],
    },
    {
        id: "symptom_parser",
        title: "Intelligent Symptom Parser",
        stage: "understand",
        capabilityIds: ["symptom_extraction"],
    },
    {
        id: "rubric_explorer",
        title: "Rubric Explorer",
        stage: "select",
        capabilityIds: ["rubric_search", "rubric_hierarchy"],
    },
    {
        id: "clinical_workbench",
        title: "Clinical Workbench",
        stage: "select",
        capabilityIds: ["rubric_search", "rubric_hierarchy"],
    },
    {
        id: "clinical_intelligence",
        title: "AI Clinical Intelligence",
        stage: "analyze",
        capabilityIds: ["remedy_reasoning", "case_validation", "knowledge_graph"],
    },
    {
        id: "repertorization",
        title: "Repertorization Engine",
        stage: "analyze",
        capabilityIds: ["repertorization"],
    },
    {
        id: "remedy_intelligence",
        title: "Remedy Intelligence",
        stage: "differentiate",
        capabilityIds: ["materia_medica", "remedy_reasoning"],
    },
    {
        id: "differential_analysis",
        title: "Differential Analysis",
        stage: "differentiate",
        capabilityIds: ["differential_analysis"],
    },
    {
        id: "case_validation",
        title: "Case Validation",
        stage: "validate",
        capabilityIds: ["case_validation"],
    },
    {
        id: "final_review",
        title: "Final Clinical Review",
        stage: "review",
        capabilityIds: ["audit_mode"],
    },
];
function getClinicalWorkspaceSection(id) {
    return exports.CLINICAL_REPERTORY_WORKSPACE_SECTIONS.find((section) => section.id === id);
}
