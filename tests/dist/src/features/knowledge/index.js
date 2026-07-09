"use strict";
// Clinical Knowledge Platform central entry point
// Exporting types, governance files, content libraries, and quality gates
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CASE_STUDIES = exports.RESEARCH = exports.FAQS = exports.LAB_TESTS = exports.REMEDIES = exports.SYMPTOMS = exports.DISEASES = void 0;
exports.getAllKnowledgeEntities = getAllKnowledgeEntities;
exports.getAllEntityIds = getAllEntityIds;
exports.getEntityUrl = getEntityUrl;
__exportStar(require("./types"), exports);
__exportStar(require("./governance/editorialPolicy"), exports);
__exportStar(require("./governance/reviewWorkflow"), exports);
__exportStar(require("./governance/citationPolicy"), exports);
__exportStar(require("./governance/medicalWritingGuidelines"), exports);
__exportStar(require("./governance/contentLifecycle"), exports);
__exportStar(require("./governance/prohibitedClaims"), exports);
__exportStar(require("./governance/qualityGates"), exports);
__exportStar(require("./versioning/contentVersion"), exports);
__exportStar(require("./versioning/migration"), exports);
__exportStar(require("./governance/clinicalOsIntegration"), exports);
const diseases_1 = require("./content/diseases");
Object.defineProperty(exports, "DISEASES", { enumerable: true, get: function () { return diseases_1.DISEASES; } });
const symptoms_1 = require("./content/symptoms");
Object.defineProperty(exports, "SYMPTOMS", { enumerable: true, get: function () { return symptoms_1.SYMPTOMS; } });
const remedies_1 = require("./content/remedies");
Object.defineProperty(exports, "REMEDIES", { enumerable: true, get: function () { return remedies_1.REMEDIES; } });
const lab_tests_1 = require("./content/lab-tests");
Object.defineProperty(exports, "LAB_TESTS", { enumerable: true, get: function () { return lab_tests_1.LAB_TESTS; } });
const faqs_1 = require("./content/faqs");
Object.defineProperty(exports, "FAQS", { enumerable: true, get: function () { return faqs_1.FAQS; } });
const research_1 = require("./content/research");
Object.defineProperty(exports, "RESEARCH", { enumerable: true, get: function () { return research_1.RESEARCH; } });
const case_studies_1 = require("./content/case-studies");
Object.defineProperty(exports, "CASE_STUDIES", { enumerable: true, get: function () { return case_studies_1.CASE_STUDIES; } });
/**
 * Aggregates all public knowledge entities in the platform.
 */
function getAllKnowledgeEntities() {
    return [
        ...diseases_1.DISEASES,
        ...symptoms_1.SYMPTOMS,
        ...remedies_1.REMEDIES,
        ...lab_tests_1.LAB_TESTS,
        ...faqs_1.FAQS,
        ...research_1.RESEARCH,
        ...case_studies_1.CASE_STUDIES,
    ];
}
/**
 * Registry of all entity IDs currently indexed.
 */
function getAllEntityIds() {
    return getAllKnowledgeEntities().map(entity => entity.id);
}
/**
 * Resolves the relative clinical platform route path for any knowledge entity type.
 */
function getEntityUrl(entityType, slug) {
    switch (entityType) {
        case "disease":
            return `/knowledge/diseases/${slug}`;
        case "symptom":
            return `/knowledge/symptoms/${slug}`;
        case "remedy":
            return `/knowledge/remedies/${slug}`;
        case "lab-test":
            return `/knowledge/lab-tests/${slug}`;
        case "faq":
            return `/knowledge/faqs`;
        case "research":
            return `/knowledge/research/${slug}`;
        case "case-study":
            return `/knowledge/case-studies/${slug}`;
        default:
            return `/knowledge`;
    }
}
