"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDITORIAL_POLICY = void 0;
exports.EDITORIAL_POLICY = {
    platformName: "Homeo Healthcare Clinical Knowledge Platform",
    targetAudience: ["patients", "students", "practitioners"],
    mission: "Provide structured, high-quality, evidence-based educational resource on homeopathic remedies and clinical conditions.",
    corePrinciples: {
        factualAccuracy: "All descriptions must match recognized clinical taxonomies and peer-reviewed studies.",
        tone: "Objective, clinical, educational, non-alarmist, and compassionate.",
        safetyFirst: "Never present content as personal medical diagnosis or advice. Medical disclaimers must be clear and ubiquitous.",
        integrity: "Conflict of interest disclosure and transparent referencing required.",
    },
    roles: {
        author: {
            requiredCredentials: ["BHMS", "MD(Hom)", "BSc", "MBBS", "PhD"],
            description: "Drafts the educational descriptions, clinical summaries, and homeopathic mappings.",
        },
        reviewer: {
            requiredCredentials: ["MD(Hom)", "MD", "FAMS"],
            description: "Verifies safety declarations, reviews remedy considerations, and signs off on clinical accuracy.",
        },
    },
};
