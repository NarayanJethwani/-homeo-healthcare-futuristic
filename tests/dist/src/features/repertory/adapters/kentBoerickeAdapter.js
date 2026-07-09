"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptKentBoerickeRubric = adaptKentBoerickeRubric;
const canonicalTypes_1 = require("../engine/canonicalTypes");
const remedyNormalizer_1 = require("../engine/remedyNormalizer");
const EXPLICIT_FIELDS = new Set(["id", "chapter", "name", "remedies", "source"]);
function sourceGrade(value) {
    const numeric = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
}
function collectMetadata(record) {
    return Object.fromEntries(Object.entries(record).filter(([field]) => !EXPLICIT_FIELDS.has(field)));
}
function adaptKentBoerickeRubric(record) {
    const warnings = [];
    const source = record.source === "boericke" ? "boericke" : record.source === "kent" ? "kent" : "unknown";
    const id = typeof record.id === "string" && record.id.trim() ? record.id : `unknown-${source}-rubric`;
    const title = typeof record.name === "string" && record.name.trim() ? record.name : id;
    const chapter = typeof record.chapter === "string" ? record.chapter : undefined;
    if (id.startsWith("unknown-"))
        warnings.push("missing_id");
    if (title === id)
        warnings.push("missing_title");
    if (!chapter)
        warnings.push("missing_chapter");
    const remedies = record.remedies && typeof record.remedies === "object" && !Array.isArray(record.remedies)
        ? Object.entries(record.remedies).map(([remedyId, grade]) => ({
            remedyId: (0, remedyNormalizer_1.normalizeRemedyId)(remedyId),
            sourceRemedyId: remedyId,
            grade: (0, canonicalTypes_1.normalizeRemedyGrade)(grade),
            sourceGrade: sourceGrade(grade),
            polarity: sourceGrade(grade) !== undefined && sourceGrade(grade) < 0 ? "negative" : "positive",
            isEliminating: sourceGrade(grade) !== undefined && sourceGrade(grade) < 0,
        }))
        : [];
    if (remedies.length === 0)
        warnings.push("missing_remedies");
    return {
        id,
        title,
        source,
        sourceId: id,
        sourceTitle: typeof record.name === "string" ? record.name : undefined,
        chapter,
        parentId: null,
        category: "unknown",
        clinicalSystem: chapter?.toLowerCase().includes("mind") ? "psychology_psychiatry" : "unknown",
        status: "active",
        synonyms: [],
        keywords: title.toLowerCase().split(/\s+/).filter(Boolean),
        modalities: [],
        miasms: [],
        remedies,
        citation: source !== "unknown" ? { sourceName: source === "kent" ? "Kent Repertory" : "Boericke Repertory" } : undefined,
        metadata: collectMetadata(record),
        originalRecord: record,
        warnings,
    };
}
