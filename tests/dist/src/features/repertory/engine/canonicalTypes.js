"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REMEDY_GRADE_WEIGHTS = void 0;
exports.normalizeRemedyGrade = normalizeRemedyGrade;
exports.getRemedyGradeWeight = getRemedyGradeWeight;
exports.REMEDY_GRADE_WEIGHTS = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
};
function normalizeRemedyGrade(input) {
    const numeric = typeof input === "number" ? input : Number(input);
    if (!Number.isFinite(numeric))
        return 0;
    if (numeric <= 0)
        return 0;
    if (numeric >= 4)
        return 4;
    return Math.round(numeric);
}
function getRemedyGradeWeight(grade) {
    return exports.REMEDY_GRADE_WEIGHTS[grade] ?? 0;
}
